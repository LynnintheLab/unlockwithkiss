import { test, expect } from '@playwright/test';
import { slides } from '../lib/slides';

test('landscape slides fade without bars; personal note and keyboard controls remain usable',async({page})=>{
  await page.route('**/api/diary',route=>route.fulfill({json:{authenticated:true,role:'guest',unlocked:true,drive:'https://drive.google.com/drive/folders/test-only'}}));
  await page.setViewportSize({width:1440,height:1000});await page.goto('/');
  const main=page.getByRole('region',{name:'Our main photo memories'});
  await expect(main.locator('.slide-photo.is-active')).toHaveAttribute('src','/slideshow/moment-08.jpg');
  await expect(main.getByRole('button')).toHaveCount(0);
  await expect(main.locator('.slide-photo.is-active')).not.toHaveAttribute('src','/slideshow/moment-08.jpg',{timeout:9000});
  await expect(main.locator('.slide-photo.was-active')).toHaveCSS('opacity','1');
  await expect(main.locator('.slide-photo.is-active')).toHaveCSS('transition-duration','1.2s');
  await main.focus();
  await page.getByRole('button',{name:'Open our little diary'}).click();
  const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();
  await expect(dialog.locator('.note-message p')).toHaveCount(5);
  await expect(dialog.locator('.note-message p').last()).toContainText('သိပ်ချစ်တယ်ကွယ် <3');
  await expect(dialog.getByRole('link',{name:'Watch the videos'})).toHaveAttribute('href','https://drive.google.com/drive/folders/test-only');
  await page.evaluate(()=>Promise.all([document.fonts.load('400 21px Walone','အသဲလေး'),document.fonts.load('100 38px Walone','အသဲလေး')]));
  expect(await dialog.locator('.note-message').evaluate(el=>getComputedStyle(el).fontFamily)).toContain('Walone');
  expect(await dialog.locator('.note-title').evaluate(el=>getComputedStyle(el).fontWeight)).toBe('100');
  const photos=dialog.getByRole('region',{name:'Photos beside your note'});
  await expect(photos.getByRole('button')).toHaveCount(0);
  await expect(photos).toHaveCSS('background-color','rgba(0, 0, 0, 0)');
  const photoBounds=await photos.boundingBox();
  expect(photoBounds!.width/photoBounds!.height).toBeCloseTo(1.5,2);
  await photos.focus();
  for(const slide of slides){
    expect(slide.width).toBeGreaterThan(slide.height);
    await expect(photos.locator('.slide-photo.is-active')).toHaveAttribute('src',slide.src);
    await expect.poll(()=>photos.locator('.slide-photo.is-active').evaluate(el=>(el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await page.keyboard.press('ArrowRight');
  }
  await expect(photos.locator('.slide-photo.is-active')).toHaveAttribute('src',slides[0].src);
  await expect.poll(()=>photos.locator('.slide-photo.is-active').evaluate(el=>Number(getComputedStyle(el).opacity))).toBe(1);
  await dialog.locator('.note-title').focus();
  await page.screenshot({path:'/private/tmp/athel-landscape-desktop.png'});
  await dialog.getByRole('link',{name:'Watch the videos'}).scrollIntoViewIfNeeded();
  await expect(dialog.getByRole('link',{name:'Watch the videos'})).toBeInViewport();
  await expect(dialog.locator('.note-photo-caption')).toBeInViewport();
  await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Open our little diary'})).toBeFocused();
});

test('mobile popup keeps the note and continue button reachable with reduced motion',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:390,height:844});
  await page.route('**/api/diary',route=>route.fulfill({json:{authenticated:true,role:'guest',unlocked:true,drive:'https://drive.google.com/drive/folders/test-only'}}));
  await page.goto('/');await page.getByRole('button',{name:'Open our little diary'}).click();
  const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();
  const photos=dialog.getByRole('region',{name:'Photos beside your note'});
  await expect(photos.getByRole('button')).toHaveCount(0);
  await expect(photos.locator('.slide-photo.is-active')).toHaveCSS('transition-duration','0s');
  const first=await photos.locator('.slide-photo.is-active').getAttribute('src');
  await page.clock.install();await page.clock.fastForward(12000);
  await expect(photos.locator('.slide-photo.is-active')).toHaveAttribute('src',first!);
  const photoBounds=await photos.boundingBox();
  expect(photoBounds!.width/photoBounds!.height).toBeCloseTo(1.5,2);
  await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:'/private/tmp/athel-landscape-mobile-top.png'});
  const link=dialog.getByRole('link',{name:'Watch the videos'});await link.scrollIntoViewIfNeeded();await expect(link).toBeInViewport();
  await expect(dialog.locator('.note-slideshow')).toBeInViewport();
  await page.screenshot({path:'/private/tmp/athel-landscape-mobile-bottom.png'});
  expect(await dialog.evaluate(el=>el.scrollWidth>el.clientWidth)).toBe(false);
  await page.setViewportSize({width:320,height:700});expect(await dialog.evaluate(el=>el.scrollWidth>el.clientWidth)).toBe(false);
  await page.setViewportSize({width:844,height:390});
  await link.scrollIntoViewIfNeeded();await expect(link).toBeInViewport();
  await expect(dialog.locator('.note-photo-caption')).toBeInViewport();
  await dialog.getByRole('button',{name:'Close note'}).click();await expect(dialog).toHaveCount(0);
});
