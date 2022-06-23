import * as React from 'react';
import BuildInPluginState from '../../BuildInPluginState';
import { DefaultFormat } from 'roosterjs-editor-types';
import { getObjectKeys } from 'roosterjs-editor-dom';

type ToggleFormatId = 'bold' | 'italic' | 'underline';
type ModeIndependentColorId = 'textColors' | 'backgroundColors';
type SelectFormatId = Exclude<keyof DefaultFormat, ToggleFormatId | ModeIndependentColorId>;

const styles = require('./OptionsPane.scss');
const NOT_SET = 'NotSet';

export interface DefaultFormatProps {
    state: DefaultFormat;
    resetState: (callback: (state: BuildInPluginState) => void, resetEditor: boolean) => void;
}

export default class DefaultFormatPane extends React.Component<DefaultFormatProps, {}> {
    render() {
        return (
            <>
                <table>
                    <tbody>
                        {this.renderFormatItem('bold', 'Bold')}
                        {this.renderFormatItem('italic', 'Italic')}
                        {this.renderFormatItem('underline', 'Underline')}
                    </tbody>
                </table>
                <table>
                    <tbody>
                        {this.renderSelectItem('fontFamily', 'Font family: ', {
                            [NOT_SET]: 'Not Set',
                            Arial: 'Arial',
                            Calibri: 'Calibri',
                            'Courier New': 'Courier New',
                            Tahoma: 'Tahoma',
                            'Times New Roman': 'Times New Roman',
                        })}
                        {this.renderSelectItem('fontSize', 'Font size: ', {
                            [NOT_SET]: 'Not Set',
                            '8pt': '8',
                            '10pt': '10',
                            '12pt': '12',
                            '16pt': '16',
                            '20pt': '20',
                            '36pt': '36',
                            '72pt': '72',
                        })}
                        {this.renderSelectItem('textColor', 'Text color: ', {
                            [NOT_SET]: 'Not Set',
                            '#757b80': 'Gray',
                            '#bd1398': 'Violet',
                            '#7232ad': 'Purple',
                            '#006fc9': 'Blue',
                            '#4ba524': 'Green',
                            '#e2c501': 'Yellow',
                            '#d05c12': 'Orange',
                            '#ff0000': 'Red',
                            '#ffffff': 'White',
                            '#000000': 'Black',
                        })}
                        {this.renderSelectItem('backgroundColor', 'Back color: ', {
                            [NOT_SET]: 'Not Set',
                            '#ffff00': 'Yellow',
                            '#00ff00': 'Green',
                            '#00ffff': 'Cyan',
                            '#ff00ff': 'Purple',
                            '#0000ff': 'Blue',
                            '#ff0000': 'Red',
                            '#bebebe': 'Gray',
                            '#666666': 'Dark Gray',
                            '#ffffff': 'White',
                            '#000000': 'Black',
                        })}
                    </tbody>
                </table>
            </>
        );
    }

    private renderFormatItem(id: ToggleFormatId, text: string): JSX.Element {
        let checked = (this.props.state[id] as boolean) || false;
        return (
            <tr>
                <td className={styles.checkboxColumn}>
                    <input
                        type="checkbox"
                        id={id}
                        checked={checked}
                        onChange={() => this.onFormatClick(id)}
                    />
                </td>
                <td>
                    <div>
                        <label htmlFor={id}>{text}</label>
                    </div>
                </td>
            </tr>
        );
    }

    private renderSelectItem(
        id: SelectFormatId,
        label: string,
        items: { [key: string]: string }
    ): JSX.Element {
        return (
            <tr>
                <td className={styles.defaultFormatLabel}>{label}</td>
                <td>
                    <select
                        id={id}
                        onChange={() => this.onSelectChanged(id)}
                        defaultValue={(this.props.state[id] || NOT_SET) as string}>
                        {getObjectKeys(items).map(key => (
                            <option value={key} key={key}>
                                {items[key]}
                            </option>
                        ))}
                    </select>
                </td>
            </tr>
        );
    }

    private onFormatClick = (id: ToggleFormatId) => {
        this.props.resetState(state => {
            let checkbox = document.getElementById(id) as HTMLInputElement;
            state.defaultFormat[id] = checkbox.checked;
        }, true);
    };

    private onSelectChanged = (id: SelectFormatId) => {
        this.props.resetState(state => {
            let value = (document.getElementById(id) as HTMLSelectElement).value;
            state.defaultFormat[id] = value == NOT_SET ? null : value;
        }, true);
    };
}
