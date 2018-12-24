import * as React from 'react';
import { FormatState } from 'roosterjs-editor-types';
import { Browser } from 'roosterjs-editor-dom';

const styles = require('./FormatStatePane.scss');

export interface FormatStatePaneState {
    format: FormatState;
    x: number;
    y: number;
}

export default class FormatStatePane extends React.Component<
    FormatStatePaneState,
    FormatStatePaneState
> {
    constructor(props: FormatStatePaneState) {
        super(props);
        this.state = {
            format: props.format,
            x: props.x,
            y: props.y,
        };
    }

    setFormatState(state: FormatStatePaneState) {
        this.setState(state);
    }

    render() {
        let { format, x, y } = this.state;
        return format ? (
            <table>
                <tbody>
                    <tr>
                        <td className={styles.title}>{'Position'}</td>
                        <td>{`${x},${y}`}</td>
                    </tr>
                    <tr>
                        <td className={styles.title}>{'Font'}</td>
                        <td>
                            <span>{`${format.fontName}, ${format.fontSize}`}</span>
                        </td>
                    </tr>
                    <tr>
                        <td className={styles.title}>{'Colors'}</td>
                        <td>
                            <span
                                style={{
                                    color: format.textColor,
                                    backgroundColor: format.backgroundColor,
                                }}
                            >{`${format.textColor} / ${format.backgroundColor}`}</span>
                        </td>
                    </tr>
                    <tr>
                        <td className={styles.title}>{'Formats'}</td>
                        <td>
                            {this.renderSpan(format.isBold, 'Bold')}
                            {this.renderSpan(format.isItalic, 'Italic')}
                            {this.renderSpan(format.isUnderline, 'Underline')}
                            {this.renderSpan(format.isStrikeThrough, 'Strike')}
                            {this.renderSpan(format.isSubscript, 'Subscript')}
                            {this.renderSpan(format.isSuperscript, 'Superscript')}
                        </td>
                    </tr>
                    <tr>
                        <td className={styles.title}>{'Structure'}</td>
                        <td>
                            {this.renderSpan(format.isBullet, 'Bullet')}
                            {this.renderSpan(format.isNumbering, 'Numbering')}
                            {this.renderSpan(format.isBlockQuote, 'Quote')}
                            {this.renderSpan(format.canUnlink, 'In Link')}
                            {this.renderSpan(format.canAddImageAltText, 'In Image')}
                            <span className={format.headerLevel == 0 && styles.inactive}>{`Header ${
                                format.headerLevel
                            }`}</span>
                        </td>
                    </tr>
                    <tr>
                        <td className={styles.title}>{'Undo'}</td>
                        <td>
                            {this.renderSpan(format.canUndo, 'Can Undo')}
                            {this.renderSpan(format.canRedo, 'Can Redo')}
                        </td>
                    </tr>
                    <tr>
                        <td className={styles.title}>{'Browser'}</td>
                        <td>
                            {this.renderSpan(Browser.isChrome, 'Chrome')}
                            {this.renderSpan(Browser.isEdge, 'Edge')}
                            {this.renderSpan(Browser.isFirefox, 'Firefox')}
                            {this.renderSpan(Browser.isIE11OrGreater, 'IE10/11')}
                            {this.renderSpan(Browser.isIE, 'IE')}
                            {this.renderSpan(Browser.isIEOrEdge, 'IE/Edge')}
                            {this.renderSpan(Browser.isSafari, 'Safari')}
                            {this.renderSpan(Browser.isWebKit, 'Webkit')}
                        </td>
                    </tr>
                    <tr>
                        <td className={styles.title}>{'OS'}</td>
                        <td>
                            {this.renderSpan(Browser.isMac, 'MacOS')}
                            {this.renderSpan(Browser.isWin, 'Windows')}
                        </td>
                    </tr>
                    <tr>
                        <td className={styles.title}>{'User Agent'}</td>
                        <td>{window.navigator.userAgent}</td>
                    </tr>
                    <tr>
                        <td className={styles.title}>{'App Version'}</td>
                        <td>{window.navigator.appVersion}</td>
                    </tr>
                </tbody>
            </table>
        ) : (
            <div>{'Please focus into editor'}</div>
        );
    }

    private renderSpan(formatState: boolean, text: string): JSX.Element {
        return <span className={formatState ? '' : styles.inactive}>{text + ' '}</span>;
    }
}
