import { computeStarArray } from './chart';

export type ElementAnalysis = {
  name: string;
  count: number;
  color: string;
  personality: string;
  strength_and_weakness: string;
  relationship: string;
  compatibility: string;
  advice: string;
};

export type CoreNumber = {
  number: number;
  element: string;
  meaning: string;
};

export type ChartExplanation = {
  key: string;
  title: string;
  number: number | null;
  description: string;
  meaning: string;
};

export type AnalysisResponse = {
  dob: string;
  core_numbers: {
    spirit: CoreNumber;
    physical: CoreNumber;
    ending: CoreNumber;
  };
  dominant_elements: ElementAnalysis[];
  personal_reading: {
    headline: string;
    summary: string;
    strengths: string;
    relationship: string;
    growth: string;
    today: string;
  };
  chart_explanations: ChartExplanation[];
  weekly_insight: {
    title: string;
    message: string;
  };
};

export type CompatibilityResponse = {
  first: AnalysisResponse;
  second: AnalysisResponse;
  compatibility: {
    summary: string;
    strengths: string;
    tension: string;
    advice: string;
  };
};

const elementMap: Record<string, number[]> = {
  metal: [1, 6],
  water: [2, 7],
  fire: [3, 8],
  wood: [4, 9],
  earth: [5],
};

const elementOrder = ['metal', 'water', 'fire', 'wood', 'earth'];

const elementColors: Record<number, string> = {
  1: '#2b2d42',
  2: '#0077b6',
  3: '#f25c54',
  4: '#57a773',
  5: '#bc6c25',
  6: '#2b2d42',
  7: '#0077b6',
  8: '#f25c54',
  9: '#57a773',
};

const elementActions: Record<string, string> = {
  Wood: 'Choose one idea and give it a practical first step today.',
  Fire: 'Channel your energy into one clear priority before starting something new.',
  Earth: 'Create stability by finishing a small promise you made to yourself.',
  Metal: 'Use your discipline gently: organize one area without over-controlling it.',
  Water: 'Trust your intuition, then write down the facts before deciding.',
};

const pairKey = (a: string, b: string) => [a, b].sort().join('|');

const supportivePairs = new Set([
  pairKey('Wood', 'Fire'),
  pairKey('Fire', 'Earth'),
  pairKey('Earth', 'Metal'),
  pairKey('Metal', 'Water'),
  pairKey('Water', 'Wood'),
]);

const challengingPairs = new Set([
  pairKey('Wood', 'Earth'),
  pairKey('Earth', 'Water'),
  pairKey('Water', 'Fire'),
  pairKey('Fire', 'Metal'),
  pairKey('Metal', 'Wood'),
]);

const knowledgeBase: Record<
  string,
  Record<string, string> | Record<number, string>
> = {
  Wood: {
    Compatibility: 'compatible with Fire and Earth, but can conflict with Metal and Water',
    Personality: 'optimistic, confident, and energetic',
    'Strength & Weakness':
      'Strength: creativity, leadership, and determination. Weakness: impulsiveness, impatience, and inflexibility',
    Relationship:
      'Encourage growth, independence, and exploration. Be supportive and understanding of their need for change.',
    Advice:
      'Emphasize the importance of finding balance between creativity and stability, and encourage them to be patient and considerate in their decisions.',
  },
  Fire: {
    Compatibility: 'compatible with Wood and Earth, but can conflict with Metal and Water',
    Personality: 'passionate, confident, and charismatic',
    'Strength & Weakness':
      'Strength: passion, energy, and confidence. Weakness: impulsiveness, hot-headedness, and a tendency to be too dramatic',
    Relationship:
      'Be passionate and energetic, and be open to new experiences. Keep the relationship lively and spontaneous.',
    Advice:
      'Emphasize the importance of finding balance between passion and practicality, and encourage them to think before acting impulsively.',
  },
  Earth: {
    Compatibility: 'compatible with Metal and Water, but can conflict with Wood and Fire',
    Personality: 'practical, reliable, and stable',
    'Strength & Weakness':
      'Strength: stability, reliability, and practicality. Weakness: rigidity, inflexibility, and a tendency to be overly attached to material possessions',
    Relationship:
      'Provide stability, security, and practicality. Be reliable and dependable, and show appreciation for their material contributions.',
    Advice:
      'Emphasize the importance of finding balance between stability and change, and encourage them to be open to new experiences.',
  },
  Metal: {
    Compatibility: 'compatible with Earth and Water, but can conflict with Wood and Fire',
    Personality: 'strong-willed, disciplined, and detail-oriented',
    'Strength & Weakness':
      'Strength: discipline, strength of will, and focus. Weakness: inflexibility, stubbornness, and a tendency to be overly controlling',
    Relationship:
      'Be disciplined and focused, and appreciate their attention to detail. Be supportive of their goals and aspirations.',
    Advice:
      'Emphasize the importance of finding balance between discipline and flexibility, and encourage them to be more open-minded and considerate of others.',
  },
  Water: {
    Compatibility: 'compatible with Metal and Earth, but can conflict with Wood and Fire',
    Personality: 'intuitive, emotional, and adaptable',
    'Strength & Weakness':
      'Strength: adaptability, intuition, and empathy. Weakness: indecisiveness, emotional instability, and a tendency to be overly passive',
    Relationship:
      'Be flexible and adaptable, and provide emotional support. Be understanding and empathetic, and allow for open communication.',
    Advice:
      'Emphasize the importance of finding balance between intuition and rational thinking, and encourage them to be more assertive and confident in their decisions.',
  },
  Physical: {
    1: 'A wise leader is someone who is good at understanding people, has a lot of good ideas and is very creative.',
    2: 'An honest person is truthful, has high moral standards and is soft-spoken. They listen to others but they dont always follow what they hear.',
    3: 'A person who is charming when young may get things done quickly, but their work is not always perfect. They can be impulsive and sometimes act aggressively. They may not always make strong decisions and their relationships can be unstable.',
    4: 'Someone who is highly skilled and wise doesnt give up easily, but they may have trouble saving money. Their relationships can also be unstable and fall apart easily.',
    5: 'A leader is someone who works very hard, holds a high position, and has a strong determination, even if others disagree.',
    6: 'This person wants to be in control of their finances, enjoys a lavish lifestyle, is self-sufficient, and has a desire to be in charge of situations.',
    7: 'This person is known for starting arguments, being very particular, having many friends and fans, and having the ability to attract people to support them.',
    8: 'This person takes their responsibilities seriously, is quiet but has many friends, is known for being reliable, and always stands up for their friends.',
    9: 'This person is skilled at managing their public image, takes good care of their appearance, is able to impress old generation, but feels lonely at times.',
  },
  Ending: {
    3: 'The final outcome for this person is either extreme wealth or extreme poverty.',
    6: 'The ultimate result for this person is a higher amount of liquid assets.',
    9: 'The final result for this person is a higher amount of fixed assets.',
  },
};

const endingFallback =
  'This ending number points to a personal outcome shaped by your choices, habits, and environment.';

const physicalMeaning = (num: number): string =>
  (knowledgeBase.Physical as Record<number, string>)[num] ?? '';

const endingMeaning = (num: number): string =>
  (knowledgeBase.Ending as Record<number, string>)[num] ?? endingFallback;

export function checkDob(dob: string): boolean {
  return /^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[012])(19|20)\d\d$/.test(dob);
}

function getElementColor(num: number): string {
  return elementColors[num] ?? '';
}

function getElementName(num: number): string {
  for (const element of elementOrder) {
    if (elementMap[element].includes(num)) {
      return element.charAt(0).toUpperCase() + element.slice(1);
    }
  }
  return 'Unknown';
}

function getElementNumber(name: string): number {
  return elementMap[name.toLowerCase()][0];
}

function getElementAnalysis(element: string, count: number): ElementAnalysis {
  const name = element.charAt(0).toUpperCase() + element.slice(1).toLowerCase();
  const knowledge = knowledgeBase[name] as Record<string, string>;
  return {
    name,
    count,
    color: getElementColor(getElementNumber(name)),
    personality: knowledge.Personality,
    strength_and_weakness: knowledge['Strength & Weakness'],
    compatibility: knowledge.Compatibility,
    relationship: knowledge.Relationship,
    advice: knowledge.Advice,
  };
}

function getDominantElements(numbers: number[]): ElementAnalysis[] {
  // Map preserves first-occurrence order, matching the Python backend's
  // defaultdict ordering (ties in count stay in star-array appearance order)
  const counts = new Map<string, number>();
  for (const num of numbers) {
    for (const element of elementOrder) {
      if (elementMap[element].includes(num)) {
        counts.set(element, (counts.get(element) ?? 0) + 1);
        break;
      }
    }
  }

  const overFour = Array.from(counts.entries()).filter(([, count]) => count > 4);
  const dominant =
    overFour.length > 0
      ? overFour
      : Array.from(counts.entries()).filter(([, count]) => count === 4);

  return dominant
    .map(([element, count]) => getElementAnalysis(element, count))
    .sort((a, b) => b.count - a.count);
}

function getChartExplanations(
  spiritNumber: number,
  physicalNumber: number,
  endingNumber: number,
  dominantElements: ElementAnalysis[],
): ChartExplanation[] {
  const dominantName = dominantElements.length
    ? dominantElements[0].name
    : getElementName(spiritNumber);
  const dominantText = dominantElements.length
    ? dominantElements[0].personality
    : (knowledgeBase[dominantName] as Record<string, string>).Personality;
  return [
    {
      key: 'spirit',
      title: 'Spirit Number',
      number: spiritNumber,
      description: 'Your inner drive and the style of energy you naturally return to.',
      meaning: physicalMeaning(spiritNumber),
    },
    {
      key: 'physical',
      title: 'Physical Number',
      number: physicalNumber,
      description: 'How your strengths tend to show up in practical choices and daily behavior.',
      meaning: physicalMeaning(physicalNumber),
    },
    {
      key: 'ending',
      title: 'Ending Number',
      number: endingNumber,
      description: 'The longer-term pattern this chart points toward when your traits are developed.',
      meaning: endingMeaning(endingNumber),
    },
    {
      key: 'dominant',
      title: 'Dominant Element',
      number: null,
      description: 'The element that appears most strongly in your chart.',
      meaning: `${dominantName}: ${dominantText}.`,
    },
  ];
}

function getPersonalReading(
  physicalNumber: number,
  spiritNumber: number,
  endingNumber: number,
  dominantElements: ElementAnalysis[],
) {
  const primary = dominantElements.length
    ? dominantElements[0]
    : getElementAnalysis(getElementName(spiritNumber), 0);
  const elementName = primary.name;
  return {
    headline: `${elementName} energy with a ${spiritNumber}-${physicalNumber}-${endingNumber} core pattern`,
    summary: `You carry ${primary.personality} energy. Your spirit number suggests ${physicalMeaning(spiritNumber)} Your physical number adds this visible pattern: ${physicalMeaning(physicalNumber)}`,
    strengths: primary.strength_and_weakness,
    relationship: primary.relationship,
    growth: primary.advice,
    today:
      elementActions[elementName] ??
      'Choose one small action that supports your strongest trait today.',
  };
}

export function buildAnalysisResponse(dob: string): AnalysisResponse {
  const star = computeStarArray(dob);
  const spiritNumber = star.spiritNumber;
  const physicalNumber = star.physicalNumber;
  const endingNumber = star.endingNumber;
  const dominantElements = getDominantElements(star.numbers);

  const weeklyMessage = dominantElements.length
    ? elementActions[dominantElements[0].name] ??
      elementActions[getElementName(spiritNumber)]
    : elementActions[getElementName(spiritNumber)];

  return {
    dob,
    core_numbers: {
      spirit: {
        number: spiritNumber,
        element: getElementName(spiritNumber),
        meaning: physicalMeaning(spiritNumber),
      },
      physical: {
        number: physicalNumber,
        element: getElementName(physicalNumber),
        meaning: physicalMeaning(physicalNumber),
      },
      ending: {
        number: endingNumber,
        element: getElementName(endingNumber),
        meaning: endingMeaning(endingNumber),
      },
    },
    dominant_elements: dominantElements,
    personal_reading: getPersonalReading(
      physicalNumber,
      spiritNumber,
      endingNumber,
      dominantElements,
    ),
    chart_explanations: getChartExplanations(
      spiritNumber,
      physicalNumber,
      endingNumber,
      dominantElements,
    ),
    weekly_insight: {
      title: 'This week',
      message: weeklyMessage,
    },
  };
}

export function buildCompatibilityResponse(
  firstDob: string,
  secondDob: string,
): CompatibilityResponse {
  const first = buildAnalysisResponse(firstDob);
  const second = buildAnalysisResponse(secondDob);
  const firstElement = first.dominant_elements.length
    ? first.dominant_elements[0].name
    : first.core_numbers.spirit.element;
  const secondElement = second.dominant_elements.length
    ? second.dominant_elements[0].name
    : second.core_numbers.spirit.element;

  let summary: string;
  let tension: string;
  if (firstElement === secondElement) {
    summary = `Both readings carry strong ${firstElement} energy, so the connection can feel familiar and easy to understand.`;
    tension =
      'The same strengths can also amplify the same blind spots, so balance comes from taking turns leading.';
  } else if (supportivePairs.has(pairKey(firstElement, secondElement))) {
    summary = `${firstElement} and ${secondElement} form a supportive pattern. Each person can add something the other naturally responds to.`;
    tension =
      'The main risk is moving at different speeds or assuming support means agreement on every detail.';
  } else if (challengingPairs.has(pairKey(firstElement, secondElement))) {
    summary = `${firstElement} and ${secondElement} can create a growth-oriented dynamic. The connection may be useful, but it needs patience.`;
    tension =
      'Differences may show up in communication style, timing, or how each person handles pressure.';
  } else {
    summary = `${firstElement} and ${secondElement} create a mixed pattern with room for both support and learning.`;
    tension =
      'The connection works best when expectations are made clear early.';
  }

  return {
    first,
    second,
    compatibility: {
      summary,
      strengths:
        'This pairing works best when both people use their strongest traits as contributions instead of control points.',
      tension,
      advice:
        'Use the reading as a conversation starter: compare what feels accurate, what feels different, and what each person needs to feel respected.',
    },
  };
}
