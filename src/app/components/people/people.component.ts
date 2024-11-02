import { isPlatformBrowser } from '@angular/common';
import { Component, effect, inject, Injector, OnInit, PLATFORM_ID, runInInjectionContext } from '@angular/core';
import { environment } from '../../core/environment/environment';
import { MoviesService } from '../../core/services/movies.service';
import { IPeople } from '../../core/interfaces/iperson';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-people',
  standalone: true,
  imports: [RouterLink,FormsModule],
  templateUrl: './people.component.html',
  styleUrl: './people.component.scss'
})
export class PeopleComponent implements OnInit{
  private readonly _TitleService = inject(Title);
  private _Router = inject(Router);
  private _ActivatedRoute = inject(ActivatedRoute);
  private readonly _MoviesService= inject(MoviesService);
  imgPrefix:string = environment.imgPath;
  peopleList: IPeople[] = [];
  totalPages: number = 500;
  currentPage: number = 1;
  pagesToShow: number = 10;
  visiblePages: number[] = [];
  ngOnInit(): void {
    this._TitleService.setTitle('Trending People - ÇukurWatch');
    this._ActivatedRoute.params.subscribe(params => {
      const type = params['type'];
      const page = +params['page'] || 1;
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
      this._Router.navigate(['/people', page > 0 ? 'page' : undefined, page]);
      this.getPage(this.currentPage);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  getPage(getpageNumber:number = 1): void{
    this._MoviesService.searchWord.set('');
    this._MoviesService.searchArray.set([]);
    this._MoviesService.getEntertainment('person', 'popular', getpageNumber).subscribe({
      next:(res)=>{
        this.peopleList = res.results;
      }
    });
  }
}