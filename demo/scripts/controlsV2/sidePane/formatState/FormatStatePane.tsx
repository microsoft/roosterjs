import * as React from 'react';
import { SidePaneElementProps } from '../SidePaneElement';
import {
    ContentModelFormatState,
    EditorEnvironment,
    TableMetadataFormat,
} from 'roosterjs-content-model-types';

const styles = require('./FormatStatePane.scss');

export interface FormatStatePaneState {
    format: ContentModelFormatState;
    x: number;
    y: number;
}
export interface FormatStatePaneProps extends FormatStatePaneState, SidePaneElementProps {
    env?: EditorEnvironment;
}

export default class FormatStatePane extends React.Component<
    FormatStatePaneProps,
    FormatStatePaneState
> {
    constructor(props: FormatStatePaneProps) {
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
        const { format, x, y } = this.state;
        const { isMac, isAndroid, isSafari, isMobileOrTablet } = this.props.env ?? {};

        const TableFormat = () => {
            const tableFormat = format.tableFormat;
            if (!tableFormat) {
                return <></>;
            }
            const tableFromatRows = Object.keys(tableFormat).map(
                (key: keyof TableMetadataFormat, index: number, array) => {
                    const rowStyle: React.CSSProperties =
                        index == 0
                            ? { borderTop: 'solid' }
                            : index == array.length - 1
                            ? { borderBottom: 'solid' }
                            : {};
                    return (
                        <tr style={rowStyle}>
                            <td style={{ fontSize: 'small' }}>{key}</td>
                            <td>{String(tableFormat[key])}</td>
                        </tr>
                    );
                }
            );
            return tableFromatRows;
        };
        return format ? (
            <table style={{ borderCollapse: 'collapse' }}>
                <tbody>
                    <tr hidden={!format.isInTable}>
                        <td className={styles.title}>Table</td>
                        <td>
                            {this.renderSpan(format.canMergeTableCell, 'Can merge')}
                            {this.renderSpan(format.tableHasHeader, 'Table has header')}
                        </td>
                    </tr>
                    {TableFormat()}
                    <tr>
                        <td className={styles.title}>Position</td>
                        <td>{`${x},${y}`}</td>
                    </tr>
                    <tr>
                        <td className={styles.title}>Font</td>
                        <td>
                            <span>{`${format.fontName}, ${format.fontSize}`}</span>
                        </td>
                    </tr>
                    <tr>
                        <td className={styles.title}>Colors</td>
                        <td>
                            <span
                                style={{
                                    color: format.textColor,
                                    backgroundColor: format.backgroundColor,
                                }}>{`${format.textColor} / ${format.backgroundColor}`}</span>
                        </td>
                    </tr>
                    <tr>
                        <td className={styles.title}>Formats</td>
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
                        <td className={styles.title}>Font weight</td>
                        <td>{format.fontWeight}</td>
                    </tr>
                    <tr>
                        <td className={styles.title}>Structure</td>
                        <td>
                            {this.renderSpan(format.isBullet, 'Bullet')}
                            {this.renderSpan(format.isNumbering, 'Numbering')}
                            {this.renderSpan(format.isBlockQuote, 'Quote')}
                            {this.renderSpan(format.canUnlink, 'In Link')}
                            {this.renderSpan(format.canAddImageAltText, 'In Image')}
                        </td>
                    </tr>
                    <tr>
                        <td className={styles.title}>Heading</td>
                        <td>{format.headingLevel}</td>
                    </tr>
                    <tr>
                        <td className={styles.title}>Undo</td>
                        <td>
                            {this.renderSpan(format.canUndo, 'Can Undo')}
                            {this.renderSpan(format.canRedo, 'Can Redo')}
                        </td>
                    </tr>
                    <tr>
                        <td className={styles.title}>Environment</td>
                        <td>
                            {this.renderSpan(isMac, 'MacOS')}
                            {this.renderSpan(isAndroid, 'Android')}
                            {this.renderSpan(isSafari, 'Safari')}
                            {this.renderSpan(isMobileOrTablet, 'Mobile or Tablet')}
                        </td>
                    </tr>
                    <tr>
                        <td className={styles.title}>User Agent</td>
                        <td>{window.navigator.userAgent}</td>
                    </tr>
                    <tr>
                        <td className={styles.title}>App Version</td>
                        <td>{window.navigator.appVersion}</td>
                    </tr>
                </tbody>
            </table>
        ) : (
            <div>Please focus into editor</div>
        );
    }

    private renderSpan(formatState: boolean, text: string): JSX.Element {
        return <span className={formatState ? '' : styles.inactive}>{text + ' '}</span>;
    }
}
