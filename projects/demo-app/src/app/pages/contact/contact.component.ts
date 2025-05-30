import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TrackAnalyticsModule, TrackAnalyticsService } from 'track-analytics';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TrackAnalyticsModule],
  template: `
    <div class="contact-container">
      <h2>Contact Us</h2>

      <div class="contact-content">
        <div class="contact-info">
          <h3>Get in Touch</h3>
          <p>
            Have questions about TrackAnalytics? Want to report a bug or request a feature?
            Fill out the form and we'll get back to you as soon as possible.
          </p>

          <div class="contact-methods">
            <div class="contact-method" ngxTrackElement trackId="contact-email">
              <strong>Email:</strong> info&#64;track-analytics.example
            </div>
            <div class="contact-method" ngxTrackElement trackId="contact-github">
              <strong>GitHub:</strong> github.com/track-analytics
            </div>
            <div class="contact-method" ngxTrackElement trackId="contact-twitter">
              <strong>Twitter:</strong> &#64;ngx_analytics
            </div>
          </div>
        </div>

        <div class="contact-form-container">
          <h3>Contact Form</h3>

          <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="contact-form">
            <div class="form-group">
              <label for="name">Name</label>
              <input
                type="text"
                id="name"
                formControlName="name"
                ngxTrackElement trackId="contact-name-input"
                [class.invalid]="submitted && f['name'].errors">
              <div class="error-message" *ngIf="submitted && f['name'].errors">
                Please enter your name
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                formControlName="email"
                ngxTrackElement trackId="contact-email-input"
                [class.invalid]="submitted && f['email'].errors">
              <div class="error-message" *ngIf="submitted && f['email'].errors">
                Please enter a valid email address
              </div>
            </div>

            <div class="form-group">
              <label for="subject">Subject</label>
              <select
                id="subject"
                formControlName="subject"
                ngxTrackElement trackId="contact-subject-select"
                [class.invalid]="submitted && f['subject'].errors">
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="feature">Feature Request</option>
                <option value="bug">Bug Report</option>
              </select>
              <div class="error-message" *ngIf="submitted && f['subject'].errors">
                Please select a subject
              </div>
            </div>

            <div class="form-group">
              <label for="message">Message</label>
              <textarea
                id="message"
                formControlName="message"
                ngxTrackElement trackId="contact-message-input"
                [class.invalid]="submitted && f['message'].errors"
                rows="5"></textarea>
              <div class="error-message" *ngIf="submitted && f['message'].errors">
                Please enter your message
              </div>
            </div>

            <button
              type="submit"
              ngxTrackElement trackId="contact-submit-button"
              class="submit-button">
              Send Message
            </button>
          </form>

          <div class="success-message" *ngIf="formSubmitted">
            Thank you for your message! We'll get back to you soon.
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .contact-container {
      padding: 20px;
    }

    .contact-content {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 40px;
      margin-top: 20px;
    }

    @media (max-width: 768px) {
      .contact-content {
        grid-template-columns: 1fr;
      }
    }

    .contact-info {
      padding: 20px;
      background-color: #f8f9fa;
      border-radius: 8px;
      height: fit-content;
    }

    .contact-methods {
      margin-top: 20px;
    }

    .contact-method {
      margin-bottom: 10px;
      padding: 10px;
      border-radius: 4px;
      background-color: white;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .contact-method:hover {
      background-color: #e9ecef;
    }

    .contact-form-container {
      padding: 20px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }

    .contact-form {
      margin-top: 20px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
    }

    input, select, textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 16px;
    }

    input.invalid, select.invalid, textarea.invalid {
      border-color: #dc3545;
    }

    .error-message {
      color: #dc3545;
      font-size: 14px;
      margin-top: 5px;
    }

    .submit-button {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .submit-button:hover {
      background-color: #0069d9;
    }

    .success-message {
      margin-top: 20px;
      padding: 15px;
      background-color: #d4edda;
      color: #155724;
      border-radius: 4px;
      text-align: center;
    }
  `]
})
export class ContactComponent {
  contactForm: FormGroup;
  submitted = false;
  formSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private analyticsService: TrackAnalyticsService
  ) {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  get f() { return this.contactForm.controls; }

  onSubmit() {
    this.submitted = true;

    // Track form submission attempt
    this.analyticsService.trackEvent('form_submission', 'contact-form', {
      isValid: this.contactForm.valid,
      formFields: Object.keys(this.contactForm.controls)
    });

    if (this.contactForm.invalid) {
      // Track validation errors
      const invalidFields = Object.keys(this.contactForm.controls)
        .filter(key => this.contactForm.controls[key].invalid);

      this.analyticsService.trackEvent('form_validation_error', 'contact-form', {
        invalidFields
      });

      return;
    }

    // Form is valid, simulate submission
    this.formSubmitted = true;
    this.contactForm.reset();
    this.submitted = false;

    // Track successful form submission
    this.analyticsService.trackEvent('form_submission_success', 'contact-form', {
      subject: this.contactForm.value.subject
    });
  }
}
