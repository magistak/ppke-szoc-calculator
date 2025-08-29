
import { FormData } from './types';
import {
    EQUALITY_POINTS,
    APPLICANT_POINTS,
    PER_CHILD_POINTS,
    SINGLE_PARENT_POINTS,
    PER_CARED_FAMILY_MEMBER_POINTS,
    SUPPORTER_DISABILITY_POINTS,
    SUPPORTER_STATUS_POINTS,
    FAMILY_STATUS_POINTS,
    LIVING_SITUATION_POINTS,
    DISTANCE_POINTS,
    HEALTH_COSTS_POINTS,
    INCOME_BRACKETS,
    HIGH_INCOME_BASE,
    HIGH_INCOME_BASE_POINTS,
    HIGH_INCOME_STEP,
    HIGH_INCOME_STEP_POINTS,
    SIBLING_POINTS,
    EXCLUSIVITY_RULES,
    SECTION_CAPS,
    FIELD_LIMITS,
} from './scoring-config';

export const calculateSiblingPoints = (count: number): number => {
    if (count <= 0) return 0;
    const base = SIBLING_POINTS.base;
    if (count <= 6) return base[count];
    return base[6] + (count - 6) * SIBLING_POINTS.extraStep;
};

export const calculateIncomePoints = (income: number): number => {
    if (income < 0) return 0;
    for (const [upper, pts] of INCOME_BRACKETS) {
        if (income <= upper) return pts;
    }
    if (income >= HIGH_INCOME_BASE) {
        const stepsAbove = Math.floor((income - HIGH_INCOME_BASE) / HIGH_INCOME_STEP);
        return HIGH_INCOME_BASE_POINTS - (stepsAbove * Math.abs(HIGH_INCOME_STEP_POINTS));
    }
    return 0;
};

export const calculateTotalScoreFromFormData = (formData: FormData): number => {
    const scores: number[] = [];

    // Helpers
    const cap = (value: number, maxCap?: number) => (typeof maxCap === 'number' ? Math.min(value, maxCap) : value);
    const clamp = (value: number, max?: number) => {
        const v = Math.max(0, Number.isFinite(value) ? value : 0);
        return typeof max === 'number' ? Math.min(v, max) : v;
    };

    // Resolve exclusivity winners
    const getKeyPoints = (key: string): number => {
        if (key in EQUALITY_POINTS) return EQUALITY_POINTS[key as keyof typeof EQUALITY_POINTS];
        if (key in APPLICANT_POINTS) return APPLICANT_POINTS[key as keyof typeof APPLICANT_POINTS];
        return 0;
    };
    const exclusiveWinners = new Set<string>();
    for (const group of EXCLUSIVITY_RULES) {
        let bestKey: string | null = null;
        let bestPts = -Infinity;
        for (const key of group) {
            if ((formData as any)[key]) {
                const pts = getKeyPoints(key);
                if (pts > bestPts) {
                    bestPts = pts;
                    bestKey = key;
                }
            }
        }
        if (bestKey) exclusiveWinners.add(bestKey);
    }
    const isAllowedByExclusivity = (key: string): boolean => {
        if (EXCLUSIVITY_RULES.length === 0) return true;
        // If the key is in any exclusivity group, only allow if it's the winner
        const inAnyGroup = EXCLUSIVITY_RULES.some(g => g.includes(key));
        if (!inAnyGroup) return true;
        return exclusiveWinners.has(key);
    };

    // Esélyegyenlőség
    const equalityScores: number[] = [];
    (Object.keys(EQUALITY_POINTS) as Array<keyof typeof EQUALITY_POINTS>).forEach((k) => {
        if ((formData as any)[k] && isAllowedByExclusivity(k as string)) equalityScores.push(EQUALITY_POINTS[k]);
    });

    // Kérvényező adatai
    const applicantScores: number[] = [];
    (Object.keys(APPLICANT_POINTS) as Array<keyof typeof APPLICANT_POINTS>).forEach((k) => {
        if ((formData as any)[k] && isAllowedByExclusivity(k as string)) applicantScores.push(APPLICANT_POINTS[k]);
    });
    
    // Field limits (optional clamps)
    const dependentSiblings = clamp(Number(formData.dependentSiblings || 0), FIELD_LIMITS.dependentSiblingsMax);
    const numberOfChildren = clamp(Number(formData.numberOfChildren || 0), FIELD_LIMITS.numberOfChildrenMax);
    const caredForFamilyMembers = clamp(Number(formData.caredForFamilyMembers || 0), FIELD_LIMITS.caredForFamilyMembersMax);
    const distanceVal = clamp(Number(formData.distance || 0), FIELD_LIMITS.distanceMax);
    const healthCostsVal = clamp(Number(formData.healthCosts || 0), FIELD_LIMITS.healthCostsMax);

    // Családi körülmények
    const communityScores: number[] = [];
    communityScores.push(calculateSiblingPoints(dependentSiblings));
    communityScores.push(numberOfChildren * PER_CHILD_POINTS);
    if (formData.singleParent) communityScores.push(SINGLE_PARENT_POINTS);
    communityScores.push(caredForFamilyMembers * PER_CARED_FAMILY_MEMBER_POINTS);
    
    // Eltartók
    const supportersScores: number[] = [];
    supportersScores.push(SUPPORTER_DISABILITY_POINTS[formData.supporter1Disability]);
    if (formData.supporter1Pensioner) supportersScores.push(SUPPORTER_STATUS_POINTS.pensioner);
    if (formData.supporter1Unemployed) supportersScores.push(SUPPORTER_STATUS_POINTS.unemployed);

    supportersScores.push(SUPPORTER_DISABILITY_POINTS[formData.supporter2Disability]);
    if (formData.supporter2Pensioner) supportersScores.push(SUPPORTER_STATUS_POINTS.pensioner);
    if (formData.supporter2Unemployed) supportersScores.push(SUPPORTER_STATUS_POINTS.unemployed);

    supportersScores.push(FAMILY_STATUS_POINTS[formData.familyStatus]);

    // Lakhatás és egyéb
    const livingScores: number[] = [];
    livingScores.push(LIVING_SITUATION_POINTS[formData.livingSituation]);
    livingScores.push(DISTANCE_POINTS[distanceVal] ?? 0);
    livingScores.push(HEALTH_COSTS_POINTS[healthCostsVal] ?? 0);

    const otherScores: number[] = [];
    if (formData.selfSupporting) otherScores.push(7);
    const otherMax = FIELD_LIMITS.otherSocialCircumstancesMax;
    otherScores.push(clamp(Number(formData.otherSocialCircumstances || 0), otherMax));

    // Jövedelem (csak ha meg van adva)
    let incomeSum = 0;
    if (formData.perCapitaIncome !== '') {
        incomeSum = calculateIncomePoints(Number(formData.perCapitaIncome));
    }

    // Apply section caps
    const equalitySum = cap(equalityScores.reduce((a, b) => a + b, 0), SECTION_CAPS.equality);
    const applicantSum = cap(applicantScores.reduce((a, b) => a + b, 0), SECTION_CAPS.applicant);
    const communitySum = cap(communityScores.reduce((a, b) => a + b, 0), SECTION_CAPS.community);
    const supportersSum = cap(supportersScores.reduce((a, b) => a + b, 0), SECTION_CAPS.supporters);
    const livingSum = cap(livingScores.reduce((a, b) => a + b, 0), SECTION_CAPS.living);
    const otherSum = cap(otherScores.reduce((a, b) => a + b, 0), SECTION_CAPS.other);
    incomeSum = cap(incomeSum, SECTION_CAPS.income);

    const total = equalitySum + applicantSum + communitySum + supportersSum + livingSum + otherSum + incomeSum;
    return cap(total, SECTION_CAPS.total);
};