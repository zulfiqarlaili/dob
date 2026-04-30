import { displayDob } from '@/lib/dob';
import { SavedReading, deleteSavedReading } from '@/lib/storage';
import { MdDeleteOutline } from 'react-icons/md';
import ElementBadge from './ElementBadge';

type RecentReadingsProps = {
  readings: SavedReading[];
  onOpen: (dob: string) => void;
  onChange: (readings: SavedReading[]) => void;
};

export default function RecentReadings({ readings, onOpen, onChange }: RecentReadingsProps) {
  if (readings.length === 0) return null;

  return (
    <div className='section'>
      <div className='section-header' style={{ textAlign: 'center' }}>
        <h3 className='section-title'>Recent Readings</h3>
      </div>
      <div className='recent-scroll'>
        {readings.map((reading) => (
          <div
            className='recent-card'
            key={reading.dob}
            onClick={() => onOpen(reading.dob)}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <p style={{ fontWeight: 600 }}>{displayDob(reading.dob)}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(deleteSavedReading(reading.dob));
                }}
                title='Remove reading'
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'transparent',
                  color: 'var(--text-tertiary)',
                  transition: 'color var(--transition-fast), background var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ef4444';
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-tertiary)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <MdDeleteOutline size={16} />
              </button>
            </div>
            <ElementBadge name={reading.dominantElement} />
            <p className='text-secondary text-xs' style={{ marginTop: 8, lineHeight: 1.4 }}>
              {reading.insight?.slice(0, 80)}{reading.insight && reading.insight.length > 80 ? '...' : ''}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
