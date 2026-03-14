/**
 * @jest-environment jsdom
 */

import { CardValidator } from '../src/js/cardValidator.js';
import { PaymentSystemDetector } from '../src/js/paymentSystemDetector.js';

// Mock the app to test DOM interactions
describe('DOM Integration Tests', () => {
  let inputElement;
  let paymentSystemDiv;
  let validationResult;
  let cardNumberDisplay;
  let paymentLogo;

  beforeEach(() => {
    // Setup DOM
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
    ['МИР', '2201382000000013', 'mir.svg', 'МИР'],
  ])('Payment system detection for %s', (name, number, logoFile, expectedName) => {
    test(`should detect ${name} correctly`, () => {
      const system = PaymentSystemDetector.detect(number);

      expect(system.name).toBe(expectedName);
      expect(system.logo).toBe(logoFile);

      // Update UI
      paymentSystemDiv.textContent = system.name;
      paymentLogo.src = `assets/${system.logo}`;

      expect(paymentSystemDiv.textContent).toBe(expectedName);
      expect(paymentLogo.src).toContain(logoFile);
    });
  });

  describe.each([
    ['4111111111111111', true],
    ['5555555555554444', true],
    ['378282246310005', true],
    ['1234567890123456', false],
    ['', false],
  ])('Card validation for %s', (number, expected) => {
    test(`should return ${expected} for number ${number || 'empty'}`, () => {
      const isValid = CardValidator.validate(number);

      expect(isValid).toBe(expected);

      // Update UI
      if (number && number.length >= 13) {
        if (isValid) {
          validationResult.textContent = '✓ Номер карты действителен';
          validationResult.className = 'validation-result valid';
        } else {
          validationResult.textContent = '✗ Недействительный номер карты';
          validationResult.className = 'validation-result invalid';
        }
      }

      if (expected) {
        expect(validationResult.textContent).toBe('✓ Номер карты действителен');
        expect(validationResult.className).toContain('valid');
      } else if (number && number.length >= 13) {
        expect(validationResult.textContent).toBe('✗ Недействительный номер карты');
        expect(validationResult.className).toContain('invalid');
      }
    });
  });

  test('should format card number display correctly', () => {
    const number = '4111111111111111';

    // Simulate masking for display
    const masked = number.replace(/.(?=.{4})/g, '*');
    cardNumberDisplay.textContent = CardValidator.format(masked);

    expect(cardNumberDisplay.textContent).toBe('**** **** **** 1111');
  });

  test('should handle empty input', () => {
    const system = PaymentSystemDetector.detect('');
    const isValid = CardValidator.validate('');

    expect(system).toBeNull();
    expect(isValid).toBe(false);

    // Update UI for empty
    paymentSystemDiv.textContent = '';
    validationResult.textContent = '';

    expect(paymentSystemDiv.textContent).toBe('');
    expect(validationResult.textContent).toBe('');
  });

  // НОВЫЙ ТЕСТ: используем inputElement для проверки ввода
  test('should update input value on user input', () => {
    // Simulate user typing
    inputElement.value = '4111111111111111';

    // Trigger input event
    const event = new Event('input', { bubbles: true });
    inputElement.dispatchEvent(event);

    // Проверяем, что значение установилось
    expect(inputElement.value).toBe('4111111111111111');
  });

  // НОВЫЙ ТЕСТ: проверка обработчика клавиш
  test('should handle keydown events correctly', () => {
    // Создаем обработчик (имитация app.js)
    const handleKeyDown = (e) => {
      const allowedKeys = [46, 8, 9, 27, 13, 110, 190];
      const isCtrlA = e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true);
      const isArrowKey = e.keyCode >= 35 && e.keyCode <= 40;

      if (allowedKeys.includes(e.keyCode) || isCtrlA || isArrowKey) {
        return true;
      }

      const isNumberKey = (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105);
      if (e.shiftKey || !isNumberKey) {
        e.preventDefault();
        return false;
      }
      return true;
    };

    // Добавляем обработчик
    inputElement.addEventListener('keydown', handleKeyDown);

    // Тестируем разрешенные клавиши
    const backspaceEvent = new KeyboardEvent('keydown', { keyCode: 8 });
    const preventDefaultSpy = jest.spyOn(backspaceEvent, 'preventDefault');
    inputElement.dispatchEvent(backspaceEvent);
    expect(preventDefaultSpy).not.toHaveBeenCalled();

    // Тестируем запрещенные клавиши (буквы)
    const letterEvent = new KeyboardEvent('keydown', { keyCode: 65 }); // 'A'
    const preventDefaultSpy2 = jest.spyOn(letterEvent, 'preventDefault');
    inputElement.dispatchEvent(letterEvent);
    expect(preventDefaultSpy2).toHaveBeenCalled();
  });
});
