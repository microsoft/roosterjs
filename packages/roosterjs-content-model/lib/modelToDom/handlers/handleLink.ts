import { applyFormat } from '../utils/applyFormat';
import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
import { ContentModelLink } from '../../publicTypes/decorator/ContentModelLink';
import { stackFormat } from '../utils/stackFormat';
import { wrap } from 'roosterjs-editor-dom';

/**
 * @internal
 */
export const handleLink: ContentModelHandler<ContentModelLink> = (doc, parent, link, context) => {
    stackFormat(context, 'a', () => {
        const a = wrap(parent, 'a');

        applyFormat(a, context.formatAppliers.link, link.format, context);
        applyFormat(a, context.formatAppliers.dataset, link.dataset, context);
    });
};
