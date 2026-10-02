import { Actor, log } from 'apify';
import { readFileSync } from 'node:fs';
import { compile, detect, extractSignals } from './detect.js';
import { fetchPage, normalizeUrl } from './fetch.js';

const dataFile = f => JSON.parse(readFileSync(new URL(`../data/${f}`, import.meta.url), 'utf8'));
const db = compile(dataFile('technologies.json'), dataFile('categories.json'));

await Actor.main(async () => {
  const input = (await Actor.getInput()) ?? {};
  const urls = [...new Set((input.urls ?? []).map(u => (typeof u === 'string' ? u : u?.url)).map(normalizeUrl).filter(Boolean))];
  if (!urls.length) throw new Error('Provide at least one website in "urls", e.g. "example.com".');
  const concurrency = Math.max(1, Math.min(20, input.maxConcurrency ?? 10));
  const minConfidence = Math.max(0, Math.min(100, input.minConfidence ?? 50));
  log.info(`Analyzing ${urls.length} website(s) with concurrency ${concurrency}`);

  let next = 0;
  let done = 0;
  const worker = async () => {
    while (next < urls.length) {
      const url = urls[next++];
      let record;
      try {
        const page = await fetchPage(url, { timeoutMs: (input.timeoutSecs ?? 20) * 1000 });
        const technologies = detect(extractSignals({ url: page.finalUrl, headers: page.headers, cookies: page.cookies, html: page.html }), db)
          .filter(t => t.confidence >= minConfidence);
        const byCategory = {};
        for (const t of technologies) for (const c of t.categories.length ? t.categories : ['Other']) (byCategory[c] ??= []).push(t.name);
        record = {
          url,
          finalUrl: page.finalUrl,
          statusCode: page.status,
          technologyCount: technologies.length,
          technologies: input.includeDetails === false ? technologies.map(t => ({ name: t.name, version: t.version, categories: t.categories })) : technologies,
          byCategory,
          responseTimeMs: page.ms,
          error: null,
        };
      } catch (e) {
        record = { url, finalUrl: null, statusCode: null, technologyCount: 0, technologies: [], byCategory: {}, responseTimeMs: null, error: String(e?.cause?.code ?? e?.name ?? e) };
      }
      await Actor.pushData(record);
      // Charge only for websites that were actually analyzed.
      if (!record.error) {
        const charged = await Actor.charge({ eventName: 'website-analyzed' });
        if (done === 0) log.info(`Charging check: ${JSON.stringify({ chargedCount: charged.chargedCount, limitReached: charged.eventChargeLimitReached })}`);
      }
      done++;
      if (done % 25 === 0) log.info(`Progress: ${done}/${urls.length}`);
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, urls.length) }, worker));
  log.info(`Done: ${done} website(s) analyzed.`);
});
