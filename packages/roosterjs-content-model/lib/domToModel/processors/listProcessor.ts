import { ContentModelListItemLevelFormat } from '../../publicTypes/format/ContentModelListItemLevelFormat';
import { DatasetFormat } from '../../publicTypes/format/formatParts/DatasetFormat';
import { DomToModelContext } from '../../publicTypes/context/DomToModelContext';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { parseFormat } from '../utils/parseFormat';
import { stackFormat } from '../utils/stackFormat';
import { updateListMetadata } from '../../domUtils/metadata/updateListMetadata';

/**
 * @internal
 */
export const listProcessor: ElementProcessor<HTMLOListElement | HTMLUListElement> = (
    group,
    element,
    context
) => {
    stackFormat(
        context,
        {
            segment: 'shallowCloneForBlock',
            paragraph: 'shallowCloneForGroup',
        },
        () => {
            const level: ContentModelListItemLevelFormat = { ...context.blockFormat };
            const { listFormat } = context;

            processMetadata(element, context, level);
            parseFormat(element, context.formatParsers.listLevel, level, context);
            parseFormat(element, context.formatParsers.segment, context.segmentFormat, context);

            const originalListParent = listFormat.listParent;

            listFormat.listParent = listFormat.listParent || group;
            listFormat.levels.push(level);

            try {
                context.elementProcessors.child(group, element, context);
            } finally {
                listFormat.levels.pop();
                listFormat.listParent = originalListParent;
            }
        }
    );
};

function processMetadata(
    element: HTMLOListElement | HTMLUListElement,
    context: DomToModelContext,
    level: ContentModelListItemLevelFormat
) {
    const dataset: DatasetFormat = {};
    parseFormat(element, context.formatParsers.dataset, dataset, context);
    updateListMetadata({ dataset }, metadata => {
        Object.assign(level, metadata || {});
        return null;
    });
}
