import { applyFormat } from '../utils/applyFormat';
import { ContentModelHandler, ContentModelSegment } from 'roosterjs-content-model-types';
import { moveAndReplaceChildNodes } from '../../domUtils/moveAndReplaceChildNodes';
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

            moveAndReplaceChildNodes(a, parent);
            parent.appendChild(a);

            applyFormat(a, context.formatAppliers.link, link.format, context);
            applyFormat(a, context.formatAppliers.dataset, link.dataset, context);

            context.onNodeCreated?.(link, a);
        });
    }

    if (code) {
        stackFormat(context, 'code', () => {
            const codeNode = document.createElement('code');

            moveAndReplaceChildNodes(codeNode, parent);
            parent.appendChild(codeNode);

            applyFormat(codeNode, context.formatAppliers.code, code.format, context);

            context.onNodeCreated?.(code, codeNode);
        });
    }
};
