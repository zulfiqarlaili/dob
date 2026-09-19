import { AnalysisResponse } from './metaphysic';
import { StarChartData } from './chart';
import { displayDob } from './dob';
import { drawStarChartToCanvas } from '@/components/StarChart';

function linesFor(
  context: CanvasRenderingContext2D,
  text: string,
  width: number
) {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (context.measureText(next).width > width && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

/** Measure the text before sizing the canvas so long readings never overlap the footer. */
export function createReadingCard(
  analysis: AnalysisResponse,
  chart: StarChartData
) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas is unavailable');
  canvas.width = 1080;
  const blocks = [
    {
      text: analysis.personal_reading.headline,
      font: '400 48px Georgia, serif',
      color: '#f3eee6',
      lineHeight: 60,
      gap: 24,
    },
    {
      text: analysis.personal_reading.summary,
      font: '400 30px Arial, sans-serif',
      color: '#b3bbcb',
      lineHeight: 46,
      gap: 40,
    },
    {
      text: 'ONE SMALL STEP TO TRY',
      font: '600 23px Arial, sans-serif',
      color: '#dfc397',
      lineHeight: 34,
      gap: 16,
    },
    {
      text: analysis.personal_reading.today,
      font: '400 32px Arial, sans-serif',
      color: '#f3eee6',
      lineHeight: 46,
      gap: 36,
    },
  ].map((block) => {
    context.font = block.font;
    return { ...block, lines: linesFor(context, block.text, 888) };
  });
  const textHeight = blocks.reduce(
    (height, block) =>
      height + block.lines.length * block.lineHeight + block.gap,
    0
  );
  canvas.height = Math.max(1920, 500 + textHeight + 690 + 140);
  const gradient = context.createLinearGradient(0, 0, 1080, canvas.height);
  gradient.addColorStop(0, '#1b2539');
  gradient.addColorStop(1, '#0b1221');
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = '#dfc39755';
  context.strokeRect(36, 36, 1008, canvas.height - 72);
  for (let index = 0; index < 35; index++) {
    context.fillStyle = index % 2 ? '#c5b4ed55' : '#dfc39755';
    context.beginPath();
    context.arc(
      60 + ((index * 137) % 960),
      60 + ((index * 271) % (canvas.height - 120)),
      1.5,
      0,
      Math.PI * 2
    );
    context.fill();
  }
  context.textAlign = 'center';
  context.fillStyle = '#dfc397';
  context.font = '500 28px Arial, sans-serif';
  context.fillText('B O R N D A T E', 540, 110);
  context.fillStyle = '#b3bbcb';
  context.font = '400 27px Arial, sans-serif';
  context.fillText(displayDob(analysis.dob), 540, 172);
  context.font = '400 23px Arial, sans-serif';
  context.fillText('YOUR ELEMENT', 540, 263);
  context.fillStyle = '#f3eee6';
  context.font = '400 104px Georgia, serif';
  context.fillText(
    analysis.dominant_elements[0]?.name || analysis.core_numbers.spirit.element,
    540,
    377
  );
  context.strokeStyle = '#dfc39755';
  context.beginPath();
  context.moveTo(96, 427);
  context.lineTo(984, 427);
  context.stroke();
  context.textAlign = 'left';
  let y = 500;
  for (const block of blocks) {
    context.font = block.font;
    context.fillStyle = block.color;
    for (const line of block.lines) {
      context.fillText(line, 96, y);
      y += block.lineHeight;
    }
    y += block.gap;
  }
  drawStarChartToCanvas(context, chart, 240, y, 1.2);
  context.textAlign = 'center';
  context.fillStyle = '#b3bbcb';
  context.font = '400 25px Arial, sans-serif';
  context.fillText(
    'A little wonder. A little self-discovery.',
    540,
    canvas.height - 104
  );
  context.fillStyle = '#dfc397';
  context.font = '500 25px Arial, sans-serif';
  context.fillText('borndate.web.app', 540, canvas.height - 65);
  return canvas;
}

export function downloadReadingCard(
  analysis: AnalysisResponse,
  chart: StarChartData
) {
  const link = document.createElement('a');
  link.download = `borndate-${analysis.dob}.png`;
  link.href = createReadingCard(analysis, chart).toDataURL('image/png');
  link.click();
}
