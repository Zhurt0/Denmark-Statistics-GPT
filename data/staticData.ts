import { Registry, Category } from '../types';

export const REGISTRIES: Registry[] = [
  {
    id: '1',
    code: 'BEF',
    name: 'The Population Registry (CPR)',
    category: Category.POPULATION,
    description: 'Contains information on the entire Danish population. It includes variables on birth, death, migration, and family structure.',
    documentationUrl: 'https://www.dst.dk/en/TilSalg/Forskningsservice/Dokumentation/hoejkvalitetsvariable/befolkning',
    keyVariables: [
      { name: 'CPR_NR', description: 'Unique Personal Identification Number' },
      { name: 'KOEN', description: 'Gender' },
      { name: 'FOED_DAG', description: 'Date of Birth' },
      { name: 'CIVST', description: 'Marital Status' },
      { name: 'FAMILIE_ID', description: 'Family Identification Number' }
    ],
    papers: [
      {
        title: 'The effect of family size on education: New evidence from population registry data',
        authors: 'Black, Devereux, Salvanes',
        journal: 'Review of Economic Studies',
        year: '2005',
        url: 'https://academic.oup.com/restud/article/72/1/197/1554325'
      }
    ]
  },
  {
    id: '2',
    code: 'IDAN',
    name: 'Integrated Database for Labor Market Research',
    category: Category.LABOR,
    description: 'Detailed information on individuals labor market status, hourly wages, jobs, and unemployment.',
    documentationUrl: 'https://www.dst.dk/extranet/forskningvariabellister/Oversigt%20over%20registre.html',
    keyVariables: [
      { name: 'STILL', description: 'Position/Job Type' },
      { name: 'SOC_STATUS', description: 'Socioeconomic Status' },
      { name: 'LOEN', description: 'Salary/Wage info' },
      { name: 'ARB_TID', description: 'Working Hours' }
    ],
    papers: [
      {
        title: 'Childhood exposure to crime and adult criminal behavior',
        authors: 'Damm, Dustmann',
        journal: 'American Economic Journal: Applied Economics',
        year: '2017',
        url: 'https://www.aeaweb.org/articles?id=10.1257/app.20170604'
      }
    ]
  },
  {
    id: 'social-module',
    code: 'SOC_MODULE',
    name: 'Moduldata for sociale forhold',
    category: Category.INCOME,
    description: 'Contains variables related to social benefits, municipal codes for benefits (e.g., AEL_KOMKOD), and social interventions.',
    documentationUrl: 'https://www.dst.dk/da/Statistik/dokumentation/Times/moduldata-for-sociale-forhold--sundhedsvaesen--retsvaesen',
    keyVariables: [
      { name: 'AEL_KOMKOD', description: 'Municipality code for payment of elderly check' },
      { name: 'YDELSE_ART', description: 'Type of social benefit' },
      { name: 'BELOEB', description: 'Amount paid' }
    ],
    papers: []
  },
  {
    id: '3',
    code: 'LPR',
    name: 'National Patient Registry',
    category: Category.HEALTH,
    description: 'Data on all hospital admissions, diagnoses, and treatments in Denmark.',
    documentationUrl: 'https://sundhedsdatastyrelsen.dk/da/registre-og-services/om-landspatientregisteret',
    keyVariables: [
      { name: 'DIAG', description: 'Diagnosis Code (ICD-10)' },
      { name: 'INDL_DATO', description: 'Admission Date' },
      { name: 'UDSKR_DATO', description: 'Discharge Date' },
      { name: 'SYGEHUS', description: 'Hospital Code' }
    ],
    papers: []
  },
  {
    id: '4',
    code: 'UDD',
    name: 'Student Register',
    category: Category.EDUCATION,
    description: 'Information on all students currently enrolled in education in Denmark.',
    documentationUrl: 'https://www.dst.dk/en/TilSalg/Forskningsservice/Dokumentation/hoejkvalitetsvariable/uddannelse',
    keyVariables: [
      { name: 'AUDD', description: 'Current Education Code' },
      { name: 'INSTNR', description: 'Institution Number' },
      { name: 'START_DATO', description: 'Start Date of Education' }
    ],
    papers: []
  },
  {
    id: '5',
    code: 'IND',
    name: 'Income Statistics',
    category: Category.INCOME,
    description: 'Detailed income and tax information for all citizens.',
    documentationUrl: 'https://www.dst.dk/da/Statistik/dokumentation/statistikdokumentation/indkomststatistik',
    keyVariables: [
      { name: 'PERINDKIALT', description: 'Total Personal Income' },
      { name: 'DISPON_NY', description: 'Disposable Income' },
      { name: 'SKAT_IALT', description: 'Total Tax' }
    ],
    papers: []
  },
  {
    id: '6',
    code: 'BBR',
    name: 'Building and Dwelling Register',
    category: Category.HOUSING,
    description: 'Detailed physical information on all buildings and housing units in Denmark.',
    documentationUrl: 'https://bbr.dk/forside',
    keyVariables: [
      { name: 'OPFOERELSE_AAR', description: 'Year of Construction' },
      { name: 'AREAL_BOLIG', description: 'Living Area (sq meters)' },
      { name: 'VARMEINSTAL', description: 'Heating Installation Code' }
    ],
    papers: []
  },
  {
    id: '7',
    code: 'DREAM',
    name: 'DREAM Database',
    category: Category.LABOR,
    description: 'Longitudinal social benefit data. Tracks weekly public transfer payments (unemployment, pension, leave, etc.).',
    documentationUrl: 'https://www.dst.dk/da/Statistik/dokumentation/Times/dream',
    keyVariables: [
      { name: 'BRANCH_KODE', description: 'Branch Code' },
      { name: 'YDELSE_TYPE', description: 'Type of Benefit' }
    ],
    papers: []
  },
  {
    id: '8',
    code: 'MFR',
    name: 'Medical Birth Registry',
    category: Category.HEALTH,
    description: 'Contains medical information about all births in Denmark.',
    documentationUrl: 'https://sundhedsdatastyrelsen.dk/da/registre-og-services/om-foedselsregisteret',
    keyVariables: [
      { name: 'VAGT', description: 'Birth Weight' },
      { name: 'LAENGDE', description: 'Birth Length' },
      { name: 'GESTATIONSALDER', description: 'Gestational Age' }
    ],
    papers: []
  }
];