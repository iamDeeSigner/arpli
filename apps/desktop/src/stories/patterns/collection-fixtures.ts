// Shared Arpli content for the collection pattern stories.
export interface OpportunityRow {
  id: string;
  name: string;
  funder: string;
  amount: string;
  deadline: string;
  kind: 'Scholarship' | 'Grant' | 'Fellowship';
  status: 'Draft' | 'In progress' | 'Submitted' | 'Not started';
}

export const opportunities: OpportunityRow[] = [
  { id: 'gates', name: 'Gates Cambridge Scholarship', funder: 'Gates Cambridge Trust', amount: '£52,000 / yr', deadline: 'Oct 14', kind: 'Scholarship', status: 'Draft' },
  { id: 'rhodes', name: 'Rhodes Scholarship', funder: 'Rhodes Trust', amount: 'Full funding', deadline: 'Oct 1', kind: 'Scholarship', status: 'Submitted' },
  { id: 'nsf', name: 'NSF Graduate Research Fellowship', funder: 'National Science Foundation', amount: '$37,000 / yr', deadline: 'Oct 20', kind: 'Fellowship', status: 'In progress' },
  { id: 'fulbright', name: 'Fulbright U.S. Student Program', funder: 'U.S. Department of State', amount: 'Varies', deadline: 'Oct 8', kind: 'Grant', status: 'Not started' },
  { id: 'daad', name: 'DAAD Study Scholarship', funder: 'German Academic Exchange Service', amount: '€992 / month', deadline: 'Nov 15', kind: 'Scholarship', status: 'Not started' },
  { id: 'wellcome', name: 'Wellcome Early-Career Award', funder: 'Wellcome Trust', amount: '£400,000', deadline: 'Dec 2', kind: 'Grant', status: 'Draft' },
];

export const sections = [
  { id: 'this-week', label: 'Due this week', items: opportunities.slice(0, 2) },
  { id: 'this-month', label: 'Due this month', items: opportunities.slice(2, 4) },
  { id: 'later', label: 'Later', items: opportunities.slice(4) },
];
