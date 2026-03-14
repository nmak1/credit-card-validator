/**
 * @jest-environment jsdom
 */

import { CardValidator } from '../src/js/cardValidator.js';
import { PaymentSystemDetector } from '../src/js/paymentSystemDetector.js';

describe('DOM Integration Tests', () => {
  let inputElement; // Убираем подчеркивание
  let paymentSystemDiv;
  let validationResult;
  let cardNumberDisplay;
  let paymentLogo;

  beforeEach(() => {
    document.body.innerHTML = `
      <div class="container">
        <input type="text" id="cardNumber" />
        <div id="paymentSystem"></div>
        <div id="validationResult"></div>
        <div class="card-number-display"></div>
        <div id="paymentSystemLogo">
          <img src="assets/icons8-неизвестный-66.png" />
        </div>
      </div>
    `;

    inputElement = document.getElementById('cardNumber');
    paymentSystemDiv = document.getElementById('paymentSystem');
    validationResult = document.getElementById('validationResult');
    cardNumberDisplay = document.querySelector('.card-number-display');
    paymentLogo = document.querySelector('#paymentSystemLogo img');
  });

  describe.each([
    ['Visa', '4111111111111111', 'visa.svg', 'Visa'],
    ['Mastercard', '5555555555554444', 'mastercard.svg', 'Mastercard'],
    ['American Express', '378282246310005', 'american-express.svg', 'American Express'],
    ['МИР', '2201382000000013', 'mir.svg', 'МИР']
  ])('Payment system detection for %s', (name, number, logoFile, expectedName) => {
    test(`should detect ${name} correctly`, () => {
      const system = PaymentSystemDetector.detect(number);

      expect(system.name).toBe(expectedName);
      expect(system.logo).toBe(logoFile);

      paymentSystemDiv.textContent = system.name;
      paymentLogo.src = `assets/${system.logo}`;

      expect(paymentSystemDiv.textContent).toBe(expectedName);
      expect(paymentLogo.src).toContain(logoFile);
    });
  });

  describe('Card validation', () => {
    test('should validate valid Visa number', () => {
      const isValid = CardValidator.validate('4111111111111111');
      expect(isValid).toBe(true);
    });

    test('should validate valid Mastercard number', () => {
      const isValid = CardValidator.validate('5555555555554444');
      expect(isValid).toBe(true);
    });

    test('should validate valid Amex number', () => {
      const isValid = CardValidator.validate('378282246310005');
      expect(isValid).toBe(true);
    });

    test('should reject invalid number', () => {
      const isValid = CardValidator.validate('1234567890123456');
      expect(isValid).toBe(false);
    });

    test('should reject empty string', () => {
      const isValid = CardValidator.validate('');
      expect(isValid).toBe(false);
    });
  });

  test('should format card number display correctly', () => {
    const number = '4111111111111111';
    const masked = number.replace(/.(?=.{4})/g, '*');
    cardNumberDisplay.textContent = CardValidator.format(masked);

    expect(cardNumberDisplay.textContent).toBe('**** **** **** 1111');
  });

  test('should handle empty input', () => {
    const system = PaymentSystemDetector.detect('');
    const isValid = CardValidator.validate('');

    expect(system).toBeNull();
    expect(isValid).toBe(false);

    paymentSystemDiv.textContent = '';
    validationResult.textContent = '';

    expect(paymentSystemDiv.textContent).toBe('');
    expect(validationResult.textContent).toBe('');
  });

  test('should update input value on user input', () => {
    inputElement.value = '4111111111111111';

    const event = new Event('input', { bubbles: true });
    inputElement.dispatchEvent(event);

    expect(inputElement.value).toBe('4111111111111111');
  });
  test('input element should be accessible', () => {
    expect(inputElement).toBeDefined();
    expect(inputElement.id).toBe('cardNumber');
  });
});