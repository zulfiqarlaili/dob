import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AnalysisResponse,
  ChartExplanation,
  buildAnalysisResponse,
  checkDob,
} from '@/lib/metaphysic';
import { StarChartData, computeStarArray } from '@/lib/chart';
import { displayDob, encodeDob } from '@/lib/dob';
import { SavedReading, saveReading } from '@/lib/storage';
import ElementBadge, { getElementColor, getElementEmoji } from './ElementBadge';
import ShareButtons from './ShareButtons';
import StarChart, { drawStarChartToCanvas } from './StarChart';

type ResultExperienceProps = {
  dob: string;
  onSaved?: (readings: SavedReading[]) => void;
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  words.forEach((word) => {
    const testLine = `${line}${word} `;
    if (context.measureText(testLine).width > maxWidth && line) {
      context.fillText(line, x, currentY);
      line = `${word} `;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  });

  context.fillText(line, x, currentY);
  return currentY + lineHeight;
}

export default function ResultExperience({ dob, onSaved }: ResultExperienceProps) {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [activeExplanation, setActiveExplanation] = useState<ChartExplanation | null>(null);
  const [error, setError] = useState('');
  const [copyStatus, setCopyStatus] = useState('');

  // Compute chart data locally (no backend image needed)
  const chartData = useMemo<StarChartData | null>(() => {
    if (!dob || dob.length !== 8) return null;
    return computeStarArray(dob);
  }, [dob]);

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/result?d=${encodeDob(dob)}`;
  }, [dob]);

  const shareText = useMemo(() => {
    if (!analysis) return '';
    const element = analysis.dominant_elements[0]?.name || 'Unknown';
    return `I just discovered my birth code! My element is ${element} ${getElementEmoji(element)} Discover yours →`;
  }, [analysis]);

  useEffect(() => {
    if (!checkDob(dob)) {
      setError('Unable to load your reading.');
      return;
    }

    try {
      const analysisJson = buildAnalysisResponse(dob);
      setAnalysis(analysisJson);
      setActiveExplanation(analysisJson.chart_explanations[0] || null);
      onSaved?.(saveReading(analysisJson));
    } catch (analysisError) {
      setError(analysisError instanceof Error ? analysisError.message : 'Unable to load your reading.');
    }
  }, [dob, onSaved]);

  async function copyShareLink() {
    if (!shareUrl) return;

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus(''), 2500);
    } else {
      setCopyStatus(shareUrl);
    }
  }

  function downloadCard() {
    if (!analysis || !chartData) return;

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Dark cosmic background
    const bgGrad = context.createLinearGradient(0, 0, 0, 1920);
    bgGrad.addColorStop(0, '#0a0a1a');
    bgGrad.addColorStop(0.5, '#161638');
    bgGrad.addColorStop(1, '#0a0a1a');
    context.fillStyle = bgGrad;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle purple glow at top
    const glowGrad = context.createRadialGradient(540, 200, 0, 540, 200, 500);
    glowGrad.addColorStop(0, 'rgba(168, 85, 247, 0.12)');
    glowGrad.addColorStop(1, 'transparent');
    context.fillStyle = glowGrad;
    context.fillRect(0, 0, 1080, 600);

    // Header
    context.fillStyle = '#f1f5f9';
    context.font = '700 52px Arial, sans-serif';
    context.textAlign = 'center';
    context.fillText('My Birth Code Reading', 540, 110);

    // Date
    context.font = '400 32px Arial, sans-serif';
    context.fillStyle = '#94a3b8';
    context.fillText(displayDob(analysis.dob), 540, 165);

    // Draw the star chart to canvas (replaces backend image)
    drawStarChartToCanvas(context, chartData, 140, 200, 1.6);

    // Element name
    const element = analysis.dominant_elements[0]?.name || 'Unknown';
    const emoji = getElementEmoji(element);
    context.font = '700 56px Arial, sans-serif';
    context.fillStyle = '#f1f5f9';
    context.textAlign = 'center';
    context.fillText(`${emoji} ${element}`, 540, 1110);

    // Personality
    if (analysis.dominant_elements[0]?.personality) {
      context.font = '400 28px Arial, sans-serif';
      context.fillStyle = '#94a3b8';
      wrapText(context, analysis.dominant_elements[0].personality, 540, 1160, 800, 38);
    }

    // Personal reading headline
    context.textAlign = 'left';
    context.font = '700 36px Arial, sans-serif';
    context.fillStyle = '#f1f5f9';
    wrapText(context, analysis.personal_reading.headline, 80, 1280, 920, 46);

    // Summary
    context.font = '400 28px Arial, sans-serif';
    context.fillStyle = '#94a3b8';
    const nextY = wrapText(context, analysis.personal_reading.summary, 80, 1360, 920, 40);

    // Weekly insight
    const insightGrad = context.createLinearGradient(0, 0, 1080, 0);
    insightGrad.addColorStop(0, '#a855f7');
    insightGrad.addColorStop(1, '#ec4899');
    context.fillStyle = insightGrad;
    context.font = '600 28px Arial, sans-serif';
    wrapText(context, analysis.weekly_insight.message, 80, nextY + 40, 920, 40);

    // Branding
    context.textAlign = 'center';
    context.font = '700 28px Arial, sans-serif';
    context.fillStyle = '#64748b';
    context.fillText('borndate.web.app', 540, 1840);

    // Download
    const link = document.createElement('a');
    link.download = `borndate-${analysis.dob}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  if (error) {
    return (
      <div className='glass-card' style={{ textAlign: 'center' }}>
        <p style={{ color: '#ef4444', fontWeight: 600 }}>{error}</p>
      </div>
    );
  }

  if (!analysis) return null;

  const primaryElement = analysis.dominant_elements[0];

  return (
    <motion.div
      variants={stagger}
      initial='hidden'
      animate='show'
    >
      {/* Section: Your Result Header */}
      <motion.div variants={fadeUp} className='section' style={{ textAlign: 'center' }}>
        <h2 className='heading-lg'>Your Result</h2>
        <p className='text-secondary'>{displayDob(analysis.dob)}</p>
      </motion.div>

      {/* Section: Chart (rendered in frontend) */}
      {chartData && (
        <motion.div variants={fadeUp} className='section'>
          <StarChart data={chartData} />
        </motion.div>
      )}

      {/* Section: Share Buttons */}
      <motion.div variants={fadeUp} className='section'>
        <ShareButtons
          shareUrl={shareUrl}
          shareText={shareText}
          elementName={primaryElement?.name}
          copyStatus={copyStatus}
          onCopy={copyShareLink}
          onDownload={downloadCard}
        />
      </motion.div>

      {/* Section: Dominant Element Highlight */}
      {primaryElement && (
        <motion.div variants={fadeUp} className='section'>
          <div
            className='glass-card'
            style={{
              textAlign: 'center',
              borderColor: getElementColor(primaryElement.name),
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            <p style={{ fontSize: '2.5rem', marginBottom: 8 }}>
              {getElementEmoji(primaryElement.name)}
            </p>
            <h3
              className='heading-md'
              style={{ color: getElementColor(primaryElement.name), marginBottom: 4 }}
            >
              {primaryElement.name}
            </h3>
            <ElementBadge name={primaryElement.name} count={primaryElement.count} />
            <p
              className='text-secondary'
              style={{ marginTop: 12, maxWidth: 400, margin: '12px auto 0' }}
            >
              {primaryElement.personality}
            </p>
          </div>
        </motion.div>
      )}

      {/* Section: About You (Personal Reading) */}
      <motion.div variants={fadeUp} className='section'>
        <div className='section-header'>
          <h3 className='section-title'>About You</h3>
        </div>
        <div className='glass-card'>
          <p style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: 8 }}>
            {analysis.personal_reading.headline}
          </p>
          <p className='text-secondary' style={{ marginBottom: 16 }}>
            {analysis.personal_reading.summary}
          </p>
          <div className='callout'>
            <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 4 }}>
              Practical focus
            </p>
            <p className='text-secondary' style={{ fontSize: '0.875rem' }}>
              {analysis.personal_reading.today}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Section: Understand Your Chart */}
      <motion.div variants={fadeUp} className='section'>
        <div className='section-header'>
          <h3 className='section-title'>Understand Your Chart</h3>
        </div>
        <div className='tab-pills'>
          {analysis.chart_explanations.map((item) => (
            <button
              key={item.key}
              className={`tab-pill ${activeExplanation?.key === item.key ? 'tab-pill--active' : ''}`}
              onClick={() => setActiveExplanation(item)}
            >
              {item.title}
            </button>
          ))}
        </div>
        <AnimatePresence mode='wait'>
          {activeExplanation && (
            <motion.div
              key={activeExplanation.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className='glass-card'
            >
              <p style={{ fontWeight: 600, marginBottom: 4 }}>
                {activeExplanation.title}
                {activeExplanation.number ? ` ${activeExplanation.number}` : ''}
              </p>
              <p className='text-secondary' style={{ fontSize: '0.875rem', marginBottom: 8 }}>
                {activeExplanation.description}
              </p>
              <p>{activeExplanation.meaning}</p>
              {activeExplanation.key === 'dominant' && primaryElement && (
                <p style={{ color: getElementColor(primaryElement.name), fontWeight: 600, marginTop: 8 }}>
                  Dominance count: {primaryElement.count}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Section: Elements of Dominance */}
      <motion.div variants={fadeUp} className='section'>
        <div className='section-header'>
          <h3 className='section-title'>Elements of Dominance</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {analysis.dominant_elements.map((element) => (
            <ElementCard key={element.name} element={element} />
          ))}
        </div>
      </motion.div>

      {/* Section: Weekly Insight */}
      <motion.div variants={fadeUp} className='section'>
        <div className='callout callout--insight'>
          <p style={{ fontWeight: 600, marginBottom: 4 }}>
            ✨ {analysis.weekly_insight.title}
          </p>
          <p className='text-secondary' style={{ fontSize: '0.875rem' }}>
            {analysis.weekly_insight.message}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* --- Element Detail Card --- */
type ElementCardProps = {
  element: {
    name: string;
    count: number;
    color: string;
    personality: string;
    strength_and_weakness: string;
    relationship: string;
    compatibility: string;
    advice: string;
  };
};

function ElementCard({ element }: ElementCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className='glass-card glass-card--element'
      style={{
        '--element-color': getElementColor(element.name),
        cursor: 'pointer',
      } as React.CSSProperties}
      onClick={() => setExpanded(!expanded)}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '1.5rem' }}>{getElementEmoji(element.name)}</span>
          <div>
            <p style={{ fontWeight: 600, color: getElementColor(element.name) }}>
              {element.name}
            </p>
            <p className='text-secondary text-sm'>{element.personality}</p>
          </div>
        </div>
        <ElementBadge name={element.name} count={element.count} />
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 2 }}>
                  Strength & Weakness
                </p>
                <p className='text-secondary text-sm'>{element.strength_and_weakness}</p>
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 2 }}>
                  Relationship
                </p>
                <p className='text-secondary text-sm'>{element.relationship}</p>
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 2 }}>
                  Compatibility
                </p>
                <p className='text-secondary text-sm'>{element.compatibility}</p>
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 2 }}>
                  Advice
                </p>
                <p className='text-secondary text-sm'>{element.advice}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
