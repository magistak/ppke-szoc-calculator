// Centralized scoring config for the calculator. Adjust these to match the PDF exactly.
import { FamilyStatus, LivingSituation, SupporterDisability } from './types';

export const EQUALITY_POINTS: Record<string, number> = {
  disadvantaged: 10,
  multiplyDisadvantaged: 15,
  disabled: 10,
  largeFamily: 5,
  familySupporter: 5,
  orphanUnder25: 17,
  halfOrphanUnder25: 12,
  childCarer: 7,
};

export const APPLICANT_POINTS: Record<string, number> = {
  fosterCare: 6,
  guardianshipEnded: 12,
  orphanOver25: 17,
  halfOrphanOver25: 12,
  imaginedPaternity: 5,
};

export const PER_CHILD_POINTS = 7;
export const SINGLE_PARENT_POINTS = 5;
export const PER_CARED_FAMILY_MEMBER_POINTS = 7;

export const SUPPORTER_DISABILITY_POINTS: Record<SupporterDisability, number> = {
  none: 0,
  cat12: 10,
  cat3: 8,
  other: 6,
};

export const SUPPORTER_STATUS_POINTS = {
  pensioner: 4,
  unemployed: 6,
};

export const FAMILY_STATUS_POINTS: Record<FamilyStatus, number> = {
  none: 0,
  divorcedNoRemarry: 7,
  divorcedNoSupport: 9,
  spouseIsSupporter: 4,
};

export const LIVING_SITUATION_POINTS: Record<LivingSituation, number> = {
  none: 0,
  rent: 20,
  dorm: 15,
  own: 5,
  courtesy: 5,
};

// Distance and Health Costs can be bracketed; default is identity mapping used in tests.
export const DISTANCE_POINTS: Record<number, number> = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
};

export const HEALTH_COSTS_POINTS: Record<number, number> = {
  0: 0,
  2: 2,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
};

// Income brackets: tuples of [upperInclusive, points]
export const INCOME_BRACKETS: Array<[number, number]> = [
  [59999, 45],
  [64999, 42],
  [69999, 39],
  [74999, 36],
  [79999, 33],
  [84999, 30],
  [89999, 27],
  [94999, 24],
  [99999, 21],
  [104999, 18],
  [109999, 15],
  [114999, 12],
  [119999, 9],
  [124999, 6],
  [129999, 3],
  [159999, 0],
  [164999, -3],
];

// For income >= 165000: -6 and then minus 3 per 5000 step.
export const HIGH_INCOME_BASE = 165000;
export const HIGH_INCOME_BASE_POINTS = -6;
export const HIGH_INCOME_STEP = 5000;
export const HIGH_INCOME_STEP_POINTS = -3;

export const SIBLING_POINTS = {
  base: [0, 4, 8, 12, 15, 17, 19] as const, // index is count up to 6
  extraStep: 2, // for each sibling beyond 6
};

// Optional exclusivity rules: list keys where only the highest-point one should apply.
// Example groups you might enable based on the PDF (disabled by default):
// [ 'orphanUnder25', 'orphanOver25', 'halfOrphanUnder25', 'halfOrphanOver25' ]
// [ 'multiplyDisadvantaged', 'disadvantaged' ]
export const EXCLUSIVITY_RULES: Array<string[]> = [];

// Optional caps (undefined means no cap).
export const SECTION_CAPS: Partial<{
  equality: number;
  applicant: number;
  community: number; // children + singleParent + caredForFamilyMembers + siblings
  supporters: number; // supporter disabilities + statuses + familyStatus
  living: number; // livingSituation + distance + healthCosts
  other: number; // selfSupporting + otherSocialCircumstances
  income: number; // income points
  total: number; // overall total
}> = {};

// Optional field limits (clamp inputs before scoring); undefined means no clamp.
export const FIELD_LIMITS: Partial<{
  dependentSiblingsMax: number;
  numberOfChildrenMax: number;
  caredForFamilyMembersMax: number;
  distanceMax: number;
  healthCostsMax: number;
  otherSocialCircumstancesMax: number;
}> = {
  distanceMax: 10,
  otherSocialCircumstancesMax: 10,
};
