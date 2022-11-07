import { applyFormat } from '../utils/applyFormat';
import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';

/**
 * @internal
 */
export const handleParagraph: ContentModelHandler<ContentModelParagraph> = (
    doc: Document,
    parent: Node,
    paragraph: ContentModelParagraph,
    context: ModelToDomContext
) => {
    let container: HTMLElement;
    let tagName: string | undefined;

    if (shouldCreateElement(paragraph)) {
        tagName = typeof paragraph.headerLevel == 'number' ? 'h' + paragraph.headerLevel : 'div';
        container = doc.createElement(tagName);
        parent.appendChild(container);

        applyFormat(container, context.formatAppliers.block, paragraph.format, context);
    } else {
        container = parent as HTMLElement;
    }

    context.regularSelection.current = {
        block: container,
        segment: null,
    };

    const segmentFormatFromBlock = context.segmentFormatFromBlock;

    try {
        context.segmentFormatFromBlock = { ...segmentFormatFromBlock };

        if (tagName && /h\d/.test(tagName)) {
            // TODO: Need a unified way to handle all this kind of format that brought from block, but not just for headers
            context.segmentFormatFromBlock.fontWeight = 'bold';
        }

        paragraph.segments.forEach(segment => {
            context.modelHandlers.segment(doc, container, segment, context);
        });
    } finally {
        context.segmentFormatFromBlock = segmentFormatFromBlock;
    }
};

function shouldCreateElement(paragraph: ContentModelParagraph) {
    return (
        !paragraph.isImplicit ||
        (typeof paragraph.headerLevel == 'number' && paragraph.headerLevel > 0)
    );
}
