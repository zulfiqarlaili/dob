import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { StarChartData, calculateElementCounts, getElementCSSColor } from '@/lib/chart';

type StarChartProps = { data: StarChartData; animate?: boolean };

/* ─── Symmetric Star of David geometry ─── */
const CX = 250, CY = 190, R = 158;
const S60 = Math.sin(Math.PI / 3); // 0.866
const C60 = Math.cos(Math.PI / 3); // 0.5

// Upper triangle (pointing up)
const U_TOP = { x: CX, y: CY - R };                         // (250, 32)
const U_BL = { x: CX - R * S60, y: CY + R * C60 };         // (113, 269)
const U_BR = { x: CX + R * S60, y: CY + R * C60 };         // (387, 269)

// Lower triangle (pointing down)
const D_BOT = { x: CX, y: CY + R };                          // (250, 348)
const D_TL = { x: CX - R * S60, y: CY - R * C60 };         // (113, 111)
const D_TR = { x: CX + R * S60, y: CY - R * C60 };         // (387, 111)

const triD = (a: { x: number, y: number }, b: { x: number, y: number }, c: { x: number, y: number }) =>
  `M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b.x.toFixed(1)} ${b.y.toFixed(1)}L${c.x.toFixed(1)} ${c.y.toFixed(1)}Z`;

// Inner hexagon vertices (where triangles intersect)
const H_TL = { x: CX - R * S60 / 3, y: CY - R * C60 };     // (204, 111)
const H_TR = { x: CX + R * S60 / 3, y: CY - R * C60 };     // (296, 111)
const H_R = { x: CX + R * S60 * 2 / 3, y: CY };              // (341, 190)
const H_BR = { x: CX + R * S60 / 3, y: CY + R * C60 };     // (296, 269)
const H_BL = { x: CX - R * S60 / 3, y: CY + R * C60 };     // (204, 269)
const H_L = { x: CX - R * S60 * 2 / 3, y: CY };              // (159, 190)

/* ─── Grid lines inside the hexagonal center ───
 * Matches the original template: 1 horizontal center + 2 vertical dividers
 * creating 4 cells in each row, plus hex boundary lines
 */
const GRID: [number, number, number, number][] = [
  // 1 horizontal + 1 vertical = 4 sections
  [H_L.x, CY, H_R.x, CY],             // horizontal center line
  [CX, H_TL.y, CX, H_BL.y],           // vertical center line
];

/* ─── Number positions ───
 * Scaled from original backend pixel coordinates (center ~250,190)
 * to match the symmetric star geometry.
 *
 * Original backend layout:
 *   s[0](145,128) s[1](212,142) | s[2](285,142) s[3](350,126)   ← top row
 *   s[8](101,165)               |               s[12](395,165)  ← wings upper
 *   s[7](101,210)               |               s[11](395,210)  ← wings lower
 *   s[6](145,245) s[5](210,220) | s[9](285,220) s[10](350,245)  ← bottom row
 */

// Scale factor: my star half-width / original star half-width
const SX = (R * S60) / 182;   // ~0.75
const SY = R / 158;           // ~1.0

function mapPos(origX: number, origY: number) {
  return { x: CX + (origX - 250) * SX, y: CY + (origY - 190) * SY };
}


const POS = [
  mapPos(125, 135),   // [0]  top row outer-left (high)
  mapPos(212, 152),   // [1]  top row inner-left (low)
  mapPos(285, 152),   // [2]  top row inner-right (low)
  mapPos(370, 135),   // [3]  top row outer-right (high) — mirrored from [0]
  mapPos(250, 85),    // [4]  Spirit (circled, top tip)
  mapPos(212, 222),   // [5]  bot row inner-left (high)
  mapPos(125, 245),   // [6]  bot row outer-left (low)
  mapPos(60, 212),    // [7]  left wing lower
  mapPos(60, 168),    // [8]  left wing upper
  mapPos(285, 222),   // [9]  bot row inner-right (high)
  mapPos(370, 245),   // [10] bot row outer-right (low)
  mapPos(430, 212),   // [11] right wing lower — mirrored from [7]
  mapPos(430, 168),   // [12] right wing upper — mirrored from [8]
  mapPos(250, 295),   // [13] Physical (circled, bottom tip)
  mapPos(180, 340),   // [14] below star left
  mapPos(320, 340),   // [15] below star right
  mapPos(250, 390),   // [16] Ending (circled, very bottom)
];

const CORE = [4, 13, 16];
const LABELS: Record<number, string> = { 4: 'Spirit', 13: 'Physical', 16: 'Ending' };
const HEX_DOTS = [H_TL, H_TR, H_R, H_BR, H_BL, H_L];

/* ─── Component ─── */
export default function StarChart({ data, animate = true }: StarChartProps) {
  const { numbers } = data;
  const elCounts = useMemo(() => calculateElementCounts(numbers), [numbers]);

  return (
    <div className='star-chart-wrapper'>
      <svg viewBox='0 0 500 570' className='star-chart-svg' role='img' aria-label='Numerology chart'>
        <defs>
          <filter id='sg' x='-30%' y='-30%' width='160%' height='160%'>
            <feGaussianBlur in='SourceGraphic' stdDeviation='3' result='b' />
            <feMerge><feMergeNode in='b' /><feMergeNode in='SourceGraphic' /></feMerge>
          </filter>
          <filter id='ng' x='-40%' y='-40%' width='180%' height='180%'>
            <feGaussianBlur in='SourceGraphic' stdDeviation='1.5' result='b' />
            <feMerge><feMergeNode in='b' /><feMergeNode in='SourceGraphic' /></feMerge>
          </filter>
          <filter id='bg' x='-50%' y='-50%' width='200%' height='200%'>
            <feGaussianBlur in='SourceGraphic' stdDeviation='5' result='b' />
            <feMerge><feMergeNode in='b' /><feMergeNode in='SourceGraphic' /></feMerge>
          </filter>
          <radialGradient id='amb' cx='50%' cy='38%' r='50%'>
            <stop offset='0%' stopColor='rgba(168,85,247,0.07)' />
            <stop offset='100%' stopColor='transparent' />
          </radialGradient>
        </defs>

        <rect width='500' height='570' fill='url(#amb)' />

        {/* Star triangles */}
        <g filter='url(#sg)'>
          <path d={triD(U_TOP, U_BL, U_BR)} fill='none' stroke='rgba(168,85,247,0.4)' strokeWidth='2.5' strokeLinejoin='round' />
          <path d={triD(D_BOT, D_TL, D_TR)} fill='none' stroke='rgba(168,85,247,0.4)' strokeWidth='2.5' strokeLinejoin='round' />
        </g>

        {/* Grid lines inside hex */}
        <g opacity='0.4' stroke='rgba(168,85,247,0.7)' strokeWidth='0.75'>
          {GRID.map(([x1, y1, x2, y2], i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />)}
        </g>

        {/* Hex vertex dots */}
        {HEX_DOTS.map((d, i) => <circle key={`h${i}`} cx={d.x} cy={d.y} r='2.5' fill='rgba(168,85,247,0.35)' />)}

        {/* Numbers */}
        <g filter='url(#ng)'>
          {numbers.map((num, i) => {
            const p = POS[i];
            const isCore = CORE.includes(i);
            const color = getElementCSSColor(num);
            const delay = animate ? 0.2 + i * 0.05 : 0;
            return (
              <motion.g key={i}
                initial={animate ? { opacity: 0, scale: 0.3 } : false}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, delay, ease: 'easeOut' }}
              >
                {isCore && (
                  <>
                    <circle cx={p.x} cy={p.y} r='24' fill='rgba(168,85,247,0.06)'
                      stroke={color} strokeWidth='1.5' filter='url(#bg)' opacity='0.9' />
                    <text x={p.x + 30} y={p.y + 2} fill='rgba(148,163,184,0.55)'
                      fontSize='13' fontFamily='Inter,system-ui,sans-serif' fontWeight='500'
                      dominantBaseline='central'>{LABELS[i]}</text>
                  </>
                )}
                <text x={p.x} y={p.y} textAnchor='middle' dominantBaseline='central'
                  fill={color} fontSize={isCore ? '32' : '30'}
                  fontFamily='"Space Grotesk",Inter,system-ui,sans-serif' fontWeight='700'>
                  {num}
                </text>
              </motion.g>
            );
          })}
        </g>

        {/* Element Legend — dynamic, with counts */}
        <g transform='translate(-20, 0)'>
          {elCounts.map((el, i) => {
            const y = 400 + i * 30;
            const barW = Math.max(el.count * 12, 16);
            return (
              <motion.g key={el.name}
                initial={animate ? { opacity: 0, x: -12 } : false}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: animate ? 1 + i * 0.08 : 0 }}
              >
                <circle cx='35' cy={y} r='8' fill={el.color} />
                <text x='52' y={y + 1} fill='rgba(241,245,249,0.85)' fontSize='15'
                  fontFamily='Inter,system-ui,sans-serif' fontWeight='600'
                  dominantBaseline='central'>{el.name}</text>
                <rect x='120' y={y - 8} width={barW} height='16' rx='8'
                  fill={el.color} opacity='0.3' />
                <text x={124 + barW + 8} y={y + 1} fill={el.color} fontSize='15'
                  fontFamily='Inter,system-ui,sans-serif' fontWeight='700'
                  dominantBaseline='central'>{el.count}</text>
              </motion.g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

/* ─── Canvas renderer for download card ─── */
export function drawStarChartToCanvas(
  ctx: CanvasRenderingContext2D, data: StarChartData,
  offsetX: number, offsetY: number, scale: number,
): void {
  const { numbers } = data;
  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);

  const drawTri = (a: { x: number, y: number }, b: { x: number, y: number }, c: { x: number, y: number }) => {
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.closePath(); ctx.stroke();
  };

  ctx.strokeStyle = 'rgba(168,85,247,0.4)'; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
  drawTri(U_TOP, U_BL, U_BR);
  drawTri(D_BOT, D_TL, D_TR);

  ctx.strokeStyle = 'rgba(168,85,247,0.14)'; ctx.lineWidth = 0.75;
  for (const [x1, y1, x2, y2] of GRID) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }

  ctx.fillStyle = 'rgba(168,85,247,0.35)';
  for (const d of HEX_DOTS) { ctx.beginPath(); ctx.arc(d.x, d.y, 2.5, 0, Math.PI * 2); ctx.fill(); }

  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  numbers.forEach((num, i) => {
    const p = POS[i]; const isCore = CORE.includes(i); const color = getElementCSSColor(num);
    if (isCore) {
      ctx.beginPath(); ctx.arc(p.x, p.y, 24, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(168,85,247,0.06)'; ctx.fill();
      ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke();
      if (LABELS[i]) {
        ctx.fillStyle = 'rgba(148,163,184,0.55)'; ctx.font = '500 13px Inter,sans-serif';
        ctx.textAlign = 'left'; ctx.fillText(LABELS[i], p.x + 30, p.y + 2); ctx.textAlign = 'center';
      }
    }
    ctx.fillStyle = color; ctx.font = `700 ${isCore ? 24 : 22}px "Space Grotesk",Inter,sans-serif`;
    ctx.fillText(String(num), p.x, p.y);
  });

  const counts = calculateElementCounts(numbers);
  counts.forEach((el, i) => {
    const y = 450 + i * 30;
    ctx.beginPath(); ctx.arc(35, y, 8, 0, Math.PI * 2); ctx.fillStyle = el.color; ctx.fill();
    ctx.fillStyle = 'rgba(241,245,249,0.85)'; ctx.font = '600 15px Inter,sans-serif';
    ctx.textAlign = 'left'; ctx.fillText(el.name, 52, y + 1);
    ctx.fillStyle = el.color; ctx.font = '700 15px Inter,sans-serif';
    ctx.fillText(`× ${el.count}`, 120, y + 1); ctx.textAlign = 'center';
  });

  ctx.restore();
}
