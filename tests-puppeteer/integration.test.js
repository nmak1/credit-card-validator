const puppeteer = require('puppeteer');

describe('Credit Card Validator Integration Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    page = await browser.newPage();

    // Переходим на страницу
    await page.goto('http://localhost:8081', {
      waitUntil: 'networkidle0'
    });

    // Ждем загрузки JavaScript
    await page.waitForFunction(() => {
      return typeof CardValidator !== 'undefined' &&
             typeof PaymentSystemDetector !== 'undefined';
    }, { timeout: 5000 });

    // Даем время на инициализацию приложения
    await page.waitForTimeout(1000);
  }, 30000);

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  test('Page title should be correct', async () => {
    const title = await page.title();
    expect(title).toBe('Credit Card Validator');
  });

  describe('Valid card numbers', () => {
    test.each([
      ['Visa', '4111111111111111'],
      ['Mastercard', '5555555555554444'],
      ['American Express', '378282246310005'],
      ['JCB', '3530111333300000'],
      ['МИР', '2201382000000013']
    ])('should validate %s card: %s', async (name, number) => {
      // Очищаем поле ввода и фокусируемся на нем
      await page.$eval('#cardNumber', el => {
        el.value = '';
        el.focus();
      });

      // Вводим номер по одной цифре с небольшими задержками
      for (let i = 0; i < number.length; i++) {
        await page.keyboard.type(number[i]);
        await page.waitForTimeout(50);
      }

      // Ждем, пока сработает валидация (input event + обработка)
      await page.waitForTimeout(500);

      // Ждем появления результата валидации
      await page.waitForFunction(() => {
        const result = document.getElementById('validationResult');
        return result && result.textContent.length > 0;
      }, { timeout: 5000 });

      // Получаем результаты
      const validationText = await page.$eval('#validationResult', el => el.textContent);
      const paymentSystem = await page.$eval('#paymentSystem', el => el.textContent);

      console.log(`Validation result for ${name}: "${validationText}"`);
      console.log(`Payment system: "${paymentSystem}"`);

      expect(validationText).toContain('действителен');
      expect(paymentSystem).toContain(name);
    });
  });

  test('should format card number as user types', async () => {
    // Очищаем поле ввода
    await page.$eval('#cardNumber', el => {
      el.value = '';
      el.focus();
    });

    // Вводим номер
    const number = '4111111111111111';
    for (let i = 0; i < number.length; i++) {
      await page.keyboard.type(number[i]);
      await page.waitForTimeout(50);
    }

    // Ждем форматирования
    await page.waitForTimeout(500);

    const formatted = await page.$eval('#cardNumber', el => el.value);
    console.log(`Formatted number: "${formatted}"`);

    expect(formatted).toBe('4111 1111 1111 1111');
  });

  test('should show invalid for wrong card number', async () => {
    // Очищаем поле ввода
    await page.$eval('#cardNumber', el => {
      el.value = '';
      el.focus();
    });

    // Вводим невалидный номер
    const number = '4111111111111112';
    for (let i = 0; i < number.length; i++) {
      await page.keyboard.type(number[i]);
      await page.waitForTimeout(50);
    }

    // Ждем валидации
    await page.waitForTimeout(500);

    // Ждем появления результата
    await page.waitForFunction(() => {
      const result = document.getElementById('validationResult');
      return result && result.textContent.length > 0;
    }, { timeout: 5000 });

    const validationText = await page.$eval('#validationResult', el => el.textContent);
    console.log(`Invalid validation result: "${validationText}"`);

    expect(validationText).toContain('Недействительный');
  });
});