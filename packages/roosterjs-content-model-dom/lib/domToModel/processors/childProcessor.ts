import { addSelectionMarker } from '../utils/addSelectionMarker';
import { getRegularSelectionOffsets } from '../utils/getRegularSelectionOffsets';
import { isNodeOfType } from '../../domUtils/isNodeOfType';
import type {
    ContentModelBlockGroup,
    DomToModelContext,
    ElementProcessor,
} from 'roosterjs-content-model-types';

/**
 * Content Model Element Processor for child elements
 * @param group The parent block group
 * @param parent Parent DOM node to process
 * @param context DOM to Content Model context
 */
export const childProcessor: ElementProcessor<ParentNode> = (
    group: ContentModelBlockGroup,
    parent: ParentNode,
    context: DomToModelContext
) => {
    const [nodeStartOffset, nodeEndOffset] = getRegularSelectionOffsets(context, parent);
    let index = 0;

    for (let child = parent.firstChild; child; child = child.nextSibling) {
        handleRegularSelection(index, context, group, nodeStartOffset, nodeEndOffset, parent);

        processChildNode(group, child, context);

        index++;
    }

    handleRegularSelection(index, context, group, nodeStartOffset, nodeEndOffset, parent);
};

/**
 * Helper function for processing child node
 * @param group The parent block group
 * @param parent Parent DOM node to process
 * @param context DOM to Content Model context
 *
 */
export function processChildNode(
    group: ContentModelBlockGroup,
    child: Node,
    context: DomToModelContext
) {
    if (isNodeOfType(child, 'ELEMENT_NODE') && child.style.display != 'none') {
        context.elementProcessors.element(group, child, context);
    } else if (isNodeOfType(child, 'TEXT_NODE')) {
        context.elementProcessors['#text'](group, child, context);
    }
}

/**
 * Helper function to handle regular (range based) selection when process child node
 * @param index Index of current child node in its parent
 * @param context DOM to Content Model context
 * @param group The parent block group
 * @param nodeStartOffset Start offset of current regular selection
 * @param nodeEndOffset  End offset of current regular selection
 * @param container The container node of this selection
 */
export function handleRegularSelection(
    index: number,
    context: DomToModelContext,
    group: ContentModelBlockGroup,
    nodeStartOffset: number,
    nodeEndOffset: number,
    container?: Node
) {
    if (index == nodeStartOffset) {
        context.isInSelection = true;

        addSelectionMarker(group, context, container, index);
    }

    if (index == nodeEndOffset && context.selection?.type == 'range') {
        if (!context.selection.range.collapsed) {
            addSelectionMarker(group, context, container, index);
        }
        context.isInSelection = false;
    }
}
