/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    newline: '',
    title: 'Data Science',
    imageUrl: 'img/ico-data-science.svg',
    description: (
      <>
        <code>ClearML</code> is designed to be as easily integrated as possible. <b>Add 2 lines of code</b> and everything is logged &amp; reported!
      </>
    ),
  },
  {
    newline: '',
    title: 'MLOps',
    imageUrl: 'img/ico-mlops.svg',
    description: (
      <>
        ClearML allows you to focus on designing your ML automations, we&apos;ll do the rest for you.
          Go ahead and move your <b>ML pipelines &amp; data processing</b> into the <code>ClearML</code> universe.
      </>
    ),
  },
  {
    newline: '',
    title: 'Data Management',
    imageUrl: 'img/ico-data-management.svg',
    description: (
      <>
          <code>ClearML-Data</code> lets you <b>abstract the Data from your Code</b>.
          Easily create datasets from anywhere using the CLI or programmatic interface.
          ClearML-Data is a fully differentiable solution on top of object-storage / http / NAS layer.
          <b> We solve your data localization problem, so you can process it anywhere.</b>
      </>
    ),
  },
  {
    newline: ' col--offset-2',
    title: 'Orchestration',
    imageUrl: 'img/ico-orchestration.svg',
    description: (
      <>
        <b>Maximize utilization</b> on your on-prem or cloud infrastructure with <code>ClearML-Agent</code>.
          ClearML-Agents can run <b>bare-metal</b> or inside <b>Kubernetes</b>.
          Set a budget for Kubernetes or your on-prem compute, and watch the utilization graphs grow.
      </>
    ),
  },
  {
    newline: '',
    title: 'Deployment',
    imageUrl: 'img/ico-deploy.svg',
    description: (
      <>
        One click <b>model serving</b> to your production Kubernetes cluster <b>directly from the UI</b>.
          ClearML also includes performance monitoring and automatic canary / upgrades.
        <b>Your development into production journey starts today!</b>
      </>
    ),
  },
];

function Feature({imageUrl, title, description, newline}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx(`col col--4 col--feature text--justified  ${newline}`, styles.feature)}>
      {imgUrl && (
        <div>
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Turn your code into MLOps with only 2 lines of code with ClearML! Easily develop, orchestrate, and automate AI workflows at scale"
    >
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">

            <div className="hero-intro">
              <div className="hero-title">
                <h1 className={styles.heroProjectTagline}>
                  <span className={styles.heroTitleTextHtml} dangerouslySetInnerHTML={{__html: siteConfig.tagline}}/>
                </h1>
              </div>
              <div className="hero-figure">
                <img
                    alt={siteConfig.title}
                    src={useBaseUrl('/img/infinity.svg')}
                  />
              </div>
            </div>

            <div className={styles.indexCtas}>
              <Link className="button button--outline button--secondary button--lg button--rounded" to="/docs">
                Get Started
              </Link>
              <Link
                className="button button--primary button--lg button--rounded shadow--md"
                to="https://app.clear.ml">
                Free Sign Up
              </Link>
              <span className={styles.indexCtasGitHubButtonWrapper}>
                <iframe
                  className={styles.indexCtasGitHubButton}
                  src="https://ghbtns.com/github-btn.html?user=clearml&repo=clearml&type=star&count=true&size=large"
                  width={160}
                  height={30}
                  title="GitHub Stars"
                />
              </span>
            </div>

        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map(({title, imageUrl, description, newline}) => (
                  <Feature
                    key={title}
                    title={title}
                    imageUrl={imageUrl}
                    description={description}
                    newline={newline}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;