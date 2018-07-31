import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuardService } from './shared/auth-guard.service';

import { ProfileComponent } from './components/profile/profile.component';
import { RedAlertsComponent } from './components/red-alerts/red-alerts.component';
import { CustomerSatisfactionComponent } from './components/customer-satisfaction/customer-satisfaction.component';
import {AgentPerformanceComponent} from './components/agent-performance/agent-performance.component';
import {CallTranscriptsComponent} from './components/call-transcripts/call-transcripts.component';
import {CallIngestionComponent} from './components/call-ingestion/call-ingestion.component';
import {NotFoundComponent} from './components/not-found/not-found.component';
import {CallRecordingsComponent} from './components/call-recordings/call-recording.component';



// @ts-ignore
const routes: Routes = [
  { path: '',  redirectTo: '/home',  pathMatch: 'full'},
  { path: 'home', component: LandingPageComponent },
  { path: 'dashboard', component: DashboardComponent , canActivate: [AuthGuardService],
     children: [
         {
           path: 'profile',
           component: ProfileComponent,
           canActivate: [AuthGuardService]
         },
         {
           path: 'customerSatisfaction',
           component: CustomerSatisfactionComponent,
           canActivate: [AuthGuardService]
         },
        {
          path: 'redAlerts',
          component: RedAlertsComponent,
          canActivate: [AuthGuardService]
        },
       {
         path: 'callIngestion',
         component: CallIngestionComponent,
         canActivate: [AuthGuardService]
       },
       {
         path: 'callRecordings',
         component: CallRecordingsComponent,
         canActivate: [AuthGuardService]
       },
       {
         path: 'callTranscripts',
         component: CallTranscriptsComponent,
         canActivate: [AuthGuardService]
       },
       {
         path: 'agentPerformance',
         component: AgentPerformanceComponent,
         canActivate: [AuthGuardService]
       },
       {
         path: '',
         redirectTo: 'customerSatisfaction',
         pathMatch: 'full',
         canActivate: [AuthGuardService],
       }
     ]
   },
   { path: '**',
     component: NotFoundComponent
   }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {useHash: true})
  ],
})
export class AppRoutingModule {
}
