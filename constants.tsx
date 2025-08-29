
import React from 'react';
import { FormData } from './types.ts';

export const CHEVRON_DOWN = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 transition-transform duration-200"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const CHEVRON_UP = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 transition-transform duration-200"
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  );

export const INITIAL_FORM_DATA: FormData = {
    disadvantaged: false,
    multiplyDisadvantaged: false,
    disabled: false,
    largeFamily: false,
    familySupporter: false,
    orphanUnder25: false,
    halfOrphanUnder25: false,
    childCarer: false,
    fosterCare: false,
    guardianshipEnded: false,
    orphanOver25: false,
    halfOrphanOver25: false,
    imaginedPaternity: false,
    dependentSiblings: 0,
    numberOfChildren: 0,
    singleParent: false,
    caredForFamilyMembers: 0,
    supporter1Disability: 'none',
    supporter1Pensioner: false,
    supporter1Unemployed: false,
    supporter2Disability: 'none',
    supporter2Pensioner: false,
    supporter2Unemployed: false,
    familyStatus: 'none',
    livingSituation: 'none',
    distance: 0,
    healthCosts: 0,
    selfSupporting: false,
    otherSocialCircumstances: 0,
    perCapitaIncome: 0,
};

export const DISTANCE_OPTIONS = [
    { value: 0, label: '0 km (azonos település)' },
    { value: 1, label: '1-39 km' },
    { value: 2, label: '40-79 km' },
    { value: 3, label: '80-119 km' },
    { value: 4, label: '120-159 km' },
    { value: 5, label: '160-199 km' },
    { value: 6, label: '200-249 km' },
    { value: 7, label: '250-299 km' },
    { value: 8, label: '300-349 km' },
    { value: 9, label: '350-399 km' },
    { value: 10, label: '≥ 400 km' },
];

export const HEALTH_COSTS_OPTIONS = [
    { value: 0, label: '0 – 2.499 Ft/hó' },
    { value: 2, label: '2.500 – 4.999 Ft/hó' },
    { value: 4, label: '5.000 – 9.999 Ft/hó' },
    { value: 5, label: '10.000 – 14.999 Ft/hó' },
    { value: 6, label: '15.000 - 19.999 Ft/hó' },
    { value: 7, label: '20.000 – 24.999 Ft/hó' },
    { value: 8, label: '≥ 25.000 Ft/hó' },
];

export const SUPPORTER_DISABILITY_POINTS = {
    'none': 0,
    'cat12': 10,
    'cat3': 8,
    'other': 6,
};

export const FAMILY_STATUS_POINTS = {
    'none': 0,
    'divorcedNoRemarry': 7,
    'divorcedNoSupport': 9,
    'spouseIsSupporter': 4,
};

export const LIVING_SITUATION_POINTS = {
    'none': 0,
    'rent': 20,
    'dorm': 15,
    'own': 5,
    'courtesy': 5,
};