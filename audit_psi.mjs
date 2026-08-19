import https from 'https';

const pages = [
  { name: 'Home (/id)', url: 'https://rosantibikemotorent.com/id' },
  { name: 'Fleet (/id/fleet)', url: 'https://rosantibikemotorent.com/id/fleet' },
  { name: 'Fleet Detail (/id/fleet/vario-150)', url: 'https://rosantibikemotorent.com/id/fleet/vario-150' },
  { name: 'Blog (/id/blog)', url: 'https://rosantibikemotorent.com/id/blog' },
  { name: 'Blog Detail', url: 'https://rosantibikemotorent.com/id/blog/panduan-menyewa-sepeda-motor-di-rosanti-bike' },
  { name: 'Booking (/id/booking)', url: 'https://rosantibikemotorent.com/id/booking' },
  { name: 'FAQ (/id/faq)', url: 'https://rosantibikemotorent.com/id/faq' }
];

async function runAudit(targetUrl, strategy = 'mobile') {
  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&strategy=${strategy}&category=performance&category=accessibility&category=best-practices&category=seo`;
  
  return new Promise((resolve, reject) => {
    https.get(apiUrl, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) {
            resolve({ error: json.error.message });
            return;
          }
          const cats = json.lighthouseResult?.categories || {};
          const audits = json.lighthouseResult?.audits || {};
          
          const scores = {
            performance: Math.round((cats.performance?.score || 0) * 100),
            accessibility: Math.round((cats.accessibility?.score || 0) * 100),
            bestPractices: Math.round((cats['best-practices']?.score || 0) * 100),
            seo: Math.round((cats.seo?.score || 0) * 100),
            metrics: {
              fcp: audits['first-contentful-paint']?.displayValue,
              lcp: audits['largest-contentful-paint']?.displayValue,
              tbt: audits['total-blocking-time']?.displayValue,
              cls: audits['cumulative-layout-shift']?.displayValue,
              speedIndex: audits['speed-index']?.displayValue
            },
            opportunities: Object.values(audits)
              .filter(a => a.details?.type === 'opportunity' && (a.numericValue || 0) > 100)
              .map(a => ({ title: a.title, savings: a.displayValue }))
          };
          resolve(scores);
        } catch (e) {
          resolve({ error: e.message });
        }
      });
    }).on('error', (e) => resolve({ error: e.message }));
  });
}

async function main() {
  console.log('=== STARTING LIGHTHOUSE AUDIT FOR ALL PAGES (MOBILE) ===\n');
  for (const p of pages) {
    console.log(`Auditing: ${p.name} (${p.url})...`);
    const res = await runAudit(p.url, 'mobile');
    console.log(JSON.stringify({ page: p.name, ...res }, null, 2));
    console.log('--------------------------------------------------\n');
  }
}

main();
