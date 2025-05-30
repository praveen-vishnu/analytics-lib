import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackAnalyticsComponent } from './track-analytics.component';


describe('TrackAnalyticsComponent', () => {
  let component: TrackAnalyticsComponent;
  let fixture: ComponentFixture<TrackAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackAnalyticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
