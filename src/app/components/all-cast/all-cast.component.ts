import { Component, inject, OnInit } from '@angular/core';
import { DetailsService } from '../../core/services/details.service';
import { environment } from '../../core/environment/environment';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ICast, ICrew } from '../../core/interfaces/icrew';
import { IMovieDetails } from '../../core/interfaces/imoviedetails';
import { DatePipe } from '@angular/common';
import { MoviesService } from '../../core/services/movies.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-all-cast',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './all-cast.component.html',
  styleUrl: './all-cast.component.scss'
})
export class AllCastComponent implements OnInit{
  private readonly _MoviesService = inject(MoviesService);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _DetailsService = inject(DetailsService);
  private readonly _TitleService = inject(Title);
  imgPrefix:string = environment.imgPath;
  mediaId:any;
  movieDetails:IMovieDetails = {} as IMovieDetails;
  crew:ICrew[] = [];
  cast:ICast[] = [];
  ngOnInit(): void {
    this._MoviesService.searchWord.set('');
    this._MoviesService.searchArray.set([]);
    this._ActivatedRoute.paramMap.subscribe({
      next:(params)=>{
        this.mediaId = params.get('id');
        this._DetailsService.getDetails('movie',this.mediaId).subscribe({
          next:(res)=>{
            this.movieDetails = res;
            this._TitleService.setTitle(this.movieDetails.title + ' - Cast & Crew');
          }
        });
        this._DetailsService.getCredits('movie',this.mediaId).subscribe({
          next:(res)=>{
            this.cast = res.cast;
            this.crew = res.crew;
          }
        });
      }
    });
  }
}
