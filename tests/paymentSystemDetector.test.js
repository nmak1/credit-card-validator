import { PaymentSystemDetector } from '../src/js/paymentSystemDetector.js';

describe('PaymentSystemDetector', () => {
  describe('detect method', () => {
    test('should detect Visa cards', () => {
      const visaNumbers = [
        '4111111111111111',
        '4012888888881881',
        '4222222222222',
        '4 1111 1111 1111 1111',
      ];

      visaNumbers.forEach((number) => {
        const result = PaymentSystemDetector.detect(number);
        expect(result).not.toBeNull();
        expect(result.name).toBe('Visa');
        expect(result.code).toBe('visa');
      });
    });

    test('should detect Mastercard cards', () => {
      const mastercardNumbers = [
        '5555555555554444',
        '5105105105105100',
        '2221000000000009',
        '2720991234567890',
      ];

      mastercardNumbers.forEach((number) => {
        const result = PaymentSystemDetector.detect(number);
        expect(result).not.toBeNull();
        expect(result.name).toBe('Mastercard');
        expect(result.code).toBe('mastercard');
      });
    });

    test('should detect American Express cards', () => {
      const amexNumbers = [
        '378282246310005',
        '371449635398431',
        '378734493671000',
      ];

      amexNumbers.forEach((number) => {
        const result = PaymentSystemDetector.detect(number);
        expect(result).not.toBeNull();
        expect(result.name).toBe('American Express');
        expect(result.code).toBe('amex');
      });
    });

    test('should detect Discover cards', () => {
      const discoverNumbers = [
        '6011111111111117',
        '6011000990139424',
        '6444444444444444',
        '6221260000000000',
      ];

      discoverNumbers.forEach((number) => {
        const result = PaymentSystemDetector.detect(number);
        expect(result).not.toBeNull();
        expect(result.name).toBe('Discover');
        expect(result.code).toBe('discover');
      });
    });

    test('should detect JCB cards', () => {
      const jcbNumbers = [
        '3530111333300000',
        '3566002020360505',
        '3528000000000007',
      ];

      jcbNumbers.forEach((number) => {
        const result = PaymentSystemDetector.detect(number);
        expect(result).not.toBeNull();
        expect(result.name).toBe('JCB');
        expect(result.code).toBe('jcb');
      });
    });

    test('should detect Diners Club cards', () => {
      const dinersNumbers = [
        '38520000023237',
        '30569309025904',
        '36700102000000',
        '30000000000004',
      ];

      dinersNumbers.forEach((number) => {
        const result = PaymentSystemDetector.detect(number);
        expect(result).not.toBeNull();
        expect(result.name).toBe('Diners Club');
        expect(result.code).toBe('diners');
      });
    });

    test('should detect MIR cards', () => {
      const mirNumbers = [
        '2201382000000013',
        '2202200223456781',
        '2204123456789012',
        '2200000000000000',
      ];

      mirNumbers.forEach((number) => {
        const result = PaymentSystemDetector.detect(number);
        expect(result).not.toBeNull();
        expect(result.name).toBe('МИР');
        expect(result.code).toBe('mir');
      });
    });

    test('should return unknown for unrecognized numbers', () => {
      const unknownNumbers = [
        '1234567890123456',
        '9999999999999999',
        '0000000000000000',
      ];

      unknownNumbers.forEach((number) => {
        const result = PaymentSystemDetector.detect(number);
        expect(result).not.toBeNull();
        expect(result.name).toBe('Неизвестная система');
        expect(result.code).toBe('unknown');
      });
    });

    test('should return null for empty input', () => {
      expect(PaymentSystemDetector.detect('')).toBeNull();
      expect(PaymentSystemDetector.detect(null)).toBeNull();
      expect(PaymentSystemDetector.detect(undefined)).toBeNull();
    });
  });

  describe('getLogoPath method', () => {
    test('should return correct logo path for known systems', () => {
      expect(PaymentSystemDetector.getLogoPath('visa')).toBe('assets/visa.svg');
      expect(PaymentSystemDetector.getLogoPath('mastercard')).toBe('assets/mastercard.svg');
      expect(PaymentSystemDetector.getLogoPath('amex')).toBe('assets/american-express.svg');
      expect(PaymentSystemDetector.getLogoPath('mir')).toBe('assets/mir.svg');
    });

    test('should return unknown logo for unknown system', () => {
      expect(PaymentSystemDetector.getLogoPath('unknown')).toBe('assets/icons8-неизвестный-66.png');
      expect(PaymentSystemDetector.getLogoPath('nonexistent')).toBe('assets/icons8-неизвестный-66.png');
    });
  });
});
