import * as React from 'react';
import BuildInPluginState, { BuildInPluginList } from '../../BuildInPluginState';
import { ContentEditFeatureSettings } from 'roosterjs-editor-plugins/lib/EditFeatures';

type PluginItemId = keyof BuildInPluginList;
type ContentEditItemId = keyof ContentEditFeatureSettings;

const styles = require('./OptionsPane.scss');

export interface ContentEditFeaturessProps {
    state: ContentEditFeatureSettings;
    resetState: (callback: (state: BuildInPluginState) => void, resetEditor: boolean) => void;
}

export default class ContentEditFeatures extends React.Component<ContentEditFeaturessProps, {}> {
    render() {
        return (
            <table>
                <tbody>
                    {this.renderContentEditItem('autoLink', 'Auto link')}
                    {this.renderContentEditItem('indentWhenTab', 'Indent When Tab')}
                    {this.renderContentEditItem('outdentWhenShiftTab', 'Outdent When Shift+Tab')}
                    {this.renderContentEditItem(
                        'outdentWhenBackspaceOnEmptyFirstLine',
                        'Outdent When Backspace On Empty FirstLine'
                    )}
                    {this.renderContentEditItem(
                        'outdentWhenEnterOnEmptyLine',
                        'Outdent When Enter On Empty Line'
                    )}
                    {this.renderContentEditItem(
                        'mergeInNewLineWhenBackspaceOnFirstChar',
                        'Merge In New Line When Backspace On FirstChar In List'
                    )}
                    {this.renderContentEditItem(
                        'unquoteWhenBackspaceOnEmptyFirstLine',
                        'Unquote When Backspace On Empty First Line'
                    )}
                    {this.renderContentEditItem(
                        'unquoteWhenEnterOnEmptyLine',
                        'Unquote When Enter On Empty Line'
                    )}
                    {this.renderContentEditItem('autoBullet', 'Auto Bullet / Numbering')}
                    {this.renderContentEditItem('tabInTable', 'Tab To Jump Cell In Table')}
                    {this.renderContentEditItem('upDownInTable', 'Up / Down To Jump Cell In Table')}
                    {this.renderContentEditItem(
                        'insertLineBeforeStructuredNodeFeature',
                        "Enter to create new line before table/list which doesn't have line before"
                    )}
                    {this.renderContentEditItem(
                        'unlinkWhenBackspaceAfterLink',
                        'Auto unlink when backspace right after a hyperlink'
                    )}
                    {this.renderContentEditItem('defaultShortcut', 'Default Shortcuts')}
                </tbody>
            </table>
        );
    }

    private renderContentEditItem(
        id: ContentEditItemId,
        text: string,
        moreOptions?: JSX.Element
    ): JSX.Element {
        return this.renderItem(
            id,
            this.props.state[id],
            text,
            moreOptions,
            this.onContentEditClick
        );
    }

    private renderItem<T extends PluginItemId | ContentEditItemId>(
        id: T,
        checked: boolean,
        text: string,
        moreOptions: JSX.Element,
        onChange: (id: T) => void
    ): JSX.Element {
        return (
            <tr>
                <td className={styles.checkboxColumn}>
                    <input
                        type="checkbox"
                        id={id}
                        checked={checked}
                        onChange={() => onChange(id)}
                    />
                </td>
                <td>
                    <div>
                        <label htmlFor={id}>{text}</label>
                    </div>
                    {checked && moreOptions}
                </td>
            </tr>
        );
    }

    private onContentEditClick = (id: ContentEditItemId) => {
        this.props.resetState(state => {
            let checkbox = document.getElementById(id) as HTMLInputElement;
            state.contentEditFeatures[id] = checkbox.checked;
        }, true);
    };
}
