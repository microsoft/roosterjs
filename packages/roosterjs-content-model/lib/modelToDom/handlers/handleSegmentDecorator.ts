import { applyFormat } from '../utils/applyFormat';
import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { stackFormat } from '../utils/stackFormat';
import { wrap } from 'roosterjs-editor-dom';

/**
 * @internal
 */
export const handleSegmentDecorator: ContentModelHandler<ContentModelSegment> = (
    _,
    parent,
    segment,
    context
) => {
    const { code, link } = segment;

    if (link) {
        stackFormat(context, 'a', () => {
            const a = wrap(parent, 'a');

            applyFormat(a, context.formatAppliers.link, link.format, context);
            applyFormat(a, context.formatAppliers.dataset, link.dataset, context);
        });
    }

    if (code) {
        stackFormat(context, 'code', () => {
            const codeNode = wrap(parent, 'code');

            applyFormat(codeNode, context.formatAppliers.code, code.format, context);
        });
    }
};
