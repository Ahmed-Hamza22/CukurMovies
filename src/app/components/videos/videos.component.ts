import { Component, inject, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DetailsService } from '../../core/services/details.service';
import { environment } from '../../core/environment/environment';
import { IMovieDetails } from '../../core/interfaces/imoviedetails';
import { DatePipe, isPlatformBrowser, NgClass } from '@angular/common';
import { IMedia } from '../../core/interfaces/imedia';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { MoviesService } from '../../core/services/movies.service';

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [RouterLink,DatePipe,NgClass],
  templateUrl: './videos.component.html',
  styleUrl: './videos.component.scss'
})
export class VideosComponent implements OnInit{
  private readonly _TitleService = inject(Title);
  private readonly _MoviesService = inject(MoviesService);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _DetailsService = inject(DetailsService);
  private readonly _PLATFORM_ID = inject(PLATFORM_ID);
  private readonly sanitizer = inject(DomSanitizer);
  private renderer = inject(Renderer2);
  imgPrefix:string = environment.imgPath;
  mediaId:any;
  movieDetails:IMovieDetails = {} as IMovieDetails;
  movieVideos:IMedia[] = [];
  videoBackgroundUrls: any = {};
  movieTypedVideos: any;
  modifiedURLs:any = {};
  isVideoVisible:boolean = false;
  videoKeys: string[] = [];
  mediaActiveTab: string = 'Trailer';
  private clickListener: (() => void) | null = null;
  currentVideoIndex: number | null = null;
  channelInfo: any;
  ngOnInit(): void {
    this._MoviesService.searchWord.set('');
    this._MoviesService.searchArray.set([]);
    this._ActivatedRoute.paramMap.subscribe({
      next:(params)=>{
        this.mediaId = params.get('id');
        this._DetailsService.getDetails('movie',this.mediaId).subscribe({
          next:(res)=>{
            this.movieDetails = res;
            this._TitleService.setTitle(this.movieDetails.title + ' - Videos');
          }
        });
        this._DetailsService.getVideos('movie', this.mediaId).subscribe({
          next: (res) => {
            this.movieVideos = res.results;
            const groupedVideos = this.movieVideos.reduce((finalArray: any, video: any) => {
              if (!finalArray[video.type]) {
                finalArray[video.type] = [];
              }
              finalArray[video.type].push(video);
              return finalArray;
            }, {});
            this.movieTypedVideos = groupedVideos;
            this.videoKeys = Object.keys(groupedVideos).reverse();
            this.videoBackgroundUrls = {};
            this.videoKeys.forEach((type) => {
              this.movieTypedVideos[type].forEach((vid: any, index: number) => {
                this._DetailsService.getVideoChannel(vid.key).subscribe({
                  next: (data) => {
                    if (data.items.length > 0) {
                      const videoDetails = data.items[0];
                      this.movieTypedVideos[type][index] = {
                        ...vid,
                        channelInfo: {
                          channelId: videoDetails.snippet.channelId,
                          channelTitle: videoDetails.snippet.channelTitle,
                          duration: this.convertDuration(videoDetails.contentDetails.duration)
                        }
                      };
                    } else {
                      console.log('No video found with that ID.');
                    }
                  }
                });
              });
            });
            this.videoKeys.forEach((type) => {
              this.movieTypedVideos[type].forEach((vid: any, index: number) => {
                const baseUrl = 'https://i.ytimg.com/vi/' + vid?.key;
                const imageUrl720 = baseUrl + '/hq720.jpg';
                const imageUrlDefault = baseUrl + '/hqdefault.jpg';
                if (isPlatformBrowser(this._PLATFORM_ID)) {
                  const img = new Image();
                  img.src = imageUrl720;
                  img.onload = () => {
                    if (img.naturalWidth === 120 && img.naturalHeight === 90) {
                      if (!this.videoBackgroundUrls[type]) {
                        this.videoBackgroundUrls[type] = [];
                      }
                      this.videoBackgroundUrls[type][index] = `url(${imageUrlDefault})`;
                    } else {
                      if (!this.videoBackgroundUrls[type]) {
                        this.videoBackgroundUrls[type] = [];
                      }
                      this.videoBackgroundUrls[type][index] = `url(${imageUrl720})`;
                    }
                  };
                  img.onerror = () => {
                    if (!this.videoBackgroundUrls[type]) {
                      this.videoBackgroundUrls[type] = [];
                    }
                    this.videoBackgroundUrls[type][index] = `url(${imageUrlDefault})`;
                  };
                }
              });
            });
            this.modifiedURLs = {};
            this.videoKeys.forEach((type) => {
              this.modifiedURLs[type] = [];
              this.movieTypedVideos[type].forEach((video: any, index: number) => {
                const modifiedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
                  `https://www.youtube.com/embed/${video.key}?autoplay=0`
                );
                this.modifiedURLs[type][index] = modifiedUrl;
              });
            });
          }
        });
      }
    });
  }


  setMediaActiveTab(tab: string) {
    this.mediaActiveTab = tab;
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
  convertDuration(duration: string): string {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = duration.match(regex);
    if (!matches) return duration;
    const hours = matches[1] ? `${matches[1]}:` : '';
    const minutes = matches[2] ? `${parseInt(matches[2], 10)}` : '0';
    const seconds = matches[3] ? matches[3].padStart(2, '0') : '00';
    return hours ? `${hours}${minutes.padStart(2, '0')}:${seconds}` : `${minutes}:${seconds}`;
  }
  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
  }
}