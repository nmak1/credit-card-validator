/**
 * Payment system detector for credit cards
 */
export class PaymentSystemDetector {
  /**
     * Detect payment system from card number
     * @param {string} cardNumber - Credit card number
     * @returns {object|null} - Payment system info or null if not detected
     */
  static detect(cardNumber) {
    if (!cardNumber) return null;

    const cleaned = cardNumber.replace(/[\s-]/g, '');

    const foundPattern = PaymentSystemDetector.patterns.find((pattern) => pattern.regex.test(cleaned));

    if (foundPattern) {
      return foundPattern;
    }

    return {
      name: 'Неизвестная система',
      code: 'unknown',
      logo: 'icons8-неизвестный-66.png',
    };
  }

  /**
     * Get logo path for payment system
     * @param {string} code - Payment system code
     * @returns {string} - Path to logo
     */
  static getLogoPath(code) {
    const system = PaymentSystemDetector.patterns.find((p) => p.code === code);
    if (system) {
      return `assets/${system.logo}`;
    }
    return 'assets/icons8-неизвестный-66.png';
  }
}

// Статические свойства выносим за класс (для совместимости с парсером)
PaymentSystemDetector.patterns = [
  {
    name: 'МИР',
    regex: /^220[0-4]/,
    code: 'mir',
    logo: 'mir.svg',
  },
  {
    name: 'Visa',
    regex: /^4/,
    code: 'visa',
    logo: 'visa.svg',
  },
  {
    name: 'Mastercard',
    regex: /^(5[1-5]|2[2-7])/,
    code: 'mastercard',
    logo: 'mastercard.svg',
  },
  {
    name: 'American Express',
    regex: /^3[47]/,
    code: 'amex',
    logo: 'american-express.svg',
  },
  {
    name: 'Discover',
    regex: /^(6011|65|64[4-9]|622)/,
    code: 'discover',
    logo: 'discover.svg',
  },
  {
    name: 'JCB',
    regex: /^35/,
    code: 'jcb',
    logo: 'jcb.svg',
  },
  {
    name: 'Diners Club',
    regex: /^(30[0-5]|36|38|39)/,
    code: 'diners',
    logo: 'diners-club.svg',
  },
];
