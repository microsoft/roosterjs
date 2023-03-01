import { addSelectionMarker } from '../utils/addSelectionMarker';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { DomToModelContext } from '../../publicTypes/context/DomToModelContext';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { getRegularSelectionOffsets } from '../utils/getRegularSelectionOffsets';
import { isNodeOfType } from '../../domUtils/isNodeOfType';
import { NodeType } from 'roosterjs-editor-types';

/**
 * @internal
 */
export const childProcessor: ElementProcessor<ParentNode> = (
    group: ContentModelBlockGroup,
    parent: ParentNode,
    context: DomToModelContext
) => {
    const [nodeStartOffset, nodeEndOffset] = getRegularSelectionOffsets(context, parent);
    let index = 0;

    for (let child = parent.firstChild; child; child = child.nextSibling) {
        handleRegularSelection(index, context, group, nodeStartOffset, nodeEndOffset);

        processChildNode(group, child, context);

        index++;
    }

    handleRegularSelection(index, context, group, nodeStartOffset, nodeEndOffset);
};

/**
 * @internal
 */
export function processChildNode(
    group: ContentModelBlockGroup,
    child: Node,
    context: DomToModelContext
) {
    if (isNodeOfType(child, NodeType.Element) && child.style.display != 'none') {
        context.elementProcessors.element(group, child, context);
    } else if (isNodeOfType(child, NodeType.Text)) {
        context.elementProcessors['#text'](group, child, context);
    }
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
