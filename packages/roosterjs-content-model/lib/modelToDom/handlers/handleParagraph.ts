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

            if (needParagraphWrapper) {
                applyFormat(container, context.formatAppliers.block, paragraph.format, context);
                applyFormat(container, context.formatAppliers.container, paragraph.format, context);
                applyFormat(
                    container,
                    context.formatAppliers.segmentOnBlock,
                    formatOnWrapper,
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
                paragraph.segments.forEach(segment => {
                    context.modelHandlers.segment(doc, container!, segment, context);
                });
            };

            if (needParagraphWrapper) {
                stackFormat(context, formatOnWrapper, handleSegments);
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
