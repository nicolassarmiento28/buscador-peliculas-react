import type { ThemeConfig } from 'antd';
import { theme } from 'antd';

const { darkAlgorithm, defaultAlgorithm } = theme;

export const lightTheme: ThemeConfig = {
  algorithm: defaultAlgorithm,
  token: {
    colorPrimary: '#cf8a22',
    colorBgBase: '#f6efe4',
    colorTextBase: '#2b1730',
    borderRadius: 16,
    fontSize: 16,
    colorBorder: 'rgba(43, 23, 48, 0.12)',
    boxShadow: '0 24px 80px rgba(0, 0, 0, 0.15)',
  },
  components: {
    Button: {
      borderRadius: 16,
      controlHeight: 48,
      fontWeight: 700,
      primaryShadow: '0 18px 30px rgba(207, 138, 34, 0.28)',
      // Texto ciruela sobre boton ambar: ~5.1:1, pasa AA. Blanco por
      // defecto solo da ~3.2:1 sobre este acento.
      colorTextLightSolid: '#2b1730',
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
    Alert: {
      borderRadius: 16,
    },
  },
};

export const darkTheme: ThemeConfig = {
  algorithm: darkAlgorithm,
  token: {
    colorPrimary: '#e8a23a',
    colorBgBase: '#1a0e1e',
    colorTextBase: '#f6efe4',
    borderRadius: 16,
    fontSize: 16,
    colorBorder: 'rgba(246, 239, 228, 0.14)',
    boxShadow: '0 24px 80px rgba(0, 0, 0, 0.35)',
  },
  components: {
    Button: {
      borderRadius: 16,
      controlHeight: 48,
      fontWeight: 700,
      primaryShadow: '0 18px 30px rgba(232, 162, 58, 0.28)',
      // Texto ciruela sobre boton ambar: ~8.9:1, pasa AA. Blanco por
      // defecto solo da ~2.1:1 sobre este acento claro.
      colorTextLightSolid: '#1a0e1e',
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
    Alert: {
      borderRadius: 16,
    },
  },
};
