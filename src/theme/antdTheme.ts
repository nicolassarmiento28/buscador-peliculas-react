import type { ThemeConfig } from 'antd';
import { theme } from 'antd';

const { darkAlgorithm, defaultAlgorithm } = theme;

export const lightTheme: ThemeConfig = {
  algorithm: defaultAlgorithm,
  token: {
    colorPrimary: '#6c5ce7',
    colorBgBase: '#f8f9fa',
    colorTextBase: '#1a1a2e',
    borderRadius: 16,
    fontSize: 16,
    colorBorder: 'rgba(0, 0, 0, 0.1)',
    boxShadow: '0 24px 80px rgba(0, 0, 0, 0.15)',
  },
  components: {
    Button: {
      borderRadius: 16,
      controlHeight: 48,
      fontWeight: 700,
      primaryShadow: '0 18px 30px rgba(108, 92, 231, 0.28)',
    },
    Input: {
      borderRadius: 16,
      controlHeight: 48,
      fontSize: 16,
    },
    Card: {
      borderRadius: 22,
      boxShadow: '0 18px 50px rgba(0, 0, 0, 0.28)',
    },
  },
};

export const darkTheme: ThemeConfig = {
  algorithm: darkAlgorithm,
  token: {
    colorPrimary: '#7c5cff',
    colorBgBase: '#0b1020',
    colorTextBase: '#f5f7fb',
    borderRadius: 16,
    fontSize: 16,
    colorBorder: 'rgba(255, 255, 255, 0.12)',
    boxShadow: '0 24px 80px rgba(0, 0, 0, 0.35)',
  },
  components: {
    Button: {
      borderRadius: 16,
      controlHeight: 48,
      fontWeight: 700,
      primaryShadow: '0 18px 30px rgba(124, 92, 255, 0.28)',
    },
    Input: {
      borderRadius: 16,
      controlHeight: 48,
      fontSize: 16,
    },
    Card: {
      borderRadius: 22,
      boxShadow: '0 18px 50px rgba(0, 0, 0, 0.28)',
    },
  },
};
