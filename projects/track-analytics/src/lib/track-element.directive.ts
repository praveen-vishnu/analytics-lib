import { Directive, ElementRef, Input, HostListener } from '@angular/core';
import { TrackAnalyticsService } from './track-analytics.service';

@Directive({
  selector: '[ngxTrackElement]',
  standalone: true
})
export class TrackElementDirective {
  @Input() trackId!: string;
  @Input() trackMetadata: any;
  @Input() trackType: string = 'click';

  constructor(
    private el: ElementRef,
    private analyticsService: TrackAnalyticsService
  ) {}

  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    if (this.trackType === 'click' || this.trackType === 'all') {
      const element = this.el.nativeElement;
      const elementType = element.tagName.toLowerCase();
      const elementInfo = this.trackId || this.getElementInfo(element);

      this.analyticsService.trackEvent('click', elementInfo, {
        ...this.trackMetadata,
        elementType
      });
    }
  }

  private getElementInfo(element: HTMLElement): string {
    if (element.id) {
      return `#${element.id}`;
    } else if (element.className && typeof element.className === 'string') {
      return `.${element.className.split(' ')[0]}`;
    } else if (element.textContent) {
      return element.textContent.trim().substring(0, 50);
    } else {
      return element.tagName.toLowerCase();
    }
  }
}
