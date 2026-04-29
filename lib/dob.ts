export type DobParseResult = {
  dob: string;
  error: string;
};

export type DateParts = {
  day: string;
  month: string;
  year: string;
};

export function formatDobInput(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);

  if (digits.length <= 2) return day;
  if (digits.length <= 4) return `${day}-${month}`;
  return `${day}-${month}-${year}`;
}

export function displayDob(dob: string) {
  if (dob.length !== 8) return dob;
  return `${dob.slice(0, 2)}-${dob.slice(2, 4)}-${dob.slice(4, 8)}`;
}

export function dobToDateInput(dob: string) {
  if (dob.length !== 8) return '';
  return `${dob.slice(4, 8)}-${dob.slice(2, 4)}-${dob.slice(0, 2)}`;
}

export function dobToDateParts(dob: string): DateParts {
  if (dob.length !== 8) return { day: '', month: '', year: '' };
  return {
    day: dob.slice(0, 2),
    month: dob.slice(2, 4),
    year: dob.slice(4, 8),
  };
}

export function parseDateParts(parts: DateParts): DobParseResult {
  if (!parts.day || !parts.month || !parts.year) {
    return { dob: '', error: 'Enter your day, month, and year.' };
  }

  if (parts.day.length !== 2 || parts.month.length !== 2 || parts.year.length !== 4) {
    return { dob: '', error: 'Use DD, MM, and YYYY.' };
  }

  return parseDisplayDob(`${parts.day}-${parts.month}-${parts.year}`);
}

export function dateInputToDob(value: string): DobParseResult {
  const [year, month, day] = value.split('-');
  if (!year || !month || !day) {
    return { dob: '', error: 'Choose your birth date.' };
  }

  return parseDisplayDob(`${day}-${month}-${year}`);
}

export function parseDisplayDob(value: string): DobParseResult {
  const digits = value.replace(/\D/g, '');
  if (digits.length !== 8) {
    return { dob: '', error: 'Enter a complete birthdate in dd-mm-yyyy format.' };
  }

  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4, 8));

  if (year < 1900 || year > 2100) {
    return { dob: '', error: 'Year must be between 1900 and 2100.' };
  }

  const date = new Date(year, month - 1, day);
  const isValid =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  if (!isValid) {
    return { dob: '', error: 'Enter a valid calendar date.' };
  }

  return { dob: digits, error: '' };
}

export function encodeDob(dob: string) {
  const encoded =
    typeof window === 'undefined'
      ? Buffer.from(dob, 'utf-8').toString('base64')
      : window.btoa(dob);

  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function decodeDob(encoded: string) {
  try {
    const normalized = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const decoded =
      typeof window === 'undefined'
        ? Buffer.from(padded, 'base64').toString('utf-8')
        : window.atob(padded);
    return /^\d{8}$/.test(decoded) ? decoded : '';
  } catch (error) {
    return '';
  }
}
