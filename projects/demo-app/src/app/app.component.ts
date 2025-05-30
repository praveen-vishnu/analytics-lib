import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { TrackAnalyticsModule, TrackAnalyticsService } from 'track-analytics';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TrackAnalyticsModule],
  template: `
    <div class="container">
      <header>
        <h1>TrackAnalytics Demo</h1>
        <nav>
          <a routerLink="/" ngxTrackElement trackId="home-nav">Home</a>
          <a routerLink="/products" ngxTrackElement trackId="products-nav">Products</a>
          <a routerLink="/about" ngxTrackElement trackId="about-nav">About</a>
          <a routerLink="/contact" ngxTrackElement trackId="contact-nav">Contact</a>
        </nav>
      </header>

      <main>
        <router-outlet></router-outlet>

        <div class="demo-actions">
          <h2>Demo Actions</h2>

          <div class="card-container">
            <div class="card" ngxTrackElement trackId="card-1" [trackMetadata]="{cardId: 1}">
              <h3>Card 1</h3>
              <p>This is a tracked card element.</p>
              <button ngxTrackElement trackId="card-1-button">Click Me</button>
            </div>

            <div class="card" ngxTrackElement trackId="card-2" [trackMetadata]="{cardId: 2}">
              <h3>Card 2</h3>
              <p>This is another tracked card element.</p>
              <button ngxTrackElement trackId="card-2-button">Click Me</button>
            </div>

            <div class="card" ngxTrackElement trackId="card-3" [trackMetadata]="{cardId: 3}">
              <h3>Card 3</h3>
              <p>This is yet another tracked card element.</p>
              <button ngxTrackElement trackId="card-3-button">Click Me</button>
            </div>
          </div>

          <div class="custom-events">
            <h3>Custom Events</h3>
            <button (click)="trackCustomEvent('button-click', 'Custom Button')">
              Track Custom Event
            </button>

            <button (click)="startNewSession()">
              Start New Session
            </button>

            <button (click)="showSessionData()">
              Log Session Data
            </button>
          </div>
        </div>
      </main>

      <footer>
        <p>&copy; 2023 TrackAnalytics Demo</p>
      </footer>
    </div>

    <!-- Analytics Component -->
    <track-analytics [showToggleButton]="true"></track-analytics>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e9ecef;
    }

    nav {
      display: flex;
      gap: 20px;
    }

    nav a {
      text-decoration: none;
      color: #007bff;
      font-weight: 500;
    }

    nav a:hover {
      text-decoration: underline;
    }

    .demo-actions {
      margin-top: 40px;
      padding: 20px;
      background-color: #f8f9fa;
      border-radius: 8px;
    }

    .card-container {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin-top: 20px;
    }

    .card {
      background-color: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      width: calc(33.33% - 14px);
    }

    .card h3 {
      margin-top: 0;
    }

    .card button {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }

    .custom-events {
      margin-top: 30px;
    }

    .custom-events button {
      background-color: #6c757d;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 10px;
    }

    footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e9ecef;
      text-align: center;
      color: #6c757d;
    }
  `]
})
export class AppComponent implements OnInit {
  constructor(
    private analyticsService: TrackAnalyticsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // You can subscribe to analytics events
    this.analyticsService.getEvents().subscribe(events => {
      // You can process events here if needed
      // console.log('Events updated:', events);
    });
  }

  trackCustomEvent(type: string, element: string): void {
    this.analyticsService.trackEvent(type, element, {
      custom: true,
      timestamp: new Date().toISOString()
    });
  }

  startNewSession(): void {
    this.analyticsService.startNewSession();
  }

  showSessionData(): void {
    const session = this.analyticsService.getSession();
    const journey = this.analyticsService.getUserJourney();

    console.log('Current Session:', session);
    console.log('User Journey:', journey);
  }
}
