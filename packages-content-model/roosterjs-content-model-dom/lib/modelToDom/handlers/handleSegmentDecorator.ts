import { applyFormat } from '../utils/applyFormat';
import { ContentModelHandler, ContentModelSegment } from 'roosterjs-content-model-types';
import { moveChildNodes } from 'roosterjs-editor-dom';
import { stackFormat } from '../utils/stackFormat';

/**
 * @internal
 */
export const handleSegmentDecorator: ContentModelHandler<ContentModelSegment> = (
    doc,
    parent,
    segment,
    context,
    onNodeCreated
) => {
    const { code, link } = segment;

    if (link) {
        stackFormat(context, 'a', () => {
            const a = doc.createElement('a');

            moveChildNodes(a, parent);
            parent.appendChild(a);

            applyFormat(a, context.formatAppliers.link, link.format, context);
            applyFormat(a, context.formatAppliers.dataset, link.dataset, context);

            onNodeCreated?.(link, a);
        });
    }

    if (code) {
        stackFormat(context, 'code', () => {
            const codeNode = doc.createElement('code');

            moveChildNodes(codeNode, parent);
            parent.appendChild(codeNode);

            applyFormat(codeNode, context.formatAppliers.code, code.format, context);

            onNodeCreated?.(code, codeNode);
        });
    }
};
