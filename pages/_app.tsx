import React from 'react';
import { AppProps } from 'next/app';

import '@/styles/style.css';

const MyApp = (props: AppProps) => {
  const { Component, pageProps } = props;

  return (
    <>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
