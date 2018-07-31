import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { TokenInterceptor } from './shared/token.interceptor';
import { Ng2FileSizeModule } from 'ng2-file-size';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { SearchComponent } from './components/search/search.component';

import { faHome, faUser, faPowerOff } from '@fortawesome/fontawesome-free-solid';
import fontawesome from '@fortawesome/fontawesome';
import { UserDetailsComponent } from './components/side-nav/user-details/user-details.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from './components/dashboard/dashboard.component';
fontawesome.library.add(faHome);
fontawesome.library.add(faUser);
fontawesome.library.add(faPowerOff);

//services
import { AuthorizationService} from '../app/shared/authorization.service';
import { AuthGuardService } from './shared/auth-guard.service';
import { ProfileComponent } from './components/profile/profile.component';
import { CustomerSatisfactionComponent } from './components/customer-satisfaction/customer-satisfaction.component';
import { RedAlertsComponent } from './components/red-alerts/red-alerts.component';
import {ProfileInfoComponent} from './components/profile/profile-information/profile-info.component';
import {CompanyInfoComponent} from './components/profile/company-info/company-info.component';
import {PḥotoUploadComponent} from './components/profile/photo-upload/photo-upload.component';
import {StoreModule} from '@ngrx/store';
import { setDataReducer} from '../app.reducer';
import { CallIngestionComponent } from './components/call-ingestion/call-ingestion.component';
import { CallTranscriptsComponent } from './components/call-transcripts/call-transcripts.component';
import { AgentPerformanceComponent } from './components/agent-performance/agent-performance.component';
import {ProfileService} from './components/profile/shared/profile.service';
import {SpinnerComponent} from './shared/spinner/spinner.component';
import {DataService} from './shared/data.service';
import {LambdaTriggerService} from './shared/lambda-trigger.service';

import {PreventLogInService} from './shared/prevent-log-in.service';
import {UploadService} from './shared/upload.service';
import {TranscriptionTimetrackerService} from './shared/transcription-timetracker-service';
import {SessionService} from './shared/session.service';
import {RoleGuardService} from './shared/roleGuard.service';
import {NotFoundComponent} from './components/not-found/not-found.component';

import {ChartComponent} from 'app/components/call-transcripts/chart/chart.component';
import {SideBarComponent} from './components/call-transcripts/side-bar/side-bar.component';
import {TranscriptService} from './components/call-transcripts/shared/transcript.service';
import {SortPipe} from './components/call-recordings/shared/filter/sort.pipe';
import {SearchPipe} from './components/call-recordings/shared/filter/search.pipe';
import {SelectlistComponent} from './components/call-recordings/selectlist/selectlist.component';
import {FileInfoService} from './components/call-recordings/shared/file-info.service';
import {CallRecordingsComponent} from './components/call-recordings/call-recording.component';



export function gettoken() {
  return localStorage.getItem('token');
};

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    DashboardComponent,
    ProfileComponent,
    HeaderComponent,
    SideNavComponent,
    FooterComponent,
    SearchComponent,
    UserDetailsComponent, CustomerSatisfactionComponent, RedAlertsComponent,
    ProfileInfoComponent,
    CompanyInfoComponent,
    PḥotoUploadComponent,
    CallIngestionComponent,
    CallTranscriptsComponent,
    AgentPerformanceComponent,
    SpinnerComponent,
    NotFoundComponent,
    SortPipe,
    SearchPipe,
    SelectlistComponent,
    ChartComponent,
    SideBarComponent,
    CallRecordingsComponent,
    SpinnerComponent

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    Ng2FileSizeModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    StoreModule.forRoot({ setData: setDataReducer}),
    JwtModule.forRoot({
      config: {
        tokenGetter: gettoken,
        whitelistedDomains: ['localhost:4200', 'https://d3codgzuy94wwm.cloudfront.net', 'https://d1542gx2ogz2qv.cloudfront.net']
      }
    }),
  ],
  providers: [AuthorizationService, { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true } , AuthGuardService,
    ProfileService,
    DataService,
    LambdaTriggerService,
    RoleGuardService,
    PreventLogInService,
    SessionService,
    TranscriptionTimetrackerService,
    UploadService,
    FileInfoService,
    TranscriptService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
