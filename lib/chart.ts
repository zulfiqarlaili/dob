/**
 * Port of the Python metaphysic.py chart calculation logic.
 * Computes the 17-number star array from a DOB string (ddmmyyyy).
 */

export type StarChartData = {
  numbers: number[];
  spiritNumber: number;
  physicalNumber: number;
  endingNumber: number;
};

function singleDigitSum(a: number, b: number): number {
  let result = a + b;
  if (result > 9) {
    result = String(result)
      .split('')
      .reduce((sum, d) => sum + Number(d), 0);
  }
  return result;
}

export function getElementName(num: number): string {
  const map: Record<number, string> = {
    1: 'Metal', 6: 'Metal',
    2: 'Water', 7: 'Water',
    3: 'Fire',  8: 'Fire',
    4: 'Wood',  9: 'Wood',
    5: 'Earth',
  };
  return map[num] || 'Unknown';
}

export function getElementCSSColor(num: number): string {
  return ELEMENT_COLORS[getElementName(num)] || '#f1f5f9';
}

export const ELEMENT_COLORS: Record<string, string> = {
  Metal: '#94a3b8',
  Water: '#60a5fa',
  Fire:  '#fb923c',
  Wood:  '#4ade80',
  Earth: '#d4a056',
};

export type ElementCount = {
  name: string;
  count: number;
  color: string;
};

/** Count how many of the 17 star numbers belong to each element */
export function calculateElementCounts(numbers: number[]): ElementCount[] {
  const counts: Record<string, number> = {};
  for (const num of numbers) {
    const name = getElementName(num);
    counts[name] = (counts[name] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([name, count]) => ({
      name,
      count,
      color: ELEMENT_COLORS[name] || '#f1f5f9',
    }))
    .sort((a, b) => b.count - a.count);
}

export function computeStarArray(dob: string): StarChartData {
  const digits = dob.split('').map(Number);

  // Handle year 2000 → 2005 substitution (matches backend logic)
  if (dob.slice(4, 8) === '2000') {
    digits[4] = 2;
    digits[5] = 0;
    digits[6] = 0;
    digits[7] = 5;
  }

  const s: number[] = new Array(17).fill(0);

  // Pair sums from the 8 DOB digits
  s[0] = singleDigitSum(digits[0], digits[1]);
  s[1] = singleDigitSum(digits[2], digits[3]);
  s[2] = singleDigitSum(digits[4], digits[5]);
  s[3] = singleDigitSum(digits[6], digits[7]);

  // Spirit number
  s[4] = singleDigitSum(s[1], s[2]);

  // Inner calculations
  s[5] = singleDigitSum(s[0], s[1]);
  s[6] = singleDigitSum(s[1], s[5]);
  s[7] = singleDigitSum(s[0], s[5]);
  s[8] = singleDigitSum(s[7], s[6]);

  s[9]  = singleDigitSum(s[2], s[3]);
  s[10] = singleDigitSum(s[2], s[9]);
  s[11] = singleDigitSum(s[3], s[9]);
  s[12] = singleDigitSum(s[10], s[11]);

  // Physical number
  s[13] = singleDigitSum(s[5], s[9]);

  s[14] = singleDigitSum(s[9], s[13]);
  s[15] = singleDigitSum(s[5], s[13]);

  // Ending number
  s[16] = singleDigitSum(s[14], s[15]);

  return {
    numbers: s,
    spiritNumber: s[4],
    physicalNumber: s[13],
    endingNumber: s[16],
  };
}
