import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, ErrorState, Layout, LoadingState } from '@/ui';
import { DashboardSessionsSection } from '../../components';
import { formatDashboardCurrentDate, formatDashboardSessionDate } from '../../helpers';
import { useDashboard } from './use-dashboard';
import './dashboard.css';

interface DashboardKpiView {
  id: 'totalAthletes' | 'sessionsThisMonth' | 'upcomingSessionsCount' | 'averageRating';
  label: string;
  value: string | number;
}

const Dashboard: React.FC = () => {
  const { t, i18n } = useTranslation('dashboard');
  const { state } = useDashboard();

  const greetingName = state.coachName || t('header.fallbackName');
  const formattedCurrentDate = formatDashboardCurrentDate(i18n.language);
  const formatSessionDate = (sessionDate: string): string => {
    return formatDashboardSessionDate(i18n.language, sessionDate);
  };

  const averageRatingLabel =
    state.averageRating === null
      ? t('kpi.notAvailable')
      : t('kpi.averageRatingValue', { value: state.averageRating.toFixed(1) });

  const kpis: DashboardKpiView[] = [
    {
      id: 'totalAthletes',
      label: t('kpi.totalAthletes'),
      value: state.totalAthletes,
    },
    {
      id: 'sessionsThisMonth',
      label: t('kpi.sessionsThisMonth'),
      value: state.sessionsThisMonth,
    },
    {
      id: 'upcomingSessionsCount',
      label: t('kpi.upcomingSessions'),
      value: state.upcomingSessionsCount,
    },
    {
      id: 'averageRating',
      label: t('kpi.averageRating'),
      value: averageRatingLabel,
    },
  ];

  if (state.isLoading) {
    return (
      <Layout>
        <section className="dashboard dashboard--state">
          <LoadingState message={t('states.loading')} />
        </section>
      </Layout>
    );
  }

  if (state.isError) {
    return (
      <Layout>
        <section className="dashboard dashboard--state">
          <ErrorState
            title={t('states.errorTitle')}
            description={state.errorMessage || t('states.errorDescription')}
          />
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="dashboard">
        <header className="dashboard__header">
          <h2 className="dashboard__title">{t('header.welcomeBack', { name: greetingName })}</h2>
          <p className="dashboard__date">{t('header.today', { date: formattedCurrentDate })}</p>
        </header>

        <div className="dashboard__kpi-grid">
          {kpis.map((kpi) => (
            <Card fullWidth variant="outlined" key={kpi.id}>
              <Card.Body>
                <p className="dashboard__kpi-label">{kpi.label}</p>
                <p className="dashboard__kpi-value">{kpi.value}</p>
              </Card.Body>
            </Card>
          ))}
        </div>

        <div className="dashboard__sessions-grid">
          <DashboardSessionsSection
            title={t('sections.recent.title')}
            emptyTitle={t('sections.recent.emptyTitle')}
            emptyDescription={t('sections.recent.emptyDescription')}
            sessions={state.recentSessions}
            showWeather
            formatSessionDate={formatSessionDate}
          />

          <DashboardSessionsSection
            title={t('sections.upcoming.title')}
            emptyTitle={t('sections.upcoming.emptyTitle')}
            emptyDescription={t('sections.upcoming.emptyDescription')}
            sessions={state.upcomingSessions}
            formatSessionDate={formatSessionDate}
          />
        </div>
      </section>
    </Layout>
  );
};

export { Dashboard };
