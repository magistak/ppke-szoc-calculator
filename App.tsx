
import React, { useState, useEffect, useCallback } from 'react';
import { FormData, ScoreBreakdown } from './types.ts';
// FIX: Statically import constants to resolve errors from using `await` in a non-async
// function and to improve performance by removing unnecessary dynamic imports.
import {
    INITIAL_FORM_DATA,
    SUPPORTER_DISABILITY_POINTS,
    FAMILY_STATUS_POINTS,
    LIVING_SITUATION_POINTS
} from './constants.tsx';
import { calculateTotalScoreFromFormData, calculateSiblingPoints, calculateIncomePoints } from './calculation.ts';
import CalculatorForm from './components/CalculatorForm.tsx';
import ScoreSummary from './components/ScoreSummary.tsx';
import InformationGuide from './components/InformationGuide.tsx';

const App: React.FC = () => {
    const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
    const [totalScore, setTotalScore] = useState<number>(0);
    const [scoreBreakdown, setScoreBreakdown] = useState<ScoreBreakdown>({});

    const calculateScores = useCallback(() => {
        const breakdown: ScoreBreakdown = {};
        
        const addScore = (key: string, label: string, points: number) => {
            if (points !== 0) {
                breakdown[key] = { label, points };
            }
        };

        // This breakdown logic is for UI display purposes.
        // The final total is calculated by the single-source-of-truth function.

        // Esélyegyenlőség
        addScore('disadvantaged', 'Hátrányos helyzet', formData.disadvantaged ? 10 : 0);
        addScore('multiplyDisadvantaged', 'Halmozottan hátrányos helyzet', formData.multiplyDisadvantaged ? 15 : 0);
        addScore('disabled', 'Fogyatékkal élő', formData.disabled ? 10 : 0);
        addScore('largeFamily', 'Nagycsaládos', formData.largeFamily ? 5 : 0);
        addScore('familySupporter', 'Családfenntartó', formData.familySupporter ? 5 : 0);
        addScore('orphanUnder25', 'Árva (25 éves korig)', formData.orphanUnder25 ? 17 : 0);
        addScore('halfOrphanUnder25', 'Félárva (25 éves korig)', formData.halfOrphanUnder25 ? 12 : 0);
        addScore('childCarer', 'Gyermekgondozó', formData.childCarer ? 7 : 0);

        // Kérvényező adatai
        addScore('fosterCare', 'Tartós nevelésbe vétel', formData.fosterCare ? 6 : 0);
        addScore('guardianshipEnded', 'Gyámság megszűnése', formData.guardianshipEnded ? 12 : 0);
        addScore('orphanOver25', 'Árva (25 év felett)', formData.orphanOver25 ? 17 : 0);
        addScore('halfOrphanOver25', 'Félárva (25 év felett)', formData.halfOrphanOver25 ? 12 : 0);
        addScore('imaginedPaternity', 'Képzelt apaság', formData.imaginedPaternity ? 5 : 0);
        
        // Családi körülmények
        addScore('dependentSiblings', 'Eltartott testvérek', calculateSiblingPoints(Number(formData.dependentSiblings)));
        addScore('numberOfChildren', 'Kérvényező gyermekeinek száma', Number(formData.numberOfChildren) * 7);
        addScore('singleParent', 'Gyermekeit egyedül neveli', formData.singleParent ? 5 : 0);
        addScore('caredForFamilyMembers', 'Ápolásra szoruló családtagok', Number(formData.caredForFamilyMembers) * 7);
        
        // Eltartók
        // FIX: Replaced `await import()` with a statically imported constant to fix usage of await in a non-async function.
        addScore('supporter1Disability', '1. Eltartó rokkantsága', formData.supporter1Disability !== 'none' ? SUPPORTER_DISABILITY_POINTS[formData.supporter1Disability] : 0);
        addScore('supporter1Pensioner', '1. Eltartó nyugdíjas', formData.supporter1Pensioner ? 4 : 0);
        addScore('supporter1Unemployed', '1. Eltartó munkanélküli', formData.supporter1Unemployed ? 6 : 0);
        
        // FIX: Replaced `await import()` with a statically imported constant to fix usage of await in a non-async function.
        addScore('supporter2Disability', '2. Eltartó rokkantsága', formData.supporter2Disability !== 'none' ? SUPPORTER_DISABILITY_POINTS[formData.supporter2Disability] : 0);
        addScore('supporter2Pensioner', '2. Eltartó nyugdíjas', formData.supporter2Pensioner ? 4 : 0);
        addScore('supporter2Unemployed', '2. Eltartó munkanélküli', formData.supporter2Unemployed ? 6 : 0);
        
        // FIX: Replaced `await import()` with a statically imported constant to fix usage of await in a non-async function.
        addScore('familyStatus', 'Családi állapot', formData.familyStatus !== 'none' ? FAMILY_STATUS_POINTS[formData.familyStatus] : 0);

        // Lakhatás és egyéb
        // FIX: Replaced `await import()` with a statically imported constant to fix usage of await in a non-async function.
        addScore('livingSituation', 'Lakhatási körülmények', formData.livingSituation !== 'none' ? LIVING_SITUATION_POINTS[formData.livingSituation] : 0);
        addScore('distance', 'Lakóhely távolsága', formData.distance);
        addScore('healthCosts', 'Rendszeres egészségügyi teher', formData.healthCosts);
        addScore('selfSupporting', 'Önellátó hallgató', formData.selfSupporting ? 7 : 0);
        addScore('otherSocialCircumstances', 'Egyéb szociális körülmény', formData.otherSocialCircumstances);

        // Jövedelem
        addScore('perCapitaIncome', 'Egy főre eső jövedelem', calculateIncomePoints(Number(formData.perCapitaIncome)));

        const total = calculateTotalScoreFromFormData(formData);
        
        setScoreBreakdown(breakdown);
        setTotalScore(total);
    }, [formData]);

    useEffect(() => {
        calculateScores();
    }, [calculateScores]);
    
    const handleReset = () => {
        setFormData(INITIAL_FORM_DATA);
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-800 dark:bg-gray-900 dark:text-gray-200">
            <header className="bg-white dark:bg-gray-800 shadow-md">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6e/Logo_univpazmany.svg" alt="Pázmány Logo" className="h-16" />
                        <div>
                           <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Szociális Támogatás Pontkalkulátor</h1>
                           <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">2025/26-os Egységes Pontrendszer alapján</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                 <>
                    <div className="mb-8">
                        <InformationGuide />
                    </div>
                    <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                        <div className="lg:col-span-2">
                            <CalculatorForm formData={formData} setFormData={setFormData} />
                        </div>
                        <div className="mt-8 lg:mt-0 lg:col-span-1">
                           <ScoreSummary totalScore={totalScore} breakdown={scoreBreakdown} onReset={handleReset} />
                        </div>
                    </div>
                </>
            </main>
            <footer className="text-center py-4 mt-8 text-gray-500 dark:text-gray-400 text-sm">
                <p>Ez egy nem hivatalos kalkulátor. A végleges pontszámot a Neptun rendszerben leadott kérvény alapján számolják.</p>
            </footer>
        </div>
    );
};

export default App;
