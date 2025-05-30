import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackAnalyticsModule } from 'track-analytics';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TrackAnalyticsModule],
  template: `
    <div class="home-container">
      <h2>Welcome to TrackAnalytics Demo</h2>

      <div class="intro-section">
        <p>
          This demo showcases the TrackAnalytics library, a powerful analytics tracking solution for Angular applications.
          Navigate through the pages and interact with elements to see analytics in action.
        </p>

        <p>
          The analytics panel can be toggled using the button at the bottom right corner of the screen.
        </p>
      </div>

      <div class="features-section">
        <h3>Key Features</h3>

        <ul>
          <li ngxTrackElement trackId="feature-session-tracking">
            <strong>Session Tracking</strong> - Automatically tracks user sessions and durations
          </li>
          <li ngxTrackElement trackId="feature-event-capture">
            <strong>Event Capture</strong> - Records user interactions with elements
          </li>
          <li ngxTrackElement trackId="feature-journey-tracking">
            <strong>User Journey</strong> - Visualizes the complete user path through your application
          </li>
          <li ngxTrackElement trackId="feature-easy-integration">
            <strong>Easy Integration</strong> - Simple to add to any Angular application
          </li>
        </ul>
      </div>

      <div class="cta-section">
        <button ngxTrackElement trackId="home-cta-button" class="cta-button">
          Try It Now
        </button>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 20px;
    }

    .intro-section {
      margin-bottom: 30px;
      line-height: 1.6;
    }

    .features-section {
      margin-bottom: 40px;
    }

    .features-section ul {
      list-style-type: none;
      padding: 0;
    }

    .features-section li {
      padding: 10px 15px;
      margin-bottom: 10px;
      background-color: #f8f9fa;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .features-section li:hover {
      background-color: #e9ecef;
    }

    .cta-section {
      text-align: center;
      margin: 40px 0;
    }

    .cta-button {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 12px 24px;
      font-size: 16px;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .cta-button:hover {
      background-color: #0069d9;
    }
  `]
})
export class HomeComponent {}
