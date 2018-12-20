import { cacheGetElementAtCursor, Editor } from 'roosterjs-editor-core';
import { getTagOfNode } from 'roosterjs-editor-dom';
import { ListState, PluginEvent } from 'roosterjs-editor-types';

/**
 * @deprecated use cacheGetElementAtCursor('OL,UL') instead
 * Get the list state at selection
 * The list state refers to the HTML elements <OL> or <UL>
 * @param editor The editor instance
 * @param event (Optional) The plugin event, it stores the event cached data for looking up.
 * If not passed, we will query the first <LI> node in selection and return the list state of its direct parent
 * @returns The list state. ListState.Numbering indicates <OL>, ListState.Bullets indicates <UL>,
 * ListState.None indicates no <OL> or <UL> elements found at current selection
 */
export default function cacheGetListState(editor: Editor, event?: PluginEvent): ListState {
    let element = cacheGetElementAtCursor(editor, event, 'OL, UL');
    let tag = getTagOfNode(element);
    return tag == 'OL' ? ListState.Numbering : tag == 'UL' ? ListState.Bullets : ListState.None;
}
