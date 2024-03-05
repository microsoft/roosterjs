import { addSelectionMarker } from '../utils/addSelectionMarker';
import type { ElementProcessor } from 'roosterjs-content-model-types';

/**
 * @internal
 * @param group
 * @param node
 * @param context
 */
export const delimiterProcessor: ElementProcessor<Node> = (group, node, context) => {
    const range = context.selection?.type == 'range' ? context.selection.range : null;

    if (range) {
        if (node.contains(range.startContainer)) {
            context.isInSelection = true;

            addSelectionMarker(group, context);
        }

        if (context.selection?.type == 'range' && node.contains(range.endContainer)) {
            if (!context.selection.range.collapsed) {
                addSelectionMarker(group, context);
            }

            context.isInSelection = false;
        }
    }
};
