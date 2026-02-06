import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '../src'),
        '@/app': path.resolve(__dirname, '../src/app'),
        '@/modules': path.resolve(__dirname, '../src/modules'),
        '@/ui': path.resolve(__dirname, '../src/ui'),
        '@/shared': path.resolve(__dirname, '../src/shared'),
        '@/assets': path.resolve(__dirname, '../src/assets'),
      };
    }
    return config;
  },
};

export default config;
