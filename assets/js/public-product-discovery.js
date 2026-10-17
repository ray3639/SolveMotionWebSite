// Optional native WebMCP view of the homepage's existing public JSON-LD owner.
// No private data, model calls, network requests, navigation or persistence.
(async () => {
  'use strict';
  const context = document.modelContext;
  if (typeof context?.registerTool !== 'function') return;

  const choices = ['SolveStudio', 'RayAI', 'SolveMotion Labs'];
  const result = (status, products = []) => JSON.stringify({
    status,
    products,
    accessNotice: 'Private project status, QA reports and release evidence require existing RayAI sign-in and project permissions.',
    actionNotice: 'Public descriptions only. This lookup does not navigate, save an intake, generate a design, grant access or authorize operations.'
  });
  const text = (value, limit) => typeof value === 'string' &&
    value.length > 0 && value.length <= limit && !/[\u0000-\u001f\u007f]/.test(value);

  async function lookup(input, {signal} = {}) {
    if (signal?.aborted) return result('CANCELLED');
    if (input === null || typeof input !== 'object' || Array.isArray(input) ||
        Object.getPrototypeOf(input) !== Object.prototype ||
        Object.keys(input).some(key => key !== 'product') ||
        ('product' in input && !choices.includes(input.product))) {
      return result('UNSUPPORTED_INPUT');
    }
    try {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      if (scripts.length !== 1) return result('UNAVAILABLE');
      const raw = scripts[0].textContent;
      if (!raw || raw.length > 65536) return result('UNAVAILABLE');
      const catalogue = JSON.parse(raw);
      if (catalogue['@context'] !== 'https://schema.org' ||
          !Array.isArray(catalogue['@graph']) || catalogue['@graph'].length > 64) {
        return result('UNAVAILABLE');
      }
      const products = [];
      for (const name of choices) {
        const company = name === 'SolveMotion Labs';
        const matches = catalogue['@graph'].filter(row =>
          row && typeof row === 'object' && row.name === name &&
          row['@type'] === (company ? 'Organization' : 'SoftwareApplication'));
        if (matches.length !== 1) return result('UNAVAILABLE');
        const row = matches[0];
        if (row['@type'] !== (company ? 'Organization' : 'SoftwareApplication') ||
            !text(row.description, 2048) || !text(row.url, 2048)) {
          return result('UNAVAILABLE');
        }
        const url = new URL(row.url);
        const path = company ? '/' : `/products/${name.toLowerCase()}.html`;
        if (url.origin !== 'https://solvemotionlabs.com' || url.pathname !== path ||
            url.username || url.password || url.search || url.hash) {
          return result('UNAVAILABLE');
        }
        // Return only admitted public fields from the sole catalogue owner.
        products.push({name: row.name, description: row.description, url: row.url});
      }
      return result('AVAILABLE', input.product
        ? products.filter(row => row.name === input.product) : products);
    } catch {
      return result('UNAVAILABLE');
    }
  }

  try {
    await context.registerTool({
      name: 'describe_solvemotion_public_products',
      description: 'Read existing public descriptions for SolveStudio software planning, RayAI authorized-project review entry, or SolveMotion Labs company information. Explicit product choice only; omit it to list all three. No private project lookup, intake writes, navigation, AI generation or operational actions.',
      inputSchema: {
        type: 'object',
        properties: {product: {type: 'string', enum: choices,
          description: 'Explicit public product or company choice. This is not a free-text request or project selector.'}},
        additionalProperties: false
      },
      annotations: {readOnlyHint: true, consequentialHint: false, untrustedContentHint: true},
      execute: lookup
    });
  } catch {
    // Unsupported/denied native registration leaves the existing website intact.
  }
})();
