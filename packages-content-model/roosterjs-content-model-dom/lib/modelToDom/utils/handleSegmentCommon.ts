import { applyFormat } from './applyFormat';
import {
    ContentModelParagraph,
    ContentModelSegment,
    ModelToDomContext,
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
    paragraph: ContentModelParagraph,
    newNodes?: Node[]
) {
    if (!segmentNode.firstChild) {
        context.regularSelection.current.segment = segmentNode;
    }

    applyFormat(containerNode, context.formatAppliers.styleBasedSegment, segment.format, context);

    context.modelHandlers.segmentDecorator(doc, containerNode, segment, context, paragraph);

    applyFormat(containerNode, context.formatAppliers.elementBasedSegment, segment.format, context);

    newNodes?.push(segmentNode);
    context.domIndexer?.onSegment(segmentNode, paragraph, [segment]);
}
