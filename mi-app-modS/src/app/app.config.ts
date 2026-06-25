import { ApplicationConfig, provideBrowserGlobalErrorListeners, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';
import { SocialLoginModule, SOCIAL_AUTH_CONFIG, SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'es-CL' },
    provideBrowserGlobalErrorListeners(),
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(SocialLoginModule),
    {
      provide: SOCIAL_AUTH_CONFIG,
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('840983042006-83o1m9n2j019ck8flkhu456eil63sdo1.apps.googleusercontent.com')
          }
        ],
        onError: (err) => console.error('Error Auth:', err)
      } as SocialAuthServiceConfig
    }
  ]
};

