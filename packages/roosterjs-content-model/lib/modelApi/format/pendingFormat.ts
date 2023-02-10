import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { NodePosition } from 'roosterjs-editor-types';

/**
 * @internal
 * Get pending segment format from editor if any, otherwise null
 * @param editor The editor to get format from
 */
export function getPendingFormat(editor: IContentModelEditor): ContentModelSegmentFormat | null {
    return getPendingFormatHolder(editor).format;
}

/**
 * @internal
 * Set pending segment format to editor
 * @param editor The editor to set pending format to
 * @param format The format to set.
 * @param position Cursor position when set this format
 */
export function setPendingFormat(
    editor: IContentModelEditor,
    format: ContentModelSegmentFormat,
    position: NodePosition
) {
    const holder = getPendingFormatHolder(editor);

    holder.format = format;
    holder.position = position;
}

/**
 * @internal Clear pending format if any
 * @param editor The editor to set pending format to
 */
export function clearPendingFormat(editor: IContentModelEditor) {
    const holder = getPendingFormatHolder(editor);

    holder.format = null;
    holder.position = null;
}

/**
 * @internal
 * Check if this editor can apply pending format
 * @param editor The editor to get format from
 */
export function canApplyPendingFormat(editor: IContentModelEditor): boolean {
    const holder = getPendingFormatHolder(editor);
    let result = false;

    if (holder.format && holder.position) {
        const position = editor.getFocusedPosition();

        if (position?.equalTo(holder.position)) {
            result = true;
        }
    }

    return result;
}
interface PendingFormatHolder {
    format: ContentModelSegmentFormat | null;
    position: NodePosition | null;
}

const PendingFormatHolderKey = '__ContentModelPendingFormat';

function getPendingFormatHolder(editor: IContentModelEditor): PendingFormatHolder {
    return editor.getCustomData<PendingFormatHolder>(PendingFormatHolderKey, () => ({
        format: null,
        position: null,
    }));
}
