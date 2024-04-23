import {
    getSelectedSegmentsAndParagraphs,
    isBlockEntityContainer,
    isEntityDelimiter,
    isNodeOfType,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelBlockGroup,
    ContentModelEntity,
    ContentModelParagraph,
    ContentModelSegment,
    IEditor,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function adjustSelectionAroundEntity(
    editor: IEditor,
    key: 'ArrowLeft' | 'ArrowRight',
    shiftKey: boolean
) {
    const selection = editor.isDisposed() ? null : editor.getDOMSelection();

    if (!selection || selection.type != 'range') {
        return;
    }

    const { range, isReverted } = selection;
    const anchorNode = isReverted ? range.startContainer : range.endContainer;
    const offset = isReverted ? range.startOffset : range.endOffset;
    const delimiter = isNodeOfType(anchorNode, 'ELEMENT_NODE')
        ? anchorNode
        : anchorNode.parentElement;
    const isRtl =
        delimiter &&
        editor.getDocument().defaultView?.getComputedStyle(delimiter).direction == 'rtl';
    const movingBefore = (key == 'ArrowLeft') != !!isRtl;

    if (
        delimiter &&
        ((isEntityDelimiter(delimiter, !movingBefore) &&
            ((movingBefore && offset == 0) || (!movingBefore && offset == 1))) ||
            isBlockEntityContainer(delimiter))
    ) {
        editor.formatContentModel(model => {
            const allSel = getSelectedSegmentsAndParagraphs(
                model,
                false /*includingFormatHolder*/,
                true /*includingEntity*/
            );
            const sel = allSel[isReverted ? 0 : allSel.length - 1];
            const index = sel?.[1]?.segments.indexOf(sel[0]) ?? -1;

            if (sel && sel[1] && index >= 0) {
                const [segment, paragraph, path] = sel;
                const isShrinking = shiftKey && !range.collapsed && movingBefore != !!isReverted;
                const entitySegment = isShrinking
                    ? segment
                    : paragraph.segments[movingBefore ? index - 1 : index + 1];

                const pairedDelimiter = findPairedDelimiter(
                    entitySegment,
                    path,
                    paragraph,
                    movingBefore
                );

                if (pairedDelimiter) {
                    const newRange = getNewRange(
                        range,
                        isShrinking,
                        movingBefore,
                        pairedDelimiter,
                        shiftKey
                    );

                    editor.setDOMSelection({
                        type: 'range',
                        range: newRange,
                        isReverted: newRange.collapsed ? false : isReverted,
                    });
                }
            }

            return false;
        });
    }
}

function getNewRange(
    originalRange: Range,
    isShrinking: boolean,
    movingBefore: boolean,
    pairedDelimiter: HTMLElement,
    shiftKey: boolean
) {
    const newRange = originalRange.cloneRange();

    if (isShrinking) {
        if (movingBefore) {
            newRange.setEndBefore(pairedDelimiter);
        } else {
            newRange.setStartAfter(pairedDelimiter);
        }
    } else {
        if (movingBefore) {
            newRange.setStartBefore(pairedDelimiter);
        } else {
            newRange.setEndAfter(pairedDelimiter);
        }
        if (!shiftKey) {
            if (movingBefore) {
                newRange.setEndBefore(pairedDelimiter);
            } else {
                newRange.setStartAfter(pairedDelimiter);
            }
        }
    }

    return newRange;
}

function findPairedDelimiter(
    entitySegment: ContentModelSegment,
    path: ContentModelBlockGroup[],
    paragraph: ContentModelParagraph,
    movingBefore: boolean
) {
    let entity: ContentModelEntity | null = null;

    if (entitySegment?.segmentType == 'Entity') {
        // Inline entity
        entity = entitySegment;
    } else {
        // Block entity
        const blocks = path[0].blocks;
        const paraIndex = blocks.indexOf(paragraph);
        const entityBlock =
            paraIndex >= 0 ? blocks[movingBefore ? paraIndex - 1 : paraIndex + 1] : null;

        if (entityBlock?.blockType == 'Entity') {
            entity = entityBlock;
        }
    }

    const pairedDelimiter = entity
        ? movingBefore
            ? entity.wrapper.previousElementSibling
            : entity.wrapper.nextElementSibling
        : null;

    return isNodeOfType(pairedDelimiter, 'ELEMENT_NODE') &&
        isEntityDelimiter(pairedDelimiter, movingBefore)
        ? pairedDelimiter
        : null;
}
