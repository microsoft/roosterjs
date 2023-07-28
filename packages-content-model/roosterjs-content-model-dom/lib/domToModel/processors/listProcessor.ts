import { ContentModelListLevel, ElementProcessor } from 'roosterjs-content-model-types';
import { createListLevel } from '../../modelApi/creators/createListLevel';
import { listLevelMetadataFormatHandler } from '../../formatHandlers/list/listLevelMetadataFormatHandler';
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
            const level: ContentModelListLevel = createListLevel(
                element.tagName as 'OL' | 'UL',
                context.blockFormat
            );
            const { listFormat } = context;

            parseFormat(element, context.formatParsers.dataset, level.dataset, context);
            parseFormat(element, context.formatParsers.listLevel, level.format, context);

            // TODO: Move this out into roosterjs-content-model-editor package
            updateListMetadata(level, metadata => {
                metadata = metadata || {};
                parseFormat(element, [listLevelMetadataFormatHandler.parse], metadata, context);

                if (
                    typeof metadata.orderedStyleType == 'undefined' &&
                    typeof metadata.unorderedStyleType == 'undefined'
                ) {
                    metadata = null;
                }

                return metadata;
            });

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
