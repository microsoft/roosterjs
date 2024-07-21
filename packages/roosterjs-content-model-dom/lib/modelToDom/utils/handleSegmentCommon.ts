import { applyFormat } from './applyFormat';
import type { ContentModelSegment, ModelToDomContext } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function handleSegmentCommon(
    doc: Document,
    segmentNode: Node,
    containerNode: HTMLElement,
    segment: ContentModelSegment,
    context: ModelToDomContext,
    segmentNodes: Node[]
) {
    if (!segmentNode.firstChild) {
        context.regularSelection.current.segment = segmentNode;
    }

    applyFormat(containerNode, context.formatAppliers.styleBasedSegment, segment.format, context);

    segmentNodes?.push(segmentNode);
    context.modelHandlers.segmentDecorator(doc, containerNode, segment, context, segmentNodes);

    applyFormat(containerNode, context.formatAppliers.elementBasedSegment, segment.format, context);

    if (segment.isSelected && context.selectionClassName) {
        containerNode.className = context.selectionClassName;
    }

    context.onNodeCreated?.(segment, segmentNode);
}
