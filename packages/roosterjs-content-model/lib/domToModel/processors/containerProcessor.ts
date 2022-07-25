import { addSegment } from '../utils/addSegment';
import { ContentModelBlockGroup } from '../../publicTypes/block/group/ContentModelBlockGroup';
import { createSelectionMarker } from '../creators/createSelectionMarker';
import { FormatContext } from '../../formatHandlers/FormatContext';
import { generalBlockProcessor } from './generalBlockProcessor';
import { generalSegmentProcessor } from './generalSegmentProcessor';
import { getProcessor } from './getProcessor';
import { isBlockElement } from 'roosterjs-editor-dom';
import { isNodeOfType } from '../../domUtils/isNodeOfType';
import { NodeType } from 'roosterjs-editor-types';
import { textProcessor } from './textProcessor';

/**
 * @internal
 */
export function containerProcessor(
    group: ContentModelBlockGroup,
    parent: ParentNode,
    context: FormatContext
) {
    const [nodeStartOffset, nodeEndOffset] = getRegularSelectionOffsets(context, parent);
    let index = 0;

    for (let child = parent.firstChild; child; child = child.nextSibling) {
        if (index == nodeStartOffset) {
            context.isInSelection = true;

            addSegment(group, createSelectionMarker(context));
        }

        if (index == nodeEndOffset) {
            if (!context.regularSelection!.isSelectionCollapsed) {
                addSegment(group, createSelectionMarker(context));
            }
            context.isInSelection = false;
        }

        if (isNodeOfType(child, NodeType.Element)) {
            processElement(group, child, context);
        } else if (isNodeOfType(child, NodeType.Text)) {
            processText(group, child, context);
        }

        index++;
    }
}

function processElement(
    group: ContentModelBlockGroup,
    element: HTMLElement,
    context: FormatContext
) {
    const processor =
        getProcessor(element.tagName) ||
        (isBlockElement(element) ? generalBlockProcessor : generalSegmentProcessor);

    processor(group, element, context);
}

function processText(group: ContentModelBlockGroup, textNode: Text, context: FormatContext) {
    let txt = textNode.nodeValue || '';
    let [txtStartOffset, txtEndOffset] = getRegularSelectionOffsets(context, textNode);

    if (txtStartOffset >= 0) {
        textProcessor(group, txt.substring(0, txtStartOffset), context);
        context.isInSelection = true;

        addSegment(group, createSelectionMarker(context));

        txt = txt.substring(txtStartOffset);
        txtEndOffset -= txtStartOffset;
    }

    if (txtEndOffset >= 0) {
        textProcessor(group, txt.substring(0, txtEndOffset), context);

        if (!context.regularSelection!.isSelectionCollapsed) {
            addSegment(group, createSelectionMarker(context));
        }

        context.isInSelection = false;
        txt = txt.substring(txtEndOffset);
    }

    textProcessor(group, txt, context);
}

function getRegularSelectionOffsets(
    context: FormatContext,
    currentContainer: Node
): [number, number] {
    let startOffset =
        context.regularSelection?.startContainer == currentContainer
            ? context.regularSelection.startOffset!
            : -1;
    let endOffset =
        context.regularSelection?.endContainer == currentContainer
            ? context.regularSelection.endOffset!
            : -1;

    return [startOffset, endOffset];
}
