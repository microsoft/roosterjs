import { applyFormat } from '../utils/applyFormat';
import { getObjectKeys, unwrap } from 'roosterjs-editor-dom';
import { optimize } from '../optimizers/optimize';
import { reuseCachedElement } from '../utils/reuseCachedElement';
import { stackFormat } from '../utils/stackFormat';
import type {
    ContentModelBlockHandler,
    ContentModelParagraph,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

const DefaultParagraphTag = 'div';

/**
 * @internal
 */
export const handleParagraph: ContentModelBlockHandler<ContentModelParagraph> = (
    doc: Document,
    parent: Node,
    paragraph: ContentModelParagraph,
    context: ModelToDomContext,
    refNode: Node | null
) => {
    let container = context.allowCacheElement ? paragraph.cachedElement : undefined;

    if (container) {
        refNode = reuseCachedElement(parent, container, refNode);
    } else {
        stackFormat(context, paragraph.decorator?.tagName || null, () => {
            const needParagraphWrapper =
                !paragraph.isImplicit ||
                !!paragraph.decorator ||
                (getObjectKeys(paragraph.format).length > 0 &&
                    paragraph.segments.some(segment => segment.segmentType != 'SelectionMarker'));
            const formatOnWrapper = needParagraphWrapper
                ? {
                      ...(paragraph.decorator?.format || {}),
                      ...paragraph.segmentFormat,
                  }
                : {};

            container = doc.createElement(paragraph.decorator?.tagName || DefaultParagraphTag);

            parent.insertBefore(container, refNode);

            context.regularSelection.current = {
                block: needParagraphWrapper ? container : container.parentNode,
                segment: null,
            };

            const handleSegments = () => {
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
                }
            };

            if (needParagraphWrapper) {
                stackFormat(context, formatOnWrapper, handleSegments);

                applyFormat(container, context.formatAppliers.block, paragraph.format, context);
                applyFormat(container, context.formatAppliers.container, paragraph.format, context);
                applyFormat(
                    container,
                    context.formatAppliers.segmentOnBlock,
                    formatOnWrapper,
                    context
                );
            } else {
                handleSegments();
            }

            optimize(container);

            // It is possible the next sibling node is changed during processing child segments
            // e.g. When this paragraph is an implicit paragraph and it contains an inline entity segment
            // The segment will be appended to container as child then the container will be removed
            // since this paragraph it is implicit. In that case container.nextSibling will become original
            // inline entity's next sibling. So reset refNode to its real next sibling (after change) here
            // to make sure the value is correct.
            refNode = container.nextSibling;

            if (container) {
                context.onNodeCreated?.(paragraph, container);
                context.domIndexer?.onParagraph(container);
            }

            if (needParagraphWrapper) {
                if (context.allowCacheElement) {
                    paragraph.cachedElement = container;
                }
            } else {
                unwrap(container);
                container = undefined;
            }
        });
    }

    return refNode;
};
