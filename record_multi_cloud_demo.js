const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const FRAMES_DIR = path.join(__dirname, 'frames');
if (!fs.existsSync(FRAMES_DIR)) {
  fs.mkdirSync(FRAMES_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let frameIndex = 0;
async function captureFrames(page, count = 5, delayMs = 150) {
  for (let i = 0; i < count; i++) {
    const filename = path.join(FRAMES_DIR, `frame_${String(frameIndex).padStart(4, '0')}.png`);
    await page.screenshot({ path: filename, type: 'png' });
    frameIndex++;
    if (delayMs > 0) await sleep(delayMs);
  }
}

async function run() {
  console.log('🚀 Launching Chrome for automated multi-cloud video recording...');

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  console.log('🌐 Navigating to http://localhost:3001...');
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle0', timeout: 30000 });
  await sleep(2000);

  console.log('📸 Scene 1: Multi-Cloud All Clouds Overview...');
  await captureFrames(page, 10, 150);

  // Scroll down smoothly
  await page.evaluate(() => window.scrollBy({ top: 350, behavior: 'smooth' }));
  await sleep(1000);
  await captureFrames(page, 10, 150);

  // Scroll back to top
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await sleep(800);

  // Scene 2: Toggle to Azure
  console.log('📸 Scene 2: Switching to Microsoft Azure (🔷 Azure)...');
  const cloudButtons = await page.$$('button');
  for (const btn of cloudButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Azure')) {
      await btn.click();
      break;
    }
  }
  await sleep(1500);
  await captureFrames(page, 12, 150);

  // Scene 3: Toggle to AWS
  console.log('📸 Scene 3: Switching to Amazon Web Services (🟧 AWS)...');
  const awsButtons = await page.$$('button');
  for (const btn of awsButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('AWS')) {
      await btn.click();
      break;
    }
  }
  await sleep(1500);
  await captureFrames(page, 12, 150);

  // Scene 4: Toggle to GCP
  console.log('📸 Scene 4: Switching to Google Cloud Platform (🔴 GCP)...');
  const gcpButtons = await page.$$('button');
  for (const btn of gcpButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('GCP')) {
      await btn.click();
      break;
    }
  }
  await sleep(1500);
  await captureFrames(page, 12, 150);

  // Switch back to All Clouds
  console.log('📸 Scene 5: Switching back to All Clouds...');
  const allButtons = await page.$$('button');
  for (const btn of allButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('All Clouds')) {
      await btn.click();
      break;
    }
  }
  await sleep(1500);
  await captureFrames(page, 8, 150);

  // Scene 6: Simulate Live Anomaly
  console.log('📸 Scene 6: Triggering Live Anomaly Simulation...');
  const simButtons = await page.$$('button');
  for (const btn of simButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Simulate Live Anomaly')) {
      await btn.click();
      break;
    }
  }
  await sleep(1200);
  await captureFrames(page, 12, 150);

  // Scene 7: 1-Click Remediation
  console.log('📸 Scene 7: Testing 1-Click Auto-Remediation...');
  const remButtons = await page.$$('button');
  for (const btn of remButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && (text.includes('Remediate') || text.includes('Auto-Fix') || text.includes('1-Click'))) {
      await btn.click();
      break;
    }
  }
  await sleep(2000);
  await captureFrames(page, 12, 150);

  console.log(`✅ Captured ${frameIndex} frames successfully!`);
  await browser.close();
}

run().catch((err) => {
  console.error('❌ Capture script error:', err);
  process.exit(1);
});
