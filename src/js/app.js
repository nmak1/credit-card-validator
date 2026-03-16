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
    const inputEl = e.target;
    const rawValue = inputEl.value;
    const selectionStart = inputEl.selectionStart ?? rawValue.length;
    const digitsBeforeCaret = rawValue.slice(0, selectionStart).replace(/\D/g, '').length;

    const cleaned = rawValue.replace(/\D/g, '');

    // Limit to 19 digits (максимальная длина номера карты)
    const limited = cleaned.slice(0, 19);

    // Format with spaces
    const formatted = CardValidator.format(limited);
    inputEl.value = formatted;
    this.setCaretByDigitsIndex(inputEl, digitsBeforeCaret);

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

  setCaretByDigitsIndex(inputEl, digitsIndex) {
    if (typeof inputEl.setSelectionRange !== 'function') return;

    const clampedDigitsIndex = Math.max(0, Math.min(digitsIndex, 19));
    const value = inputEl.value ?? '';

    let digitsSeen = 0;
    let caretPos = value.length;

    for (let i = 0; i < value.length; i += 1) {
      if (/\d/.test(value[i])) {
        digitsSeen += 1;
        if (digitsSeen >= clampedDigitsIndex) {
          caretPos = i + 1;
          break;
        }
      }
    }

    inputEl.setSelectionRange(caretPos, caretPos);
  }

  handleKeyDown(e) {
    // Allow: navigation/editing keys + common shortcuts
    const allowedKeys = new Set([
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
    ]);

    if (allowedKeys.has(e.key)) {
      return;
    }

    // Allow: copy/paste/select all/cut
    if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
      return;
    }

    // Block anything that's not a single digit.
    // Note: we still clean on 'input' as the source of truth (covers paste/autofill/IME).
    if (!/^\d$/.test(e.key)) {
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