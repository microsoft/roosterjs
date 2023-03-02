import { applyFormat } from '../utils/applyFormat';
import { ContentModelBlockHandler } from '../../publicTypes/context/ContentModelHandler';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { getObjectKeys } from 'roosterjs-editor-dom';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';
import { stackFormat } from '../utils/stackFormat';

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
    let container: HTMLElement;

    stackFormat(context, paragraph.decorator?.tagName || null, () => {
        if (paragraph.decorator) {
            const { tagName, format } = paragraph.decorator;

            container = createParagraphElement(doc, parent, paragraph, tagName, refNode);

            applyFormat(container, context.formatAppliers.block, paragraph.format, context);
            applyFormat(container, context.formatAppliers.segmentOnBlock, format, context);
        } else if (
            !paragraph.isImplicit ||
            (getObjectKeys(paragraph.format).length > 0 &&
                paragraph.segments.some(segment => segment.segmentType != 'SelectionMarker'))
        ) {
            container = createParagraphElement(doc, parent, paragraph, 'div', refNode);

            applyFormat(container, context.formatAppliers.block, paragraph.format, context);
        } else {
            container = parent as HTMLElement;
        }

        context.regularSelection.current = {
            block: container,
            segment: null,
        };

        paragraph.segments.forEach(segment => {
            context.modelHandlers.segment(doc, container, segment, context);
        });
    });
};

function createParagraphElement(
    doc: Document,
    parent: Node,
    paragraph: ContentModelParagraph,
    tagName: string,
    refNode: Node | null
) {
    const element = doc.createElement(tagName);
    parent.insertBefore(element, refNode);
    paragraph.cachedElement = element;

    return element;
}
