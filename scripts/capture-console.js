const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  page.on('console', msg => {
    try {
      const args = msg.args();
      Promise.all(args.map(a => a.jsonValue())).then(values => {
        console.log('PAGE LOG:', msg.type(), ...values);
      }).catch(() => console.log('PAGE LOG:', msg.text()));
    } catch (e) {
      console.log('PAGE LOG:', msg.text());
    }
  });

  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.message);
    console.log(err.stack);
  });

  page.on('response', res => {
    if (res.status() >= 400) {
      console.log('HTTP ERROR', res.status(), res.url());
    }
  });

  try {
    const url = process.env.URL || 'http://localhost:3000';
    console.log('Visiting', url);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    // wait a bit for client-side exceptions to surface
    await page.waitForTimeout(5000);
  } catch (err) {
    console.log('NAV ERROR:', err.message);
  }

  await browser.close();
  process.exit(0);
})();
