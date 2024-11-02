import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../core/environment/environment';
import { ISeries } from '../../core/interfaces/imedia';
import { MoviesService } from '../../core/services/movies.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProgressPipe } from '../../core/pipes/progress.pipe';
import { RatingPipe } from '../../core/pipes/rating.pipe';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-tv-shows',
  standalone: true,
  imports: [RouterLink,ProgressPipe,RatingPipe,DatePipe,FormsModule],
  templateUrl: './tv-shows.component.html',
  styleUrl: './tv-shows.component.scss'
})
export class TvShowsComponent implements OnInit{
  private readonly _TitleService = inject(Title);
  private _Router = inject(Router);
  private _ActivatedRoute = inject(ActivatedRoute);
  private readonly _MoviesService= inject(MoviesService);
  imgPrefix:string = environment.imgPath;
  tvListType:any = 'popular';
  tvsList: ISeries[] = [];
  totalPages: number = 500;
  currentPage: number = 1;
  pagesToShow: number = 10;
  visiblePages: number[] = [];
  ngOnInit(): void {
    this._ActivatedRoute.params.subscribe(params => {
      const type = params['type'];
      const page = +params['page'] || 1;
      this.tvListType = type;
      if(this.tvListType == "popular" || this.tvListType == undefined){
        this._TitleService.setTitle('Popular TV-Shows - ÇukurWatch');
      }else{
        this._TitleService.setTitle('Top Rated TV-Shows - ÇukurWatch');
      }
      this.currentPage = page;
      this.renderPagination();
      this.getPage(this.currentPage);
    });
    this.renderPagination();
  }
  renderPagination(): void {
    let startPage = 1;
    let endPage = this.pagesToShow;
    if (this.currentPage > this.pagesToShow) {
      startPage = this.currentPage - this.pagesToShow + 1;
      endPage = this.currentPage;
    }
    this.visiblePages = [];
    for (let i = startPage; i <= endPage; i++) {
      this.visiblePages.push(i);
    }
  }
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.renderPagination();
      this._Router.navigate(['/tv', this.tvListType, page > 0 ? 'page' : undefined, page]);
      this.getPage(this.currentPage);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  getPage(getpageNumber:number = 1): void{
    this._MoviesService.searchWord.set('');
    this._MoviesService.searchArray.set([]);
    this.tvListType = this._MoviesService.tvSelected(); // الاشتراك في signal
    this._MoviesService.getEntertainment('tv', this.tvListType, getpageNumber).subscribe({
      next:(res)=>{
        this.tvsList = res.results;
      }
    });
  }
}
