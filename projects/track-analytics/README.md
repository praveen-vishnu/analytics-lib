# TrackAnalytics

A powerful, self-contained analytics library for Angular applications. This library provides analytics functionality similar to Google Analytics or Mixpanel, but as a component that can be embedded directly in Angular applications.

## Features

- **Session Tracking**: Automatically tracks user sessions and their duration
- **Event Capture**: Records user interactions such as clicks on buttons or other interactive elements
- **User Journey Tracking**: Records the sequence of user actions to reconstruct the user's journey
- **Minimal Setup**: Easy integration with any Angular application

## Installation

```bash
npm install track-analytics --save
```

## Usage

### Basic Setup

1. Import the `TrackAnalyticsModule` in your app module or component:

```typescript
// In your app.module.ts (for non-standalone apps)
import { TrackAnalyticsModule } from 'track-analytics';

@NgModule({
  imports: [
    TrackAnalyticsModule,
    // other imports
  ],
  // ...
})
export class AppModule { }
```

```typescript
// In your component (for standalone components)
import { Component } from '@angular/core';
import { TrackAnalyticsModule } from 'track-analytics';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TrackAnalyticsModule],
  // ...
})
export class AppComponent { }
```

2. Add the analytics component to your app component template:

```html
<!-- Add this at the bottom of your app.component.html -->
<track-analytics [showToggleButton]="true"></track-analytics>
```

### Tracking Elements

Use the `ngxTrackElement` directive to track specific elements:

```html
<button ngxTrackElement trackId="my-button">Click Me</button>

<!-- With additional metadata -->
<div ngxTrackElement 
     trackId="product-card" 
     [trackMetadata]="{productId: 123, category: 'electronics'}">
  Product Content
</div>
```

### Using the Analytics Service

Inject the `TrackAnalyticsService` to manually track events or access analytics data:

```typescript
import { Component } from '@angular/core';
import { TrackAnalyticsService } from 'track-analytics';

@Component({
  // ...
})
export class MyComponent {
  constructor(private analyticsService: TrackAnalyticsService) { }
  
  trackCustomEvent() {
    this.analyticsService.trackEvent('custom_event', 'My Custom Event', {
      customData: 'Some value',
      timestamp: new Date().toISOString()
    });
  }
  
  checkSessionDuration() {
    const duration = this.analyticsService.getSessionDuration();
    console.log(`Session duration: ${duration}ms`);
  }
  
  viewUserJourney() {
    const journey = this.analyticsService.getUserJourney();
    console.log('User journey:', journey);
  }
}
```

### API Reference

#### TrackAnalyticsService

- `trackEvent(eventType: string, elementInfo: string, metadata?: Record<string, any>)`: Track a custom event
- `getSessionDuration()`: Get the current session duration in milliseconds
- `endSession()`: End the current session
- `startNewSession()`: Start a new session
- `getSession()`: Get the current session as an Observable
- `getEvents()`: Get all events as an Observable
- `getUserJourney()`: Get the user journey (page views and events in chronological order)

#### TrackAnalyticsComponent

- `@Input() showToggleButton: boolean`: Whether to show the toggle button (default: true)

#### TrackElementDirective

- `@Input() trackId: string`: ID for the tracked element
- `@Input() trackType: string`: Type of tracking (default: 'click')
- `@Input() trackMetadata: Record<string, any>`: Additional metadata for the event

## Data Structure

### AnalyticsEvent

```typescript
interface AnalyticsEvent {
  type: string;
  element: string;
  elementType: string;
  timestamp: number;
  metadata?: Record<string, any>;
}
```

### UserSession

```typescript
interface UserSession {
  sessionId: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  events: AnalyticsEvent[];
  pageViews: {
    path: string;
    title: string;
    timestamp: number;
  }[];
}
```

## License

MIT
