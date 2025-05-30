import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackAnalyticsService, UserSession, AnalyticsEvent } from './track-analytics.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'track-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="track-analytics-container" *ngIf="showUI">
      <div class="track-analytics-header">
        <h3>Analytics Dashboard</h3>
        <button class="track-analytics-close" (click)="toggleVisibility()">×</button>
      </div>

      <div class="track-analytics-content">
        <div class="track-analytics-section">
          <h4>Session Information</h4>
          <div *ngIf="currentSession">
            <p>Session ID: {{ currentSession.sessionId }}</p>
            <p>Started: {{ currentSession.startTime | date:'medium' }}</p>
            <p>Duration: {{ formatDuration(getSessionDuration()) }}</p>
          </div>
        </div>

        <div class="track-analytics-section">
          <h4>Page Views ({{ currentSession?.pageViews?.length || 0 }})</h4>
          <div class="track-analytics-table-container" *ngIf="currentSession?.pageViews?.length">
            <table class="track-analytics-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Path</th>
                  <th>Title</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let pageView of currentSession?.pageViews">
                  <td>{{ pageView.timestamp | date:'HH:mm:ss' }}</td>
                  <td>{{ pageView.path }}</td>
                  <td>{{ pageView.title }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="track-analytics-section">
          <h4>Events ({{ currentSession?.events?.length || 0 }})</h4>
          <div class="track-analytics-table-container" *ngIf="currentSession?.events?.length">
            <table class="track-analytics-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Type</th>
                  <th>Element</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let event of currentSession?.events">
                  <td>{{ event.timestamp | date:'HH:mm:ss' }}</td>
                  <td>{{ event.type }}</td>
                  <td>{{ event.element }}</td>
                  <td>
                    <button class="track-analytics-details-btn"
                            (click)="toggleEventDetails(event)">
                      {{ selectedEvent === event ? 'Hide' : 'Show' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="track-analytics-event-details" *ngIf="selectedEvent">
              <h5>Event Details</h5>
              <pre>{{ selectedEvent | json }}</pre>
            </div>
          </div>
        </div>

        <div class="track-analytics-section">
          <h4>User Journey</h4>
          <div class="track-analytics-journey" *ngIf="userJourney?.length">
            <div class="track-analytics-journey-item"
                 *ngFor="let item of userJourney; let i = index"
                 [class.track-analytics-journey-pageview]="item.journeyType === 'pageView'"
                 [class.track-analytics-journey-event]="item.journeyType === 'event'">
              <div class="track-analytics-journey-time">
                {{ item.timestamp | date:'HH:mm:ss' }}
              </div>
              <div class="track-analytics-journey-connector" *ngIf="i < userJourney.length - 1"></div>
              <div class="track-analytics-journey-content">
                <strong>{{ item.journeyType === 'pageView' ? 'Page View' : 'Event' }}</strong>
                <span *ngIf="item.journeyType === 'pageView'">
                  {{ item.path }}
                </span>
                <span *ngIf="item.journeyType === 'event'">
                  {{ item.type }}: {{ item.element }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button *ngIf="!showUI && showToggleButton"
            class="track-analytics-toggle-btn"
            (click)="toggleVisibility()">
      Show Analytics
    </button>
  `,
  styles: [`
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    .track-analytics-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 400px;
      max-height: 600px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 9999;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .track-analytics-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background-color: #f8f9fa;
      border-bottom: 1px solid #e9ecef;
    }

    .track-analytics-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }

    .track-analytics-close {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #6c757d;
    }

    .track-analytics-content {
      padding: 16px;
      overflow-y: auto;
      max-height: 540px;
    }

    .track-analytics-section {
      margin-bottom: 20px;
    }

    .track-analytics-section h4 {
      margin: 0 0 10px;
      font-size: 14px;
      font-weight: 600;
    }

    .track-analytics-table-container {
      max-height: 200px;
      overflow-y: auto;
    }

    .track-analytics-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }

    .track-analytics-table th, .track-analytics-table td {
      padding: 6px 8px;
      text-align: left;
      border-bottom: 1px solid #e9ecef;
    }

    .track-analytics-table th {
      font-weight: 600;
      background-color: #f8f9fa;
    }

    .track-analytics-details-btn {
      background-color: #e9ecef;
      border: none;
      border-radius: 4px;
      padding: 2px 6px;
      font-size: 11px;
      cursor: pointer;
    }

    .track-analytics-event-details {
      margin-top: 10px;
      padding: 10px;
      background-color: #f8f9fa;
      border-radius: 4px;
      font-size: 12px;
    }

    .track-analytics-event-details h5 {
      margin: 0 0 5px;
      font-size: 13px;
    }

    .track-analytics-event-details pre {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-all;
    }

    .track-analytics-journey {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .track-analytics-journey-item {
      display: flex;
      align-items: flex-start;
      padding: 6px 0;
      position: relative;
    }

    .track-analytics-journey-time {
      width: 70px;
      font-size: 11px;
      color: #6c757d;
    }

    .track-analytics-journey-connector {
      position: absolute;
      left: 70px;
      top: 24px;
      height: 100%;
      border-left: 1px dashed #ced4da;
    }

    .track-analytics-journey-content {
      margin-left: 10px;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
    }

    .track-analytics-journey-pageview .track-analytics-journey-content {
      background-color: #e3f2fd;
    }

    .track-analytics-journey-event .track-analytics-journey-content {
      background-color: #fff3e0;
    }

    .track-analytics-toggle-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 8px 16px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      z-index: 9999;
    }
  `]
})
export class TrackAnalyticsComponent implements OnInit, OnDestroy {
  @Input() showToggleButton = true;

  showUI = false;
  currentSession: UserSession | null = null;
  events: AnalyticsEvent[] = [];
  userJourney: any[] = [];
  selectedEvent: AnalyticsEvent | null = null;

  private subscriptions: Subscription[] = [];

  constructor(private analyticsService: TrackAnalyticsService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.analyticsService.getSession().subscribe(session => {
        this.currentSession = session;
        this.updateUserJourney();
      }),

      this.analyticsService.getEvents().subscribe(events => {
        this.events = events;
        this.updateUserJourney();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  toggleVisibility(): void {
    this.showUI = !this.showUI;
  }

  toggleEventDetails(event: AnalyticsEvent): void {
    if (this.selectedEvent === event) {
      this.selectedEvent = null;
    } else {
      this.selectedEvent = event;
    }
  }

  getSessionDuration(): number {
    return this.analyticsService.getSessionDuration();
  }

  formatDuration(ms: number): string {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  private updateUserJourney(): void {
    this.userJourney = this.analyticsService.getUserJourney();
  }
}
