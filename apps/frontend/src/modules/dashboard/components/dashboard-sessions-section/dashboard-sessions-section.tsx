import React from 'react';
import { Card, EmptyState } from '@/ui';
import type { SessionSummary } from '../../dashboard.types';
import { SessionSummaryItem } from '../session-summary-item';

interface DashboardSessionsSectionProps {
  title: string;
  emptyTitle: string;
  emptyDescription: string;
  sessions: SessionSummary[];
  formatSessionDate: (sessionDate: string) => string;
  showWeather?: boolean;
}

const DashboardSessionsSection: React.FC<DashboardSessionsSectionProps> = ({
  title,
  emptyTitle,
  emptyDescription,
  sessions,
  formatSessionDate,
  showWeather = false,
}) => {
  return (
    <Card fullWidth variant="outlined">
      <Card.Header>
        <h3 className="dashboard__section-title">{title}</h3>
      </Card.Header>
      <Card.Body>
        {sessions.length === 0 ? (
          <EmptyState
            size="sm"
            appearance="transparent"
            title={emptyTitle}
            description={emptyDescription}
          />
        ) : (
          <ul className="dashboard__session-list">
            {sessions.map((session) => (
              <SessionSummaryItem
                key={session.id}
                session={session}
                showWeather={showWeather}
                formatSessionDate={formatSessionDate}
              />
            ))}
          </ul>
        )}
      </Card.Body>
    </Card>
  );
};

export { DashboardSessionsSection };
export type { DashboardSessionsSectionProps };
