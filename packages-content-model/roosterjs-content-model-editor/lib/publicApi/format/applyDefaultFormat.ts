import { DeleteResult } from '../../modelApi/edit/utils/DeleteSelectionStep';
import { deleteSelection } from '../../modelApi/edit/deleteSelection';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { getPendingFormat, setPendingFormat } from '../../modelApi/format/pendingFormat';
import { isBlockElement, Position } from 'roosterjs-editor-dom';
import { isNodeOfType, normalizeContentModel } from 'roosterjs-content-model-dom';
import type { ContentModelSegmentFormat } from 'roosterjs-content-model-types';
import type { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import type { NodePosition } from 'roosterjs-editor-types';

/**
 * @internal
 * When necessary, set default format as current pending format so it will be applied when Input event is fired
 * @param editor The Content Model Editor
 * @param defaultFormat The default segment format to apply
 */
export default function applyDefaultFormat(
    editor: IContentModelEditor,
    defaultFormat: ContentModelSegmentFormat
) {
    const selection = editor.getDOMSelection();
    const range = selection?.type == 'range' ? selection.range : null;
    const startPos = range ? Position.getStart(range) : null;
    let node: Node | null = startPos?.node ?? null;

    while (node && editor.contains(node)) {
        if (isNodeOfType(node, 'ELEMENT_NODE') && node.getAttribute?.('style')) {
            return;
        } else if (isBlockElement(node)) {
            break;
        } else {
            node = node.parentNode;
        }
    }

    formatWithContentModel(editor, 'input', (model, context) => {
        const result = deleteSelection(model, [], context);

        if (result.deleteResult == DeleteResult.Range) {
            normalizeContentModel(model);
            editor.addUndoSnapshot();

            return true;
        } else if (
            result.deleteResult == DeleteResult.NotDeleted &&
            result.insertPoint &&
            startPos
        ) {
            const { paragraph, path, marker } = result.insertPoint;
            const blocks = path[0].blocks;
            const blockCount = blocks.length;
            const blockIndex = blocks.indexOf(paragraph);

            if (
                paragraph.isImplicit &&
                paragraph.segments.length == 1 &&
                paragraph.segments[0] == marker &&
                blockCount > 0 &&
                blockIndex == blockCount - 1
            ) {
                // Focus is in the last paragraph which is implicit and there is not other segments.
                // This can happen when focus is moved after all other content under current block group.
                // We need to check if browser will merge focus into previous paragraph by checking if
                // previous block is block. If previous block is paragraph, browser will most likely merge
                // the input into previous paragraph, then nothing need to do here. Otherwise we need to
                // apply pending format since this input event will start a new real paragraph.
                const previousBlock = blocks[blockIndex - 1];

                if (previousBlock?.blockType != 'Paragraph') {
                    internalApplyDefaultFormat(editor, defaultFormat, marker.format, startPos);
                }
            } else if (paragraph.segments.every(x => x.segmentType != 'Text')) {
                internalApplyDefaultFormat(editor, defaultFormat, marker.format, startPos);
            }

            // We didn't do any change but just apply default format to pending format, so no need to write back
            return false;
        } else {
            return false;
        }
    });
}

function internalApplyDefaultFormat(
    editor: IContentModelEditor,
    defaultFormat: ContentModelSegmentFormat,
    currentFormat: ContentModelSegmentFormat,
    startPos: NodePosition
) {
    const pendingFormat = getPendingFormat(editor) || {};
    const newFormat: ContentModelSegmentFormat = {
        ...defaultFormat,
        ...pendingFormat,
        ...currentFormat,
    };

    setPendingFormat(editor, newFormat, startPos);
}
