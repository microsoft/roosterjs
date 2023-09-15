import { applyFormat } from './applyFormat';
import {
    ContentModelSegment,
    ModelToDomContext,
    OnNodeCreated,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function handleSegmentCommon(
    doc: Document,
    segmentNode: Node,
    containerNode: HTMLElement,
    segment: ContentModelSegment,
    context: ModelToDomContext,
    onNodeCreated?: OnNodeCreated
) {
    if (!segmentNode.firstChild) {
        context.regularSelection.current.segment = segmentNode;
    }

    applyFormat(containerNode, context.formatAppliers.styleBasedSegment, segment.format, context);

    context.modelHandlers.segmentDecorator(doc, containerNode, segment, context);

    applyFormat(containerNode, context.formatAppliers.elementBasedSegment, segment.format, context);

    onNodeCreated?.(segment, segmentNode);
}
