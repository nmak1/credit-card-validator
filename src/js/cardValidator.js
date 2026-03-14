/**
 * Credit card validator using Luhn algorithm
 */
export class CardValidator {
  /**
     * Validate credit card number using Luhn algorithm
     * @param {string} cardNumber - Credit card number
     * @returns {boolean} - True if valid, false otherwise
     */
  static validate(cardNumber) {
    if (!cardNumber) return false;

    // Remove spaces and dashes
    const cleaned = cardNumber.replace(/[\s-]/g, '');

    // Check if it contains only digits
    if (!/^\d+$/.test(cleaned)) return false;

    // Check length (usually 13-19 digits)
    if (cleaned.length < 13 || cleaned.length > 19) return false;

    // Luhn algorithm
    let sum = 0;
    let isEven = false;

    // Loop from right to left - используем i -= 1 вместо i--
    for (let i = cleaned.length - 1; i >= 0; i -= 1) {
      let digit = parseInt(cleaned.charAt(i), 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  /**
     * Format card number with spaces every 4 digits
     * @param {string} cardNumber - Raw card number
     * @returns {string} - Formatted card number
     */
  static format(cardNumber) {
    if (!cardNumber) return '';

    const cleaned = cardNumber.replace(/[\s-]/g, '');
    const parts = [];

    for (let i = 0; i < cleaned.length; i += 4) {
      parts.push(cleaned.substr(i, 4));
    }

    return parts.join(' ').trim();
  }

  /**
     * Remove formatting from card number
     * @param {string} cardNumber - Formatted card number
     * @returns {string} - Raw card number
     */
  static unformat(cardNumber) {
    return cardNumber.replace(/[\s-]/g, '');
  }
}
