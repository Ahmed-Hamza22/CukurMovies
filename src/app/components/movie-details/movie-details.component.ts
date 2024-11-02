import { Component, inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DetailsService } from '../../core/services/details.service';
import { IMovieDetails, Productioncompany } from '../../core/interfaces/imoviedetails';
import { CurrencyPipe, DatePipe, isPlatformBrowser, NgClass, NgStyle, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { environment } from '../../core/environment/environment';
import { RatingPipe } from '../../core/pipes/rating.pipe';
import { ProgressPipe } from '../../core/pipes/progress.pipe';
import { ICast, ICrew } from '../../core/interfaces/icrew';
import { ILinks } from '../../core/interfaces/ilinks';
import { TimePipe } from '../../core/pipes/time.pipe';
import { TermPipe } from '../../core/pipes/term.pipe';
import { IReview } from '../../core/interfaces/ireview';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { IMedia, IMovie } from '../../core/interfaces/imedia';
import { BehaviorSubject } from 'rxjs';
import { MoviesService } from '../../core/services/movies.service';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [NgClass,NgStyle,UpperCasePipe,TitleCasePipe,DatePipe,RatingPipe,ProgressPipe,CurrencyPipe,RouterLink,TimePipe,TermPipe],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss'
})
export class MovieDetailsComponent implements OnInit, OnDestroy {
  private readonly _MoviesService = inject(MoviesService);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _DetailsService = inject(DetailsService);
  private readonly _TitleService = inject(Title);
  private readonly _PLATFORM_ID = inject(PLATFORM_ID);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly renderer = inject(Renderer2);
  imgPrefix:string = environment.imgPath;
  posterPrefix:string = environment.detailsBackground;
  imgView:string = environment.imgOriginalSize;
  MCertificate!:string | null;
  movieCertificate:BehaviorSubject<string | any> = new BehaviorSubject('');
  movieCountry!:string | null;
  movieGenres:string[] | null = [];
  crew:ICrew[] = [];
  cast:ICast[] = [];
  movieKeywords: { id:number , name: string }[] | null = [];
  moviePCompanies:Productioncompany[] = [];
  movieExternalIds:ILinks | any;
  videoBackgroundUrls: string[] = [];
  movieTrailerVideo:IMedia | any ;
  movieVideos:IMedia[] = [];
  movieReversedVideos:IMedia[] = [];
  modifiedURLs:string [] = [];
  isVideoVisible:boolean = false;
  isTrailerVisible: boolean = false;
  private clickListener: (() => void) | null = null;
  currentVideoIndex: number | null = null;
  mediaActiveTab: string = 'videos';
  movieImages:any;
  movieRecommendations:IMovie[] = [];
  movieReviews:IReview[] = [];
  movieOneReviews:IReview = {} as IReview;
  mediaId:any;
  movieDetails!:IMovieDetails;
  ngOnInit(): void {
    this._MoviesService.searchWord.set('');
    this._MoviesService.searchArray.set([]);
    this._ActivatedRoute.paramMap.subscribe({
      next:(params)=>{
        this.mediaId = params.get('id');
        this._DetailsService.getDetails('movie',this.mediaId).subscribe({
          next:(res)=>{
            this.movieDetails = res;
            this._TitleService.setTitle(this.movieDetails.title + ' - ÇukurWatch');
            this.movieGenres = res.genres.map((genre:any) => genre.name);
            this.moviePCompanies = res.production_companies.sort((a:Productioncompany, b:Productioncompany) => {
              if (a.logo_path === null) return 1;
              if (b.logo_path === null) return -1;
              return 0;
          });
            this.movieCountry = res.origin_country[0];
          }
        });
        this._DetailsService.getReleaseDateAndCertificate('movie',this.mediaId).subscribe({
          next:(res)=>{
            if(res.results.find((country:any)=>country.iso_3166_1 === this.movieCountry)?.release_dates[0]?.certification){
              this.movieCertificate.next(res.results.find((country:any)=>country.iso_3166_1 === this.movieCountry)?.release_dates[0]?.certification);
            }else if(res.results.find((country:any)=>country.iso_3166_1 === this.movieCountry)?.release_dates[1]?.certification){
              this.movieCertificate.next(res.results.find((country:any)=>country.iso_3166_1 === this.movieCountry)?.release_dates[1]?.certification);
            }else if(res.results.find((country:any)=>country.iso_3166_1 === this.movieCountry)?.release_dates[2]?.certification){
              this.movieCertificate.next(res.results.find((country:any)=>country.iso_3166_1 === this.movieCountry)?.release_dates[2]?.certification);
            }
            else{
            }
            this.movieCertificate.subscribe({
              next:(data)=>{
                this.MCertificate = data;
              }
            });
          }
        });
        this._DetailsService.getCredits('movie',this.mediaId).subscribe({
          next:(res)=>{
            function getFirstFromDepartment(department:string) {
              return res.crew.filter((item:any) => item.popularity > 0).find((item:any) => item.job === department);
            }
            const firstFromEachDepartment = [
              getFirstFromDepartment("Director"),
              getFirstFromDepartment("Writer"),
              getFirstFromDepartment("Producer"),
              getFirstFromDepartment("Screenplay"),
              getFirstFromDepartment("Story"),
              getFirstFromDepartment("Director of Photography"),
              getFirstFromDepartment("Original Music Composer"),
          ];
          const filteredArray = firstFromEachDepartment.filter(item => item !== undefined);
            this.crew = filteredArray;
            this.cast = res.cast;
          }
        });
        this._DetailsService.getKeywords('movie',this.mediaId).subscribe({
          next:(res)=>{
            this.movieKeywords = res.keywords;
          }
        });
        this._DetailsService.getExternalIds('movie',this.mediaId).subscribe({
          next:(res)=>{
            this.movieExternalIds = res;
          }
        });
        this._DetailsService.getVideos('movie',this.mediaId).subscribe({
          next:(res)=>{
            this.movieVideos = res.results;
            this.movieReversedVideos = [...this.movieVideos].reverse().slice(0, 6);
            this.movieReversedVideos.forEach((vid:any, index) => {
              const baseUrl = 'https://i.ytimg.com/vi/' + vid?.key;
              const imageUrl720 = baseUrl + '/hq720.jpg';
              const imageUrlDefault = baseUrl + '/hqdefault.jpg';
              if (isPlatformBrowser(this._PLATFORM_ID)) {
                const img = new Image();
                img.src = imageUrl720;
                img.onload = () => {
                  if (img.naturalWidth === 120 && img.naturalHeight === 90) {
                    this.videoBackgroundUrls[index] = `url(${imageUrlDefault})`;
                  } else {
                    this.videoBackgroundUrls[index] = `url(${imageUrl720})`;
                  }
                };
                img.onerror = () => {
                  this.videoBackgroundUrls[index] = `url(${imageUrlDefault})`;
                };
              }
            });
            let modifiedUrl:any;
            for (let i = 0; i < this.movieVideos.length; i++) {
              modifiedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.movieVideos[i].key}?autoplay=1`);
              this.modifiedURLs.unshift(modifiedUrl);
            }
            this.movieTrailerVideo = res.results.find((i:any)=>i.name === "Final Trailer");
            if(this.movieTrailerVideo == null){
              this.movieTrailerVideo = res.results.find((i:any)=>i.name === "Official Trailer");
            }
            if(this.movieTrailerVideo == null){
              this.movieTrailerVideo = res.results.find((i:any)=>i.type === "Trailer");
            }
            if(this.movieTrailerVideo == null){
              this.movieTrailerVideo = res.results[0];
            }
            this.movieTrailerVideo = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.movieTrailerVideo?.key}?autoplay=0`);
          }
        });
        this._DetailsService.getImages('movie',this.mediaId).subscribe({
          next:(res)=>{
            this.movieImages = res;
          }
        });
        this._DetailsService.getRecommendations('movie',this.mediaId).subscribe({
          next:(res)=>{
            this.movieRecommendations = res.results;
          }
        });
        this._DetailsService.getReviews('movie',this.mediaId).subscribe({
          next:(res)=>{
            Array.prototype.sample = function () {
              return this[Math.floor(Math.random() * this.length)];
            };
            this.movieReviews = res.results;
            this.movieOneReviews = this.movieReviews.sample();
          }
        });
      }
    });
  }
  showTrailer(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      this.isTrailerVisible = true;
      this.clickListener = this.renderer.listen('document', 'click', (event: Event) => {
      const targetElement = event.target as HTMLElement;
      if (targetElement.classList.contains('video-overlay')&&!targetElement.classList.contains('video-container')) {
        this.closeTrailer();
      }
    });
    }
  }
  closeTrailer(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      this.isTrailerVisible = false;
      if (this.clickListener) {
        this.clickListener();
      }
    }
  }
  showVideo(index:number): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      this.isVideoVisible = true;
      this.currentVideoIndex = index;
      this.clickListener = this.renderer.listen('document', 'click', (event: Event) => {
      const targetElement = event.target as HTMLElement;
      if (targetElement.classList.contains('media-video-overlay')&&!targetElement.classList.contains('media-video-container')) {
        this.closeVideo();
      }
    });
    }
  }
  closeVideo(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      this.isVideoVisible = false;
      this.currentVideoIndex = null;
      if (this.clickListener) {
        this.clickListener();
      }
    }
  }
  setMediaActiveTab(tab: string) {
    this.mediaActiveTab = tab;
  }
  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
  }
}