import { applyFormat } from '../utils/applyFormat';
import { ContentModelBlockHandler } from '../../publicTypes/context/ContentModelHandler';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { getObjectKeys, unwrap } from 'roosterjs-editor-dom';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';
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

            container = doc.createElement(paragraph.decorator?.tagName || DefaultParagraphTag);

            parent.insertBefore(container, refNode);

            if (needParagraphWrapper) {
                applyFormat(container, context.formatAppliers.block, paragraph.format, context);
                applyFormat(container, context.formatAppliers.container, paragraph.format, context);
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

            paragraph.segments.forEach(segment => {
                context.modelHandlers.segment(doc, container!, segment, context);
            });

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
