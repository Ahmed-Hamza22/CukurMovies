import { Component, inject, OnInit } from '@angular/core';
import { MoviesService } from '../../core/services/movies.service';
import { IMovie } from '../../core/interfaces/imedia';
import { ITvShows } from '../../core/interfaces/itv-shows';
import { environment } from '../../core/environment/environment';
import { RatingPipe } from '../../core/pipes/rating.pipe';
import { ProgressPipe } from '../../core/pipes/progress.pipe';
import { RouterLink } from '@angular/router';
import { TermPipe } from '../../core/pipes/term.pipe';
import { FormsModule } from '@angular/forms';
import { SwiperComponent } from "../swiper/swiper.component";
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RatingPipe, ProgressPipe, RouterLink, TermPipe, FormsModule, SwiperComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  private readonly _MoviesService = inject(MoviesService);
  private readonly _TitleService = inject(Title);
  trendingMovies: IMovie[] = [];
  trendingTV: ITvShows[] = [];
  imgPrefix:string = environment.imgPath;
  ngOnInit(): void {
    this._TitleService.setTitle('ÇukurWatch');
    this._MoviesService.searchWord.set('');
    this._MoviesService.searchArray.set([]);
    this._MoviesService.getTrending('week','movie').subscribe({
      next:(res)=>{
        this.trendingMovies = res.results.slice(0,10);
      }
    });
    this._MoviesService.getTrending('week','tv').subscribe({
      next:(res)=>{
        this.trendingTV = res.results.slice(0,10);
      }
    });
  }
}
