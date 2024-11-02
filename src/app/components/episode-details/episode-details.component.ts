import { Component, inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DetailsService } from '../../core/services/details.service';
import { DatePipe, isPlatformBrowser, NgClass, UpperCasePipe } from '@angular/common';
import { RatingPipe } from '../../core/pipes/rating.pipe';
import { TimePipe } from '../../core/pipes/time.pipe';
import { environment } from '../../core/environment/environment';
import { ITVDetails } from '../../core/interfaces/itvdetails';
import { IEPCast, IEPCrew, IEpisode, IGueststar, ISEDetails } from '../../core/interfaces/isedetails';
import { IMedia } from '../../core/interfaces/imedia';
import { IImage } from '../../core/interfaces/iimage';
import { MoviesService } from '../../core/services/movies.service';

@Component({
  selector: 'app-episode-details',
  standalone: true,
  imports: [RouterLink,DatePipe,RatingPipe,TimePipe,NgClass,UpperCasePipe],
  templateUrl: './episode-details.component.html',
  styleUrl: './episode-details.component.scss'
})
export class EpisodeDetailsComponent implements OnInit, OnDestroy{
  private readonly _MoviesService = inject(MoviesService);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _DetailsService = inject(DetailsService);
  private readonly _TitleService = inject(Title);
  private readonly _PLATFORM_ID = inject(PLATFORM_ID);
  private readonly sanitizer = inject(DomSanitizer);
  private renderer = inject(Renderer2);
  mediaId:any;
  urlSeasonNumber:any;
  urlEpisodeNumber:any;
  imgPrefix:string = environment.imgPath;
  TVDetails!:ITVDetails;
  episodeDetails!:IEpisode;
  seasonDetails:ISEDetails = {} as ISEDetails;
  seasonLength: number | string = 0;
  seasonEpisodes:IEpisode [] | any = [];
  mediaActiveTab: string = 'cast';
  episodeCrew:IEPCrew[] = [];
  directors:IEPCrew[] = [];
  writers:IEPCrew[] = [];
  episodeMainCast:IEPCast[] = [];
  episodeGuests:IGueststar[] = [];
  episodeVideos:IMedia[] | any = [];
  videoBackgroundUrls: string[] = [];
  modifiedURLs:string [] = [];
  currentVideoIndex: number | null = null;
  isVideoVisible:boolean = false;
  private clickListener: (() => void) | null = null;
  channelInfo: any;
  episodeImages:IImage[] = [];
  goOriginal:string = environment.imgOriginalSize;
  prevEpisodename:string = '';
  nextEpisodename:string = '';
  ngOnInit(): void {
    this._MoviesService.searchWord.set('');
    this._MoviesService.searchArray.set([]);
    this._ActivatedRoute.paramMap.subscribe({
      next:(params)=>{
        this.mediaId = params.get('id');
        this.urlSeasonNumber = params.get('seasonNumber');
        this.urlEpisodeNumber = params.get('episodeNumber');
        this._DetailsService.getDetails('tv',this.mediaId).subscribe({
          next:(res)=>{
            this.TVDetails = res;
            this._TitleService.setTitle(this.TVDetails.name + ' - Season ' + this.urlSeasonNumber + ' - Episode ' + this.urlEpisodeNumber );
          }
        });
        this._DetailsService.getSeasonDetails('tv',this.mediaId,this.urlSeasonNumber).subscribe({
          next:(res)=>{
            this.seasonDetails = res;
            this.seasonLength = this.seasonDetails.episodes.length;
            this.seasonEpisodes = this.seasonDetails.episodes;
          }
        });
        this._DetailsService.getEpisodeDetails('tv',this.mediaId,this.urlSeasonNumber,this.urlEpisodeNumber).subscribe({
          next:(res)=>{
            this.episodeDetails = res;
            this.episodeGuests = res.guest_stars;
            this.episodeCrew = res.crew;
            this.writers = this.episodeCrew.filter((member:IEPCrew) => member.job === 'Writer');
            this.directors = this.episodeCrew.filter((member:IEPCrew) => member.job === 'Director');
            if(this.seasonEpisodes?.length > 0){
            if(this.episodeDetails?.episode_number !== this.seasonDetails?.episodes[0]?.episode_number){
              let prev:any = this.seasonEpisodes.find((i:any)=>i.episode_number == this.episodeDetails?.episode_number-1);
              this.prevEpisodename = prev.name;
            }
            if(this.episodeDetails.episode_number !== this.seasonDetails?.episodes[this.seasonDetails?.episodes.length-1]?.episode_number){
              let next:any = this.seasonEpisodes.find((i:any)=>i.episode_number == this.episodeDetails.episode_number+1);
              this.nextEpisodename = next.name;
            }}
          }
        });
        this._DetailsService.getEpisodeCredits('tv',this.mediaId,this.urlSeasonNumber,this.urlEpisodeNumber).subscribe({
          next:(res)=>{
            this.episodeMainCast = res.cast;
          }
        });
        this._DetailsService.getEpisodeVideos('tv',this.mediaId,this.urlSeasonNumber,this.urlEpisodeNumber).subscribe({
          next:(res)=>{
            this.episodeVideos = res.results;
            this.episodeVideos.forEach((vid:any, index:any) => {
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
            for (let i = 0; i < this.episodeVideos.length; i++) {
              modifiedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.episodeVideos[i].key}?autoplay=1`);
              this.modifiedURLs.push(modifiedUrl);
            }
            this.episodeVideos.forEach((vid: any, index: number) => {
              this._DetailsService.getVideoChannel(vid.key).subscribe({
                next: (data) => {
                  if (data.items.length > 0) {
                    const videoDetails = data.items[0];
                    this.episodeVideos[index] = {
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
          }
        });
        this._DetailsService.getEpisodeImages('tv',this.mediaId,this.urlSeasonNumber,this.urlEpisodeNumber).subscribe({
          next:(res)=>{
            this.episodeImages = res.stills;
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
