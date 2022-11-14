import { addSelectionMarker } from '../utils/addSelectionMarker';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { DomToModelContext } from '../../publicTypes/context/DomToModelContext';
import { getRegularSelectionOffsets } from '../utils/getRegularSelectionOffsets';
import { isNodeOfType } from '../../domUtils/isNodeOfType';
import { NodeType } from 'roosterjs-editor-types';

/**
 * @internal
 */
export function childProcessor(
    group: ContentModelBlockGroup,
    parent: ParentNode,
    context: DomToModelContext
) {
    const [nodeStartOffset, nodeEndOffset] = getRegularSelectionOffsets(context, parent);
    let index = 0;

    for (let child = parent.firstChild; child; child = child.nextSibling) {
        handleSelection(index, context, group, nodeStartOffset, nodeEndOffset);

        if (isNodeOfType(child, NodeType.Element)) {
            context.elementProcessors.element(group, child, context);
        } else if (isNodeOfType(child, NodeType.Text)) {
            context.elementProcessors['#text'](group, child, context);
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

        addSelectionMarker(group, context);
    }

    if (index == nodeEndOffset) {
        if (!context.regularSelection!.isSelectionCollapsed) {
            addSelectionMarker(group, context);
        }
        context.isInSelection = false;
    }
}
