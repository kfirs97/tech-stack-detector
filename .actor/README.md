# Tech Stack Detector — Wappalyzer Alternative

**Find out what any website is built with.** Give it a list of domains and get back the CMS, JavaScript frameworks, analytics and marketing tools, CDN, hosting, e-commerce platform, payment providers and more — detected from **7,600+ technology fingerprints**.

Built for **lead generation, sales prospecting, competitor research, and market analysis** — e.g. *"find every Shopify store in this list"*, *"which of our prospects use HubSpot?"*, *"what framework does each competitor use?"*

## Why this actor

- 💸 **Cheap:** pay only per website successfully analyzed — failed or unreachable sites are free.
- ⚡ **Fast:** plain HTTP (no headless browser), up to 20 sites in parallel.
- 🧠 **Rich output:** name, **version** (when exposed), **confidence**, categories, website, icon and description for every technology — plus a per-category summary.
- 📦 **Bulk-ready:** paste thousands of domains; duplicates are removed automatically.
- 🔓 **Open fingerprints:** based on the community-maintained [webappanalyzer](https://github.com/enthec/webappanalyzer) database (the open continuation of Wappalyzer's fingerprints).

## Input

```json
{
  "urls": ["wordpress.org", "vercel.com", "https://www.shopify.com"],
  "minConfidence": 50
}
```

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

Export as JSON, CSV or Excel, call it via API, schedule it, or connect it to Make, Zapier, n8n or your AI agent.

## What it can and can't see

Detection uses everything a normal page load returns: HTTP headers, cookies, HTML, meta tags, script URLs, inline scripts and DOM selectors. Technologies that only reveal themselves after JavaScript runs in a browser may be missed. Only analyze sites you're allowed to access, and respect their terms.

## Source & license

Source code: [github.com/kfirs97/tech-stack-detector](https://github.com/kfirs97/tech-stack-detector) (GPL-3.0, as required by the fingerprint database).
