import {inject} from 'aurelia-framework';
import {CurrentService} from 'shared/services/currentService';

@inject(Element, CurrentService)
export class StripeCheckoutCustomAttribute {
  constructor(element, current) {
    this.element = element;
    this.current = current;
  }

  attached() {
    // Create script element
    this.checkout = document.createElement('script');

    // Add Attribues to Script Element
    this.checkout.setAttribute('src', 'https://checkout.stripe.com/checkout.js');
    this.checkout.setAttribute('class', 'stripe-button');
    this.checkout.setAttribute('data-key', 'pk_test_wxjz7IhKLu2M9UJUTNpDgYOC');
    this.checkout.setAttribute('data-amount', '600');
    this.checkout.setAttribute('data-name', 'Marks');
    this.checkout.setAttribute('data-description', 'Monthly Subscription');
    this.checkout.setAttribute('data-locale', 'auto');
    this.checkout.setAttribute('data-zip-code', 'true');
    this.checkout.setAttribute('data-panel-label', 'Pay {{amount}} per Month');
    this.checkout.setAttribute('data-email', this.current.user.email);
    this.checkout.setAttribute('data-allow-remember-me', false);

    // Append script tag to element
    this.element.appendChild(this.checkout);
  }

  detached() {
    if (this.checkout) {
      this.checkout.remove();
    }
  }
}
