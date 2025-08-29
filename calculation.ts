
import { FormData } from './types.ts';
import { SUPPORTER_DISABILITY_POINTS, FAMILY_STATUS_POINTS, LIVING_SITUATION_POINTS } from './constants.tsx';

export const calculateSiblingPoints = (count: number): number => {
    if (count <= 0) return 0;
    if (count === 1) return 4;
    if (count === 2) return 8;
    if (count === 3) return 12;
    if (count === 4) return 15;
    if (count === 5) return 17;
    if (count === 6) return 19;
    return 19 + (count - 6) * 2;
};

export const calculateIncomePoints = (income: number): number => {
    if (income < 0) return 0;
    if (income <= 59999) return 45;
    if (income <= 64999) return 42;
    if (income <= 69999) return 39;
    if (income <= 74999) return 36;
    if (income <= 79999) return 33;
    if (income <= 84999) return 30;
    if (income <= 89999) return 27;
    if (income <= 94999) return 24;
    if (income <= 99999) return 21;
    if (income <= 104999) return 18;
    if (income <= 109999) return 15;
    if (income <= 114999) return 12;
    if (income <= 119999) return 9;
    if (income <= 124999) return 6;
    if (income <= 129999) return 3;
    if (income <= 159999) return 0;
    if (income <= 164999) return -3;
    
    const stepsAbove = Math.floor((income - 165000) / 5000);
    return -6 - (stepsAbove * 3);
};

export const calculateTotalScoreFromFormData = (formData: FormData): number => {
    const scores: number[] = [];

    // Esélyegyenlőség
    if (formData.disadvantaged) scores.push(10);
    if (formData.multiplyDisadvantaged) scores.push(15);
    if (formData.disabled) scores.push(10);
    if (formData.largeFamily) scores.push(5);
    if (formData.familySupporter) scores.push(5);
    if (formData.orphanUnder25) scores.push(17);
    if (formData.halfOrphanUnder25) scores.push(12);
    if (formData.childCarer) scores.push(7);

    // Kérvényező adatai
    if (formData.fosterCare) scores.push(6);
    if (formData.guardianshipEnded) scores.push(12);
    if (formData.orphanOver25) scores.push(17);
    if (formData.halfOrphanOver25) scores.push(12);
    if (formData.imaginedPaternity) scores.push(5);
    
    // Családi körülmények
    scores.push(calculateSiblingPoints(Number(formData.dependentSiblings)));
    scores.push(Number(formData.numberOfChildren) * 7);
    if (formData.singleParent) scores.push(5);
    scores.push(Number(formData.caredForFamilyMembers) * 7);
    
    // Eltartók
    scores.push(SUPPORTER_DISABILITY_POINTS[formData.supporter1Disability]);
    if (formData.supporter1Pensioner) scores.push(4);
    if (formData.supporter1Unemployed) scores.push(6);
    
    scores.push(SUPPORTER_DISABILITY_POINTS[formData.supporter2Disability]);
    if (formData.supporter2Pensioner) scores.push(4);
    if (formData.supporter2Unemployed) scores.push(6);
    
    scores.push(FAMILY_STATUS_POINTS[formData.familyStatus]);

    // Lakhatás és egyéb
    scores.push(LIVING_SITUATION_POINTS[formData.livingSituation]);
    scores.push(formData.distance);
    scores.push(formData.healthCosts);
    if (formData.selfSupporting) scores.push(7);
    scores.push(formData.otherSocialCircumstances);

    // Jövedelem
    scores.push(calculateIncomePoints(Number(formData.perCapitaIncome)));

    return scores.reduce((sum, current) => sum + current, 0);
};