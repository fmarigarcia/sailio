import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/ui';
import type {
  DashboardSessionStatus,
  RecentSessionSummary,
  SessionSummary,
} from '../../dashboard.types';
import './sessionSummaryItem.css';

interface StatusPresentation {
  labelKey: string;
  variant: 'success' | 'warning' | 'error' | 'info' | 'neutral';
}

interface SessionSummaryItemProps {
  session: SessionSummary;
  showWeather?: boolean;
  formatSessionDate: (sessionDate: string) => string;
}

function getStatusPresentation(status: DashboardSessionStatus): StatusPresentation {
  const statusMap: Record<string, StatusPresentation> = {
    planned: { labelKey: 'status.planned', variant: 'info' },
    in_progress: { labelKey: 'status.inProgress', variant: 'warning' },
    completed: { labelKey: 'status.completed', variant: 'success' },
    cancelled: { labelKey: 'status.cancelled', variant: 'error' },
  };

  return statusMap[status] ?? { labelKey: 'status.unknown', variant: 'neutral' };
}

const SessionSummaryItem: React.FC<SessionSummaryItemProps> = ({
  session,
  showWeather = false,
  formatSessionDate,
}) => {
  const { t } = useTranslation('dashboard');
  const statusPresentation = getStatusPresentation(session.status);
  const recentSession = session as RecentSessionSummary;
  const hasWeatherInfo =
    showWeather &&
    (recentSession.temperatureCelsius !== null || recentSession.windSpeedKnots !== null);

  return (
    <li className="dashboard-session-item">
      <div className="dashboard-session-item__row">
        <h4 className="dashboard-session-item__title">{session.title}</h4>
        <Badge variant={statusPresentation.variant}>{t(statusPresentation.labelKey)}</Badge>
      </div>

      <p className="dashboard-session-item__detail">{formatSessionDate(session.sessionDate)}</p>
      <p className="dashboard-session-item__detail">
        {t('sessions.athletesCount', { count: session.athletesCount })}
      </p>

      {hasWeatherInfo && (
        <div className="dashboard-session-item__weather-row">
          {recentSession.temperatureCelsius !== null && (
            <span>
              {t('sessions.weather.temperature', { value: recentSession.temperatureCelsius })}
            </span>
          )}
          {recentSession.windSpeedKnots !== null && (
            <span>{t('sessions.weather.wind', { value: recentSession.windSpeedKnots })}</span>
          )}
        </div>
      )}
    </li>
  );
};

export { SessionSummaryItem };
export type { SessionSummaryItemProps };
