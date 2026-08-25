import { DATE_PIPE_DEFAULT_OPTIONS, IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  LOCALE_ID,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideApi as provideCsssApi } from '@csss-api';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { LOCALE } from './config';
import { ActivityService } from './core/activity.service';
import { DebugService } from './core/debug.service';

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
    },
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig): string => {
        return `${environment.mediaUrl}/images/${config.src}`;
      }
    },
    provideAppInitializer(() => {
      inject(ActivityService);
      inject(DebugService);
    })
  ]
};
