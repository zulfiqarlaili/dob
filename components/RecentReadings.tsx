import { displayDob } from '@/lib/dob';
import { SavedReading, deleteSavedReading } from '@/lib/storage';
import ElementBadge from './ElementBadge';
import { MdArrowForward, MdDeleteOutline } from 'react-icons/md';

type Props = {
  readings: SavedReading[];
  onOpen: (dob: string) => void;
  onChange: (readings: SavedReading[]) => void;
};
export default function RecentReadings({ readings, onOpen, onChange }: Props) {
  return (
    <section className='recent-section' aria-labelledby='recent-title'>
      <div className='section-heading-row'>
        <h2 id='recent-title'>Your recent readings</h2>
        <span className='text-secondary text-sm'>Saved on this device</span>
      </div>
      <div className='recent-grid'>
        {readings.map((reading, index) => (
          <article className='recent-card' key={reading.dob}>
            <div className='recent-meta'>
              <ElementBadge name={reading.dominantElement} />
              <button
                className='icon-button'
                aria-label={`Delete reading for ${displayDob(reading.dob)}`}
                onClick={() => onChange(deleteSavedReading(reading.dob))}
              >
                <MdDeleteOutline aria-hidden='true' />
              </button>
            </div>
            <button className='recent-open' onClick={() => onOpen(reading.dob)}>
              <span>
                <small>
                  {index === 0 ? 'Continue your last reading' : 'Open reading'}
                </small>
                <strong>{displayDob(reading.dob)}</strong>
              </span>
              <MdArrowForward aria-hidden='true' />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
