export type SupporterDisability = 'none' | 'cat12' | 'cat3' | 'other';
export type LivingSituation = 'none' | 'rent' | 'dorm' | 'own' | 'courtesy';
export type FamilyStatus = 'none' | 'divorcedNoRemarry' | 'divorcedNoSupport' | 'spouseIsSupporter';

export interface FormData {
  // Nyilvántartott esélyegyenlőségi adatok
  disadvantaged: boolean;
  multiplyDisadvantaged: boolean;
  disabled: boolean;
  largeFamily: boolean;
  familySupporter: boolean;
  orphanUnder25: boolean;
  halfOrphanUnder25: boolean;
  childCarer: boolean;

  // Kérvényező által megadandó adatok
  fosterCare: boolean;
  guardianshipEnded: boolean;
  orphanOver25: boolean;
  halfOrphanOver25: boolean;
  imaginedPaternity: boolean;

  // Eltartott testvérek
  dependentSiblings: number | '';

  // Eltartói közösség körülményei
  numberOfChildren: number | '';
  singleParent: boolean;
  caredForFamilyMembers: number | '';

  // Eltartóra vonatkozó körülmények
  supporter1Disability: SupporterDisability;
  supporter1Pensioner: boolean;
  supporter1Unemployed: boolean;
  
  supporter2Disability: SupporterDisability;
  supporter2Pensioner: boolean;
  supporter2Unemployed: boolean;
  
  familyStatus: FamilyStatus;

  // Lakhatási adatok
  livingSituation: LivingSituation;

  // Lakóhely távolsága
  distance: number;

  // Egészségügyi terhek
  healthCosts: number;

  // Önellátó
  selfSupporting: boolean;

  // Egyéb szociális körülmény
  otherSocialCircumstances: number;

  // Jövedelem
  perCapitaIncome: number | '';
}

export interface ScoreBreakdown {
  [key: string]: {
    label: string;
    points: number;
  };
}