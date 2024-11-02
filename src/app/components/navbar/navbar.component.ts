import { Component, ElementRef, inject, Renderer2, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MoviesService } from '../../core/services/movies.service';
import { environment } from '../../core/environment/environment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent{
  _MoviesService = inject(MoviesService);
  private readonly _Renderer2 = inject(Renderer2);
  isMovieDropdownVisible: boolean = false;
  isTvDropdownVisible: boolean = false;
  movieActiveTab:string = 'popular';
  tvActiveTab:string = 'popular';
  imgPrefix:string = environment.imgPath;
  @ViewChild('searchDiv', { static: false }) searchDiv!: ElementRef;
  onSelectMovie(movieType: string) {
    this._MoviesService.movieSelected.set(movieType);
    this.movieActiveTab = movieType;
    this.hideMovieDropdown();
  }
  hideMovieDropdown(): void {
    this.isMovieDropdownVisible = false;
  }
  showMovieDropdown(): void {
    this.isMovieDropdownVisible = true;
  }
  onSelectTv(tvType: string) {
    this._MoviesService.tvSelected.set(tvType);
    this.tvActiveTab = tvType;
    this.hideTvDropdown();
  }
  hideTvDropdown(): void {
    this.isTvDropdownVisible = false;
  }
  showTvDropdown(): void {
    this.isTvDropdownVisible = true;
  }
  search():void{
    this._MoviesService.getSearch('multi',this._MoviesService.searchWord()).subscribe({
      next:(res)=>{
        this._MoviesService.searchArray.set(res.results);
      }
    });
  }
  onBlur(event: FocusEvent): void {
    const target = event.relatedTarget as HTMLElement;
    const isInsideSearchList = this.searchDiv.nativeElement.contains(target);
    if (!isInsideSearchList) {
      this._MoviesService.searchArray.set([]);
    }
  }
  blurAgain() {
    this._MoviesService.searchWord.set('');
    this._MoviesService.searchArray.set([]);
  }
}
