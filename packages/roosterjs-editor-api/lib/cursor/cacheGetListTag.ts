import { Editor } from 'roosterjs-editor-core';
import { ListTag, PluginEvent } from 'roosterjs-editor-types';
import { cacheGetNodeAtCursor } from '../cursor/getNodeAtCursor';
import { getTagOfNode } from 'roosterjs-editor-dom';

/**
 * Get the list state at selection
 * The list state refers to the HTML elements <OL> or <UL>
 * @param event (Optional) The plugin event, it stores the event cached data for looking up.
 * @param editor The editor instance
 * If not passed, we will query the first <LI> node in selection and return the list state of its direct parent
 * @returns The list tag, OL, UL or empty when cursor is not inside a list
 */
export default function cacheGetListTag(event: PluginEvent, editor: Editor): ListTag {
    let li = cacheGetNodeAtCursor(editor, event, 'LI');
    let tag = li && getTagOfNode(li.parentNode);
    return tag == 'OL' || tag == 'UL' ? tag : null;
}
