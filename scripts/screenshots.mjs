/** 生成 preview/ 目录截图（构建产物 artifact，不入库） */
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:5173/'
mkdirSync('preview', { recursive: true })

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(BASE, { waitUntil: 'networkidle' })
await page.waitForTimeout(800)

// 中文：Hero + 全景陈列首屏
await page.screenshot({ path: 'preview/01-desktop-zh-hero.png' })

// 价格图 + hover Tooltip（2018 行：iPhone XR + iPhone XS 双卡）
await page.locator('#price').scrollIntoViewIfNeeded()
await page.waitForTimeout(700)
const dots = page.locator('#price .recharts-line-dots circle.recharts-dot')
const box = await dots.nth(11).boundingBox()
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 6 })
await page.waitForTimeout(500)
await page.locator('#price').screenshot({ path: 'preview/02-desktop-zh-price-tooltip.png' })

// 芯片图
await page.locator('#chips').scrollIntoViewIfNeeded()
await page.waitForTimeout(700)
await page.locator('#chips').screenshot({ path: 'preview/03-desktop-zh-chips.png' })

// 规格表（勾选两行高亮）
await page.locator('#specs').scrollIntoViewIfNeeded()
await page.waitForTimeout(500)
await page.locator('#specs tbody tr').nth(0).locator('input[type="checkbox"]').click()
await page.locator('#specs tbody tr').nth(2).locator('input[type="checkbox"]').click()
await page.waitForTimeout(300)
await page.locator('#specs').screenshot({ path: 'preview/04-desktop-zh-specs.png' })

// 里程碑深色卡
await page.locator('#milestones').scrollIntoViewIfNeeded()
await page.waitForTimeout(900)
await page.locator('#milestones article').nth(2).screenshot({ path: 'preview/05-desktop-zh-milestone-dark.png' })

// 英文 Hero
await page.getByRole('button', { name: 'EN', exact: true }).click()
await page.waitForTimeout(400)
await page.locator('#overview').screenshot({ path: 'preview/06-desktop-en-hero.png' })

// 移动端 375px：菜单展开 + 详情抽屉
const mobile = await browser.newPage({ viewport: { width: 375, height: 812 } })
await mobile.goto(BASE, { waitUntil: 'networkidle' })
await mobile.waitForTimeout(600)
await mobile.screenshot({ path: 'preview/07-mobile-zh-hero.png' })
await mobile.locator('header button[aria-expanded]').click()
await mobile.waitForTimeout(300)
await mobile.screenshot({ path: 'preview/08-mobile-zh-menu.png' })
const card = mobile.getByRole('button', { name: '查看 iPhone 17e 详情' }).first()
await card.scrollIntoViewIfNeeded()
await card.click()
await mobile.waitForTimeout(700)
await mobile.screenshot({ path: 'preview/09-mobile-zh-detail.png' })

await browser.close()
console.log('screenshots written to preview/')
