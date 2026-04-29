export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://borndate.07102020.xyz';

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
