// app.config.ts
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/token.interceptor.js';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes.js';

export const appConfig: ApplicationConfig = {
  providers: [
    // …
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes),
  ],
};
