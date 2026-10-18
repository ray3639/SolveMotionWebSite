// One progressive public navigation owner. Existing HTML links are the fallback.
(() => {
  'use strict';

  const script = document.currentScript;
  const nav = document.querySelector('header .navlinks');
  if (!script) return;
  const base = new URL('../../', script.src);
  if (base.origin !== location.origin) return;

  // Presentation routes only: no product, permission, release or lifecycle truth.
  const groups = [
    ['Products', [
      ['Explore all products', 'products/'],
      ['RayAI', 'products/rayai.html'],
      ['SolveStudio + Agent', 'products/solvestudio.html'],
      ['Core 12', 'products/core12.html'],
      ['SolvePharmacy', 'products/solvepharmacy.html'],
      ['SolveMind', 'products/solvemind.html'],
      ['SolveMotion', 'products/solvemotion.html'],
      ['SolveCrime', 'products/solvecrime.html'],
      ['SolveOura - In Development', 'products/solveoura.html'],
      ['Command Center', 'applications.html#command-center']
    ]],
    ['Solutions', [
      ['Platform and ecosystem', 'platform.html'],
      ['Capabilities', 'capabilities.html'],
      ['Governed software creation', 'products/solvestudio.html'],
      ['Reports and review', 'reports.html'],
      ['Enterprise and partnerships', 'institutional.html']
    ]],
    ['Industries', [
      ['Product and learning domains', 'departments.html'],
      ['Health and science', 'products/solvepharmacy.html'],
      ['Education and research', 'education/'],
      ['Movement and performance', 'products/solvemotion.html'],
      ['Investigation and public safety', 'products/solvecrime.html'],
      ['Software development', 'products/solvestudio.html']
    ]],
    ['Resources', [
      ['Education', 'education/'],
      ['Learning paths', 'learning-paths.html'],
      ['Research', 'research.html'],
      ['Methodology', 'methodology.html'],
      ['Intelligence map', 'intelligence-map.html'],
      ['Roadmap', 'roadmap.html'],
      ['Downloads', 'downloads.html'],
      ['Metrics and measurement', 'metrics.html'],
      ['Support', 'support.html']
    ]],
    ['About', [
      ['Our mission', 'about.html'],
      ['Governance approach', 'doctrine.html'],
      ['Partnerships', 'partnerships.html'],
      ['Contact', 'contact.html']
    ]]
  ];
  const normalized = (path) => path.replace(/index\.html$/, '').replace(/\/$/, '');
  const currentPath = normalized(location.pathname);
  function link(label, route, className) {
    const anchor = document.createElement('a');
    const url = new URL(route, base);
    anchor.href = url.href;
    anchor.textContent = label;
    if (className) anchor.className = className;
    if (!url.hash && normalized(url.pathname) === currentPath) {
      anchor.setAttribute('aria-current', 'page');
    }
    return anchor;
  }

  // Reuse the same public route owner for the site-wide footer. Static HTML
  // remains the fallback; no application status, permission or release registry.
  function navigationRoute(group, label) {
    return groups.find(([name]) => name === group)[1].find(([name]) => name === label)[1];
  }
  function enhanceFooter() {
    const footer = document.querySelector('footer') || document.createElement('footer');
    if (footer.dataset.enhanced === 'true') return;
    const grid = document.createElement('div');
    grid.className = 'container footer-grid ecosystem-footer-grid';
    const brand = document.createElement('div');
    brand.className = 'footer-brand';
    const identity = link('SolveMotion Labs', '');
    identity.className = 'footer-identity';
    const logo = document.createElement('img');
    logo.src = new URL('assets/images/SolveMotion.png', base).href;
    logo.alt = '';
    logo.width = 48;
    logo.height = 48;
    logo.loading = 'lazy';
    identity.prepend(logo);
    const description = document.createElement('p');
    description.textContent = 'Human judgment. Governed intelligence. Connected learning and creation.';
    brand.append(identity, description, link('About', navigationRoute('About', 'Our mission')), link('Contact', navigationRoute('About', 'Contact')));
    grid.append(brand);
    const columns = [
      ['Applications', ['RayAI', 'SolveStudio + Agent', 'SolveMotion', 'SolvePharmacy', 'SolveMind', 'SolveCrime', 'SolveOura - In Development'].map((name) => [name === 'SolveStudio + Agent' ? 'SolveStudio' : name, navigationRoute('Products', name)])],
      ['Platform', ['Core 12', 'Command Center'].map((name) => [name, navigationRoute('Products', name)]).concat([['Intelligence Map', navigationRoute('Resources', 'Intelligence map')]])],
      ['Explore', [
        ['Products', navigationRoute('Products', 'Explore all products')],
        ['Solutions', navigationRoute('Solutions', 'Platform and ecosystem')],
        ...['Education', 'Roadmap', 'Downloads', 'Support'].map((name) => [name, navigationRoute('Resources', name)])
      ]],
      ['Android Testing', [['Become an Android tester', 'contact.html#android-testing']]],
      ['Legal', [
        ['SolveMotion Privacy', 'privacy/solvemotion.html'],
        ['SolvePharmacy Privacy', 'privacy/solvepharmacy.html']
      ]],
      ['Education Pillars', [
        ['Kinesiology', 'education/kinesiology.html'], ['Psychology', 'education/psychology.html'],
        ['Criminology', 'education/criminology.html'], ['Pharmacy', 'education/pharmacy.html'],
        ['Chemical Literacy', 'education/chemical-literacy.html']
      ]]
    ];
    for (const [label, routes] of columns) {
      const section = document.createElement('nav');
      section.className = 'footer-column';
      section.setAttribute('aria-label', label + ' footer');
      const heading = document.createElement('h2');
      heading.textContent = label;
      const list = document.createElement('ul');
      for (const [name, route] of routes) {
        const item = document.createElement('li');
        item.append(link(name, route));
        list.append(item);
      }
      section.append(heading, list);
      grid.append(section);
    }
    const note = document.createElement('p');
    note.className = 'container footer-note';
    note.textContent = '© 2026 SolveMotion Labs. All rights reserved.';
    footer.replaceChildren(grid, note);
    footer.classList.add('ecosystem-footer');
    footer.setAttribute('aria-label', 'SolveMotion Labs');
    footer.dataset.enhanced = 'true';
    if (!footer.isConnected) document.body.append(footer);
  }

  // Legal and error pages use the same footer without requiring a site header.
  enhanceFooter();
  if (!nav || nav.dataset.enhanced === 'true') return;

  const fragment = document.createDocumentFragment();
  const disclosures = [];
  for (const [label, routes] of groups) {
    const details = document.createElement('details');
    details.className = 'nav-group';
    const summary = document.createElement('summary');
    summary.textContent = label;
    const panel = document.createElement('div');
    panel.className = 'nav-dropdown';
    for (const [name, route] of routes) panel.append(link(name, route));
    details.append(summary, panel);
    fragment.append(details);
    disclosures.push(details);
  }
  fragment.append(
    link('RayAI sign in', 'webapps/rayai/', 'nav-entry'),
    link('Start with SolveStudio', 'webapps/solvemotionstudio/', 'nav-studio')
  );

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'nav-toggle';
  toggle.textContent = 'Menu';
  nav.id = nav.id || 'site-primary-navigation';
  nav.setAttribute('aria-label', 'Primary');
  toggle.setAttribute('aria-controls', nav.id);
  toggle.setAttribute('aria-expanded', 'false');
  const mobile = matchMedia('(max-width: 980px)');

  function closeGroups(except) {
    for (const details of disclosures) {
      if (details !== except && details.open) details.open = false;
    }
  }
  function setMenu(open, restoreFocus = false) {
    nav.dataset.open = String(open);
    toggle.setAttribute('aria-expanded', String(open));
    if (!open) closeGroups();
    if (restoreFocus && mobile.matches) toggle.focus();
  }
  for (const details of disclosures) {
    details.addEventListener('toggle', () => {
      if (details.open) closeGroups(details);
    });
  }
  toggle.addEventListener('click', () => setMenu(nav.dataset.open !== 'true'));
  nav.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const open = disclosures.find((details) => details.open);
    if (open) {
      open.open = false;
      open.querySelector('summary').focus();
    } else if (mobile.matches) {
      setMenu(false, true);
    }
    event.preventDefault();
  });
  document.addEventListener('click', (event) => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) setMenu(false);
  });
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });
  mobile.addEventListener('change', () => setMenu(false));

  // Commit only after all accessible controls and destinations are constructed.
  nav.replaceChildren(fragment);
  nav.before(toggle);
  nav.dataset.enhanced = 'true';
  setMenu(false);
})();
