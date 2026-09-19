import Link from 'next/link';
import { useEffect, useMemo, useRef } from 'react';
import { buildAnalysisResponse } from '@/lib/metaphysic';
import { computeStarArray } from '@/lib/chart';
import { displayDob, encodeDob, parseDisplayDob } from '@/lib/dob';
import { SavedReading, saveReading } from '@/lib/storage';
import ElementBadge, { getElementColor, getElementEmoji } from './ElementBadge';
import CompatibilityChecker from './CompatibilityChecker';
import ShareButtons from './ShareButtons';
import StarChart from './StarChart';
import { downloadReadingCard } from '@/lib/reading-card';

type ResultExperienceProps = {
  dob: string;
  onSaved?: (readings: SavedReading[]) => void;
  focusOnMount?: boolean;
};

export default function ResultExperience({
  dob,
  onSaved,
  focusOnMount = false,
}: ResultExperienceProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const result = useMemo(() => {
    try {
      if (!/^\d{8}$/.test(dob) || parseDisplayDob(dob).error) return null;
      return {
        analysis: buildAnalysisResponse(dob),
        chart: computeStarArray(dob),
      };
    } catch {
      return null;
    }
  }, [dob]);

  useEffect(() => {
    if (result && onSaved) onSaved(saveReading(result.analysis));
  }, [result, onSaved]);

  useEffect(() => {
    if (focusOnMount && result) {
      headingRef.current?.focus({ preventScroll: true });
      // No delayed scrolling or motion required to reach the reading.
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [focusOnMount, result]);

  if (!result)
    return (
      <div className='empty-state' role='alert'>
        <h1>We couldn’t read that birthday.</h1>
        <p>Please return home and enter a valid calendar date.</p>
        <Link className='primary-action-button' href='/'>
          Create a new reading
        </Link>
      </div>
    );

  const { analysis, chart } = result;
  const element = analysis.dominant_elements[0];
  const shareUrl =
    typeof window === 'undefined'
      ? ''
      : `${window.location.origin}/result?d=${encodeDob(dob)}`;
  const shareText = `My BornDate element is ${
    element?.name || 'a discovery'
  }. A little insight, written in my birthday. Discover yours →`;

  return (
    <div className='reading-experience fade-in' key={dob}>
      <section className='reading-summary' aria-labelledby='reading-title'>
        <div className='reading-date'>
          <span className='eyebrow'>Your birthday, interpreted</span>
          <span>{displayDob(dob)}</span>
        </div>
        <div
          className='element-emblem'
          style={{ color: getElementColor(element?.name || '') }}
          aria-hidden='true'
        >
          {getElementEmoji(element?.name || '')}
        </div>
        <p className='eyebrow'>Your element</p>
        <h1 id='reading-title' ref={headingRef} tabIndex={-1}>
          {element?.name || analysis.core_numbers.spirit.element}
        </h1>
        <p className='element-personality'>{element?.personality}</p>
        <div className='reading-meaning'>
          <h2>{analysis.personal_reading.headline}</h2>
          <p>
            {analysis.personal_reading.strengths
              .replace('Strength:', 'Your strengths:')
              .replace('Weakness:', 'Room to grow:')}
          </p>
        </div>
        <div className='takeaway'>
          <span aria-hidden='true'>✧</span>
          <div>
            <h3>One small step to try</h3>
            <p>{analysis.personal_reading.today}</p>
          </div>
        </div>
      </section>
      <ShareButtons
        key={dob}
        shareUrl={shareUrl}
        shareText={shareText}
        onDownload={() => downloadReadingCard(analysis, chart)}
      />
      <details className='disclosure comparison-disclosure'>
        <summary>
          <span className='disclosure-icon' aria-hidden='true'>
            ⌘
          </span>
          <span>
            <strong>Compare with someone</strong>
            <small>A friend, a partner, a different perspective.</small>
          </span>
          <span className='disclosure-chevron' aria-hidden='true'>
            +
          </span>
        </summary>
        <div className='disclosure-content'>
          <CompatibilityChecker key={dob} currentDob={dob} />
        </div>
      </details>
      <details className='disclosure chart-disclosure'>
        <summary>
          <span className='disclosure-icon' aria-hidden='true'>
            ✧
          </span>
          <span>
            <strong>Explore your chart</strong>
            <small>The numbers and elements behind your reading.</small>
          </span>
          <span className='disclosure-chevron' aria-hidden='true'>
            +
          </span>
        </summary>
        <div className='disclosure-content details-stack'>
          <div>
            <p className='eyebrow'>A closer look</p>
            <h2>Your birthday in numbers</h2>
            <p className='text-secondary'>
              This chart maps the numbers calculated from your birthday. The
              highlighted numbers describe your inner nature, how you act, and
              the direction you grow.
            </p>
          </div>
          <section>
            <h3 className='detail-heading'>Your full personal reading</h3>
            <p className='text-secondary'>
              {analysis.personal_reading.summary}
            </p>
          </section>
          <StarChart data={chart} animate={false} />
          <section>
            <h3 className='detail-heading'>What the numbers mean</h3>
            <div className='explanation-list'>
              {analysis.chart_explanations.map((item) => (
                <details className='inner-disclosure' key={item.key}>
                  <summary>
                    {item.title}
                    {item.number !== null ? ` · ${item.number}` : ''}
                    <span aria-hidden='true'>+</span>
                  </summary>
                  <div>
                    <p className='text-secondary'>{item.description}</p>
                    <p>{item.meaning}</p>
                    {item.key === 'dominant' && element && (
                      <p className='text-secondary'>
                        This element appears {element.count} times in your
                        chart.
                      </p>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </section>
          <section>
            <h3 className='detail-heading'>Your elements, explained</h3>
            <p className='text-secondary'>
              Each element describes a different kind of energy. Its count is
              how often it appears in your chart.
            </p>
            <div className='explanation-list'>
              {analysis.dominant_elements.map((item) => (
                <details className='inner-disclosure' key={item.name}>
                  <summary>
                    <ElementBadge name={item.name} count={item.count} />
                    <span aria-hidden='true'>+</span>
                  </summary>
                  <div className='details-stack'>
                    <p>{item.personality}</p>
                    <div>
                      <h4>Strengths & room to grow</h4>
                      <p className='text-secondary'>
                        {item.strength_and_weakness}
                      </p>
                    </div>
                    <div>
                      <h4>Relationships</h4>
                      <p className='text-secondary'>{item.relationship}</p>
                    </div>
                    <div>
                      <h4>Connecting with other elements</h4>
                      <p className='text-secondary'>{item.compatibility}</p>
                    </div>
                    <div>
                      <h4>Something to try</h4>
                      <p className='text-secondary'>{item.advice}</p>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </section>
          <section className='takeaway'>
            <span aria-hidden='true'>✧</span>
            <div>
              <h3>{analysis.weekly_insight.title}</h3>
              <p>{analysis.weekly_insight.message}</p>
            </div>
          </section>
        </div>
      </details>
    </div>
  );
}
