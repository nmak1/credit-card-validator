import { CardValidator } from './cardValidator.js';
import { PaymentSystemDetector } from './paymentSystemDetector.js';

class CreditCardApp {
  constructor() {
    this.input = document.getElementById('cardNumber');
    this.paymentSystemDiv = document.getElementById('paymentSystem');
    this.validationResult = document.getElementById('validationResult');
    this.cardNumberDisplay = document.querySelector('.card-number-display');
    this.paymentLogo = document.querySelector('#paymentSystemLogo img');

    this.init();
  }

  init() {
    this.input.addEventListener('input', this.handleInput.bind(this));
    this.input.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  handleInput(e) {
    const rawValue = e.target.value;
    const cleaned = rawValue.replace(/[^\d]/g, '');

    // Limit to 19 digits (максимальная длина номера карты)
    const limited = cleaned.slice(0, 19);

    // Format with spaces
    const formatted = CardValidator.format(limited);
    e.target.value = formatted;

    // Update card display
    this.updateCardDisplay(limited);

    // Detect payment system
    this.detectPaymentSystem(limited);

    // Validate if enough digits
    if (limited.length >= 13) {
      this.validateCard(limited);
    } else {
      this.clearValidation();
    }
  }

  handleKeyDown(e) {
    // Allow: backspace, delete, tab, escape, enter, arrows, numbers
    const allowedKeys = [46, 8, 9, 27, 13, 110, 190];
    const isCtrlA = e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true);
    const isArrowKey = e.keyCode >= 35 && e.keyCode <= 40;

    if (allowedKeys.includes(e.keyCode) || isCtrlA || isArrowKey) {
      return;
    }

    // Ensure it's a number
    const isNumberKey = (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105);
    if (e.shiftKey || !isNumberKey) {
      e.preventDefault();
    }
  }

  updateCardDisplay(number) {
    if (!number) {
      this.cardNumberDisplay.textContent = '**** **** **** ****';
      return;
    }

    // Show last 4 digits, mask the rest
    const masked = number.replace(/.(?=.{4})/g, '*');
    this.cardNumberDisplay.textContent = CardValidator.format(masked);
  }

  detectPaymentSystem(number) {
    const system = PaymentSystemDetector.detect(number);

    if (system) {
      this.paymentSystemDiv.textContent = system.name;
      this.paymentLogo.src = `assets/${system.logo}`;
    } else {
      this.paymentSystemDiv.textContent = '';
      this.paymentLogo.src = 'assets/icons8-неизвестный-66.png';
    }
  }

  validateCard(number) {
    const isValid = CardValidator.validate(number);

    if (isValid) {
      this.input.classList.remove('invalid');
      this.input.classList.add('valid');
      this.validationResult.textContent = '✓ Номер карты действителен';
      this.validationResult.className = 'validation-result valid';
    } else {
      this.input.classList.remove('valid');
      this.input.classList.add('invalid');
      this.validationResult.textContent = '✗ Недействительный номер карты';
      this.validationResult.className = 'validation-result invalid';
    }
  }

  clearValidation() {
    this.input.classList.remove('valid', 'invalid');
    this.validationResult.textContent = '';
    this.validationResult.className = 'validation-result';
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new CreditCardApp();
});