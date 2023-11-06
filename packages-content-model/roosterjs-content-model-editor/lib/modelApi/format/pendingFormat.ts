import type { ContentModelSegmentFormat } from 'roosterjs-content-model-types';
import type { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import type {
    ContentModelFormatter,
    FormatWithContentModelOptions,
} from '../../publicTypes/parameter/FormatWithContentModelContext';

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
 * @param posContainer Container node of current focus position
 * @param posOffset Offset number of current focus position
 */
export function setPendingFormat(
    editor: IContentModelEditor,
    format: ContentModelSegmentFormat,
    posContainer: Node,
    posOffset: number
) {
    const holder = getPendingFormatHolder(editor);

    holder.format = format;
    holder.posContainer = posContainer;
    holder.posOffset = posOffset;
}

/**
 * @internal Clear pending format if any
 * @param editor The editor to set pending format to
 */
export function clearPendingFormat(editor: IContentModelEditor) {
    const holder = getPendingFormatHolder(editor);

    holder.format = null;
    holder.posContainer = null;
    holder.posOffset = null;
}

/**
 * @internal
 * Check if this editor can apply pending format
 * @param editor The editor to get format from
 */
export function canApplyPendingFormat(editor: IContentModelEditor): boolean {
    const holder = getPendingFormatHolder(editor);
    let result = false;

    if (holder.format && holder.posContainer && holder.posOffset !== null) {
        const position = editor.getFocusedPosition();

        if (position?.node == holder.posContainer && position?.offset == holder.posOffset) {
            result = true;
        }
    }

    return result;
}

/**
 * @internal
 * Execute a callback function and keep pending format state still available
 * @param editor The editor to keep pending format
 * @param formatter Formatter function, see ContentModelFormatter
 * @param options More options, see FormatWithContentModelOptions
 */
export function formatAndKeepPendingFormat(
    editor: IContentModelEditor,
    formatter: ContentModelFormatter,
    options?: FormatWithContentModelOptions
) {
    const pendingFormat = getPendingFormat(editor);

    editor.formatContentModel(formatter, options);

    const pos = editor.getFocusedPosition();

    if (pendingFormat && pos) {
        setPendingFormat(editor, pendingFormat, pos.node, pos.offset);
    }
}

interface PendingFormatHolder {
    format: ContentModelSegmentFormat | null;
    posContainer: Node | null;
    posOffset: number | null;
}

const PendingFormatHolderKey = '__ContentModelPendingFormat';

function getPendingFormatHolder(editor: IContentModelEditor): PendingFormatHolder {
    return editor.getCustomData<PendingFormatHolder>(PendingFormatHolderKey, () => ({
        format: null,
        posContainer: null,
        posOffset: null,
    }));
}
