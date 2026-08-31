import type { Milestone } from '@/types/device'

/**
 * 里程碑机型（9 个）：绑定 Device.id。说明文字全部自撰短句（勿抄官网）。
 * tone 用于「深色 / 浅色」交替展示。
 */
export const milestones: Milestone[] = [
  {
    deviceId: 'iphone-original',
    year: 2007,
    tone: 'dark',
    title: { zh: '初代 iPhone：一切的起点', en: 'The original iPhone' },
    text: {
      zh: '2007 年，一块 3.5 英寸触摸屏取代了实体键盘，手机的形态从此分成了「之前」和「之后」。',
      en: 'In 2007 one 3.5-inch touchscreen replaced the keypad — phones became "before" and "after".',
    },
    specs: [
      { zh: '3.5 英寸 480×320 触摸屏', en: '3.5-inch 480×320 touchscreen' },
      { zh: '200 万像素后置相机', en: '2MP rear camera' },
      { zh: '起售价 $499（4GB）', en: 'From $499 (4GB)' },
      { zh: '运行 OS X 系统内核', en: 'Ran an OS X-derived system' },
    ],
  },
  {
    deviceId: 'iphone-4',
    year: 2010,
    tone: 'light',
    title: { zh: 'iPhone 4：Retina 与视频通话', en: 'iPhone 4: Retina and FaceTime' },
    text: {
      zh: '326 ppi 让像素在肉眼面前消失，前置摄像头把视频通话变成日常，工业设计也在此登顶。',
      en: '326 ppi made pixels invisible; a front camera made video calls normal. Design peaked here.',
    },
    specs: [
      { zh: '3.5 英寸 Retina 屏（960×640）', en: '3.5-inch Retina (960×640)' },
      { zh: '首次搭载自研 A4 芯片', en: 'First Apple-designed A4 chip' },
      { zh: '500 万相机 + FaceTime', en: '5MP camera + FaceTime' },
      { zh: '玻璃与不锈钢结构', en: 'Glass and stainless steel build' },
    ],
  },
  {
    deviceId: 'iphone-6-plus',
    year: 2014,
    tone: 'dark',
    title: { zh: 'iPhone 6 / 6 Plus：大屏转折点', en: 'iPhone 6 / 6 Plus: the big-screen turn' },
    text: {
      zh: '4.7 与 5.5 英寸承认了世界想要更大的屏幕，Apple Pay 则把 NFC 带进主流，历代最畅销的一代。',
      en: '4.7 and 5.5 inches conceded what the world wanted, and Apple Pay mainstreamed NFC. The best-selling generation ever.',
    },
    specs: [
      { zh: '4.7 / 5.5 英寸两种尺寸', en: 'Two sizes: 4.7 / 5.5 inches' },
      { zh: 'Apple Pay 与 NFC 首次搭载', en: 'First NFC, first Apple Pay' },
      { zh: '64 位 A8 芯片', en: '64-bit A8 chip' },
      { zh: '首销周末销量纪录', en: 'Record launch-weekend sales' },
    ],
  },
  {
    deviceId: 'iphone-x',
    year: 2017,
    tone: 'light',
    title: { zh: 'iPhone X：全面屏十年之约', en: 'iPhone X: the ten-year reset' },
    text: {
      zh: '为十周年而生的 X 取消 Home 键，用 Face ID 和手势操作定义了此后所有 iPhone 的交互模板。',
      en: 'The tenth-anniversary X dropped the Home button; Face ID and gestures became the template for everything after.',
    },
    specs: [
      { zh: '5.8 英寸 OLED 全面屏', en: '5.8-inch OLED all-screen' },
      { zh: 'Face ID 原深感系统', en: 'Face ID TrueDepth system' },
      { zh: '手势导航取代 Home 键', en: 'Gestures replaced the Home button' },
      { zh: '首售价 $999 的新锚点', en: 'A new $999 anchor price' },
    ],
  },
  {
    deviceId: 'iphone-12',
    year: 2020,
    tone: 'dark',
    title: { zh: 'iPhone 12：5G 与 MagSafe', en: 'iPhone 12: 5G and MagSafe' },
    text: {
      zh: '直角边框回归，5G 全面铺开，磁吸的 MagSafe 让配件生态重新洗牌——当代设计的直接祖先。',
      en: 'Flat edges returned, 5G went mainstream, and magnetic MagSafe reshuffled accessories — the direct ancestor of today\'s design.',
    },
    specs: [
      { zh: '首款 5G iPhone', en: 'First 5G iPhone' },
      { zh: 'MagSafe 磁吸配件系统', en: 'MagSafe accessory system' },
      { zh: 'A14 芯片（5nm）', en: 'A14 chip on 5nm' },
      { zh: '超视网膜 XDR OLED', en: 'Super Retina XDR OLED' },
    ],
  },
  {
    deviceId: 'iphone-17-pro-max',
    year: 2025,
    tone: 'light',
    title: { zh: 'iPhone 17 Pro Max：当代旗舰', en: 'iPhone 17 Pro Max: the current flagship' },
    text: {
      zh: '一体式铝金属机身、12GB 内存与 8x 光学变焦，A19 Pro 把散热与续航一起推到当前最高点。',
      en: 'Unibody aluminum, 12GB of memory, 8x optical zoom — A19 Pro pushes thermals and battery to the current ceiling.',
    },
    specs: [
      { zh: '6.9 英寸 120Hz ProMotion', en: '6.9-inch ProMotion 120Hz' },
      { zh: 'A19 Pro + 12GB 内存', en: 'A19 Pro + 12GB RAM' },
      { zh: '4800 万三摄 + 8x 长焦', en: '48MP triple + 8x telephoto' },
      { zh: '起售价 $1,199', en: 'From $1,199' },
    ],
  },
  {
    deviceId: 'ipad-1',
    year: 2010,
    tone: 'dark',
    title: { zh: '初代 iPad：第三类设备', en: 'The original iPad: a third category' },
    text: {
      zh: '2010 年之前「平板」只是概念；初代 iPad 用 9.7 英寸触屏和一整天的续航把它变成了产品品类。',
      en: 'Before 2010 "tablet" was a concept; the original iPad turned it into a category overnight.',
    },
    specs: [
      { zh: '9.7 英寸 1024×768', en: '9.7-inch 1024×768' },
      { zh: 'A4 芯片，最多 10 小时续航', en: 'A4 chip, up to 10 hours' },
      { zh: '起售价 $499', en: 'From $499' },
      { zh: '首发 90 天卖出 300 万台', en: '3 million sold in 90 days' },
    ],
  },
  {
    deviceId: 'ipad-pro-129-1',
    year: 2015,
    tone: 'light',
    title: { zh: 'iPad Pro：生产力宣言', en: 'iPad Pro: the productivity claim' },
    text: {
      zh: '12.9 英寸大屏、Apple Pencil 与 Smart Keyboard 同场亮相，iPad 第一次正面瞄准笔记本的工作。',
      en: 'A 12.9-inch canvas with Apple Pencil and Smart Keyboard — the iPad took aim at laptop work for the first time.',
    },
    specs: [
      { zh: '12.9 英寸 2732×2048', en: '12.9-inch 2732×2048' },
      { zh: 'A9X 桌面级性能', en: 'Desktop-class A9X' },
      { zh: 'Apple Pencil（一代）', en: 'Apple Pencil (1st gen)' },
      { zh: '四扬声器系统', en: 'Four-speaker audio' },
    ],
  },
  {
    deviceId: 'ipad-pro-13-m4',
    year: 2024,
    tone: 'dark',
    title: { zh: 'iPad Pro (M4)：Tandem OLED 时代', en: 'iPad Pro (M4): the Tandem OLED era' },
    text: {
      zh: 'M 系列芯片与 OLED 大屏合体，5.3 毫米的机身比初代 iPod nano 还薄，成为「M 系列 Pro」的当代代表。',
      en: 'M-series silicon plus Tandem OLED in 5.3mm — thinner than the original iPod nano and the modern face of "M-series Pro".',
    },
    specs: [
      { zh: 'Tandem OLED 液态视网膜 XDR', en: 'Tandem OLED Liquid Retina XDR' },
      { zh: 'M4 芯片（3nm）', en: 'M4 chip on 3nm' },
      { zh: '5.3 毫米史上最薄', en: '5.3mm, thinnest Apple device' },
      { zh: '起售价 $1,299（13 英寸）', en: 'From $1,299 (13-inch)' },
    ],
  },
]
