import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, NO_ERRORS_SCHEMA, OnInit, PLATFORM_ID } from '@angular/core';
import { environment } from '../../core/environment/environment';
import { MoviesService } from '../../core/services/movies.service';
import { IMovie } from '../../core/interfaces/imedia';
import { ITvShows } from '../../core/interfaces/itv-shows';
import { isPlatformBrowser } from '@angular/common';
import { ShufflePipe } from '../../core/pipes/shuffle.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-swiper',
  standalone: true,
  imports: [ShufflePipe,RouterLink],
  templateUrl: './swiper.component.html',
  styleUrl: './swiper.component.scss',
  schemas:[CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA]
})
export class SwiperComponent implements OnInit{
  private readonly _MoviesService = inject(MoviesService);
  private readonly _PLATFORM_ID = inject(PLATFORM_ID);
  trendingMovies: IMovie[]= [];
  trendingTV: ITvShows[] = [];
  trending:any[] = [];
  imgPrefix:string = environment.imgPath;
  platformBrowser:boolean = false;
  backgrounds: string[] = [
    'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),url(./assets/webp/1.webp)',
    'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),url(./assets/webp/2.webp)',
    'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),url(./assets/webp/3.webp)',
    'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),url(./assets/webp/4.webp)',
    'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url(./assets/webp/5.webp)',
    'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),url(./assets/webp/6.webp)',
    'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),url(./assets/webp/7.webp)',
    // 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url(./assets/webp/8.webp)',
    'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),url(./assets/webp/9.webp)',
    'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),url(./assets/webp/10.webp)',
    'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),url(./assets/webp/12.webp)',
    'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),url(./assets/webp/13.webp)',
    'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url(./assets/webp/14.webp)',
    'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),url(./assets/webp/16.webp)',
    'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),url(./assets/webp/17.webp)',
    'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),url(./assets/webp/18.webp)',
    'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),url(./assets/webp/19.webp)',
    'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url(./assets/webp/20.webp)',
    'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),url(./assets/webp/21.webp)',
    'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),url(./assets/webp/22.webp)',
    'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url(./assets/webp/24.webp)',
    'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),url(./assets/webp/25.webp)',
    'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),url(./assets/webp/26.webp)',
  ];
  currentBackground: string = '';
  currentIndex: number = 0;
  ngOnInit(): void {
    this.changeBackground();
    this.platformCheck();
    this._MoviesService.getTrending('week','movie').subscribe({
      next:(res)=>{
        this.trendingMovies = res.results;
      }
    });
    this._MoviesService.getTrending('week','tv').subscribe({
      next:(res)=>{
        this.trendingTV = res.results;
        this.trending = [...this.trendingMovies,...this.trendingTV];
      }
    });
  }
  platformCheck():void {
    if(isPlatformBrowser(this._PLATFORM_ID)){
      this.platformBrowser = true;
    }
  }
  changeBackground() {
    const randomIndex = Math.floor(Math.random() * this.backgrounds.length);
    this.currentBackground = this.backgrounds[randomIndex];
  }
}