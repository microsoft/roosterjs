import { applyFormat } from '../utils/applyFormat';
import { isNodeOfType } from '../../domUtils/isNodeOfType';
import { stackFormat } from '../utils/stackFormat';
import { wrapAllChildNodes } from '../../domUtils/moveChildNodes';
import type {
    ContentModelSegmentHandler,
    ReadonlyContentModelSegment,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const handleSegmentDecorator: ContentModelSegmentHandler<ReadonlyContentModelSegment> = (
    _,
    parent,
    segment,
    context,
    segmentNodes
) => {
    const { code, link } = segment;

    if (isNodeOfType(parent, 'ELEMENT_NODE')) {
        if (link) {
            stackFormat(context, 'a', () => {
                const a = wrapAllChildNodes(parent, 'a');

                applyFormat(a, context.formatAppliers.link, link.format, context);
                applyFormat(a, context.formatAppliers.dataset, link.dataset, context);

                segmentNodes?.push(a);
                context.onNodeCreated?.(link, a);
            });
        }

        if (code) {
            stackFormat(context, 'code', () => {
                const codeNode = wrapAllChildNodes(parent, 'code');

                applyFormat(codeNode, context.formatAppliers.code, code.format, context);

                segmentNodes?.push(codeNode);
                context.onNodeCreated?.(code, codeNode);
            });
        }
    }
};
