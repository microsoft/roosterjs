import { contains, getTagOfNode } from 'roosterjs-editor-dom';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { DomToModelContext } from '../../publicTypes/context/DomToModelContext';
import { getRegularSelectionOffsets } from '../utils/getRegularSelectionOffsets';
import { handleRegularSelection, processChildNode } from './childProcessor';

interface FormatStateContext extends DomToModelContext {
    /**
     * An optional stack of parent elements to process. When provided, the child nodes of current parent element will be ignored,
     * but use the top element in this stack instead in childProcessor.
     */
    nodeStack?: Node[];
}

/**
 * @internal
 * In order to get format, we can still use the regular child processor. However, to improve performance, we don't need to create
 * content model for the whole doc, instead we only need to traverse the tree path that can arrive current selected node.
 * This "reduced" child processor will first create a node stack that stores DOM node from root to current common ancestor node of selection,
 * then use this stack as a faked DOM tree to create a reduced content model which we can use to retrieve format state
 */
export function reducedModelChildProcessor(
    group: ContentModelBlockGroup,
    parent: ParentNode,
    context: FormatStateContext
) {
    if (context.selectionRootNode) {
        if (!context.nodeStack) {
            context.nodeStack = createNodeStack(parent, context.selectionRootNode);
        }

        const stackChild = context.nodeStack.pop();

        if (stackChild) {
            const [nodeStartOffset, nodeEndOffset] = getRegularSelectionOffsets(context, parent);

            // If selection is not on this node, skip getting node index to save some time since we don't need it here
            const index =
                nodeStartOffset >= 0 || nodeEndOffset >= 0 ? getChildIndex(parent, stackChild) : -1;

            if (index >= 0) {
                handleRegularSelection(index, context, group, nodeStartOffset, nodeEndOffset);
            }

            processChildNode(group, stackChild, context);

            if (index >= 0) {
                handleRegularSelection(index + 1, context, group, nodeStartOffset, nodeEndOffset);
            }
        } else {
            // No child node from node stack, that means we have reached the deepest node of selection.
            // Now we can use default child processor to perform full sub tree scanning for content model,
            // So that all selected node will be included.
            context.defaultElementProcessors.child(group, parent, context);
        }
    }
}

function createNodeStack(root: Node, startNode: Node): Node[] {
    const result: Node[] = [];
    let node: Node | null = startNode;

    while (node && contains(root, node)) {
        if (getTagOfNode(node) == 'TABLE') {
            // For table, we can't do a reduced model creation since we need to handle their cells and indexes,
            // so clean up whatever we already have, and just put table into the stack
            result.splice(0, result.length, node);
        } else {
            result.push(node);
        }

        node = node.parentNode;
    }

    return result;
}

function getChildIndex(parent: ParentNode, stackChild: Node) {
    let index = 0;
    let child = parent.firstChild;

    while (child && child != stackChild) {
        index++;
        child = child.nextSibling;
    }
    return index;
}
