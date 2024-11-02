import { DatePipe, UpperCasePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '../../core/environment/environment';
import { IMovieDetails } from '../../core/interfaces/imoviedetails';
import { DetailsService } from '../../core/services/details.service';
import { IBackdrop } from '../../core/interfaces/ibackdrop';
import { MoviesService } from '../../core/services/movies.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-backdrops',
  standalone: true,
  imports: [DatePipe, RouterLink, UpperCasePipe],
  templateUrl: './backdrops.component.html',
  styleUrl: './backdrops.component.scss'
})
export class BackdropsComponent implements OnInit {
  private readonly _MoviesService = inject(MoviesService);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _DetailsService = inject(DetailsService);
  private readonly _TitleService = inject(Title);
  imgPrefix:string = environment.imgPath;
  goOriginal:string = environment.imgOriginalSize;
  mediaId:any;
  movieDetails:IMovieDetails = {} as IMovieDetails;
  movieBackdrops:IBackdrop [] = [];
  ngOnInit(): void {
    this._MoviesService.searchWord.set('');
    this._MoviesService.searchArray.set([]);
    this._ActivatedRoute.paramMap.subscribe({
      next:(params)=>{
        this.mediaId = params.get('id');
        this._DetailsService.getDetails('movie',this.mediaId).subscribe({
          next:(res)=>{
            this.movieDetails = res;
            this._TitleService.setTitle(this.movieDetails.title + ' - Backdrops');
          }
        });
        this._DetailsService.getImages('movie',this.mediaId).subscribe({
          next:(res)=>{
            this.movieBackdrops = res.backdrops;
          }
        });
      }
    });
  }
}
