'use client';
import { MoonLoader } from 'react-spinners';

import css from './Preloader.module.scss';

export default function Preloader() {
  return (
    <div className={css.wrapper}>
      <MoonLoader />
    </div>
  );
}
