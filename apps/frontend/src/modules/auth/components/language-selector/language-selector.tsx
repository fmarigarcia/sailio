import React from 'react';
import { Dropdown, DropdownItem } from '@/ui';
import { GlobeIcon } from '@/ui/icons';
import { useLanguage } from '@/shared/i18n';
import './language-selector.css';

const LanguageSelector: React.FC = () => {
  const { state, actions } = useLanguage();

  const dropdownItems: DropdownItem[] = state.availableLanguages.map((lang) => ({
    id: lang.code,
    label: lang.label,
    onClick: () => actions.changeLanguage(lang.code),
  }));

  const trigger = (
    <div className="language-selector-trigger">
      <GlobeIcon size={16} color="currentColor" />
      <span className="language-selector-trigger__text">{state.currentLanguage.label}</span>
    </div>
  );

  return (
    <div className="language-selector">
      <Dropdown trigger={trigger} items={dropdownItems} position="bottom" closeOnSelect />
    </div>
  );
};

export { LanguageSelector };
