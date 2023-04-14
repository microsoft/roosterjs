import formatUndoSnapshot from '../utils/formatUndoSnapshot';
import { IEditor, QueryScope } from 'roosterjs-editor-types';
import { unwrap } from 'roosterjs-editor-dom';

/**
 * Remove link at selection. If no links at selection, do nothing.
 * If selection contains multiple links, all of the link styles will be removed.
 * If only part of a link is selected, the whole link style will be removed.
 * @param editor The editor instance
 */
export default function removeLink(editor: IEditor) {
    editor.focus();
    formatUndoSnapshot(
        editor,
        (start, end) => {
            editor.queryElements('a[href]', QueryScope.OnSelection, unwrap);
            if (start && end) {
                editor.select(start, end);
            }
        },
        'removeLink'
    );
}
