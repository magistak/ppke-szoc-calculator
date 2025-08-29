
// @ts-nocheck
// This file contains test cases for the point calculation logic.
// It is prepared to be run with a standard test runner like Jest.

import { describe, test, expect } from '@jest/globals';
import { FormData, LivingSituation } from './types.ts';
import { INITIAL_FORM_DATA } from './constants.tsx';
import { calculateTotalScoreFromFormData } from './calculation.ts';

// Helper to create form data for tests by overriding defaults
const getTestData = (overrides: Partial<FormData>): FormData => {
    return { ...INITIAL_FORM_DATA, ...overrides };
};

describe('Szociális Pontkalkulátor - Pontszámítási Tesztek', () => {

    describe('Nyilvántartott esélyegyenlőségi adatok', () => {
        test.each([
            ['disadvantaged', 10],
            ['multiplyDisadvantaged', 15],
            ['disabled', 10],
            ['largeFamily', 5],
            ['familySupporter', 5],
            ['orphanUnder25', 17],
            ['halfOrphanUnder25', 12],
            ['childCarer', 7],
        ])('should award %s points for %s', (key, points) => {
            const formData = getTestData({ [key]: true });
            expect(calculateTotalScoreFromFormData(formData)).toEqual(points);
        });

        it('should sum points for multiple equality statuses', () => {
            const formData = getTestData({ disadvantaged: true, disabled: true, largeFamily: true });
            expect(calculateTotalScoreFromFormData(formData)).toEqual(10 + 10 + 5);
        });
    });
    
    describe('Kérvényező által megadandó adatok', () => {
        test.each([
            ['fosterCare', 6],
            ['guardianshipEnded', 12],
            ['orphanOver25', 17],
            ['halfOrphanOver25', 12],
            ['imaginedPaternity', 5],
        ])('should award %s points for %s', (key, points) => {
            const formData = getTestData({ [key]: true });
            expect(calculateTotalScoreFromFormData(formData)).toEqual(points);
        });
    });

    describe('Eltartott testvérek', () => {
        test.each([
            [0, 0],
            [1, 4],
            [2, 8],
            [3, 12],
            [4, 15],
            [5, 17],
            [6, 19],
            [7, 21],
            [10, 27],
        ])('should award %i points for %i dependent siblings', (count, points) => {
            const formData = getTestData({ dependentSiblings: count });
            expect(calculateTotalScoreFromFormData(formData)).toEqual(points);
        });
    });

    describe('Eltartói közösség körülményei', () => {
        it('should award 7 points per child', () => {
            expect(calculateTotalScoreFromFormData(getTestData({ numberOfChildren: 1 }))).toEqual(7);
            expect(calculateTotalScoreFromFormData(getTestData({ numberOfChildren: 3 }))).toEqual(21);
        });

        it('should award 5 points for being a single parent', () => {
            expect(calculateTotalScoreFromFormData(getTestData({ singleParent: true }))).toEqual(5);
        });

        it('should award 7 points per cared for family member', () => {
            expect(calculateTotalScoreFromFormData(getTestData({ caredForFamilyMembers: 1 }))).toEqual(7);
            expect(calculateTotalScoreFromFormData(getTestData({ caredForFamilyMembers: 2 }))).toEqual(14);
        });

        it('should sum points for multiple community circumstances', () => {
            const formData = getTestData({ numberOfChildren: 2, singleParent: true });
            expect(calculateTotalScoreFromFormData(formData)).toEqual(14 + 5);
        });
    });

    describe('Eltartóra vonatkozó körülmények', () => {
        it('should calculate points for supporter 1', () => {
            expect(calculateTotalScoreFromFormData(getTestData({ supporter1Disability: 'cat12' }))).toEqual(10);
            expect(calculateTotalScoreFromFormData(getTestData({ supporter1Disability: 'cat3' }))).toEqual(8);
            expect(calculateTotalScoreFromFormData(getTestData({ supporter1Disability: 'other' }))).toEqual(6);
            expect(calculateTotalScoreFromFormData(getTestData({ supporter1Pensioner: true }))).toEqual(4);
            expect(calculateTotalScoreFromFormData(getTestData({ supporter1Unemployed: true }))).toEqual(6);
        });
        
        it('should sum points for supporter 1', () => {
            const formData = getTestData({ supporter1Disability: 'cat12', supporter1Unemployed: true });
            expect(calculateTotalScoreFromFormData(formData)).toEqual(10 + 6);
        });

        it('should sum points for both supporters', () => {
            const formData = getTestData({ supporter1Pensioner: true, supporter2Disability: 'cat3' });
            expect(calculateTotalScoreFromFormData(formData)).toEqual(4 + 8);
        });

        it('should calculate points for family status', () => {
            expect(calculateTotalScoreFromFormData(getTestData({ familyStatus: 'divorcedNoRemarry' }))).toEqual(7);
            expect(calculateTotalScoreFromFormData(getTestData({ familyStatus: 'divorcedNoSupport' }))).toEqual(9);
            expect(calculateTotalScoreFromFormData(getTestData({ familyStatus: 'spouseIsSupporter' }))).toEqual(4);
        });
    });

    describe('Lakhatási adatok', () => {
        test.each<[LivingSituation, number]>([
            ['rent', 20],
            ['dorm', 15],
            ['own', 5],
            ['courtesy', 5],
            ['none', 0],
        ])('should award %i points for %s', (situation, points) => {
            const formData = getTestData({ livingSituation: situation });
            expect(calculateTotalScoreFromFormData(formData)).toEqual(points);
        });
    });

    describe('Lakóhely távolsága', () => {
        test.each([
            [0, 0],
            [1, 1],
            [5, 5],
            [10, 10],
        ])('should award %i points for distance option %i', (value, points) => {
            const formData = getTestData({ distance: value });
            expect(calculateTotalScoreFromFormData(formData)).toEqual(points);
        });
    });
    
    describe('Egészségügyi terhek', () => {
         test.each([
            [0, 0],
            [2, 2],
            [4, 4],
            [5, 5],
            [6, 6],
            [7, 7],
            [8, 8],
        ])('should award %i points for health cost option %i', (value, points) => {
            const formData = getTestData({ healthCosts: value });
            expect(calculateTotalScoreFromFormData(formData)).toEqual(points);
        });
    });

    describe('Egyéb körülmények', () => {
        it('should award 7 points for being self-supporting', () => {
            expect(calculateTotalScoreFromFormData(getTestData({ selfSupporting: true }))).toEqual(7);
        });
        it('should award points for other social circumstances', () => {
            expect(calculateTotalScoreFromFormData(getTestData({ otherSocialCircumstances: 5 }))).toEqual(5);
            expect(calculateTotalScoreFromFormData(getTestData({ otherSocialCircumstances: 10 }))).toEqual(10);
        });
    });

    describe('Egy főre eső jövedelem', () => {
        test.each([
            [0, 45],
            [59999, 45],
            [60000, 42],
            [64999, 42],
            [97000, 21],
            [129999, 3],
            [130000, 0],
            [159999, 0],
            [160000, -3],
            [164999, -3],
            [165000, -6],
            [169999, -6],
            [170000, -9],
            [174999, -9],
        ])('should award %i points for income of %i Ft', (income, points) => {
            const formData = getTestData({ perCapitaIncome: income });
            expect(calculateTotalScoreFromFormData(formData)).toEqual(points);
        });
    });
    
    describe('Teljes kalkulációs forgatókönyvek', () => {
        it('should calculate the total score correctly for a complex scenario 1', () => {
            const formData = getTestData({
                disadvantaged: true,
                halfOrphanUnder25: true,
                dependentSiblings: 2,
                supporter1Disability: 'cat3',
                supporter2Pensioner: true,
                livingSituation: 'rent',
                distance: 4,
                healthCosts: 5,
                perCapitaIncome: 78000,
            });
            const expectedScore = 10 + 12 + 8 + 8 + 4 + 20 + 4 + 5 + 33;
            expect(calculateTotalScoreFromFormData(formData)).toEqual(expectedScore);
        });

        it('should calculate the total score correctly for a complex scenario 2 (with children)', () => {
            const formData = getTestData({
                familySupporter: true,
                numberOfChildren: 2,
                singleParent: true,
                caredForFamilyMembers: 1,
                familyStatus: 'divorcedNoSupport',
                selfSupporting: true,
                perCapitaIncome: 168000,
            });
            const expectedScore = 5 + 14 + 5 + 7 + 9 + 7 - 6;
            expect(calculateTotalScoreFromFormData(formData)).toEqual(expectedScore);
        });

        it('should return 0 for the initial empty form', () => {
            expect(calculateTotalScoreFromFormData(INITIAL_FORM_DATA)).toEqual(0);
        })
    });
});
