import { applyFormat } from '../utils/applyFormat';
import { moveChildNodes } from 'roosterjs-editor-dom';
import { stackFormat } from '../utils/stackFormat';
import type {
    ContentModelSegment,
    ContentModelSegmentHandler,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const handleSegmentDecorator: ContentModelSegmentHandler<ContentModelSegment> = (
    _,
    parent,
    segment,
    context,
    segmentNodes
) => {
    const { code, link } = segment;

    if (link) {
        stackFormat(context, 'a', () => {
            const a = document.createElement('a');

            moveChildNodes(a, parent);
            parent.appendChild(a);

            applyFormat(a, context.formatAppliers.link, link.format, context);
            applyFormat(a, context.formatAppliers.dataset, link.dataset, context);

            segmentNodes?.push(a);
            context.onNodeCreated?.(link, a);
        });
    }

    if (code) {
        stackFormat(context, 'code', () => {
            const codeNode = document.createElement('code');

            moveChildNodes(codeNode, parent);
            parent.appendChild(codeNode);

            applyFormat(codeNode, context.formatAppliers.code, code.format, context);

            segmentNodes?.push(codeNode);
            context.onNodeCreated?.(code, codeNode);
        });
    }
};
