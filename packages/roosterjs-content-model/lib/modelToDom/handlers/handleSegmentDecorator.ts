import { applyFormat } from '../utils/applyFormat';
import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { moveChildNodes } from 'roosterjs-editor-dom';
import { stackFormat } from '../utils/stackFormat';

/**
 * @internal
 */
export const handleSegmentDecorator: ContentModelHandler<ContentModelSegment> = (
    doc,
    parent,
    segment,
    context
) => {
    const { code, link } = segment;

    if (link) {
        stackFormat(context, 'a', () => {
            const a = document.createElement('a');

            moveChildNodes(a, parent);
            parent.appendChild(a);

            applyFormat(a, context.formatAppliers.link, link.format, context);
            applyFormat(a, context.formatAppliers.dataset, link.dataset, context);

            context.onNodeCreated?.(link, a);
        });
    }

    if (code) {
        stackFormat(context, 'code', () => {
            const codeNode = document.createElement('code');

            moveChildNodes(codeNode, parent);
            parent.appendChild(codeNode);

            applyFormat(codeNode, context.formatAppliers.code, code.format, context);

            context.onNodeCreated?.(code, codeNode);
        });
    }
};
