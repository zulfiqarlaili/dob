import { Input } from '@nextui-org/react';
import { DateParts } from '@/lib/dob';

type BirthDateFieldsProps = {
  value: DateParts;
  onChange: (value: DateParts) => void;
  namePrefix?: string;
  prefix?: string;
};

function onlyDigits(value: string, maxLength: number) {
  return value.replace(/\D/g, '').slice(0, maxLength);
}

export default function BirthDateFields({
  value,
  onChange,
  namePrefix = 'birth',
  prefix = 'Birth',
}: BirthDateFieldsProps) {
  const updatePart = (part: keyof DateParts, nextValue: string, maxLength: number) => {
    onChange({ ...value, [part]: onlyDigits(nextValue, maxLength) });
  };

  return (
    <div className='birth-date-fields'>
      <div>
        <Input
          bordered
          fullWidth
          color='secondary'
          aria-label={`${prefix} day`}
          label='Day'
          name={`${namePrefix}-day`}
          placeholder='DD'
          value={value.day}
          maxLength={2}
          inputMode='numeric'
          onChange={(event) =>
            updatePart('day', event.currentTarget.value, 2)
          }
          onInput={(event) =>
            updatePart('day', event.currentTarget.value, 2)
          }
        />
      </div>
      <div>
        <Input
          bordered
          fullWidth
          color='secondary'
          aria-label={`${prefix} month`}
          label='Month'
          name={`${namePrefix}-month`}
          placeholder='MM'
          value={value.month}
          maxLength={2}
          inputMode='numeric'
          onChange={(event) =>
            updatePart('month', event.currentTarget.value, 2)
          }
          onInput={(event) =>
            updatePart('month', event.currentTarget.value, 2)
          }
        />
      </div>
      <div>
        <Input
          bordered
          fullWidth
          color='secondary'
          aria-label={`${prefix} year`}
          label='Year'
          name={`${namePrefix}-year`}
          placeholder='YYYY'
          value={value.year}
          maxLength={4}
          inputMode='numeric'
          onChange={(event) =>
            updatePart('year', event.currentTarget.value, 4)
          }
          onInput={(event) =>
            updatePart('year', event.currentTarget.value, 4)
          }
        />
      </div>
    </div>
  );
}
