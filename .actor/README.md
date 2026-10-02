# Tech Stack Detector — Wappalyzer & BuiltWith Alternative

**Find out what any website is built with.** Give it a list of domains and get back the CMS, JavaScript frameworks, analytics and marketing tools, CDN, hosting, e-commerce platform, payment providers and more — detected from **7,600+ technology fingerprints**.

**$0.01 per website analyzed** — 1,000 websites cost $10. Failed or unreachable websites are free.

## What you can use it for

- 🎯 **Lead generation & sales prospecting** — *"find every Shopify store in this list"*, *"which of our prospects use HubSpot or Salesforce?"*, *"which agencies' clients run WordPress?"*
- 🧩 **Lead enrichment** — add a technographics column to your CRM or spreadsheet: CMS, e-commerce platform, analytics, live chat, payment provider.
- 🕵️ **Competitor research** — what framework, hosting and marketing stack does each competitor use?
- 📊 **Market research** — measure adoption of a technology (e.g. Next.js, Stripe, Klaviyo) across thousands of domains.
- 🔐 **Asset inventory** — see web servers, CDNs and library versions across your own sites.
- 🤖 **AI agents** — a simple "what is this website built with?" tool for your agent (via the Apify API or MCP server).

## Why this actor

- 💸 **Cheap & fair:** a flat $0.01 per website successfully analyzed. No subscription, no API key to manage, no charge for sites that fail.
- ⚡ **Fast:** plain HTTP (no headless browser), up to 20 sites in parallel — 10 websites in about 15 seconds, including startup.
- 🧠 **Rich output:** name, **version** (when exposed), **confidence**, categories, website, icon and description for every technology — plus a per-category summary that's easy to filter in a spreadsheet.
- 📦 **Bulk-ready:** paste thousands of domains (with or without `https://`); duplicates are removed automatically.
- 🔓 **Open fingerprints:** based on the community-maintained [webappanalyzer](https://github.com/enthec/webappanalyzer) database — the open continuation of Wappalyzer's fingerprints, updated regularly.

> 💡 **Need contacts too?** [Website Company Enricher](https://apify.com/kfirs/website-company-enricher) returns the same tech stack **plus** emails, phones, LinkedIn & social profiles, logo and address — one row per company, same $0.01 per website.

## What it detects

7,600+ technologies in 100+ categories, including:

| Category | Examples |
|---|---|
| CMS | WordPress, Drupal, Joomla, Webflow, Wix, Squarespace, Ghost |
| E-commerce | Shopify, WooCommerce, Magento, BigCommerce, PrestaShop |
| JavaScript frameworks | React, Next.js, Vue.js, Nuxt.js, Angular, Svelte |
| Analytics & tag managers | Google Analytics, Google Tag Manager, Hotjar, Segment, Mixpanel |
| Marketing automation & CRM | HubSpot, Marketo, Klaviyo, Mailchimp, Salesforce |
| Payments | Stripe, PayPal, Klarna, Afterpay |
| CDN & hosting | Cloudflare, Fastly, Amazon CloudFront, Vercel, Netlify |
| Web servers & languages | Nginx, Apache, PHP, Node.js, Ruby on Rails |
| Live chat & support | Intercom, Zendesk, Drift, LiveChat |

## Input

```json
{
  "urls": ["wordpress.org", "vercel.com", "https://www.shopify.com"],
  "minConfidence": 50
}
```

| Field | Description |
|---|---|
| `urls` | Domains or URLs to analyze. |
| `minConfidence` | Only report technologies with at least this confidence (0–100, default 50). |
| `includeDetails` | Include website, icon and description for each technology (default on). |
| `maxConcurrency` | Websites analyzed in parallel (1–20, default 10). |
| `timeoutSecs` | Give up on a website after this many seconds (default 20) — not charged. |

## Output (one item per website)

```json
{
  "url": "https://vercel.com/",
  "finalUrl": "https://vercel.com/",
  "statusCode": 200,
  "technologyCount": 13,
  "technologies": [
    { "name": "Next.js", "version": null, "confidence": 100, "categories": ["JavaScript frameworks", "Web frameworks", "Static site generator"], "website": "https://nextjs.org" },
    { "name": "Vercel", "version": null, "confidence": 100, "categories": ["PaaS"], "website": "https://vercel.com" }
  ],
  "byCategory": { "JavaScript frameworks": ["Next.js", "React"], "PaaS": ["Vercel"], "Analytics": ["..."] },
  "responseTimeMs": 412,
  "error": null
}
```

Export as JSON, CSV or Excel, schedule recurring runs, or connect it to Make, Zapier, n8n or Google Sheets.

## Use it as an API

Run it and get the results in one HTTP call:

```bash
curl -X POST "https://api.apify.com/v2/acts/kfirs~tech-stack-detector/run-sync-get-dataset-items?token=YOUR_APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"urls": ["example.com", "shopify.com"]}'
```

Or from Python:

```python
from apify_client import ApifyClient

client = ApifyClient("YOUR_APIFY_TOKEN")
run = client.actor("kfirs/tech-stack-detector").call(run_input={"urls": ["example.com"]})
for site in client.dataset(run["defaultDatasetId"]).iterate_items():
    print(site["url"], site["byCategory"])
```

## Pricing

| Event | Price |
|---|---|
| Website analyzed (successful) | $0.01 |
| Website failed / unreachable / timed out | free |
| Actor start | $0.00005 |

Platform compute is tiny (HTTP only, 1 GB memory by default).

## What it can and can't see

Detection uses everything a normal page load returns: HTTP headers, cookies, HTML, meta tags, script URLs, inline scripts and DOM selectors. Technologies that only reveal themselves after JavaScript runs in a browser may be missed, and like every fingerprint-based detector it can occasionally report a false positive — use `minConfidence` to tune. Only analyze sites you're allowed to access, and respect their terms.

## FAQ

**Is this the Wappalyzer API?** No — it's an independent alternative that uses the open webappanalyzer fingerprint database (which continues Wappalyzer's open-source fingerprints) with its own detection engine.

**Do I need an API key?** Only your Apify account. No separate subscription.

**Does it scan subpages?** It analyzes the URL you give it (after redirects). Pass a specific page (e.g. `/checkout` or `/pricing`) to analyze that page.

**Found a wrong or missing detection?** Open an issue on GitHub — fixes ship fast.

## Source & license

Source code: [github.com/kfirs97/tech-stack-detector](https://github.com/kfirs97/tech-stack-detector) (GPL-3.0, as required by the fingerprint database).
