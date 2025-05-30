import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackAnalyticsModule } from 'track-analytics';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, TrackAnalyticsModule],
  template: `
    <div class="about-container">
      <h2>About TrackAnalytics</h2>

      <div class="about-content">
        <p>
          TrackAnalytics is a powerful, self-contained analytics library for Angular applications.
          Unlike external services like Google Analytics or Mixpanel, TrackAnalytics operates entirely
          within your application, giving you complete control over your analytics data.
        </p>

        <h3>Why TrackAnalytics?</h3>

        <div class="feature-cards">
          <div class="feature-card" ngxTrackElement trackId="about-feature-privacy">
            <h4>Privacy First</h4>
            <p>
              Keep your analytics data private and under your control.
              No external services or third-party tracking.
            </p>
          </div>

          <div class="feature-card" ngxTrackElement trackId="about-feature-integration">
            <h4>Easy Integration</h4>
            <p>
              Simple to add to any Angular application with minimal configuration.
              Just import the module and you're ready to go.
            </p>
          </div>

          <div class="feature-card" ngxTrackElement trackId="about-feature-comprehensive">
            <h4>Comprehensive Tracking</h4>
            <p>
              Track sessions, events, and user journeys with built-in visualization.
              Get insights into how users interact with your application.
            </p>
          </div>
        </div>

        <h3>How It Works</h3>

        <p>
          TrackAnalytics uses a combination of Angular services, directives, and components to track user behavior:
        </p>

        <ol>
          <li ngxTrackElement trackId="about-how-1">
            <strong>Session Tracking:</strong> Automatically tracks when users start and end their sessions.
          </li>
          <li ngxTrackElement trackId="about-how-2">
            <strong>Event Capture:</strong> Records clicks and other interactions with tracked elements.
          </li>
          <li ngxTrackElement trackId="about-how-3">
            <strong>Page Navigation:</strong> Logs when users navigate between different pages or views.
          </li>
          <li ngxTrackElement trackId="about-how-4">
            <strong>Journey Visualization:</strong> Provides a chronological view of the user's path through your app.
          </li>
        </ol>

        <div class="team-section">
          <h3>Our Team</h3>
          <p>
            TrackAnalytics is developed by a team of passionate Angular developers committed to
            creating powerful, privacy-focused tools for the Angular ecosystem.
          </p>

          <button ngxTrackElement trackId="about-contact-button" class="contact-button">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .about-container {
      padding: 20px;
      max-width: 900px;
      margin: 0 auto;
    }

    .about-content {
      line-height: 1.6;
    }

    h3 {
      margin-top: 30px;
      margin-bottom: 15px;
    }

    .feature-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
      margin: 25px 0;
    }

    .feature-card {
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }

    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .feature-card h4 {
      margin-top: 0;
      color: #007bff;
    }

    ol {
      padding-left: 20px;
    }

    ol li {
      margin-bottom: 10px;
      padding: 5px 0;
    }

    .team-section {
      margin-top: 40px;
      padding: 20px;
      background-color: #f8f9fa;
      border-radius: 8px;
      text-align: center;
    }

    .contact-button {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      font-size: 16px;
      margin-top: 15px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .contact-button:hover {
      background-color: #0069d9;
    }
  `]
})
export class AboutComponent {}
