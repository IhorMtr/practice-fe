'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import styles from './ClientPickerField.module.scss';

export type ClientPickerOption = {
  id: string;
  title: string;
  subtitle?: string | null;
};

interface ClientPickerFieldProps {
  label: string;
  value: string;
  search: string;
  options: ClientPickerOption[];
  isLoading?: boolean;
  disabled?: boolean;
  errorText?: string | null;
  touched?: boolean;
  onChange: (nextId: string) => void;
  onSearchChange: (next: string) => void;
  onTouched?: () => void;
}

export default function ClientPickerField({
  label,
  value,
  search,
  options,
  isLoading,
  disabled,
  errorText,
  touched,
  onChange,
  onSearchChange,
  onTouched,
}: ClientPickerFieldProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string>('');

  const selectedFromOptions = useMemo(() => {
    if (!value) return null;
    return options.find(o => o.id === value) ?? null;
  }, [options, value]);

  useEffect(() => {
    if (selectedFromOptions) {
      const label = selectedFromOptions.subtitle
        ? `${selectedFromOptions.title} — ${selectedFromOptions.subtitle}`
        : selectedFromOptions.title;

      setSelectedLabel(label);
    }
  }, [selectedFromOptions]);

  useEffect(() => {
    const onDocDown = (e: MouseEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      if (el.contains(e.target as Node)) return;

      setOpen(false);
      onTouched?.();
    };

    document.addEventListener('mousedown', onDocDown);
    return () => document.removeEventListener('mousedown', onDocDown);
  }, [onTouched]);

  const showError = Boolean(touched && errorText);

  return (
    <div ref={wrapRef} className={styles.field}>
      <label className={styles.label}>{label}</label>

      {value ? (
        <div className={styles.selectedRow}>
          <div className={styles.selectedText}>
            {selectedLabel || `ID: ${value}`}
          </div>

          <button
            type="button"
            className={styles.clearBtn}
            onClick={() => {
              onChange('');
              setSelectedLabel('');
              onSearchChange('');
              setOpen(false);
              onTouched?.();
            }}
            disabled={disabled}
          >
            Очистити
          </button>
        </div>
      ) : null}

      <div className={styles.control}>
        <input
          className={`${styles.input} ${showError ? styles.inputError : ''}`}
          value={search}
          onChange={e => {
            onSearchChange(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => onTouched?.()}
          placeholder="Пошук клієнта: імʼя або email…"
          disabled={disabled}
        />

        {isLoading ? <div className={styles.loading}>Завантаження…</div> : null}
      </div>

      {open ? (
        <div className={styles.dropdown}>
          {options.length === 0 ? (
            <div className={styles.dropdownEmpty}>
              {search.trim()
                ? 'Нічого не знайдено.'
                : 'Почніть вводити для пошуку.'}
            </div>
          ) : (
            <ul className={styles.list}>
              {options.map(opt => {
                const isSelected = value === opt.id;

                return (
                  <li key={opt.id}>
                    <button
                      type="button"
                      className={`${styles.item} ${
                        isSelected ? styles.itemSelected : ''
                      }`}
                      onClick={() => {
                        onChange(opt.id);

                        const label = opt.subtitle
                          ? `${opt.title} — ${opt.subtitle}`
                          : opt.title;

                        setSelectedLabel(label);
                        onSearchChange('');
                        setOpen(false);
                        onTouched?.();
                      }}
                      disabled={disabled}
                    >
                      <div className={styles.itemTitle}>{opt.title}</div>
                      {opt.subtitle ? (
                        <div className={styles.itemSubtitle}>
                          {opt.subtitle}
                        </div>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}

      {showError ? <div className={styles.fieldError}>{errorText}</div> : null}
    </div>
  );
}
