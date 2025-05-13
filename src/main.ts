import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes'; // ✅ Import the actual route array

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(), provideRouter(routes)] // ✅ Pass in the route array
});
