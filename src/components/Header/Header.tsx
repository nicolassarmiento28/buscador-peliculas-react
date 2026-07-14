import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { HeartOutlined, BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useTheme } from '../../hooks/useTheme';
import { AuthButton } from '../AuthButton/AuthButton';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.title}>
        CineList
      </Link>
      <div className={styles.rightGroup}>
        <Link to="/mi-lista">
          <Button icon={<HeartOutlined />} size="large">
            <span className={styles.labelText}>Mi lista</span>
          </Button>
        </Link>
        <AuthButton />
        <Button
          onClick={toggleTheme}
          icon={theme === 'dark' ? <BulbOutlined /> : <BulbFilled />}
          shape="circle"
          size="large"
          title={`Cambiar a ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
        />
      </div>
    </header>
  );
};
