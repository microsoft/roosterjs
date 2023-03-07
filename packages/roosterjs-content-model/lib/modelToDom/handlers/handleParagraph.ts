import { applyFormat } from '../utils/applyFormat';
import { ContentModelBlockHandler } from '../../publicTypes/context/ContentModelHandler';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { getObjectKeys, unwrap, wrap } from 'roosterjs-editor-dom';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';
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
    stackFormat(context, paragraph.decorator?.tagName || null, () => {
        const needParagraphWrapper =
            !paragraph.isImplicit ||
            !!paragraph.decorator ||
            (getObjectKeys(paragraph.format).length > 0 &&
                paragraph.segments.some(segment => segment.segmentType != 'SelectionMarker'));

        let container = doc.createElement(paragraph.decorator?.tagName || DefaultParagraphTag);

        parent.insertBefore(container, refNode);

        if (needParagraphWrapper) {
            applyFormat(container, context.formatAppliers.block, paragraph.format, context);
        }

        if (paragraph.decorator) {
            applyFormat(
                container,
                context.formatAppliers.segmentOnBlock,
                paragraph.decorator.format,
                context
            );
        }

        let pre: HTMLElement | undefined;

        // Need some special handling for PRE tag in order to cache the correct element.
        // TODO: Consider use decorator to handle PRE tag
        if (paragraph.format.whiteSpace == 'pre') {
            pre = wrap(container, 'pre');

            pre.style.marginTop = '0';
            pre.style.marginBottom = '0';
        }

        context.regularSelection.current = {
            block: needParagraphWrapper ? container : container.parentNode,
            segment: null,
        };

        paragraph.segments.forEach(segment => {
            context.modelHandlers.segment(doc, container, segment, context);
        });

        if (needParagraphWrapper) {
            paragraph.cachedElement = pre || container;
        } else {
            unwrap(container);
        }
    });
};
