import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { errorsInterceptor } from './core/interceptors/errors.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { HashLocationStrategy } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    HashLocationStrategy,
    provideRouter(routes, withViewTransitions(),
    withInMemoryScrolling({scrollPositionRestoration:'top'})
    ),
    importProvidersFrom(NgxSpinnerModule,BrowserAnimationsModule),
    provideClientHydration(),
    provideHttpClient(withFetch(),withInterceptors([errorsInterceptor, loadingInterceptor])),
  ],
};
