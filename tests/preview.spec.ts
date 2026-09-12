import { test, expect } from '@playwright/test';

test('messaging crawlers receive the new image pathname and a public photo card',async({request})=>{
  for(const path of ['/','/?v=athel-photos-3','/admin']){
    const response=await request.get(path,{headers:{'User-Agent':'TelegramBot (like TwitterBot)'}});
    expect(response.ok()).toBe(true);
    const html=await response.text();
    expect(html).toContain('For AThel — A little corner, just for you');
    const og=html.match(/<meta property="og:image" content="([^"]+)"/g);
    expect(og).toHaveLength(1);
    expect(og![0]).toMatch(/https:\/\/[^/]+\/share\/for-athel-hands-v2\.png/);
    expect(html).toMatch(/<meta name="twitter:image" content="https:\/\/[^/]+\/share\/for-athel-hands-v2\.png"/);
    expect(html).not.toMatch(/<meta[^>]+content="[^"]*\/opengraph-image/);
  }
  const image=await request.get('/share/for-athel-hands-v2.png',{headers:{'User-Agent':'TelegramBot (like TwitterBot)'}});
  expect(image.ok()).toBe(true);expect(image.headers()['content-type']).toContain('image/png');
  const png=await image.body();
  expect(png.subarray(0,8).toString('hex')).toBe('89504e470d0a1a0a');
  expect(png.readUInt32BE(16)).toBe(1200);expect(png.readUInt32BE(20)).toBe(630);
  const oldImage=await request.get('/opengraph-image',{maxRedirects:0});
  expect(oldImage.status()).toBe(307);
  expect(oldImage.headers().location).toBe('/share/for-athel-hands-v2.png');
});
