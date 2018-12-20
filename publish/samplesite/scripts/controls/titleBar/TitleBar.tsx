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
                <div className={styles.version}>{(window as WindowHack).roosterJsVer || ''}</div>
                <div className={styles.links}>
                    <a
                        href='https://github.com/microsoft/roosterjs'
                        target='_blank'
                        className={styles.link}
                    >
                        RoosterJs on Github
                    </a>
                    &nbsp;
                    <a
                        href='https://www.npmjs.com/package/roosterjs'
                        target='_blank'
                        className={styles.link}
                    >
                        RoosterJs on NPM
                    </a>
                    &nbsp;
                    <a
                        href='https://github.com/Microsoft/roosterjs/wiki'
                        target='_blank'
                        className={styles.link}
                    >
                        Documentations
                    </a>
                </div>
                <div className={styles.logo}>
                    <div className={styles.rooster}>🐔</div>
                </div>
            </div>
        );
    }
}
