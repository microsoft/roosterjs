import * as React from 'react';

const classicalStyles = require('./TitleBar.scss');
const contentModelStyles = require('./ContentModelTitleBar.scss');

const github = require('./iconmonstr-github-1.svg');

export interface TitleBarProps {
    className?: string;
    isContentModelPane: boolean;
}

export default class TitleBar extends React.Component<TitleBarProps, {}> {
    render() {
        const { isContentModelPane, className: baseClassName } = this.props;
        const styles = isContentModelPane ? contentModelStyles : classicalStyles;
        const className = styles.titleBar + ' ' + (baseClassName || '');
        const titleText = isContentModelPane
            ? 'RoosterJs Content Model Demo Site'
            : 'RoosterJs Demo Site';
        const switchLink = isContentModelPane ? (
            <a className={styles.link} href="?cm=0">
                Switch to classical demo
            </a>
        ) : (
            <a className={styles.link} href="?cm=1">
                Switch to Content Model demo
            </a>
        );

        return (
            <div className={className}>
                <div className={styles.title}>
                    <span className={styles.titleText}>{titleText}</span>
                </div>
                <div className={styles.version}></div>
                <div className={styles.links}>
                    {switchLink} {' | '}
                    <a
                        href="https://github.com/Microsoft/roosterjs/wiki"
                        target="_blank"
                        className={styles.link}>
                        Wiki
                    </a>
                    {' | '}
                    <a href="docs/index.html" target="_blank" className={styles.link}>
                        References
                    </a>
                    {' | '}
                    <a href="coverage/index.html" target="_blank" className={styles.link}>
                        Test
                    </a>
                    {' | '}
                    <a
                        href="https://github.com/microsoft/roosterjs/actions/workflows/build-and-deploy.yml"
                        target="_blank">
                        <img
                            className={styles.externalLink}
                            src="https://github.com/microsoft/roosterjs/actions/workflows/build-and-deploy.yml/badge.svg"
                            alt="Build Status"
                        />
                    </a>{' '}
                    <a href="http://badge.fury.io/js/roosterjs" target="_blank">
                        <img
                            src="https://badge.fury.io/js/roosterjs.svg"
                            alt="NPM Version"
                            className={styles.externalLink}
                        />
                    </a>{' '}
                    <a
                        href="https://github.com/microsoft/roosterjs"
                        target="_blank"
                        className={styles.link}
                        title="RoosterJs on Github">
                        <img className={styles.externalLink} src={github} />
                    </a>
                </div>
            </div>
        );
    }
}
