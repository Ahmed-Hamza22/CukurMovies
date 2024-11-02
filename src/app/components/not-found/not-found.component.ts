import { Component, inject, OnInit } from '@angular/core';
import { MoviesService } from '../../core/services/movies.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent implements OnInit{
  private readonly _TitleService = inject(Title);
  private readonly _MoviesService = inject(MoviesService);
  ngOnInit(): void {
    this._TitleService.setTitle('Not Found 404');
    this._MoviesService.searchWord.set('');
    this._MoviesService.searchArray.set([]);
  }
}
