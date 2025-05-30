import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackElementDirective } from './track-element.directive';
import { TrackAnalyticsService } from './track-analytics.service';
import { TrackAnalyticsComponent } from './track-analytics.component';

@NgModule({
  imports: [
    CommonModule,
    TrackAnalyticsComponent,
    TrackElementDirective
  ],
  exports: [
    TrackAnalyticsComponent,
    TrackElementDirective
  ],
  providers: [
    TrackAnalyticsService
  ]
})
export class TrackAnalyticsModule { }
