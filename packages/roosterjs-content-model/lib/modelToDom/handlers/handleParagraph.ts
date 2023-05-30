import { applyFormat } from '../utils/applyFormat';
import { ContentModelBlockHandler } from '../../publicTypes/context/ContentModelHandler';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { getObjectKeys, unwrap } from 'roosterjs-editor-dom';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';
import { optimize } from '../optimizers/optimize';
import { reuseCachedElement } from '../utils/reuseCachedElement';
import { stackFormat } from '../utils/stackFormat';

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
    let container = paragraph.cachedElement;

    if (container) {
        refNode = reuseCachedElement(parent, container, refNode);
    } else {
        stackFormat(context, paragraph.decorator?.tagName || null, () => {
            let hasDefaultFormatOnContainer = false;
            const needParagraphWrapper =
                !paragraph.isImplicit ||
                !!paragraph.decorator ||
                (getObjectKeys(paragraph.format).length > 0 &&
                    paragraph.segments.some(segment => segment.segmentType != 'SelectionMarker'));

            container = doc.createElement(paragraph.decorator?.tagName || DefaultParagraphTag);

            parent.insertBefore(container, refNode);

            if (needParagraphWrapper) {
                applyFormat(container, context.formatAppliers.block, paragraph.format, context);
                applyFormat(container, context.formatAppliers.container, paragraph.format, context);

                if (context.defaultFormat) {
                    applyFormat(
                        container,
                        context.formatAppliers.segmentOnBlock,
                        context.defaultFormat,
                        context
                    );
                    hasDefaultFormatOnContainer = true;
                }
            }

            if (paragraph.decorator) {
                applyFormat(
                    container,
                    context.formatAppliers.segmentOnBlock,
                    paragraph.decorator.format,
                    context
                );
            }

            if (paragraph.zeroFontSize && !paragraph.segments.some(s => s.segmentType == 'Text')) {
                container.style.fontSize = '0';
            }

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
                            context
                        );
                    }

                    paragraph.segments.forEach(segment => {
                        context.modelHandlers.segment(doc, parent, segment, context);
                    });
                }
            };

            if (hasDefaultFormatOnContainer) {
                stackFormat(context, context.defaultFormat || null, handleSegments);
            } else {
                handleSegments();
            }

            optimize(container);

            if (needParagraphWrapper) {
                paragraph.cachedElement = container;
            } else {
                unwrap(container);
            }
        });
    }

    if (container) {
        context.onNodeCreated?.(paragraph, container);
    }

    return refNode;
};
