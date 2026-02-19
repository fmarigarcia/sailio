export function formatDashboardCurrentDate(language: string, date = new Date()): string {
  return new Intl.DateTimeFormat(language, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatDashboardSessionDate(language: string, sessionDate: string): string {
  return new Intl.DateTimeFormat(language, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(sessionDate));
}
