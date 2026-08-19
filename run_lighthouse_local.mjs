import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const profileDir = path.resolve('./scratch/chrome_profile');

console.log('Launching headless Chrome on port 9222...');
const chromeProc = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--no-sandbox',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${profileDir}`
], { detached: false });

await new Promise(r => setTimeout(r, 2000));

const targets = [
  { name: 'Fleet Detail (/id/fleet/honda-vario-150)', url: 'https://rosantibikemotorent.com/id/fleet/honda-vario-150', out: 'lh_fleet_detail.json' },
  { name: 'Blog Detail (/id/blog/panduan-menyewa-sepeda-elektrik)', url: 'https://rosantibikemotorent.com/id/blog/panduan-menyewa-sepeda-elektrik', out: 'lh_blog_detail.json' }
];

try {
  for (const t of targets) {
    console.log(`\n========================================`);
    console.log(`Auditing: ${t.name} -> ${t.url}`);
    console.log(`========================================`);
    
    const cmd = `npx --yes lighthouse "${t.url}" --port=9222 --output=json --output-path="./scratch/${t.out}" --only-categories=performance,accessibility,best-practices,seo --quiet`;
    
    try {
      execSync(cmd, { stdio: 'inherit' });
      const outPath = `./scratch/${t.out}`;
      if (fs.existsSync(outPath)) {
        const data = JSON.parse(fs.readFileSync(outPath, 'utf8'));
        const cats = data.categories || {};
        const audits = data.audits || {};
        
        const summary = {
          name: t.name,
          url: t.url,
          scores: {
            performance: Math.round((cats.performance?.score || 0) * 100),
            accessibility: Math.round((cats.accessibility?.score || 0) * 100),
            bestPractices: Math.round((cats['best-practices']?.score || 0) * 100),
            seo: Math.round((cats.seo?.score || 0) * 100)
          },
          metrics: {
            fcp: audits['first-contentful-paint']?.displayValue,
            lcp: audits['largest-contentful-paint']?.displayValue,
            tbt: audits['total-blocking-time']?.displayValue,
            cls: audits['cumulative-layout-shift']?.displayValue,
            speedIndex: audits['speed-index']?.displayValue
          }
        };
        console.log('Result:', JSON.stringify(summary, null, 2));
      }
    } catch (err) {
      console.error(`Audit error on ${t.name}:`, err.message);
    }
  }
} finally {
  console.log('Closing Chrome...');
  try {
    chromeProc.kill('SIGKILL');
  } catch {}
}
