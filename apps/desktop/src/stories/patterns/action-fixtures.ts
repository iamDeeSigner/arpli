// Shared Arpli-flavoured action definitions for the action-menu and collection stories.
import { defineActions } from '$lib/components/patterns/action-menu';
import {
  faArchive,
  faArrowUpRightFromSquare,
  faBell,
  faCalendar,
  faCopy,
  faDownload,
  faEnvelope,
  faPen,
  faStar,
  faTrash,
} from '$lib/icons/phosphor-icons';

export const applicationActions = defineActions([
  { kind: 'action', id: 'open', label: 'Open application', icon: faArrowUpRightFromSquare, shortcut: '↵' },
  { kind: 'action', id: 'edit', label: 'Edit answers', icon: faPen, shortcut: '⌘E' },
  { kind: 'action', id: 'duplicate', label: 'Duplicate as template', icon: faCopy },
  {
    kind: 'submenu',
    id: 'remind',
    label: 'Remind me',
    icon: faBell,
    group: 'plan',
    children: [
      { kind: 'action', id: 'remind-1d', label: '1 day before deadline' },
      { kind: 'action', id: 'remind-3d', label: '3 days before deadline' },
      { kind: 'action', id: 'remind-1w', label: '1 week before deadline' },
    ],
  },
  { kind: 'action', id: 'calendar', label: 'Add deadline to calendar', icon: faCalendar, group: 'plan' },
  {
    kind: 'action',
    id: 'email-referee',
    label: 'Email referees',
    icon: faEnvelope,
    group: 'plan',
    disabledReason: 'Add a referee to your profile first',
  },
  { kind: 'action', id: 'archive', label: 'Archive', icon: faArchive, group: 'danger' },
  { kind: 'action', id: 'withdraw', label: 'Withdraw application', icon: faTrash, group: 'danger', destructive: true },
]);

export const viewActions = defineActions([
  {
    kind: 'section',
    id: 'show',
    label: 'Show',
    children: [
      { kind: 'checkbox', id: 'show-scholarships', label: 'Scholarships', checked: true },
      { kind: 'checkbox', id: 'show-grants', label: 'Research grants', checked: true },
      { kind: 'checkbox', id: 'show-fellowships', label: 'Fellowships', checked: false },
    ],
  },
  {
    kind: 'radio-group',
    id: 'sort',
    label: 'Sort by',
    value: 'deadline',
    children: [
      { kind: 'radio', id: 'sort-deadline', label: 'Deadline', value: 'deadline' },
      { kind: 'radio', id: 'sort-match', label: 'Best match', value: 'match' },
      { kind: 'radio', id: 'sort-amount', label: 'Award amount', value: 'amount' },
    ],
  },
]);

export const toolbarActions = defineActions([
  { kind: 'action', id: 'star', label: 'Save to shortlist', icon: faStar, shortcut: 'S' },
  { kind: 'action', id: 'edit', label: 'Edit answers', icon: faPen, shortcut: '⌘E' },
  { kind: 'action', id: 'export', label: 'Export as PDF', icon: faDownload },
  { kind: 'action', id: 'calendar', label: 'Add deadline to calendar', icon: faCalendar },
  { kind: 'action', id: 'archive', label: 'Archive', icon: faArchive },
  { kind: 'action', id: 'withdraw', label: 'Withdraw application', icon: faTrash, destructive: true },
]);
