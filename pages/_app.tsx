import React from 'react';
import { AppProps } from 'next/app';

import '@/styles/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Layout from '@/components/templates/Layout';

const MyApp = (props: AppProps) => {
  const { Component, pageProps } = props;

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default MyApp;
