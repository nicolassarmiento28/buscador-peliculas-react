import { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import styles from './WelcomeCurtain.module.css';

const STORAGE_KEY = 'marquesina-curtain-shown';

export const WelcomeCurtain: FC = () => {
  const [visible, setVisible] = useState(
    () => sessionStorage.getItem(STORAGE_KEY) === null
  );
  const [open, setOpen] = useState(false);
  const leftPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const dismiss = () => {
      sessionStorage.setItem(STORAGE_KEY, '1');
      setVisible(false);
    };

    const delayTimer = setTimeout(() => {
      if (reduceMotion) {
        dismiss();
        return;
      }
      setOpen(true);
    }, 400);

    return () => clearTimeout(delayTimer);
  }, [visible]);

  useEffect(() => {
    if (!open) return;

    const panel = leftPanelRef.current;
    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.propertyName !== 'transform') return;
      sessionStorage.setItem(STORAGE_KEY, '1');
      setVisible(false);
    };

    panel?.addEventListener('transitionend', onTransitionEnd);
    // Respaldo por si transitionend no dispara (ej. tab en background).
    const fallbackTimer = setTimeout(() => {
      sessionStorage.setItem(STORAGE_KEY, '1');
      setVisible(false);
    }, 900);

    return () => {
      panel?.removeEventListener('transitionend', onTransitionEnd);
      clearTimeout(fallbackTimer);
    };
  }, [open]);

  if (!visible) return null;

  return (
    <>
      <div
        ref={leftPanelRef}
        aria-hidden="true"
        className={`${styles.panel} ${styles.left} ${open ? styles.open : ''}`}
      />
      <div
        aria-hidden="true"
        className={`${styles.panel} ${styles.right} ${open ? styles.open : ''}`}
      />
    </>
  );
};
