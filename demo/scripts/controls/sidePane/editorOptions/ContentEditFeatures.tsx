import * as React from 'react';
import BuildInPluginState from '../../BuildInPluginState';
import { ContentEditFeatureSettings } from 'roosterjs-editor-types';
import { getAllFeatures } from 'roosterjs-editor-plugins/lib/ContentEdit';
import { getObjectKeys } from 'roosterjs-editor-dom';

type ContentEditItemId = keyof ContentEditFeatureSettings;

const styles = require('./OptionsPane.scss');
const EditFeatureDescriptionMap: Record<keyof ContentEditFeatureSettings, string> = {
    autoBullet: 'Auto Bullet / Numbering',
    indentWhenTab: 'Indent list when Tab',
    outdentWhenShiftTab: 'Outdent list when Shift + Tab',
    outdentWhenBackspaceOnEmptyFirstLine: 'Outdent list when Backspace on empty first Line',
    outdentWhenEnterOnEmptyLine: 'Outdent list when Enter on empty line',
    mergeInNewLineWhenBackspaceOnFirstChar:
        'Merge in new line when Backspace on first char in list',
    maintainListChain: 'Maintain the continued list numbers',
    unquoteWhenBackspaceOnEmptyFirstLine: 'Unquote when Backspace on empty first line',
    unquoteWhenEnterOnEmptyLine: 'Unquote when Enter on empty line',
    tabInTable: 'Tab to jump cell in table',
    upDownInTable: 'Up / Down to jump cell in table',
    insertLineBeforeStructuredNodeFeature:
        'Enter to create new line before table/list at beginning of editor content',
    autoLink: 'Auto link',
    unlinkWhenBackspaceAfterLink: 'Auto unlink when backspace right after a hyperlink',
    defaultShortcut: 'Default Shortcuts',
    noCycleCursorMove: 'Avoid moving cycle moving cursor when Ctrl+Left/Right',
    clickOnEntity: 'Fire an event when click on a readonly entity',
    escapeFromEntity: 'Fire an event when Escape from a readonly entity',
    enterBeforeReadonlyEntity: 'Start a new line when Enter before an event',
    backspaceAfterEntity: 'Fire an event when Backspace after an entity',
    deleteBeforeEntity: 'Fire an event when Delete before an event',
    markdownBold: 'Markdown style Bolding',
    markdownItalic: 'Markdown style Italics',
    markdownStrikethru: 'Markdown style Strikethrough',
    markdownInlineCode: 'Markdown style Code blocks',
    maintainListChainWhenDelete:
        'Maintain the list of number in the right order after press delete before the first item',
    indentTableOnTab: 'Indent the table if it is all cells are selected.',
    indentWhenTabText:
        'On Tab indent the selection or add Tab, requires TabKeyFeatures Experimental Feature',
    outdentWhenTabText:
        'On Shift + Tab outdent the selection, requires TabKeyFeatures Experimental Feature',
    autoHyphen: 'Automatically transform -- into hyphen, if typed between two words.',
    autoBulletList:
        'When press space after *, -, --, ->, -->, >, =>  in an empty line, toggle bullet',
    autoNumberingList:
        'When press space after an number, a letter or roman number followed by ), ., -, or between parenthesis in an empty line, toggle numbering',
    mergeListOnBackspaceAfterList: 'When backspacing between lists, merge the lists',
    deleteTableWithBackspace: 'Delete table with backspace key with whole table is selected',
    moveBetweenDelimitersFeature:
        'Content edit feature to move the cursor from Delimiters around Entities when using Right or Left Arrow Keys',
    removeEntityBetweenDelimiters:
        'When using BACKSPACE or DELETE in a Readonly inline entity delimeter, trigger a Entity Operation',
    removeCodeWhenEnterOnEmptyLine: 'Remove code line when enter on empty line',
    removeCodeWhenBackspaceOnEmptyFirstLine: 'Remove code line when backspace on empty first line',
    indentWhenAltShiftRight: 'Indent list item using Alt + Shift + Right',
    outdentWhenAltShiftLeft: 'Outdent list item using Alt + Shift + Left',
};

export interface ContentEditFeaturessProps {
    state: ContentEditFeatureSettings;
    resetState: (callback: (state: BuildInPluginState) => void, resetEditor: boolean) => void;
}

export default class ContentEditFeatures extends React.Component<ContentEditFeaturessProps, {}> {
    render() {
        const features = getAllFeatures();
        return (
            <table>
                <tbody>
                    {getObjectKeys(features).map(key =>
                        this.renderContentEditItem(key, EditFeatureDescriptionMap[key])
                    )}
                </tbody>
            </table>
        );
    }

    private renderContentEditItem(
        id: ContentEditItemId,
        text: string,
        moreOptions?: JSX.Element
    ): JSX.Element {
        const checked = this.props.state[id];

        return (
            <tr key={id}>
                <td className={styles.checkboxColumn}>
                    <input
                        type="checkbox"
                        id={id}
                        checked={checked}
                        title={id}
                        onChange={() => this.onContentEditClick(id)}
                    />
                </td>
                <td>
                    <div>
                        <label htmlFor={id} title={id}>
                            {text}
                        </label>
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
