// Shared Arpli-flavoured settings schema for the settings pattern stories.
import { writable } from 'svelte/store';
import { defineSettings } from '$lib/components/patterns/settings';

export const deadlineReminders = writable(true);
export const reminderLead = writable('7');
export const weeklyDigest = writable(false);
export const studyLevel = writable('masters');
export const fieldOfStudy = writable('Environmental engineering');
export const contactEmail = writable('maya.okafor@example.edu');
export const maxApplications = writable(8);
export const draftTone = writable('formal');

export const arpliSettings = defineSettings({
  sections: [
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Decide when Arpli nudges you about upcoming deadlines.',
      entries: [
        {
          kind: 'switch',
          id: 'deadline-reminders',
          label: 'Deadline reminders',
          description: 'Get a desktop notification before an application is due.',
          store: deadlineReminders,
        },
        {
          kind: 'select',
          id: 'reminder-lead',
          label: 'Remind me',
          options: [
            { value: '1', label: '1 day before' },
            { value: '3', label: '3 days before' },
            { value: '7', label: '1 week before' },
            { value: '14', label: '2 weeks before' },
          ],
          store: reminderLead,
        },
        {
          kind: 'switch',
          id: 'weekly-digest',
          label: 'Weekly opportunity digest',
          description: 'A Monday summary of new scholarships that match your profile.',
          store: weeklyDigest,
          experimental: true,
        },
      ],
    },
    {
      id: 'profile',
      title: 'Profile defaults',
      description: 'Used to match opportunities and pre-fill applications.',
      entries: [
        {
          kind: 'select',
          id: 'study-level',
          label: 'Level of study',
          options: [
            { value: 'undergraduate', label: 'Undergraduate' },
            { value: 'masters', label: 'Master’s' },
            { value: 'phd', label: 'PhD' },
            { value: 'postdoc', label: 'Postdoctoral' },
          ],
          store: studyLevel,
        },
        {
          kind: 'input',
          id: 'field-of-study',
          label: 'Field of study',
          placeholder: 'e.g. Molecular biology',
          store: fieldOfStudy,
        },
        {
          kind: 'input',
          id: 'contact-email',
          label: 'Contact email',
          inputType: 'email',
          description: 'Shown on generated cover letters.',
          store: contactEmail,
        },
        {
          kind: 'number',
          id: 'max-applications',
          label: 'Active applications limit',
          description: 'Arpli warns you when you take on more than this at once.',
          min: 1,
          max: 30,
          store: maxApplications,
        },
      ],
    },
    {
      id: 'data',
      title: 'Data',
      entries: [
        {
          kind: 'action',
          id: 'export-data',
          label: 'Export applications',
          description: 'Download every application and essay draft as a ZIP archive.',
          actionLabel: 'Export…',
          action: () => {},
        },
        {
          kind: 'action',
          id: 'reset-profile',
          label: 'Reset profile',
          description: 'Removes your profile and all drafts from this device.',
          actionLabel: 'Reset…',
          danger: true,
          action: () => {},
        },
      ],
    },
  ],
});
