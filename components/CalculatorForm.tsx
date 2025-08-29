
import React from 'react';
import { FormData, SupporterDisability, LivingSituation, FamilyStatus } from '../types.ts';
import AccordionItem from './AccordionItem.tsx';
import Tooltip from './Tooltip.tsx';
import { DISTANCE_OPTIONS, HEALTH_COSTS_OPTIONS } from '../constants.tsx';
import { HELP_TEXTS } from '../constants/helpTexts.ts';

interface CalculatorFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const Checkbox: React.FC<{ id: keyof FormData; label: string; points: number; tooltipText?: string } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'>> = ({ id, label, points, tooltipText, ...props }) => {
    return (
        <label htmlFor={id as string} className="flex items-center justify-between p-3 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
            <div className="flex items-center space-x-2">
              <span className="text-gray-700 dark:text-gray-300">{label}</span>
              {tooltipText && <Tooltip text={tooltipText} />}
            </div>
            <div className="flex items-center space-x-3">
                <span className="text-sm font-semibold text-blue-800 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300 px-2.5 py-0.5 rounded-full">{points} pont</span>
                <input type="checkbox" id={id as string} name={id as string} {...props} className="h-5 w-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" />
            </div>
        </label>
    );
};

const CalculatorForm: React.FC<CalculatorFormProps> = ({ formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, tagName } = e.target;
    if (tagName.toLowerCase() === 'input' && value === '') {
        setFormData(prev => ({ ...prev, [name]: '' }));
    } else {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue)) {
            setFormData(prev => ({ ...prev, [name]: numValue }));
        }
    }
  };
  
  return (
    <div className="space-y-4">
      <AccordionItem title="Esélyegyenlőségi adatok" isOpenDefault={true}>
        <Checkbox id="disadvantaged" label="Hátrányos helyzet" points={10} checked={formData.disadvantaged} onChange={handleChange} tooltipText={HELP_TEXTS.disadvantaged} />
        <Checkbox id="multiplyDisadvantaged" label="Halmozottan hátrányos helyzet" points={15} checked={formData.multiplyDisadvantaged} onChange={handleChange} tooltipText={HELP_TEXTS.multiplyDisadvantaged} />
        <Checkbox id="disabled" label="Fogyatékkal élő" points={10} checked={formData.disabled} onChange={handleChange} tooltipText={HELP_TEXTS.disabled} />
        <Checkbox id="largeFamily" label="Nagycsaládos" points={5} checked={formData.largeFamily} onChange={handleChange} tooltipText={HELP_TEXTS.largeFamily} />
        <Checkbox id="familySupporter" label="Családfenntartó" points={5} checked={formData.familySupporter} onChange={handleChange} tooltipText={HELP_TEXTS.familySupporter} />
        <Checkbox id="orphanUnder25" label="Árva (25 éves korig)" points={17} checked={formData.orphanUnder25} onChange={handleChange} tooltipText={HELP_TEXTS.orphanUnder25} />
        <Checkbox id="halfOrphanUnder25" label="Félárva (25 éves korig)" points={12} checked={formData.halfOrphanUnder25} onChange={handleChange} tooltipText={HELP_TEXTS.halfOrphanUnder25} />
        <Checkbox id="childCarer" label="Gyermekgondozó" points={7} checked={formData.childCarer} onChange={handleChange} tooltipText={HELP_TEXTS.childCarer} />
      </AccordionItem>
      
      <AccordionItem title="Kérvényező által megadandó adatok">
        <Checkbox id="fosterCare" label="Nagykorúságáig tartós nevelésbe volt véve" points={6} checked={formData.fosterCare} onChange={handleChange} tooltipText={HELP_TEXTS.fosterCare} />
        <Checkbox id="guardianshipEnded" label="Gyámsága nagykorúsága miatt szűnt meg" points={12} checked={formData.guardianshipEnded} onChange={handleChange} tooltipText={HELP_TEXTS.guardianshipEnded} />
        <Checkbox id="orphanOver25" label="Árva 25 év felett" points={17} checked={formData.orphanOver25} onChange={handleChange} tooltipText={HELP_TEXTS.orphanOver25} />
        <Checkbox id="halfOrphanOver25" label="Félárva 25 év felett" points={12} checked={formData.halfOrphanOver25} onChange={handleChange} tooltipText={HELP_TEXTS.halfOrphanOver25} />
        <Checkbox id="imaginedPaternity" label="Határozat képzelt apaságról" points={5} checked={formData.imaginedPaternity} onChange={handleChange} tooltipText={HELP_TEXTS.imaginedPaternity} />
      </AccordionItem>

      <AccordionItem title="Családi és közösségi körülmények">
          <div>
            <div className="flex items-center space-x-2 mb-1">
                <label htmlFor="dependentSiblings" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Eltartott testvérek száma</label>
                <Tooltip text={HELP_TEXTS.dependentSiblings} />
            </div>
            <input type="number" name="dependentSiblings" id="dependentSiblings" min="0" value={formData.dependentSiblings} onChange={handleNumberChange} className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200" />
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
                <label htmlFor="numberOfChildren" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kérvényező gyermekeinek száma (+7 pont/gyermek)</label>
                <Tooltip text={HELP_TEXTS.numberOfChildren} />
            </div>
            <input type="number" name="numberOfChildren" id="numberOfChildren" min="0" value={formData.numberOfChildren} onChange={handleNumberChange} className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200" />
          </div>
          <Checkbox id="singleParent" label="Gyermekeit egyedül neveli" points={5} checked={formData.singleParent} onChange={handleChange} tooltipText={HELP_TEXTS.singleParent} />
          <div>
            <div className="flex items-center space-x-2 mb-1">
                <label htmlFor="caredForFamilyMembers" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ápolásra szoruló családtagok száma (+7 pont/fő)</label>
                <Tooltip text={HELP_TEXTS.caredForFamilyMembers} />
            </div>
            <input type="number" name="caredForFamilyMembers" id="caredForFamilyMembers" min="0" value={formData.caredForFamilyMembers} onChange={handleNumberChange} className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200" />
          </div>
      </AccordionItem>
      
      <AccordionItem title="Eltartókra vonatkozó körülmények">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border dark:border-gray-700 rounded-lg space-y-4">
                <h4 className="font-semibold text-md text-gray-800 dark:text-gray-200">1. Eltartó</h4>
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rokkantság</label>
                        <Tooltip text={HELP_TEXTS.supporterDisability} />
                    </div>
                    <select name="supporter1Disability" value={formData.supporter1Disability} onChange={handleChange} className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200">
                        <option value="none">Nem rokkant</option>
                        <option value="cat12">I. vagy II. kategóriás (+10p)</option>
                        <option value="cat3">III. kategóriás (+8p)</option>
                        <option value="other">Kategórián kívüli (+6p)</option>
                    </select>
                </div>
                <Checkbox id="supporter1Pensioner" label="Nyugdíjban részesül" points={4} checked={formData.supporter1Pensioner} onChange={handleChange} tooltipText={HELP_TEXTS.supporterPensioner} />
                <Checkbox id="supporter1Unemployed" label="Munkanélküli" points={6} checked={formData.supporter1Unemployed} onChange={handleChange} tooltipText={HELP_TEXTS.supporterUnemployed} />
            </div>
            <div className="p-4 border dark:border-gray-700 rounded-lg space-y-4">
                <h4 className="font-semibold text-md text-gray-800 dark:text-gray-200">2. Eltartó</h4>
                 <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rokkantság</label>
                        <Tooltip text={HELP_TEXTS.supporterDisability} />
                    </div>
                    <select name="supporter2Disability" value={formData.supporter2Disability} onChange={handleChange} className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200">
                        <option value="none">Nem rokkant</option>
                        <option value="cat12">I. vagy II. kategóriás (+10p)</option>
                        <option value="cat3">III. kategóriás (+8p)</option>
                        <option value="other">Kategórián kívüli (+6p)</option>
                    </select>
                </div>
                <Checkbox id="supporter2Pensioner" label="Nyugdíjban részesül" points={4} checked={formData.supporter2Pensioner} onChange={handleChange} tooltipText={HELP_TEXTS.supporterPensioner} />
                <Checkbox id="supporter2Unemployed" label="Munkanélküli" points={6} checked={formData.supporter2Unemployed} onChange={handleChange} tooltipText={HELP_TEXTS.supporterUnemployed} />
            </div>
        </div>
        <div className="pt-6">
            <div className="flex items-center space-x-2 mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Családi állapot (eltartók)</label>
                <Tooltip text={HELP_TEXTS.familyStatus} />
            </div>
            <select name="familyStatus" value={formData.familyStatus} onChange={handleChange} className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200">
                <option value="none">Nincs</option>
                <option value="divorcedNoRemarry">Eltartók elváltak, eltartó nem házasodott újra (+7p)</option>
                <option value="divorcedNoSupport">Eltartók elváltak, eltartó nem kap támogatást (+9p)</option>
                <option value="spouseIsSupporter">Eltartó a kérvényező házastársa (+4p)</option>
            </select>
        </div>
      </AccordionItem>

      <AccordionItem title="Lakhatás, távolság és egészségügyi terhek">
        <div>
            <div className="flex items-center space-x-2 mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lakhatási körülmények</label>
                <Tooltip text={HELP_TEXTS.livingSituation} />
            </div>
            <select name="livingSituation" value={formData.livingSituation} onChange={handleChange} className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200">
                <option value="none">Nincs</option>
                <option value="rent">Albérlet (+20p)</option>
                <option value="own">Saját lakás (+5p)</option>
                <option value="courtesy">Szívességi lakáshasználat (+5p)</option>
                <option value="dorm">Kollégium/diákotthon (+15p)</option>
            </select>
        </div>
        <div>
            <div className="flex items-center space-x-2 mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lakóhely távolsága az intézménytől</label>
                <Tooltip text={HELP_TEXTS.distance} />
            </div>
             <select name="distance" value={formData.distance} onChange={handleNumberChange} className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200">
                 {DISTANCE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
        </div>
        <div>
            <div className="flex items-center space-x-2 mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rendszeres egészségügyi terhek havonta</label>
                <Tooltip text={HELP_TEXTS.healthCosts} />
            </div>
             <select name="healthCosts" value={formData.healthCosts} onChange={handleNumberChange} className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200">
                 {HEALTH_COSTS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
        </div>
      </AccordionItem>

      <AccordionItem title="Egyéb körülmények és jövedelem">
        <Checkbox id="selfSupporting" label="Önellátó hallgató" points={7} checked={formData.selfSupporting} onChange={handleChange} tooltipText={HELP_TEXTS.selfSupporting} />
        <div>
            <div className="flex items-center space-x-2 mb-1">
                <label htmlFor="otherSocialCircumstances" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Egyéb szociális körülményre adható pontszám ({formData.otherSocialCircumstances} pont)</label>
                <Tooltip text={HELP_TEXTS.otherSocialCircumstances} />
            </div>
            <input type="range" min="0" max="10" name="otherSocialCircumstances" id="otherSocialCircumstances" value={formData.otherSocialCircumstances} onChange={handleNumberChange} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer" />
        </div>
        <div>
            <div className="flex items-center space-x-2 mb-1">
                <label htmlFor="perCapitaIncome" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Eltartói közösség egy főre eső havi nettó jövedelme (Ft)</label>
                <Tooltip text={HELP_TEXTS.perCapitaIncome} />
            </div>
            <div className="relative rounded-md shadow-sm">
                <input type="number" name="perCapitaIncome" id="perCapitaIncome" min="0" value={formData.perCapitaIncome} onChange={handleNumberChange} className="block w-full rounded-md border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 pl-8 bg-white dark:bg-gray-700 dark:text-gray-200" />
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 dark:text-gray-400 sm:text-sm">Ft</span>
                </div>
            </div>
        </div>
      </AccordionItem>
    </div>
  );
};

export default CalculatorForm;