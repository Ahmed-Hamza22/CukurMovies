import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '../../core/environment/environment';
import { ITVCrew, ITVCast, Role } from '../../core/interfaces/icrew';
import { ITVDetails } from '../../core/interfaces/itvdetails';
import { DetailsService } from '../../core/services/details.service';
import { DatePipe } from '@angular/common';
import { MoviesService } from '../../core/services/movies.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-tv-cast',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './tv-cast.component.html',
  styleUrl: './tv-cast.component.scss'
})
export class TvCastComponent implements OnInit{
  private readonly _MoviesService = inject(MoviesService);
  private readonly _TitleService = inject(Title);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _DetailsService = inject(DetailsService);
  imgPrefix:string = environment.imgPath;
  mediaId:any;
  TVDetails!:ITVDetails;
  crew:ITVCrew[] = [];
  cast:ITVCast[] = [];
  ngOnInit(): void {
    this._MoviesService.searchWord.set('');
    this._MoviesService.searchArray.set([]);
    this._ActivatedRoute.paramMap.subscribe({
      next:(params)=>{
        this.mediaId = params.get('id');
        this._DetailsService.getDetails('tv',this.mediaId).subscribe({
          next:(res)=>{
            this.TVDetails = res;
              this._TitleService.setTitle(this.TVDetails.name + ' - Cast & Crew');
          }
        });
        this._DetailsService.getAggregateCredits('tv',this.mediaId).subscribe({
          next:(res)=>{
            this.crew = res.crew;
            this.cast = res.cast;
          }
        });
      }
    });
  }
  getTotalEpisodes(actorRoles: Role[]): number {
    return actorRoles.reduce((total:any, role:any) => total + role.episode_count, 0);
  }
}