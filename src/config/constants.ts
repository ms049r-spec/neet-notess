import { SubjectId, ResourceTypeId, SubjectMeta } from '../types/resource';

export const CLOUDFLARE_R2_BASE_URL = 'https://pub-8685e97f89c64dc886e870213a4d3126.r2.dev/catalog';

export const SUBJECTS: Record<SubjectId, SubjectMeta> = {
  biology: {
    id: 'biology',
    name: 'Biology',
    tagline: 'Botany and zoology concepts, structural organization, cellular mechanisms, and physiological systems.',
    accentColor: {
      light: '#4ecdc4', // teal/mint from Variation 3
      dark: '#4ecdc4',
    },
    ncertUnits: [
      'Diversity in Living World',
      'Structural Organisation in Animals & Plants',
      'Cell Structure and Function',
      'Plant Physiology',
      'Human Physiology',
      'Reproduction',
      'Genetics and Evolution',
      'Biology and Human Welfare',
      'Biotechnology and Its Applications',
      'Ecology and Environment',
    ],
  },
  physics: {
    id: 'physics',
    name: 'Physics',
    tagline: 'Mechanics, thermodynamics, wave equations, electromagnetic theory, and modern physics from first principles.',
    accentColor: {
      light: '#45b7d1', // sky/cyan from Variation 3
      dark: '#45b7d1',
    },
    ncertUnits: [
      'Physical World and Measurement',
      'Kinematics & Laws of Motion',
      'Work, Energy and Power',
      'Motion of System of Particles and Rigid Body',
      'Gravitation & Properties of Bulk Matter',
      'Thermodynamics & Kinetic Theory',
      'Oscillations and Waves',
      'Electrostatics & Current Electricity',
      'Magnetic Effects of Current & Magnetism',
      'Electromagnetic Waves & Optics',
      'Dual Nature of Radiation & Matter',
      'Atoms, Nuclei & Electronic Devices',
    ],
  },
  chemistry: {
    id: 'chemistry',
    name: 'Chemistry',
    tagline: 'Physical chemistry principles, inorganic structure and bonding, and organic reaction mechanisms.',
    accentColor: {
      light: '#ff9f43', // warm orange from Variation 3
      dark: '#ff9f43',
    },
    ncertUnits: [
      'Some Basic Concepts of Chemistry',
      'Structure of Atom & Periodic Classification',
      'Chemical Bonding and Molecular Structure',
      'Chemical Thermodynamics & Equilibrium',
      'Redox Reactions and Electrochemistry',
      'Chemical Kinetics & Solutions',
      'Coordination Compounds & d/f Block Elements',
      'General Organic Chemistry & Hydrocarbons',
      'Haloalkanes, Alcohols, Phenols & Ethers',
      'Aldehydes, Ketones, Carboxylic Acids & Amines',
      'Biomolecules',
    ],
  },
};

export const RESOURCE_TYPES: Record<ResourceTypeId, { label: string; shortLabel: string; description: string }> = {
  'short-notes': {
    label: 'Short Notes',
    shortLabel: 'NOTES',
    description: 'Ultra-dense NCERT extractions highlighting recurring NEET keywords and exceptions.',
  },
  'revision-material': {
    label: 'Revision Material',
    shortLabel: 'REVISION',
    description: 'Comprehensive high-yield chapter summaries and NCERT line-by-line pointers.',
  },
  'mind-map': {
    label: 'Mind Maps',
    shortLabel: 'MIND MAP',
    description: 'Visual flowcharts connecting physiological loops, reaction pathways, and physical laws.',
  },
  'formula-sheet': {
    label: 'Formula Sheets',
    shortLabel: 'FORMULA',
    description: 'Dimensional equations, numerical shortcuts, SI units, and chemical conversion maps.',
  },
  'study-plan': {
    label: 'Study Plans',
    shortLabel: 'PLAN',
    description: 'Time-tested 90-day revision timetables and chapter-wise weightage priority checklists.',
  },
  'question-bank': {
    label: 'Question Banks',
    shortLabel: 'QUESTIONS',
    description: 'NCERT exemplar extractions and high-probability PYQ patterns with verified keys.',
  },
  'video': {
    label: 'Concept Videos',
    shortLabel: 'VIDEO',
    description: 'Concise lecture modules focused strictly on high-difficulty concepts.',
  },
};

