import { addSelectionMarker } from './addSelectionMarker';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { DomToModelContext } from '../../publicTypes/context/DomToModelContext';
import { isNodeOfType } from '../../domUtils/isNodeOfType';
import { NodeType } from 'roosterjs-editor-types';

/**
 * @internal
 */
export function getRegularSelectionOffsets(
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

/**
 * @internal
 */
export function handleRegularSelection(
    index: number,
    context: DomToModelContext,
    group: ContentModelBlockGroup,
    nodeStartOffset: number,
    nodeEndOffset: number
) {
    if (index == nodeStartOffset) {
        context.isInSelection = true;

        addSelectionMarker(group, context);
    }

    if (index == nodeEndOffset) {
        if (!context.regularSelection!.isSelectionCollapsed) {
            addSelectionMarker(group, context);
        }
        context.isInSelection = false;
    }
}

/**
 * @internal
 */
export function processChildNode(
    group: ContentModelBlockGroup,
    child: Node,
    context: DomToModelContext
) {
    if (isNodeOfType(child, NodeType.Element)) {
        context.elementProcessors.element(group, child, context);
    } else if (isNodeOfType(child, NodeType.Text)) {
        context.elementProcessors['#text'](group, child, context);
    }
}
