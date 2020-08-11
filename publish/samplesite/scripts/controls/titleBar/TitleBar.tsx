import * as React from 'react';

const styles = require('./TitleBar.scss');

interface WindowHack extends Window {
    roosterJsVer: string;
}

export interface TitleBarProps {
    className?: string;
}

export default class TitleBar extends React.Component<TitleBarProps, {}> {
    render() {
        let className = styles.titleBar + ' ' + (this.props.className || '');
        return (
            <div className={className}>
                <div className={styles.title}>
                    <span className={styles.titleText}>RoosterJs Demo Site</span>
                </div>
                <div className={styles.version}>
                    {((window as any) as WindowHack).roosterJsVer || ''}
                </div>
                <div className={styles.links}>
                    <a
                        href="https://github.com/microsoft/roosterjs"
                        target="_blank"
                        className={styles.link}>
                        RoosterJs on Github
                    </a>
                    {' | '}
                    <a
                        href="https://github.com/Microsoft/roosterjs/wiki"
                        target="_blank"
                        className={styles.link}>
                        Wiki
                    </a>
                    {' | '}
                    <a href="docs/index.html" target="_blank" className={styles.link}>
                        API References
                    </a>
                    {' | '}
                    <a href="https://www.travis-ci.org/microsoft/roosterjs" target="_blank">
                        <img
                            src="https://api.travis-ci.org/microsoft/roosterjs.svg?branch=master"
                            alt="Build Status"
                        />
                    </a>{' '}
                    <a href="http://badge.fury.io/js/roosterjs" target="_blank">
                        <img src="https://badge.fury.io/js/roosterjs.svg" alt="NPM Version" />
                    </a>
                </div>
            </div>
        );
    }
}
