const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function run() {
  const artifactDir = 'C:/Users/doanl/.gemini/antigravity-ide/brain/a233c117-c3ce-4352-b961-98ed39765440';
  
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  console.log('Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 30000 });

  // 1. Initial Page View with Header and Floating Widget
  await page.waitForSelector('.app-header__lookup-btn', { timeout: 10000 });
  console.log('Found Tra cứu vé button in AppHeader');
  
  await page.screenshot({ path: path.join(artifactDir, 'guest_lookup_step1_home.png') });
  console.log('Captured step 1: Home page with Tra cuu ve button & Floating Widget');

  // 2. Click "Tra cứu vé" button
  await page.click('.app-header__lookup-btn');
  await page.waitForSelector('.guest-lookup-modal-dialog', { timeout: 5000 });
  await page.waitForSelector('#lookup-booking-id', { timeout: 5000 });
  await page.screenshot({ path: path.join(artifactDir, 'guest_lookup_step2_modal_form.png') });
  console.log('Captured step 2: Guest Lookup Modal open with 2 tabs & quick samples');

  // 3. Click the Vietnam Airlines quick sample chip
  const chips = await page.$$('.guest-lookup__chip');
  if (chips.length > 0) {
    await chips[0].click();
    console.log('Clicked Vietnam Airlines quick test chip');
  }

  // 4. Click Submit button
  await page.click('.guest-lookup__submit-btn');
  console.log('Submitted 2-factor lookup form...');

  // 5. Wait for ElectronicTicketView
  await page.waitForSelector('.e-ticket__card', { timeout: 8000 });
  await page.waitForSelector('.e-ticket__pnr-code', { timeout: 5000 });
  await page.screenshot({ path: path.join(artifactDir, 'guest_lookup_step3_boarding_pass.png') });
  console.log('Captured step 3: Boarding Pass Electronic Ticket with QR & Passenger table');

  // 6. Test Back button to return to search modal
  await page.click('.e-ticket__back-btn');
  await page.waitForSelector('.guest-lookup__tabs', { timeout: 5000 });
  
  // 7. Click Tab 2: "Vé đã lưu trên máy"
  const tabs = await page.$$('.guest-lookup__tab');
  if (tabs.length > 1) {
    await tabs[1].click();
    await page.waitForSelector('.guest-lookup__recent-list', { timeout: 5000 });
    await page.screenshot({ path: path.join(artifactDir, 'guest_lookup_step4_saved_tickets.png') });
    console.log('Captured step 4: Saved tickets tab on device storage');
  }

  await browser.close();
  console.log('All Guest Lookup E2E verification steps completed successfully!');
}

run().catch(err => {
  console.error('Puppeteer run error:', err);
  process.exit(1);
});
