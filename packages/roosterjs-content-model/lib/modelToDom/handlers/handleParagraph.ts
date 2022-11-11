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
    const implicitSegmentFormat = context.implicitSegmentFormat;

    if (paragraph.header) {
        const tag = ('h' + paragraph.header.headerLevel) as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

        container = doc.createElement(tag);
        parent.appendChild(container);
        context.implicitSegmentFormat = {
            ...implicitSegmentFormat,
            ...(context.defaultImplicitSegmentFormatMap[tag] || {}),
        };

        applyFormat(container, context.formatAppliers.block, paragraph.format, context);
        applyFormat(
            container,
            context.formatAppliers.segmentOnBlock,
            paragraph.header.format,
            context
        );

        Object.assign(context.implicitSegmentFormat, paragraph.header.format);
    } else if (!paragraph.isImplicit) {
        container = doc.createElement('div');
        parent.appendChild(container);

        applyFormat(container, context.formatAppliers.block, paragraph.format, context);
    } else {
        container = parent as HTMLElement;
    }

    context.regularSelection.current = {
        block: container,
        segment: null,
    };

    try {
        paragraph.segments.forEach(segment => {
            context.modelHandlers.segment(doc, container, segment, context);
        });
    } finally {
        context.implicitSegmentFormat = implicitSegmentFormat;
    }
};
