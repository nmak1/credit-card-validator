module.exports = {
  // Правильная структура для jest-puppeteer
  launch: {
    headless: 'new', // Используем новый headless режим
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security'
    ],
    product: 'chrome'
  },
  server: {
    command: 'npx http-server src -p 8081',
    port: 8081,
    launchTimeout: 30000,
    debug: true
  }
};