import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MoviesComponent } from './components/movies/movies.component';
import { PeopleComponent } from './components/people/people.component';
import { TvShowsComponent } from './components/tv-shows/tv-shows.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'movies', component: MoviesComponent},
  { path: 'tv', component: TvShowsComponent},
  { path: 'people', component: PeopleComponent},

  // { path: 'movies', loadComponent: () => import('./components/movies/movies.component').then(m => m.MoviesComponent) },
  { path: 'movies/:type', loadComponent: () => import('./components/movies/movies.component').then(m => m.MoviesComponent) },
  { path: 'movies/:type/page/:page', loadComponent: () => import('./components/movies/movies.component').then(m => m.MoviesComponent) },

  // { path: 'tv', loadComponent: () => import('./components/tv-shows/tv-shows.component').then(m => m.TvShowsComponent) },
  { path: 'tv/:type', loadComponent: () => import('./components/tv-shows/tv-shows.component').then(m => m.TvShowsComponent) },
  { path: 'tv/:type/page/:page', loadComponent: () => import('./components/tv-shows/tv-shows.component').then(m => m.TvShowsComponent) },

  // { path: 'people', loadComponent: () => import('./components/people/people.component').then(m => m.PeopleComponent) },
  { path: 'people/page/:page', loadComponent: () => import('./components/people/people.component').then(m => m.PeopleComponent) },

  { path: 'moviedetails/:id', loadComponent: () => import('./components/movie-details/movie-details.component').then(m => m.MovieDetailsComponent) },
  { path: 'moviedetails/:id/cast', loadComponent: () => import('./components/all-cast/all-cast.component').then(m => m.AllCastComponent) },
  { path: 'moviedetails/:id/reviews', loadComponent: () => import('./components/reviews/reviews.component').then(m => m.ReviewsComponent) },
  { path: 'moviedetails/:id/videos', loadComponent: () => import('./components/videos/videos.component').then(m => m.VideosComponent) },
  { path: 'moviedetails/:id/backdrops', loadComponent: () => import('./components/backdrops/backdrops.component').then(m => m.BackdropsComponent) },
  { path: 'moviedetails/:id/posters', loadComponent: () => import('./components/posters/posters.component').then(m => m.PostersComponent) },

  { path: 'tvdetails/:id', loadComponent: () => import('./components/tv-details/tv-details.component').then(m => m.TvDetailsComponent) },
  { path: 'tvdetails/:id/cast', loadComponent: () => import('./components/tv-cast/tv-cast.component').then(m => m.TvCastComponent) },
  { path: 'tvdetails/:id/seasons', loadComponent: () => import('./components/tv-seasons/tv-seasons.component').then(m => m.TvSeasonsComponent) },
  { path: 'tvdetails/:id/seasons/:seasonNumber', loadComponent: () => import('./components/season-details/season-details.component').then(m => m.SeasonDetailsComponent) },
  { path: 'tvdetails/:id/seasons/:seasonNumber/episode/:episodeNumber', loadComponent: () => import('./components/episode-details/episode-details.component').then(m => m.EpisodeDetailsComponent) },
  { path: 'tvdetails/:id/reviews', loadComponent: () => import('./components/tv-reviews/tv-reviews.component').then(m => m.TvReviewsComponent) },
  { path: 'tvdetails/:id/videos', loadComponent: () => import('./components/tv-videos/tv-videos.component').then(m => m.TvVideosComponent) },
  { path: 'tvdetails/:id/backdrops', loadComponent: () => import('./components/tv-backdrops/tv-backdrops.component').then(m => m.TvBackdropsComponent) },
  { path: 'tvdetails/:id/posters', loadComponent: () => import('./components/tv-posters/tv-posters.component').then(m => m.TvPostersComponent) },

  { path: 'person/:id', loadComponent: () => import('./components/person-details/person-details.component').then(m => m.PersonDetailsComponent) },

  { path: 'keyword/:id/:name/:type/page/:pageNumber', loadComponent: () => import('./components/discover/discover.component').then(m => m.DiscoverComponent) },

  { path: '**', loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent) },
];