import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Observable, fromEvent, filter } from 'rxjs';

export interface AnalyticsEvent {
  type: string;
  element: string;
  elementType: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface UserSession {
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

@Injectable({
  providedIn: 'root'
})
export class TrackAnalyticsService {
  private currentSession: UserSession | null = null;
  private sessionTimeoutId: any = null;
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private readonly STORAGE_KEY = 'ngx_analytics_session';
  private readonly INACTIVE_TIMEOUT = 15 * 60 * 1000; // 15 minutes of inactivity

  private sessionSubject = new BehaviorSubject<UserSession | null>(null);
  private eventsSubject = new BehaviorSubject<AnalyticsEvent[]>([]);
  private isBrowser: boolean;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      // Initialize session
      this.initSession();

      // Set up event listeners
      this.setupEventListeners();

      // Set up route change tracking
      this.setupRouteTracking();

      // Set up session timeout
      this.setupSessionTimeout();

      // Load session from storage if exists
      this.loadSessionFromStorage();
    }
  }

  /**
   * Public API methods
   */

  // Get current session as observable
  public getSession(): Observable<UserSession | null> {
    return this.sessionSubject.asObservable();
  }

  // Get all events as observable
  public getEvents(): Observable<AnalyticsEvent[]> {
    return this.eventsSubject.asObservable();
  }

  // Manually track custom event
  public trackEvent(eventType: string, elementInfo: string, metadata?: Record<string, any>): void {
    if (!this.isBrowser || !this.currentSession) return;

    const event: AnalyticsEvent = {
      type: eventType,
      element: elementInfo,
      elementType: 'custom',
      timestamp: Date.now(),
      metadata
    };

    this.currentSession.events.push(event);
    this.eventsSubject.next([...this.currentSession.events]);
    this.updateSessionInStorage();
  }

  // Get session duration in milliseconds
  public getSessionDuration(): number {
    if (!this.currentSession) return 0;

    const endTime = this.currentSession.endTime || Date.now();
    return endTime - this.currentSession.startTime;
  }

  // End current session
  public endSession(): void {
    if (!this.isBrowser || !this.currentSession) return;

    this.currentSession.endTime = Date.now();
    this.currentSession.duration = this.getSessionDuration();

    this.sessionSubject.next({...this.currentSession});
    this.updateSessionInStorage();
  }

  // Start a new session
  public startNewSession(): void {
    if (!this.isBrowser) return;

    if (this.currentSession) {
      this.endSession();
    }

    this.initSession();
  }

  // Get user journey (page views and events in chronological order)
  public getUserJourney(): Array<any> {
    if (!this.currentSession) return [];

    const journey = [
      ...this.currentSession.pageViews.map(pv => ({...pv, journeyType: 'pageView'})),
      ...this.currentSession.events.map(ev => ({...ev, journeyType: 'event'}))
    ];

    // Sort by timestamp
    return journey.sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Private helper methods
   */

  private initSession(): void {
    this.currentSession = {
      sessionId: this.generateSessionId(),
      startTime: Date.now(),
      events: [],
      pageViews: []
    };

    this.sessionSubject.next(this.currentSession);
    this.eventsSubject.next([]);
    this.updateSessionInStorage();
  }

  private setupEventListeners(): void {
    // Track clicks
    fromEvent(document, 'click').subscribe((event: Event) => {
      const target = event.target as HTMLElement;
      if (!target) return;

      const elementType = target.tagName.toLowerCase();
      let elementInfo = '';

      // Try to get meaningful info about the element
      if (target.id) {
        elementInfo = `#${target.id}`;
      } else if (target.className && typeof target.className === 'string') {
        elementInfo = `.${target.className.split(' ')[0]}`;
      } else if (target.textContent) {
        elementInfo = target.textContent.trim().substring(0, 50);
      } else {
        elementInfo = elementType;
      }

      this.trackEvent('click', elementInfo, {
        elementType,
        path: window.location.pathname,
        x: (event as MouseEvent).clientX,
        y: (event as MouseEvent).clientY
      });
    });

    // Track user activity to reset inactivity timeout
    const activityEvents = ['click', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    activityEvents.forEach(eventType => {
      fromEvent(document, eventType).subscribe(() => {
        this.resetInactivityTimeout();
      });
    });
  }

  private setupRouteTracking(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (!this.currentSession) return;

      const path = event.urlAfterRedirects || event.url;
      const title = document.title;

      this.currentSession.pageViews.push({
        path,
        title,
        timestamp: Date.now()
      });

      this.sessionSubject.next({...this.currentSession});
      this.updateSessionInStorage();
    });
  }

  private setupSessionTimeout(): void {
    this.resetInactivityTimeout();
  }

  private resetInactivityTimeout(): void {
    if (this.sessionTimeoutId) {
      clearTimeout(this.sessionTimeoutId);
    }

    this.sessionTimeoutId = setTimeout(() => {
      this.endSession();
    }, this.INACTIVE_TIMEOUT);
  }

  private generateSessionId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private updateSessionInStorage(): void {
    if (!this.isBrowser || !this.currentSession) return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.currentSession));
    } catch (e) {
      console.error('Failed to store analytics session:', e);
    }
  }

  private loadSessionFromStorage(): void {
    if (!this.isBrowser) return;

    try {
      const storedSession = localStorage.getItem(this.STORAGE_KEY);
      if (storedSession) {
        this.currentSession = JSON.parse(storedSession);

        // Check if session has timed out
        const now = Date.now();
        if (this.currentSession && now - this.currentSession.startTime > this.SESSION_TIMEOUT) {
          // Session expired, start a new one
          this.initSession();
        } else if (this.currentSession) {
          this.sessionSubject.next(this.currentSession);
          this.eventsSubject.next(this.currentSession.events);
        }
      }
    } catch (e) {
      console.error('Failed to load analytics session:', e);
      this.initSession();
    }
  }
}
