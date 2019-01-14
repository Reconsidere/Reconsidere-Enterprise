import { AppService } from 'src/services/app.service';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { FlatpickrModule } from 'angularx-flatpickr';
import { MatListModule } from '@angular/material/list';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ROUTING, routes } from './app.routing';
import { NgxMaskModule } from 'ngx-mask';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/services/auth.service';
import { RouterModule } from '@angular/router';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ForgotComponent } from './auth/forgot/forgot.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { AdminComponent } from './admin/admin.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { StartcenterComponent } from './startcenter/startcenter.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { CepPipe } from '../pipes/cep.pipe';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VehicleManagementComponent } from './vehicle-management/vehicle-management.component';
import { NgxPaginationModule } from 'ngx-pagination';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { DecriptEncript } from './_helpers/decriptencript';
import { RecaptchaModule } from 'angular-google-recaptcha';
import { BooltransformPipe } from '../pipes/booltransform.pipe';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    ForgotComponent,
    SignInComponent,
    LogoutComponent,
    AdminComponent,
    ToolbarComponent,
    StartcenterComponent,
    SchedulerComponent,
    CepPipe,
    VehicleManagementComponent,
    BooltransformPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ROUTING,
    NgxMaskModule.forRoot(),
    HttpClientModule,
    FormsModule,
    BrowserModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    MatListModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    CommonModule,
    RecaptchaModule.forRoot({
      siteKey: '6Le4YIgUAAAAAJFj9q0jVjfxVR0D_QNfGetw0JKF',
  }),
  ],


  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: LOCALE_ID, useValue: 'pt' },
    AuthService,
    AppService,
    ReactiveFormsModule,
    BrowserModule,
    RouterModule,
    DecriptEncript
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
