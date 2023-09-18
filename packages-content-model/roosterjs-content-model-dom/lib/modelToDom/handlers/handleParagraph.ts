import { applyFormat } from '../utils/applyFormat';
import { ContentModelBlockHandler, ContentModelParagraph } from 'roosterjs-content-model-types';
import { optimize } from '../optimizers/optimize';
import { reuseCachedElement } from '../utils/reuseCachedElement';
import { stackFormat } from '../utils/stackFormat';

const DefaultParagraphTag = 'div';
const DefaultImplicitParagraphTag = 'span';

/**
 * @internal
 */
export const handleParagraph: ContentModelBlockHandler<ContentModelParagraph> = (
    doc,
    parent,
    paragraph,
    context,
    refNode,
    newNodes
) => {
    let container = context.allowCacheElement ? paragraph.cachedElement : undefined;

    if (container) {
        refNode = reuseCachedElement(parent, container, refNode);
    } else {
        stackFormat(context, paragraph.decorator?.tagName || null, () => {
            const formatOnWrapper = {
                ...paragraph.decorator?.format,
                ...paragraph.segmentFormat,
            };

            container = doc.createElement(
                paragraph.decorator?.tagName || paragraph.isImplicit
                    ? DefaultImplicitParagraphTag
                    : DefaultParagraphTag
            );

            parent.insertBefore(container, refNode);

            context.regularSelection.current = {
                block: container,
                segment: null,
            };

            stackFormat(context, formatOnWrapper, () => {
                const parent = container;

                if (parent) {
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
                            paragraph
                        );
                    }

                    paragraph.segments.forEach(segment => {
                        context.modelHandlers.segment(doc, parent, segment, context, paragraph);
                    });
                }
            });

            applyFormat(container, context.formatAppliers.block, paragraph.format, context);
            applyFormat(container, context.formatAppliers.container, paragraph.format, context);
            applyFormat(container, context.formatAppliers.segmentOnBlock, formatOnWrapper, context);

            optimize(container);

            // It is possible the next sibling node is changed during processing child segments
            // e.g. When this paragraph is an implicit paragraph and it contains an inline entity segment
            // The segment will be appended to container as child then the container will be removed
            // since this paragraph it is implicit. In that case container.nextSibling will become original
            // inline entity's next sibling. So reset refNode to its real next sibling (after change) here
            // to make sure the value is correct.
            refNode = container.nextSibling;

            if (context.allowCacheElement) {
                paragraph.cachedElement = container;
            }
        });
    }

    if (container) {
        newNodes?.push(container);
        context.domIndexer?.onParagraph(container);
    }

    return refNode;
};
