/* ============================================================
   weGAS Intelligence — data + helpers (Northwind e-commerce demo)
   ============================================================ */

/* number formatting */
const fmt = n => n.toLocaleString('en-US');
const zar = n => {
  const neg = n < 0;
  return (neg ? '-R' : 'R') + Math.abs(n).toLocaleString('en-US');
};
const pct = n => n + '%';

/* SVG icon set (inline, stroke=currentColor) */
const ICON = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>',
  bi: '<path d="M3 3v18h18"/><rect x="7" y="11" width="3" height="6"/><rect x="12" y="7" width="3" height="10"/><rect x="17" y="13" width="3" height="4"/>',
  contacts: '<circle cx="12" cy="8" r="4"/><path d="M5 21v-1a7 7 0 0 1 14 0v1"/>',
  segments: '<circle cx="12" cy="12" r="9"/><path d="M12 3v9l7 4"/>',
  campaigns: '<path d="m3 11 18-7-7 18-2.5-7.5z"/>',
  chevron: '<path d="m15 18-6-6 6-6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  bell: '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.5 21a1.8 1.8 0 0 1-3 0"/>',
  arrowDown: '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
  arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  sms: '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4L3 21l1.1-4.5A8.4 8.4 0 1 1 21 11.5Z"/>',
  whatsapp: '<path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.2-5.5A8.4 8.4 0 1 1 21 11.5Z"/><path d="M8.5 9c0 3 2.5 5.5 5.5 5.5"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5.5a3.5 3.5 0 0 1 0 7"/><path d="M18 20a6 6 0 0 0-3-5.2"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  trend: '<path d="m3 17 6-6 4 4 8-8"/><path d="M21 7h-5v5"/>',
  zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/>',
  pdf: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
  pin: '<path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>',
  cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>',
  money: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>',
  wallet: '<path d="M3 7a2 2 0 0 1 2-2h13v4"/><path d="M3 7v10a2 2 0 0 0 2 2h15V7Z"/><circle cx="17" cy="13" r="1.3"/>',
  download: '<path d="M12 3v12"/><path d="m7 11 5 4 5-4"/><path d="M5 21h14"/>',
  alert: '<path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/>',
  link: '<path d="M9 15 15 9"/><path d="M11 6.5 13 4.5a4 4 0 0 1 6 6l-2 2"/><path d="M13 17.5 11 19.5a4 4 0 0 1-6-6l2-2"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>',
  monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
  smartphone: '<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  branch: '<path d="M6 3v12"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
  filter: '<path d="M3 4h18l-7 9v6l-4 2v-8z"/>',
  send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
  coin: '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6"/><path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  shield: '<path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z"/><path d="m9 12 2 2 4-4"/>',
  cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.4 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L23 7H6"/>',
  bag: '<path d="M6 7V6a4 4 0 0 1 8 0v1M5 7h14l-1 13H6z" transform="translate(1 0)"/>',
  tag: '<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="8" cy="8" r="1.6"/>',
  box: '<path d="M3 7.5 12 3l9 4.5v9L12 21 3 16.5z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/>',
  star: '<path d="m12 3 2.7 6 6.3.5-4.8 4.1 1.5 6.4L12 16.8 6.3 20.5l1.5-6.4L3 9.5 9.3 9z"/>',
  repeat: '<path d="M17 2l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
  google: '<path d="M21 12.2c0-.6 0-1.2-.1-1.7H12v3.5h5a4.3 4.3 0 0 1-1.9 2.8v2.3h3a8.9 8.9 0 0 0 2.8-6.9z"/><path d="M12 21c2.4 0 4.5-.8 6-2.2l-3-2.3c-.8.6-1.9.9-3 .9-2.3 0-4.3-1.6-5-3.7H3.9v2.3A9 9 0 0 0 12 21z"/><path d="M7 13.7a5.4 5.4 0 0 1 0-3.4V8H3.9a9 9 0 0 0 0 8z"/><path d="M12 6.6c1.3 0 2.5.5 3.4 1.3l2.6-2.6A9 9 0 0 0 3.9 8L7 10.3c.7-2.1 2.7-3.7 5-3.7z"/>',
  meta: '<path d="M2 16c0-5 2.2-9 5-9 2 0 3.2 1.8 5 5 1.8-3.2 3-5 5-5 2.8 0 5 4 5 9"/>',
  funnel: '<path d="M3 4h18l-7 8v7l-4 2v-9z"/>',
  forecast: '<path d="m3 15 5-5 4 3 4-6 5 4"/><path d="M3 20h18"/>',
};
const svg = (k, cls='') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${ICON[k]||''}</svg>`;

/* shared segment list (marketing pills) */
const SEGMENTS = [
  'All Customers','First-Time Buyers','Repeat Buyers','VIP / High-Value',
  'Lapsed 30-90d','Win-Back','Cart Abandoners','Registered · Never Purchased',
  'Email Subscribers','SMS Opt-In','Discount-Driven'
];

/* 18-month timeline shared by charts */
const MONTHS18 = ['Jan 25','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan 26','Feb','Mar','Apr','May','Jun'];

const DATA = {
  months: MONTHS18,

  /* ---------- EXECUTIVE VIEW ---------- */
  exec: {
    headline: [
      { label:'Revenue · This Month', value:'R6,840,000', delta:'+8.2%', prev:'vs R6,320,000', up:true },
      { label:'Total Customers', value:'712,480', delta:'+2.7%', prev:'vs 693,560', up:true },
      { label:'Orders · This Month', value:'32,180', delta:'-3.1%', prev:'vs 33,210', up:false },
      { label:'Avg Order Value', value:'R213', delta:'+11.6%', prev:'vs R191', up:true },
      { label:'Conversion Rate', value:'2.74%', delta:'-0.18pts', prev:'vs 2.92%', up:false },
    ],
    revSeries: [3.9,4.1,4.0,4.3,4.6,4.4,4.8,5.0,5.3,5.1,5.7,6.2,5.4,5.8,6.1,6.4,6.32,6.84], // R millions
    trends: [
      { k:'Net Revenue · MTD', v:'R5,000,000', sub:'after refunds & discounts' },
      { k:'Refund Rate', v:'2.1%', sub:'down from 2.6%', up:true },
      { k:'New vs Returning', v:'34% / 66%', sub:'revenue split' },
    ],
    alerts: [
      { tone:'alert', t:'Cart abandonment up 4.2pts this week', s:'R1.84M in carts left at checkout — recovery flow not firing on mobile.' },
      { tone:'op', t:'VIP tier revenue +14% MoM', s:'Top 9% of customers now drive 58% of revenue. Protect this group.' },
      { tone:'alert', t:'Paid CAC climbing on Meta', s:'Cost per customer up to R148 — ROAS slipping below 3x on prospecting.' },
    ],
  },

  /* ---------- CUSTOMER GROWTH ---------- */
  growth: {
    cards: [
      { label:'Total Customers', value:'712,480', delta:'+2.7%', prev:'vs 693,560', up:true },
      { label:'New Customers · Month', value:'18,920', delta:'+14.3%', prev:'vs 16,550', up:true },
      { label:'Returning Customers · Month', value:'21,140', delta:'-5.4%', prev:'vs 22,350', up:false },
      { label:'Repeat Purchase Rate', value:'41.2%', delta:'+1.9pts', prev:'vs 39.3%', up:true },
    ],
    newSeries: [11200,11800,12300,11900,12900,13500,13100,14400,15000,14600,15900,13900,13200,15800,17200,18100,16550,18920],
    returningSeries: [9400,9900,10200,10600,11100,11800,12200,13000,13900,14400,15600,16200,15100,17800,19400,20600,22350,21140],
  },

  /* ---------- CUSTOMERS YOU'RE LOSING ---------- */
  churn: {
    cards: [
      { label:'30-Day Churn', value:'8,910', delta:'+6.1%', prev:'vs 8,398', up:false, tone:'red', note:'recently quiet · recoverable' },
      { label:'60-Day Churn', value:'5,240', delta:'-2.4%', prev:'vs 5,369', up:true, tone:'red' },
      { label:'90-Day Churn', value:'21,680', delta:'+1.2%', prev:'vs 21,420', up:false, tone:'red' },
      { label:'At-Risk Customers', value:'34,500', delta:'+3.8%', prev:'vs 33,240', up:false, tone:'red', note:'predicted to lapse in 30d' },
    ],
    churnSeries: [4.1,4.0,4.3,4.5,4.2,4.6,4.8,4.4,4.1,3.9,4.2,4.7,5.1,4.9,4.6,4.3,4.5,4.8], // % monthly churn
    reasons: [
      ['Price / found cheaper', 31],
      ['One-time gift purchase', 24],
      ['Product / fit issues', 18],
      ['Slow delivery', 14],
      ['No reason given', 13],
    ],
  },

  /* ---------- CUSTOMERS WAITING TO CONVERT ---------- */
  convert: {
    cards: [
      { label:'Registered · Never Purchased', value:'42,610', delta:'+9.4%', prev:'vs 38,950', up:true, note:'one nudge from first order' },
      { label:'Lead → Customer Rate', value:'18.6%', delta:'+1.3pts', prev:'vs 17.3%', up:true },
      { label:'Avg Time to First Purchase', value:'11.4 days', delta:'-1.8 days', prev:'vs 13.2 days', up:true },
      { label:'Browse-to-Cart Rate', value:'9.2%', delta:'-0.6pts', prev:'vs 9.8%', up:false },
    ],
    funnel: [
      ['Visited store', 100, 248600],
      ['Viewed product', 46.2, 114853],
      ['Added to cart', 12.8, 31821],
      ['Reached checkout', 6.1, 15165],
      ['Purchased', 2.74, 6812],
    ],
  },

  /* ---------- ABANDONED REVENUE ---------- */
  abandoned: {
    cards: [
      { label:'Abandoned Cart Value', value:'R1,840,000', delta:'+12.4%', prev:'vs R1,637,000', up:false, tone:'red' },
      { label:'Cart Recovery Rate', value:'18.3%', delta:'-2.1pts', prev:'vs 20.4%', up:false },
      { label:'Checkout Drop-Off', value:'55.1%', delta:'+1.9pts', prev:'vs 53.2%', up:false, tone:'red' },
      { label:'Recovered Revenue · Month', value:'R336,720', delta:'+4.0%', prev:'vs R323,800', up:true },
    ],
    products: [
      ['Aalto Linen Throw', 2840, 412000],
      ['Nordic Oak Side Table', 1920, 386000],
      ['Cera Ceramic Dinner Set', 3110, 298000],
      ['Wool Runner — Charcoal', 1680, 241000],
      ['Glasshouse Candle Trio', 4250, 198000],
      ['Terra Stoneware Mug ×4', 2960, 156000],
    ],
    dropoff: [
      ['Shipping cost shown', 38],
      ['Created account required', 21],
      ['Payment step', 17],
      ['Slow page / error', 13],
      ['Just browsing', 11],
    ],
  },

  /* ---------- YOUR MOST VALUABLE CUSTOMERS ---------- */
  value: {
    cards: [
      { label:'High-Value Customers', value:'64,120', delta:'+5.1%', prev:'vs 61,010', up:true, note:'9% of base · 58% of revenue' },
      { label:'Mid-Value Customers', value:'213,740', delta:'+1.8%', prev:'vs 209,960', up:true },
      { label:'Low-Value Customers', value:'434,620', delta:'-0.9%', prev:'vs 438,540', up:false },
      { label:'Avg Customer Lifetime Value', value:'R1,840', delta:'+7.3%', prev:'vs R1,715', up:true },
    ],
    tiers: [
      ['High-Value', 9, 58, 'var(--lime)'],
      ['Mid-Value', 30, 31, 'var(--teal)'],
      ['Low-Value', 61, 11, 'var(--grey)'],
    ],
    ltvBands: [
      ['R5,000+', 18200, 'var(--lime)'],
      ['R2,000–5,000', 45920, 'var(--teal)'],
      ['R500–2,000', 198400, '#9aa0ff'],
      ['Under R500', 449960, 'var(--grey)'],
    ],
  },

  /* ---------- MARKETING PERFORMANCE ---------- */
  marketing: {
    cards: [
      { label:'Blended ROAS', value:'4.8x', delta:'+0.4x', prev:'vs 4.4x', up:true },
      { label:'Revenue · Attributed', value:'R4,790,000', delta:'+9.1%', prev:'vs R4,390,000', up:true },
      { label:'Cost Per Acquisition', value:'R94', delta:'+8.0%', prev:'vs R87', up:false, tone:'red' },
      { label:'Email/SMS Conversion', value:'3.6%', delta:'+0.5pts', prev:'vs 3.1%', up:true },
    ],
    campaigns: [
      ['Win-Back · Lapsed VIP','WhatsApp','12,640','410','R1,180,000','11.2x'],
      ['Abandoned Cart Recovery','Email+SMS','41,220','1,310','R1,420,000','8.4x'],
      ['First-Order Nudge','Email','38,510','640','R890,000','5.1x'],
      ['Repeat-Buyer Rewards','Email','28,440','720','R760,000','4.6x'],
      ['Seasonal Sale Blast','Email','64,280','980','R540,000','3.2x'],
    ],
    byChannel: [
      ['Email', 1240000],['SMS', 980000],['WhatsApp', 640000],['Paid Search', 1130000],['Paid Social', 800000],
    ],
  },

  /* ---------- PAID MEDIA INTELLIGENCE ---------- */
  paid: {
    cards: [
      { label:'Total Ad Spend · Month', value:'R1,420,000', delta:'+6.4%', prev:'vs R1,335,000', up:false, tone:'red' },
      { label:'Blended ROAS', value:'3.4x', delta:'-0.3x', prev:'vs 3.7x', up:false, tone:'red' },
      { label:'Cost Per Lead', value:'R38', delta:'-4.2%', prev:'vs R40', up:true },
      { label:'Cost Per Customer', value:'R148', delta:'+9.6%', prev:'vs R135', up:false, tone:'red' },
    ],
    platforms: [
      { name:'Google Ads', icon:'google', spend:'R760,000', rev:'R3,040,000', roas:'4.0x', cpc:'R3.10', conv:'3.1%', up:true },
      { name:'Meta Ads', icon:'meta', spend:'R520,000', rev:'R1,460,000', roas:'2.8x', cpc:'R2.40', conv:'2.2%', up:false },
      { name:'Other / Affiliate', icon:'globe', spend:'R140,000', rev:'R590,000', roas:'4.2x', cpc:'R1.90', conv:'3.6%', up:true },
    ],
    roasSeries: { google:[3.6,3.7,3.8,3.9,4.1,4.0,4.2,4.1,4.0], meta:[3.4,3.3,3.2,3.1,3.0,2.9,2.9,2.8,2.8] },
    roasMonths: ['Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun'],
  },

  /* ---------- CUSTOMER SEGMENTATION (dashboard tab) ---------- */
  segTab: {
    frequency: [
      ['1 order', 449960],['2 orders', 142100],['3–5 orders', 84300],['6–10 orders', 24120],['10+ orders', 12000],
    ],
    geo: [
      ['South Africa',412800],['Mozambique',86400],['Botswana',41200],['Namibia',28600],
      ['Zimbabwe',19400],['Zambia',14800],['Lesotho',11200],['Other',98080],
    ],
    interest: [
      ['Home & Living', 34],['Apparel', 26],['Beauty', 18],['Electronics', 13],['Outdoor', 9],
    ],
    behaviour: [
      ['Full-price buyers', 38, 'var(--lime)'],
      ['Discount-driven', 34, '#F5B73D'],
      ['One-time gifters', 16, 'var(--teal)'],
      ['Window shoppers', 12, 'var(--grey)'],
    ],
  },

  /* ---------- RFM value tiers (shared: home + segments) ---------- */
  rfm: [
    ['Champions',9,58],['Loyal',21,24],['Potential',30,12],['At-Risk',24,5],['Dormant',16,1],
  ],

  /* ---------- CUSTOMER PROFILE (AMS) ---------- */
  contact: {
    name:'Naledi Khumalo',
    initials:'NK',
    info: [
      ['Customer ID','NW-88241600'],['Account Status','Active','lime'],['Registered','2024-05-20'],
      ['First Order','2024-06-02'],['Email','naledi.k@example.com'],['Email Verified','Yes','lime'],
      ['Marketing Opt-In','Email · SMS','lime'],['Default Currency','ZAR'],
      ['Last Order','Jun 4 2026'],['Country','ZA'],['Last Active','Jun 5 2026'],['Preferred Category','Home & Living'],
    ],
    zar: [['Total Spend · AllTime','18,420'],['Total Spend · 24 months','9,640'],['Total Spend · 12 months','6,210']],
    segments: ['VIP / High-Value','Repeat Buyers','Email Subscribers','SMS Opt-In','Home & Living','Win-Back · recovered','Full-price buyer','Loyalty · Gold'],
    engagement: [22,28,31,40,38,52,61,70,84,96,108,120,118,134,150,168,176,182],
    history: [
      { icon:'dep', t:'Order NW-88241 placed', s:'3 items · R1,240 · Home & Living', time:'Jun 5 · 14:20' },
      { icon:'seg', t:'Added to segment: VIP / High-Value', s:'Segmentation engine', time:'Jun 5 · 09:02' },
      { icon:'email', t:'Repeat-Buyer Rewards · Email opened', s:'Email · opened 2× · 1 click', time:'Jun 4 · 18:44' },
      { icon:'email', t:'Repeat-Buyer Rewards · Email sent', s:'Lifecycle journey · rewards', time:'Jun 4 · 08:00' },
      { icon:'dep', t:'Refund processed · order NW-88102', s:'1 item returned · R320', time:'Jun 2 · 11:30' },
      { icon:'seg', t:'Added to campaign: Abandoned Cart Recovery', s:'Campaign orchestration', time:'Jun 1 · 16:10' },
      { icon:'wa', t:'WhatsApp delivered · VIP early access', s:'WhatsApp · read · 1 reply', time:'May 30 · 13:05' },
    ],
  },
};
