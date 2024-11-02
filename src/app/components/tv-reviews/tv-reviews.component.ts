import { DatePipe, UpperCasePipe, TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TermPipe } from '../../core/pipes/term.pipe';
import { DetailsService } from '../../core/services/details.service';
import { environment } from '../../core/environment/environment';
import { IReview } from '../../core/interfaces/ireview';
import { ITVDetails } from '../../core/interfaces/itvdetails';
import { MoviesService } from '../../core/services/movies.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-tv-reviews',
  standalone: true,
  imports: [RouterLink,DatePipe,UpperCasePipe,TitleCasePipe,TermPipe],
  templateUrl: './tv-reviews.component.html',
  styleUrl: './tv-reviews.component.scss'
})
export class TvReviewsComponent implements OnInit{
  private readonly _TitleService = inject(Title);
  private readonly _MoviesService = inject(MoviesService);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _DetailsService = inject(DetailsService);
  imgPrefix:string = environment.imgPath;
  mediaId:any;
  TVDetails!:ITVDetails;
  TVReviews:IReview[] = [];
  ngOnInit(): void {
    this._MoviesService.searchWord.set('');
    this._MoviesService.searchArray.set([]);
    this._ActivatedRoute.paramMap.subscribe({
      next:(params)=>{
        this.mediaId = params.get('id');
        this._DetailsService.getDetails('tv',this.mediaId).subscribe({
          next:(res)=>{
            this.TVDetails = res;
            this._TitleService.setTitle(this.TVDetails.name + ' - Reviews');
          }
        });
        this._DetailsService.getReviews('tv',this.mediaId).subscribe({
          next:(res)=>{
            this.TVReviews = res.results;
          }
        });
      }
    });
  }
}
