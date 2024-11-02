import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DetailsService } from '../../core/services/details.service';
import { environment } from '../../core/environment/environment';
import { ITVDetails, Season } from '../../core/interfaces/itvdetails';
import { ISEDetails } from '../../core/interfaces/isedetails';
import { DatePipe } from '@angular/common';
import { RatingPipe } from '../../core/pipes/rating.pipe';
import { TimePipe } from '../../core/pipes/time.pipe';
import { MoviesService } from '../../core/services/movies.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-season-details',
  standalone: true,
  imports: [RouterLink,DatePipe,RatingPipe,TimePipe],
  templateUrl: './season-details.component.html',
  styleUrl: './season-details.component.scss'
})
export class SeasonDetailsComponent implements OnInit{
  private readonly _MoviesService = inject(MoviesService);
  private readonly _TitleService = inject(Title);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _DetailsService = inject(DetailsService);
  mediaId:any;
  seasonNumber:any;
  imgPrefix:string = environment.imgPath;
  TVDetails!:ITVDetails;
  seasonDetails:ISEDetails = {} as ISEDetails;
  seasonLength: number | string = 0;
  haveSpecialSeason:boolean = true;
  prevSeasonname:string = '';
  nextSeasonname:string = '';
  ngOnInit(): void {
    this._MoviesService.searchWord.set('');
    this._MoviesService.searchArray.set([]);
    this._ActivatedRoute.paramMap.subscribe({
      next:(params)=>{
        this.mediaId = params.get('id');
        this.seasonNumber = params.get('seasonNumber');
        this._DetailsService.getDetails('tv',this.mediaId).subscribe({
          next:(res)=>{
            this.TVDetails = res;
            this.haveSpecialSeason = this.hasSpecialSeason(res.seasons);
            if(this.seasonNumber == '0'){
              this._TitleService.setTitle(this.TVDetails.name + ' - Specials');
            }else{
              this._TitleService.setTitle(this.TVDetails.name + ' - Season ' + this.seasonNumber);
            }
          }
        });
        this._DetailsService.getSeasonDetails('tv',this.mediaId,this.seasonNumber).subscribe({
          next:(res)=>{
            this.seasonDetails = res;
            this.seasonLength = this.seasonDetails.episodes.length;
            if(this.seasonDetails.season_number !== 0){
              if(!this.haveSpecialSeason){
                this.prevSeasonname = this.TVDetails?.seasons[this.seasonDetails.season_number-2]?.name;
              }else{
                this.prevSeasonname = this.TVDetails?.seasons[this.seasonDetails.season_number-1]?.name;
              }
            }
            if(!this.haveSpecialSeason){
              if(this.seasonDetails.season_number !== this.TVDetails.seasons.length){
                this.nextSeasonname = this.TVDetails?.seasons[this.seasonDetails.season_number]?.name;
              }
            }else{
              if(this.seasonDetails.season_number !== this.TVDetails.seasons.length +1){
                this.nextSeasonname = this.TVDetails?.seasons[this.seasonDetails.season_number+1]?.name;
              }
            }
          }
        });
      }
    });
  }
  hasSpecialSeason(seasons: Season[]): boolean {
    return seasons.some(season => season.season_number === 0);
  }
}