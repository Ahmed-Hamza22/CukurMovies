import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MoviesService } from '../../core/services/movies.service';
import { environment } from '../../core/environment/environment';
import { IPersonCastCredit } from '../../core/interfaces/iperson-credit';
import { DatePipe, NgFor } from '@angular/common';
import { TermPipe } from '../../core/pipes/term.pipe';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-discover',
  standalone: true,
  imports: [DatePipe, RouterLink, TermPipe,NgFor],
  templateUrl: './discover.component.html',
  styleUrl: './discover.component.scss'
})
export class DiscoverComponent implements OnInit{
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _MoviesService = inject(MoviesService);
  private readonly _TitleService = inject(Title);
  private readonly _Router = inject(Router);
  imgPrefix:string = environment.imgPath;
  keywordId:string | number | null = '';
  keywordName:string | null = '';
  listType:string | null = '';
  worksList:IPersonCastCredit[] = [];
  workListLength!:number;
  workListPages!:number;
  currentPage: number = 1;
  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next:(params)=>{
        this.keywordId = params.get('id');
        this.keywordName = params.get('name');
        this.listType = params.get('type');
        const pageParam  = params.get('pageNumber');
        this.currentPage = pageParam ? +pageParam : 1;;
        this.loadWorks();
        this._TitleService.setTitle('" ' + this.keywordName + ' "' + ' ' + this.listType+'s');
      }
    });
  }
  loadWorks(){
    this._MoviesService.getDiscover(this.keywordId,this.listType,this.currentPage).subscribe({
      next:(res)=>{
        this.worksList = res.results;
        console.log(this.worksList);
        this.workListLength = res.total_results;
        this.workListPages = res.total_pages;
      }
    });
  }
  changePage(page: number) {
    this.currentPage = page;
    this._Router.navigate(['/keyword',this.keywordId,this.keywordName,this.listType,'page',this.currentPage]);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  getDisplayedPages(): number[] {
    const pages = [];
    const startPage = Math.max(1, this.currentPage - 8);
    const endPage = Math.min(startPage + 9, this.workListPages);
    for (let i = startPage; i <= endPage; i++) {
      if (i <= this.workListPages) {
        pages.push(i);
      }
    }
    if (pages.length < 10) {
      const additionalPages = Math.min(10 - pages.length, this.workListPages - pages[pages.length - 1]);
      for (let i = 1; i <= additionalPages; i++) {
        pages.push(pages[pages.length - 1] + i);
      }
    }
    return pages;
  }
}
