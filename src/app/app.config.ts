import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideApi as provideCsssApi } from '../app/api/generated/csss-backend';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

export const LOCALE = 'en-CA';
export const IANA_TIMEZONE = 'America/Vancouver';
export const DATETIME_FORMATTER = new Intl.DateTimeFormat(LOCALE, {
  timeZone: IANA_TIMEZONE
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideCsssApi({
      basePath: environment.csssApiUrl
    }),
    {
      provide: LOCALE_ID,
      useValue: LOCALE
    },
    {
      provide: DATE_PIPE_DEFAULT_OPTIONS,
      useValue: { timezone: '-700' }
    }
  ]
};
