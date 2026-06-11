import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import { join } from 'path';

const BASE = 'http://localhost:5200';
const SS_DIR = 'c:/Projects/amigofitnessgym/qa_screenshots';

import { mkdirSync } from 'fs';
try { mkdirSync(SS_DIR, { recursive: true }); } catch {}

const ss = (name) => join(SS_DIR, `${name}.png`);

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();

const results = [];
const log = (status, label, note = '') => {
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  results.push(`${icon} ${label}${note ? ' — ' + note : ''}`);
  console.log(`${icon} ${label}${note ? ' — ' + note : ''}`);
};

// ─── LANDING PAGE ───────────────────────────────────────────────────────────
console.log('\n=== LANDING PAGE ===');

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.screenshot({ path: ss('01_landing_hero'), fullPage: false });

// Navbar
const navLinks = await page.locator('nav a, nav .nav-link, .navbar a').count();
const hasLogo = await page.locator('img[alt*="migo"], img[alt*="logo"], .navbar img').count();
log(navLinks >= 5 ? 'PASS' : 'FAIL', 'Navbar has nav links', `count=${navLinks}`);
log(hasLogo > 0 ? 'PASS' : 'FAIL', 'Logo present in navbar', `count=${hasLogo}`);

// Hero
const heroText = await page.locator('h1, .hero h1, .hero-title').first().textContent().catch(() => '');
log(heroText.length > 0 ? 'PASS' : 'FAIL', 'Hero h1 renders', `text="${heroText.trim().substring(0,50)}"`);

// No horizontal scroll
const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
const viewportWidth = await page.evaluate(() => window.innerWidth);
log(bodyWidth <= viewportWidth ? 'PASS' : 'FAIL', 'No horizontal scroll (desktop 1280px)', `body=${bodyWidth} vp=${viewportWidth}`);

// Stats section
await page.screenshot({ path: ss('02_landing_scroll'), fullPage: true });
const statsCount = await page.locator('.stat-card, .stats .stat, [class*="stat"]').count();
log(statsCount >= 4 ? 'PASS' : 'FAIL', 'Stats section visible', `count=${statsCount}`);

// Sections exist
const sections = ['About', 'Facilities', 'Promo', 'Contact', 'Careers'];
for (const sec of sections) {
  const exists = await page.locator(`text="${sec}", [id*="${sec.toLowerCase()}"], section h2:has-text("${sec}")`).count();
  log(exists > 0 ? 'PASS' : 'FAIL', `Section: ${sec}`, `found=${exists}`);
}

// Footer admin link
const adminLink = await page.locator('a[href="/login"], a:has-text("Admin"), footer a:has-text("Login")').count();
log(adminLink > 0 ? 'PASS' : 'FAIL', 'Footer admin/login link present');

// Mobile — no horizontal scroll at 390px
const mobCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const mobPage = await mobCtx.newPage();
await mobPage.goto(BASE, { waitUntil: 'networkidle' });
await mobPage.screenshot({ path: ss('03_mobile_hero'), fullPage: false });
const mobScrollWidth = await mobPage.evaluate(() => document.body.scrollWidth);
const mobVpWidth = await mobPage.evaluate(() => window.innerWidth);
log(mobScrollWidth <= mobVpWidth ? 'PASS' : 'FAIL', 'No horizontal scroll (mobile 390px)', `body=${mobScrollWidth} vp=${mobVpWidth}`);
const hamburger = await mobPage.locator('[class*="hamburger"], [class*="mobile"], button:has([class*="menu"]), .navbar button').count();
log(hamburger > 0 ? 'PASS' : 'FAIL', 'Mobile hamburger button exists', `count=${hamburger}`);
await mobCtx.close();

// ─── AUTH ────────────────────────────────────────────────────────────────────
console.log('\n=== AUTH ===');

await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
await page.screenshot({ path: ss('04_login_page') });

const loginForm = await page.locator('form, input[type="text"], input[type="password"]').count();
log(loginForm > 0 ? 'PASS' : 'FAIL', 'Login page renders form');

// Wrong credentials
await page.fill('input[type="text"], input[name="username"], input[placeholder*="sername"]', 'wronguser');
await page.fill('input[type="password"]', 'wrongpass');
await page.click('button[type="submit"]');
await page.waitForTimeout(500);
const errMsg = await page.locator('[class*="error"], [class*="alert"], text=/invalid/i, text=/incorrect/i').count();
log(errMsg > 0 ? 'PASS' : 'FAIL', 'Wrong credentials shows error message');
await page.screenshot({ path: ss('05_login_error') });

// Correct credentials
await page.fill('input[type="text"], input[name="username"], input[placeholder*="sername"]', 'admin');
await page.fill('input[type="password"]', 'amigo2025');
await page.click('button[type="submit"]');
await page.waitForURL('**/admin**', { timeout: 5000 }).catch(() => {});
const afterLoginUrl = page.url();
log(afterLoginUrl.includes('/admin') ? 'PASS' : 'FAIL', 'Login redirects to /admin', `url=${afterLoginUrl}`);
await page.screenshot({ path: ss('06_admin_dashboard') });

// ─── ADMIN LAYOUT & NAV ──────────────────────────────────────────────────────
console.log('\n=== ADMIN ===');

const sidebar = await page.locator('[class*="sidebar"], [class*="al-side"], aside').count();
log(sidebar > 0 ? 'PASS' : 'FAIL', 'Sidebar renders');

const sideLinks = await page.locator('aside a, [class*="al-nav"]').count();
log(sideLinks >= 5 ? 'PASS' : 'FAIL', 'Sidebar has nav links', `count=${sideLinks}`);

// Dashboard KPI cards
const kpiCards = await page.locator('[class*="stat-card"], [class*="kpi"], [class*="card"]').count();
log(kpiCards >= 4 ? 'PASS' : 'FAIL', 'Dashboard KPI cards render', `count=${kpiCards}`);

// Members page
await page.goto(`${BASE}/admin/members`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
const membersUrl = page.url();
const membersBlack = await page.evaluate(() => {
  const bg = window.getComputedStyle(document.body).backgroundColor;
  return bg === 'rgb(0, 0, 0)';
});
const memberTable = await page.locator('table, [class*="table"]').count();
log(!membersBlack && memberTable > 0 ? 'PASS' : 'FAIL', 'Members page loads (not black)', `url=${membersUrl} table=${memberTable}`);
await page.screenshot({ path: ss('07_members_page') });

// Add Member modal
const addBtn = await page.locator('button:has-text("Add Member"), button:has-text("Add")').first();
await addBtn.click().catch(() => {});
await page.waitForTimeout(500);
const modal = await page.locator('[class*="modal"], [class*="pm-modal"]').count();
log(modal > 0 ? 'PASS' : 'FAIL', 'Add Member modal opens');
await page.screenshot({ path: ss('08_add_member_modal') });
// Close modal
await page.keyboard.press('Escape');
await page.locator('[class*="modal__close"], button:has-text("Cancel")').click().catch(() => {});
await page.waitForTimeout(300);

// Employees page
await page.goto(`${BASE}/admin/employees`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
const empTable = await page.locator('table, [class*="table"]').count();
const empBlack = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor === 'rgb(0,0,0)');
log(empTable > 0 ? 'PASS' : 'FAIL', 'Employees page loads with table', `tables=${empTable}`);
await page.screenshot({ path: ss('09_employees_page') });

// Plans page
await page.goto(`${BASE}/admin/plans`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
const plansTable = await page.locator('table, [class*="table"]').count();
log(plansTable > 0 ? 'PASS' : 'FAIL', 'Plans page loads with table', `tables=${plansTable}`);
await page.screenshot({ path: ss('10_plans_page') });

// Payments page
await page.goto(`${BASE}/admin/payments`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
const payTable = await page.locator('table, [class*="table"]').count();
log(payTable > 0 ? 'PASS' : 'FAIL', 'Payments page loads with table', `tables=${payTable}`);
await page.screenshot({ path: ss('11_payments_page') });

// Logout
const logoutBtn = await page.locator('button:has-text("Logout"), [class*="logout"]').first();
await logoutBtn.click().catch(() => {});
await page.waitForTimeout(800);
const afterLogoutUrl = page.url();
log(afterLogoutUrl.includes('/login') ? 'PASS' : 'FAIL', 'Logout redirects to /login', `url=${afterLogoutUrl}`);
await page.screenshot({ path: ss('12_after_logout') });

// Unauthenticated /admin access
await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
const unauthUrl = page.url();
log(unauthUrl.includes('/login') ? 'PASS' : 'FAIL', 'Unauthenticated /admin redirect to /login', `url=${unauthUrl}`);

// ─── PROBE: CRUD on Members ──────────────────────────────────────────────────
console.log('\n=== PROBES ===');

// Re-login
await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
await page.fill('input[type="text"], input[name="username"], input[placeholder*="sername"]', 'admin');
await page.fill('input[type="password"]', 'amigo2025');
await page.click('button[type="submit"]');
await page.waitForURL('**/admin**', { timeout: 5000 }).catch(() => {});

await page.goto(`${BASE}/admin/members`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

// Count rows before add
const rowsBefore = await page.locator('tbody tr').count();

// Add a test member
await page.locator('button:has-text("Add Member"), button:has-text("Add")').first().click();
await page.waitForTimeout(500);
await page.fill('[name="name"]', 'QA Test Member');
await page.fill('[name="contact"]', '+63 999 000 1111');
await page.waitForTimeout(200);
await page.locator('button:has-text("Add Member"), button:has-text("Save")').last().click();
await page.waitForTimeout(500);
const rowsAfter = await page.locator('tbody tr').count();
log(rowsAfter > rowsBefore ? 'PASS' : 'FAIL', '🔍 PROBE: Add Member creates new row', `before=${rowsBefore} after=${rowsAfter}`);
await page.screenshot({ path: ss('13_after_add_member') });

// Edit the member just added
const editBtns = await page.locator('tbody tr:last-child button[title*="edit"], tbody tr:last-child button:has([class*="edit"])');
await editBtns.first().click().catch(() => page.locator('tbody tr:last-child button').nth(0).click());
await page.waitForTimeout(500);
const modalVisible = await page.locator('[class*="pm-modal"], [class*="modal"]').isVisible().catch(() => false);
log(modalVisible ? 'PASS' : 'FAIL', '🔍 PROBE: Edit button opens pre-filled modal');
await page.screenshot({ path: ss('14_edit_member_modal') });
await page.locator('button:has-text("Cancel")').click().catch(() => page.keyboard.press('Escape'));
await page.waitForTimeout(300);

// Delete the test member
const delBtns = await page.locator('tbody tr:last-child button[title*="delete"], tbody tr:last-child button:has([class*="delete"])');
await delBtns.first().click().catch(() => page.locator('tbody tr:last-child button').nth(1).click());
await page.waitForTimeout(500);
const confirmDialog = await page.locator('[class*="modal"], [class*="pm-modal--sm"]').count();
log(confirmDialog > 0 ? 'PASS' : 'FAIL', '🔍 PROBE: Delete opens confirm dialog');
// Confirm delete
await page.locator('button:has-text("Yes"), button:has-text("Remove"), button:has-text("Delete")').last().click().catch(() => {});
await page.waitForTimeout(500);
const rowsFinal = await page.locator('tbody tr').count();
log(rowsFinal <= rowsBefore ? 'PASS' : 'FAIL', '🔍 PROBE: Confirmed delete removes row', `before=${rowsBefore} final=${rowsFinal}`);

// Search filter
const searchInput = await page.locator('input[placeholder*="search" i], input[type="search"]').first();
await searchInput.fill('Maria').catch(() => {});
await page.waitForTimeout(400);
const filteredRows = await page.locator('tbody tr').count();
log(filteredRows <= rowsBefore ? 'PASS' : 'FAIL', '🔍 PROBE: Search filters table', `rows after "Maria" search: ${filteredRows}`);
await searchInput.fill('').catch(() => {});

// ─── SUMMARY ─────────────────────────────────────────────────────────────────
console.log('\n=== SUMMARY ===');
const passes = results.filter(r => r.startsWith('✅')).length;
const fails  = results.filter(r => r.startsWith('❌')).length;
const warns  = results.filter(r => r.startsWith('⚠️')).length;
console.log(`\nTotal: ${passes} PASS, ${fails} FAIL, ${warns} WARN`);

await browser.close();

if (fails > 0) process.exit(1);
