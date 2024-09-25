import type { ContentModelParagraph, ModelToDomContext } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function handleSegments(
    doc: Document,
    parent: Node,
    paragraph: ContentModelParagraph,
    context: ModelToDomContext
) {
    const firstSegment = paragraph.segments[0];

    if (firstSegment?.segmentType == 'SelectionMarker') {
        // Make sure there is a segment created before selection marker.
        // If selection marker is the first selected segment in a paragraph, create a dummy text node,
        // so after rewrite, the regularSelection object can have a valid segment object set to the text node.
        context.modelHandlers.text(
            doc,
            parent,
            {
                ...firstSegment,
                segmentType: 'Text',
                text: '',
            },
            context,
            []
        );
    }

    paragraph.segments.forEach(segment => {
        const newSegments: Node[] = [];
        context.modelHandlers.segment(doc, parent, segment, context, newSegments);

        newSegments.forEach(node => {
            context.domIndexer?.onSegment(node, paragraph, [segment]);
        });
    });

    delete context.textContext;
}
