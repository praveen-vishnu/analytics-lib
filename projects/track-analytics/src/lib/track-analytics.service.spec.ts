import { TestBed } from '@angular/core/testing';

import { TrackAnalyticsService } from './track-analytics.service';

describe('TrackAnalyticsService', () => {
  let service: TrackAnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrackAnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
