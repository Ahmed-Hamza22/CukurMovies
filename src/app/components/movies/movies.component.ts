import { Component, inject, OnInit } from '@angular/core';
import { MoviesService } from '../../core/services/movies.service';
import { IMovie } from '../../core/interfaces/imedia';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProgressPipe } from '../../core/pipes/progress.pipe';
import { RatingPipe } from '../../core/pipes/rating.pipe';
import { environment } from '../../core/environment/environment';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [RouterLink,ProgressPipe,RatingPipe,DatePipe,FormsModule],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss'
})
export class MoviesComponent implements OnInit{
  private _Router = inject(Router);
  private _ActivatedRoute = inject(ActivatedRoute);
  private readonly _MoviesService= inject(MoviesService);
  private readonly _TitleService = inject(Title);
  imgPrefix:string = environment.imgPath;
  movieListType:any = 'popular';
  moviesList: IMovie[] = [];
  totalPages: number = 500;
  currentPage: number = 1;
  pagesToShow: number = 10;
  visiblePages: number[] = [];
  ngOnInit(): void {
    this._ActivatedRoute.params.subscribe(params => {
      const type = params['type'];
      const page = +params['page'] || 1;
      this.movieListType = type;
      if(this.movieListType == "popular" || this.movieListType == undefined){
        this._TitleService.setTitle('Popular Movies - ÇukurWatch');
      }else{
        this._TitleService.setTitle('Top Rated Movies - ÇukurWatch');
      }
      this.currentPage = page;
      this.renderPagination();
      this.getPage(this.currentPage);
    });
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
      this._Router.navigate(['/movies', this.movieListType, page > 0 ? 'page' : undefined, page]);
      this.getPage(this.currentPage);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  getPage(getpageNumber: number = 1): void {
    this._MoviesService.searchWord.set('');
    this._MoviesService.searchArray.set([]);
    this.movieListType = this._MoviesService.movieSelected();
    this._MoviesService.getEntertainment('movie', this.movieListType, getpageNumber).subscribe({
      next: (res) => {
        this.moviesList = res.results;
      }
    });
  }
}
