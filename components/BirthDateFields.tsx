import { DateParts } from '@/lib/dob';

type BirthDateFieldsProps = {
  value: DateParts;
  onChange: (value: DateParts) => void;
  namePrefix?: string;
  prefix?: string;
  hasError?: boolean;
  describedBy?: string;
};

export default function BirthDateFields({
  value,
  onChange,
  namePrefix = 'birth',
  prefix = 'Birth',
  hasError = false,
  describedBy,
}: BirthDateFieldsProps) {
  return (
    <div className='birth-date-fields'>
      {(['day', 'month', 'year'] as const).map((part) => (
        <div className='birth-date-field' key={part}>
          <label htmlFor={`${namePrefix}-${part}`}>
            {part[0].toUpperCase() + part.slice(1)}
          </label>
          <input
            id={`${namePrefix}-${part}`}
            name={`${namePrefix}-${part}`}
            type='text'
            inputMode='numeric'
            placeholder={
              part === 'year' ? 'YYYY' : part === 'month' ? 'MM' : 'DD'
            }
            maxLength={part === 'year' ? 4 : 2}
            value={value[part]}
            aria-label={`${prefix} ${part}`}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            onChange={(event) =>
              onChange({
                ...value,
                [part]: event.target.value
                  .replace(/\D/g, '')
                  .slice(0, part === 'year' ? 4 : 2),
              })
            }
          />
        </div>
      ))}
    </div>
  );
}
