import {
  DATE_PIPE_DEFAULT_OPTIONS,
  IMAGE_LOADER,
  ImageLoaderConfig,
  registerLocaleData
} from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localeCa from '@angular/common/locales/en-CA';
import {
  ApplicationConfig,
  inject,
  LOCALE_ID,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners
} from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import { ActivityService } from '@core/activity.service';
import { DebugService } from '@core/debug/debug.service';
import { loggingInterceptor } from '@core/logging/logging.interceptor';
import { provideApi as provideCsssApi } from '@csss-api';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { LOCALE } from './config';

registerLocaleData(localeCa, LOCALE);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([loggingInterceptor])),
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
