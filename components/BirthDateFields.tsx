import { DateParts } from '@/lib/dob';
import { useRef } from 'react';

type BirthDateFieldsProps = {
  value: DateParts;
  onChange: (value: DateParts) => void;
  namePrefix?: string;
  prefix?: string;
  hasError?: boolean;
};

function onlyDigits(value: string, maxLength: number) {
  return value.replace(/\D/g, '').slice(0, maxLength);
}

export default function BirthDateFields({
  value,
  onChange,
  namePrefix = 'birth',
  prefix = 'Birth',
  hasError = false,
}: BirthDateFieldsProps) {
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  const updatePart = (
    part: keyof DateParts,
    nextValue: string,
    maxLength: number,
    nextFieldRef?: React.RefObject<HTMLInputElement>,
  ) => {
    const cleaned = onlyDigits(nextValue, maxLength);
    onChange({ ...value, [part]: cleaned });

    // Auto-advance to next field when max length reached
    if (cleaned.length === maxLength && nextFieldRef?.current) {
      nextFieldRef.current.focus();
    }
  };

  return (
    <div className={`birth-date-fields ${hasError ? 'animate-shake' : ''}`}>
      <div className='birth-date-field'>
        <label htmlFor={`${namePrefix}-day`}>Day</label>
        <input
          id={`${namePrefix}-day`}
          name={`${namePrefix}-day`}
          type='text'
          inputMode='numeric'
          placeholder='DD'
          maxLength={2}
          value={value.day}
          aria-label={`${prefix} day`}
          className={hasError && !value.day ? 'error' : ''}
          onChange={(e) => updatePart('day', e.currentTarget.value, 2, monthRef)}
          onInput={(e) => updatePart('day', e.currentTarget.value, 2, monthRef)}
        />
      </div>
      <div className='birth-date-field'>
        <label htmlFor={`${namePrefix}-month`}>Month</label>
        <input
          ref={monthRef}
          id={`${namePrefix}-month`}
          name={`${namePrefix}-month`}
          type='text'
          inputMode='numeric'
          placeholder='MM'
          maxLength={2}
          value={value.month}
          aria-label={`${prefix} month`}
          className={hasError && !value.month ? 'error' : ''}
          onChange={(e) => updatePart('month', e.currentTarget.value, 2, yearRef)}
          onInput={(e) => updatePart('month', e.currentTarget.value, 2, yearRef)}
        />
      </div>
      <div className='birth-date-field'>
        <label htmlFor={`${namePrefix}-year`}>Year</label>
        <input
          ref={yearRef}
          id={`${namePrefix}-year`}
          name={`${namePrefix}-year`}
          type='text'
          inputMode='numeric'
          placeholder='YYYY'
          maxLength={4}
          value={value.year}
          aria-label={`${prefix} year`}
          className={hasError && !value.year ? 'error' : ''}
          onChange={(e) => updatePart('year', e.currentTarget.value, 4)}
          onInput={(e) => updatePart('year', e.currentTarget.value, 4)}
        />
      </div>
    </div>
  );
}
