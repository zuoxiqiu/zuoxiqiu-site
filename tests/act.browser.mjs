import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(process.env.ACT_PLAYWRIGHT_PATH || import.meta.url);
const {chromium,webkit}=require('playwright');
const browser=await chromium.launch({headless:true,channel:'chrome'});
const page=await browser.newPage({reducedMotion:'reduce'});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const requests=[];page.on('request',r=>requests.push([r.url(),r.method()]));
const url='http://127.0.0.1:4322/act/';
const click=async a=>{if(a.startsWith('timer')&&(await page.locator('.act-stay').getAttribute('open'))===null)await page.locator('.act-stay summary').click();await page.locator(`[data-action="${a}"]`).click();};
const pick=i=>page.locator(`[data-choice="${i}"]`).click();
const read=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('zuoxiqiu-act-v1')));
await page.goto(url);
for(const route of ['thoughts','starting','urge','feeling']){
 await page.locator(`[data-route="${route}"]`).click();
 for(let step=0;step<7;step++){
  const n=await page.locator('[data-choice]').count();
  for(let i=0;i<n;i++){await pick(i);assert.ok((await page.locator('.act-feedback').innerText()).length>5);}
  if(step<6)await click('next');
 }
 assert.equal((await read()).step,6);await click('home');
}
await page.locator('[data-route="thoughts"]').click();await pick(0);await click('next');await pick(0);await click('next');await pick(0);
await page.clock.install();await click('timer-toggle');await page.clock.fastForward(10000);await click('timer-toggle');let s=await read();assert.ok(s.remaining<=50&&s.remaining>48);
await page.reload();await click('resume');assert.match(await page.locator('output').textContent(),/未运行/);await click('timer-toggle');await page.clock.fastForward(60000);assert.equal((await read()).step,2);assert.match(await page.locator('output').textContent(),/已结束/);
await click('next');await pick(0);await click('next');await pick(0);await click('back');await click('back');await click('back');await click('back');await pick(1);assert.deepEqual((await read()).answers,{'0':1});
await click('end');assert.match(await page.locator('h2').innerText(),/结束/);await page.locator('[data-global="clear"]').click();assert.equal(await read(),null);
await page.evaluate(()=>localStorage.setItem('zuoxiqiu-act-v1',JSON.stringify({version:0})));await page.reload();assert.equal(await page.locator('[data-route]').count(),4);
for(const width of [360,390,768,1440]){
 await page.setViewportSize({width,height:900});await page.screenshot({path:`artifacts/act/entry-${width}.png`,fullPage:true,animations:'disabled'});
 await page.locator('[data-route="feeling"]').click();await click('next');await click('next');await click('next');await pick(0);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.screenshot({path:`artifacts/act/exercise-${width}.png`,fullPage:true,animations:'disabled'});await click('end');await click('home');
}
await page.locator('[data-route="thoughts"]').focus();await page.keyboard.press('Enter');assert.equal((await read()).step,0);
await click('next');await click('next');await click('timer-toggle');await page.clock.fastForward(1000);await page.evaluate(()=>window.dispatchEvent(new Event('blur')));assert.match(await page.locator('output').textContent(),/未运行/);
await click('end');await click('back');assert.equal((await read()).step,2);await page.locator('[data-global="clear"]').click();
await page.emulateMedia({reducedMotion:'reduce'});await page.reload();await page.locator('[data-route="urge"]').click();await click('next');await click('next');await click('skip');await click('skip');await click('end');
await page.locator('[data-global="clear"]').click();await page.keyboard.press('Tab');
await page.goto('http://127.0.0.1:4322/');assert.equal(await page.locator('.act-entry a').getAttribute('href'),'/act/');
await page.goto(url);await page.addStyleTag({content:'html {font-size:200%}'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
const blocked=await browser.newContext();await blocked.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked')}})});const bp=await blocked.newPage();await bp.goto(url);await bp.locator('[data-route="starting"]').click();assert.match(await bp.locator('#act-storage').innerText(),/不可用/);
const nojs=await browser.newContext({javaScriptEnabled:false});const np=await nojs.newPage();await np.goto(url);assert.match(await np.locator('noscript').innerText(),/JavaScript/);
assert.deepEqual(errors,[]);assert.ok(!requests.some(([u,m])=>m!=='GET'||(!u.startsWith('http://127.0.0.1:4322/')&&!u.startsWith('data:'))));
console.log('PASS: four routes, every response, upstream invalidation, timer expiry, refresh, early end, skip, old storage, blocked storage, no-JS, four widths, reduced motion, homepage, request audit.');
try{const wb=await webkit.launch({headless:true});await wb.close();console.log('WebKit available');}catch{console.log('WebKit unavailable: physical mobile Safari remains a manual acceptance check.');}
await browser.close();
