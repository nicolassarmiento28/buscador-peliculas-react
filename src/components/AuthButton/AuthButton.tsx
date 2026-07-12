import React from 'react';
import { Avatar, Button, Dropdown } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import styles from './AuthButton.module.css';

export const AuthButton: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <Button
        className={styles.signInButton}
        icon={<GoogleOutlined />}
        size="large"
        onClick={() =>
          signInWithPopup(auth, new GoogleAuthProvider()).catch((error) =>
            console.error('Error al iniciar sesion con Google:', error)
          )
        }
      >
        Iniciar sesion con Google
      </Button>
    );
  }

  return (
    <Dropdown
      menu={{
        items: [
          {
            key: 'logout',
            label: 'Cerrar sesion',
            onClick: () =>
              signOut(auth).catch((error) =>
                console.error('Error al cerrar sesion:', error)
              ),
          },
        ],
      }}
      trigger={['click']}
    >
      <button type="button" className={styles.userTrigger}>
        <Avatar src={user.photoURL} alt={user.displayName ?? 'Usuario'}>
          {user.displayName?.[0]}
        </Avatar>
        <span className={styles.userName}>{user.displayName}</span>
      </button>
    </Dropdown>
  );
};
