import { Component, inject, OnInit } from '@angular/core';
import { DetailsService } from '../../core/services/details.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '../../core/environment/environment';
import { DatePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { IMovieDetails } from '../../core/interfaces/imoviedetails';
import { IReview } from '../../core/interfaces/ireview';
import { TermPipe } from '../../core/pipes/term.pipe';
import { MoviesService } from '../../core/services/movies.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [RouterLink,DatePipe,UpperCasePipe,TitleCasePipe,TermPipe],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss'
})
export class ReviewsComponent implements OnInit{
  private readonly _MoviesService = inject(MoviesService);
  private readonly _TitleService = inject(Title);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _DetailsService = inject(DetailsService);
  imgPrefix:string = environment.imgPath;
  mediaId:any;
  movieDetails:IMovieDetails = {} as IMovieDetails;
  movieReviews:IReview[] = [];
  ngOnInit(): void {
    this._MoviesService.searchWord.set('');
    this._MoviesService.searchArray.set([]);
    this._ActivatedRoute.paramMap.subscribe({
      next:(params)=>{
        this.mediaId = params.get('id');
        this._DetailsService.getDetails('movie',this.mediaId).subscribe({
          next:(res)=>{
            this.movieDetails = res;
            this._TitleService.setTitle(this.movieDetails.title + ' - Reviews');
          }
        });
        this._DetailsService.getReviews('movie',this.mediaId).subscribe({
          next:(res)=>{
            this.movieReviews = res.results;
          }
        });
      }
    });
  }
}