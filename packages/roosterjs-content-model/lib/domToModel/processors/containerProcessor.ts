import { addSegment } from '../../modelApi/common/addSegment';
import { ContentModelBlockGroup } from '../../publicTypes/block/group/ContentModelBlockGroup';
import { createSelectionMarker } from '../../modelApi/creators/createSelectionMarker';
import { DomToModelContext } from '../context/DomToModelContext';
import { isNodeOfType } from '../../domUtils/isNodeOfType';
import { NodeType } from 'roosterjs-editor-types';
import { singleElementProcessor } from './singleElementProcessor';
import { textProcessor } from './textProcessor';

/**
 * @internal
 */
export function containerProcessor(
    group: ContentModelBlockGroup,
    parent: ParentNode,
    context: DomToModelContext
) {
    const [nodeStartOffset, nodeEndOffset] = getRegularSelectionOffsets(context, parent);
    let index = 0;

    for (let child = parent.firstChild; child; child = child.nextSibling) {
        handleSelection(index, context, group, nodeStartOffset, nodeEndOffset);

        if (isNodeOfType(child, NodeType.Element)) {
            singleElementProcessor(group, child, context);
        } else if (isNodeOfType(child, NodeType.Text)) {
            textNodeProcessor(group, child, context);
        }

        index++;
    }

    handleSelection(index, context, group, nodeStartOffset, nodeEndOffset);
}

function handleSelection(
    index: number,
    context: DomToModelContext,
    group: ContentModelBlockGroup,
    nodeStartOffset: number,
    nodeEndOffset: number
) {
    if (index == nodeStartOffset) {
        context.isInSelection = true;

        addSegment(group, createSelectionMarker());
    }

    if (index == nodeEndOffset) {
        if (!context.regularSelection!.isSelectionCollapsed) {
            addSegment(group, createSelectionMarker());
        }
        context.isInSelection = false;
    }
}

function textNodeProcessor(
    group: ContentModelBlockGroup,
    textNode: Text,
    context: DomToModelContext
) {
    let txt = textNode.nodeValue || '';
    let [txtStartOffset, txtEndOffset] = getRegularSelectionOffsets(context, textNode);

    if (txtStartOffset >= 0) {
        textProcessor(group, txt.substring(0, txtStartOffset), context);
        context.isInSelection = true;

        addSegment(group, createSelectionMarker());

        txt = txt.substring(txtStartOffset);
        txtEndOffset -= txtStartOffset;
    }

    if (txtEndOffset >= 0) {
        textProcessor(group, txt.substring(0, txtEndOffset), context);

        if (!context.regularSelection!.isSelectionCollapsed) {
            addSegment(group, createSelectionMarker());
        }

        context.isInSelection = false;
        txt = txt.substring(txtEndOffset);
    }

    textProcessor(group, txt, context);
}

function getRegularSelectionOffsets(
    context: DomToModelContext,
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
