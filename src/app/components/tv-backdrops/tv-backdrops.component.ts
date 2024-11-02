import { DatePipe, UpperCasePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ITVDetails } from '../../core/interfaces/itvdetails';
import { IBackdrop } from '../../core/interfaces/ibackdrop';
import { environment } from '../../core/environment/environment';
import { DetailsService } from '../../core/services/details.service';
import { MoviesService } from '../../core/services/movies.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-tv-backdrops',
  standalone: true,
  imports: [DatePipe, RouterLink, UpperCasePipe],
  templateUrl: './tv-backdrops.component.html',
  styleUrl: './tv-backdrops.component.scss'
})
export class TvBackdropsComponent implements OnInit{
  private readonly _MoviesService = inject(MoviesService);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _DetailsService = inject(DetailsService);
  private readonly _TitleService = inject(Title);
  imgPrefix:string = environment.imgPath;
  goOriginal:string = environment.imgOriginalSize;
  mediaId:any;
  TVDetails!:ITVDetails;
  TVBackdrops:IBackdrop [] = [];
  ngOnInit(): void {
    this._MoviesService.searchWord.set('');
    this._MoviesService.searchArray.set([]);
    this._ActivatedRoute.paramMap.subscribe({
      next:(params)=>{
        this.mediaId = params.get('id');
        this._DetailsService.getDetails('tv',this.mediaId).subscribe({
          next:(res)=>{
            this.TVDetails = res;
            this._TitleService.setTitle(this.TVDetails.name + ' - Backdrops');
          }
        });
        this._DetailsService.getImages('tv',this.mediaId).subscribe({
          next:(res)=>{
            this.TVBackdrops = res.backdrops;
          }
        });
      }
    });
  }
}
