import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '../../core/environment/environment';
import { DetailsService } from '../../core/services/details.service';
import { ITVDetails, Season } from '../../core/interfaces/itvdetails';
import { DatePipe, NgClass } from '@angular/common';
import { RatingPipe } from '../../core/pipes/rating.pipe';
import { MoviesService } from '../../core/services/movies.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-tv-seasons',
  standalone: true,
  imports: [RouterLink,DatePipe,RatingPipe,NgClass],
  templateUrl: './tv-seasons.component.html',
  styleUrl: './tv-seasons.component.scss'
})
export class TvSeasonsComponent implements OnInit{
  private readonly _TitleService = inject(Title);
  private readonly _MoviesService = inject(MoviesService);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _DetailsService = inject(DetailsService);
  imgPrefix:string = environment.imgPath;
  mediaId:any;
  TVDetails!:ITVDetails;
  TVSeasons:Season[] = [];
  ngOnInit(): void {
    this._MoviesService.searchWord.set('');
    this._MoviesService.searchArray.set([]);
    this._ActivatedRoute.paramMap.subscribe({
      next:(params)=>{
        this.mediaId = params.get('id');
        this._DetailsService.getDetails('tv',this.mediaId).subscribe({
          next:(res)=>{
            this.TVDetails = res;
            this._TitleService.setTitle(this.TVDetails.name + ' - All Seasons');
            this.TVSeasons = res.seasons;
          }
        });
      }
    });
  }
}