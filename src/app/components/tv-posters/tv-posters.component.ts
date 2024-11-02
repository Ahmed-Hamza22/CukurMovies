import { UpperCasePipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { environment } from '../../core/environment/environment';
import { IBackdrop } from '../../core/interfaces/ibackdrop';
import { ITVDetails } from '../../core/interfaces/itvdetails';
import { DetailsService } from '../../core/services/details.service';
import { MoviesService } from '../../core/services/movies.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-tv-posters',
  standalone: true,
  imports: [RouterLink,UpperCasePipe,DatePipe],
  templateUrl: './tv-posters.component.html',
  styleUrl: './tv-posters.component.scss'
})
export class TvPostersComponent implements OnInit {
  private readonly _MoviesService = inject(MoviesService);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _DetailsService = inject(DetailsService);
  private readonly _TitleService = inject(Title);
  imgPrefix:string = environment.imgPath;
  goOriginal:string = environment.imgOriginalSize;
  mediaId:any;
  TVDetails!:ITVDetails;
  TVPosters:IBackdrop [] = [];
  ngOnInit(): void {
    this._MoviesService.searchWord.set('');
    this._MoviesService.searchArray.set([]);
    this._ActivatedRoute.paramMap.subscribe({
      next:(params)=>{
        this.mediaId = params.get('id');
        this._DetailsService.getDetails('tv',this.mediaId).subscribe({
          next:(res)=>{
            this.TVDetails = res;
            this._TitleService.setTitle(this.TVDetails.name + ' - Posters');
          }
        });
        this._DetailsService.getImages('tv',this.mediaId).subscribe({
          next:(res)=>{
            this.TVPosters = res.posters;
          }
        });
      }
    });
  }
}