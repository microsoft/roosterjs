import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

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
 * @param format The format to set. Pass null to clear existing format
 */
export function setPendingFormat(
    editor: IContentModelEditor,
    format: ContentModelSegmentFormat | null
) {
    getPendingFormatHolder(editor).format = format;
}

interface PendingFormatHolder {
    format: ContentModelSegmentFormat | null;
}

const PendingFormatHolderKey = '__ContentModelPendingFormat';

function getPendingFormatHolder(editor: IContentModelEditor): PendingFormatHolder {
    return editor.getCustomData<PendingFormatHolder>(PendingFormatHolderKey, () => ({
        format: null,
    }));
}
