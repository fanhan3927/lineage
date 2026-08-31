/**
 * 交互走查（playwright-core + 系统 Edge，无浏览器下载）
 * 覆盖：语言切换持久化、卡片详情 Esc、价格图 Tooltip 绑定与串点、图表 tap 固定卡、
 * 规格表筛选/搜索/对比、里程碑 whileInView、移动端折叠导航与横向滚动、console 错误收集。
 */
import { chromium } from 'playwright-core'

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:5173/'
const results = []
let pageErrors = []

function check(name, ok, detail = '') {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

const browser = await chromium.launch({ channel: 'msedge', headless: true })

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  page.on('pageerror', (error) => pageErrors.push(String(error)))
  page.on('console', (message) => {
    if (message.type() === 'error') pageErrors.push(message.text())
  })

  await page.goto(BASE, { waitUntil: 'networkidle' })

  // 1) 默认中文 + Hero 统计
  const heroTitle = await page.locator('h1').innerText()
  check('默认语言为中文', heroTitle.includes('装进口袋'), heroTitle)
  const bodyText = await page.locator('body').innerText()
  check('Hero 统计包含 50 / 43', bodyText.includes('50') && bodyText.includes('43'))

  // 2) 语言切换 EN + localStorage 持久化
  await page.getByRole('button', { name: 'EN', exact: true }).click()
  await page.waitForTimeout(300)
  const heroEn = await page.locator('h1').innerText()
  check('切换 EN 后标题为英文', /pocket/i.test(heroEn), heroEn)
  const stored = await page.evaluate(() => window.localStorage.getItem('lineage-locale'))
  check('语言写入 localStorage', stored === 'en', String(stored))
  await page.reload({ waitUntil: 'networkidle' })
  const heroAfterReload = await page.locator('h1').innerText()
  check('刷新后语言保持 EN', /pocket/i.test(heroAfterReload))
  await page.getByRole('button', { name: '中', exact: true }).click()
  await page.waitForTimeout(250)

  // 3) 设备卡片 → 详情 Modal → Esc 关闭
  const card = page.getByRole('button', { name: /iPhone 17e 详情|iPhone 17e details/ }).first()
  await card.scrollIntoViewIfNeeded()
  await card.click()
  const dialog = page.getByRole('dialog')
  await dialog.waitFor({ state: 'visible', timeout: 3000 })
  const dialogText = await dialog.innerText()
  check('详情 Modal 打开且含规格', dialogText.includes('首发起售价') && dialogText.includes('A19'))
  await page.keyboard.press('Escape')
  await page
    .locator('[role="dialog"]')
    .waitFor({ state: 'detached', timeout: 4000 })
    .catch(() => {})
  check('Esc 关闭详情', (await page.locator('[role="dialog"]').count()) === 0)

  // 4) 价格图 Tooltip：绑定 payload，相邻点内容不同（串点检查）
  await page.locator('#price').scrollIntoViewIfNeeded()
  await page.waitForTimeout(600)
  const dots = page.locator('#price .recharts-line-dots circle.recharts-dot')
  const dotCount = await dots.count()
  check('价格图数据点数量 27', dotCount === 27, String(dotCount))

  async function tooltipText() {
    return (await page.locator('#price .recharts-tooltip-wrapper').innerText().catch(() => '')).replace(/\s+/g, ' ').trim()
  }
  const box10 = await dots.nth(10).boundingBox()
  const box11 = await dots.nth(11).boundingBox()
  await page.mouse.move(box10.x + box10.width / 2, box10.y + box10.height / 2, { steps: 4 })
  await page.waitForTimeout(350)
  const tip1 = await tooltipText()
  await page.mouse.move(box11.x + box11.width / 2, box11.y + box11.height / 2, { steps: 4 })
  await page.waitForTimeout(350)
  const tip2 = await tooltipText()
  check('Tooltip 随数据点切换', tip1.includes('$699') && tip2.includes('$749') && tip1 !== tip2, `${tip1} | ${tip2}`)
  check('Tooltip 含机型名', tip1.includes('iPhone 8') && tip2.includes('iPhone XR'), `${tip1} | ${tip2}`)

  // 5) 点击数据点 → 固定信息卡
  await page.mouse.click(box11.x + box11.width / 2, box11.y + box11.height / 2)
  await page.waitForTimeout(300)
  const pinned = await page.locator('#price').getByText('iPhone XR', { exact: true }).count()
  check('tap/点击选中显示固定信息卡', pinned > 0)

  // 6) 价格图 Tab 切到 iPad
  await page.locator('#price').getByRole('tab', { name: 'iPad' }).click()
  await page.waitForTimeout(400)
  const ipadDots = await dots.count()
  // 基础系列 11 台但 2012 年两台合并 → 10 点；Pro 9 台但 2017 年两台合并 → 8 点
  check('iPad Tab 数据点渲染（10 基础 + 8 Pro）', ipadDots === 18, String(ipadDots))

  // 7) 芯片图：Tab M 系列 + 口径说明
  await page.locator('#chips').scrollIntoViewIfNeeded()
  await page.waitForTimeout(400)
  const footnote = await page.locator('#chips').innerText()
  check('芯片图含口径说明', footnote.includes('口径说明') || footnote.includes('Methodology'))
  await page.locator('#chips').getByRole('tab', { name: /M 系列/ }).click()
  await page.waitForTimeout(400)
  const chipsText = await page.locator('#chips').innerText()
  check('M 系列 Tab 含 M5', chipsText.includes('M5'))

  // 8) 规格表：筛选、搜索、空状态、对比高亮
  await page.locator('#specs').scrollIntoViewIfNeeded()
  await page.waitForTimeout(400)
  const rowsBefore = await page.locator('#specs tbody tr').count()
  check('规格表全量 93 行', rowsBefore === 93, String(rowsBefore))
  await page.locator('#specs').getByRole('tab', { name: '仅 iPad' }).click()
  await page.waitForTimeout(300)
  const ipadRows = await page.locator('#specs tbody tr').count()
  check('仅 iPad 筛选 43 行', ipadRows === 43, String(ipadRows))
  const search = page.locator('#specs input[type="search"]')
  await search.fill('iPad mini 7')
  await page.waitForTimeout(300)
  const miniRows = await page.locator('#specs tbody tr').count()
  check('搜索 iPad mini 7 → 1 行', miniRows === 1, String(miniRows))
  await search.fill('zzzz-no-match')
  await page.waitForTimeout(300)
  const emptyText = await page.locator('#specs').innerText()
  check('空搜索显示空状态', emptyText.includes('没有匹配的机型'))
  await search.fill('')
  await page.locator('#specs').getByRole('tab', { name: '全部产品线' }).click()
  await page.waitForTimeout(300)
  const checkboxA = page.locator('#specs tbody tr').nth(0).locator('input[type="checkbox"]')
  const checkboxB = page.locator('#specs tbody tr').nth(1).locator('input[type="checkbox"]')
  await checkboxA.click()
  await checkboxB.click()
  await page.waitForTimeout(200)
  const compareText = await page.locator('#specs').innerText()
  check('勾选 2 行显示计数', compareText.includes('2 / 4'))
  const highlighted = await page.locator('#specs tr.shadow-\\[inset_3px_0_0_0_\\#0071e3\\]').count()
  check('选中行高亮', highlighted === 2, String(highlighted))

  // 9) 里程碑 whileInView 触发（滚动到第一张卡片本体）
  const firstArticle = page.locator('#milestones article').first()
  await firstArticle.scrollIntoViewIfNeeded()
  await page.waitForTimeout(1000)
  const firstArticleOpacity = await firstArticle.evaluate((el) => getComputedStyle(el).opacity)
  check('里程碑卡片进入视口后 opacity=1', Number(firstArticleOpacity) > 0.9, firstArticleOpacity)
  const articleCount = await page.locator('#milestones article').count()
  check('里程碑 9 张卡片', articleCount === 9, String(articleCount))

  // 10) 滚动高亮：滚到规格表后导航「规格」高亮
  await page.locator('#specs').scrollIntoViewIfNeeded()
  await page.waitForTimeout(800)
  const activeNav = await page.locator('header nav a[aria-current="true"]').innerText().catch(() => '')
  check('Navbar 当前段高亮', activeNav.trim() === '规格', activeNav)

  // 11) 移动端 375px：折叠导航 + 表格横向滚动 + 语言切换可及
  const mobile = await browser.newPage({ viewport: { width: 375, height: 812 } })
  mobile.on('pageerror', (error) => pageErrors.push(String(error)))
  await mobile.goto(BASE, { waitUntil: 'networkidle' })
  const menuButton = mobile.locator('header button[aria-expanded]')
  await menuButton.click()
  await mobile.waitForTimeout(250)
  const menuVisible = await mobile.locator('header > div').getByText('里程碑', { exact: true }).isVisible()
  check('移动端汉堡菜单展开', menuVisible)
  await menuButton.click()
  const langVisible = await mobile.getByRole('button', { name: 'EN', exact: true }).isVisible()
  check('移动端语言切换常驻可及', langVisible)
  const tableScroller = mobile.locator('#specs .overflow-x-auto')
  await tableScroller.scrollIntoViewIfNeeded()
  const scrollInfo = await tableScroller.evaluate((el) => ({ sw: el.scrollWidth, cw: el.clientWidth }))
  check('移动端表格横向可滚动', scrollInfo.sw > scrollInfo.cw, JSON.stringify(scrollInfo))
  await mobile.close()

  // 12) prefers-reduced-motion：位移被禁用（transform 保持 none）
  const reducePage = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  await reducePage.goto(BASE, { waitUntil: 'networkidle' })
  const gridCard = reducePage.locator('#gallery ul li').first()
  await gridCard.scrollIntoViewIfNeeded()
  await reducePage.waitForTimeout(700)
  const transform = await gridCard.evaluate((el) => getComputedStyle(el).transform)
  check('reduced-motion 下卡片无位移', transform === 'none', transform)
  await reducePage.close()

  // 13) console / page 错误
  check('无 console/page 错误', pageErrors.length === 0, pageErrors.slice(0, 3).join(' | '))
} finally {
  await browser.close()
}

const failed = results.filter((r) => !r.ok)
console.log(`\n==== ${results.length - failed.length}/${results.length} passed ====`)
if (failed.length > 0) process.exitCode = 1
