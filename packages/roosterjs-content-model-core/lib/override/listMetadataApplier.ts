import {
    ListMetadataDefinition,
    OrderedListStyleMap,
    UnorderedListStyleMap,
    getAutoListStyleType,
    getOrderedListNumberStr,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelListItemFormat,
    ContentModelListItemLevelFormat,
    ListMetadataFormat,
    MetadataApplier,
} from 'roosterjs-content-model-types';

const OrderedMapPlaceholderRegex = /\$\{(\w+)\}/;

function getListStyleValue(
    listType: 'OL' | 'UL',
    listStyleType: number,
    listNumber?: number
): string | undefined {
    if (listType == 'OL') {
        const numberStr = getOrderedListNumberStr(listStyleType, listNumber ?? 1);
        const template = OrderedListStyleMap[listStyleType];

        return template ? template.replace(OrderedMapPlaceholderRegex, numberStr) : undefined;
    } else {
        return UnorderedListStyleMap[listStyleType];
    }
}

function shouldApplyToItem(listStyleType: number, listType: 'OL' | 'UL') {
    const style =
        listType == 'OL'
            ? OrderedListStyleMap[listStyleType]
            : UnorderedListStyleMap[listStyleType];

    return style?.indexOf('"') >= 0;
}

/**
 * @internal
 */
export const listItemMetadataApplier: MetadataApplier<
    ListMetadataFormat,
    ContentModelListItemFormat
> = {
    metadataDefinition: ListMetadataDefinition,
    applierFunction: (metadata, format, context) => {
        const depth = context.listFormat.nodeStack.length - 2; // Minus two for the parent element and convert length to index

        if (depth >= 0) {
            const listType = context.listFormat.nodeStack[depth + 1].listType ?? 'OL';
            const listStyleType = getAutoListStyleType(listType, metadata ?? {}, depth);

            if (listStyleType !== undefined) {
                if (shouldApplyToItem(listStyleType, listType)) {
                    format.listStyleType = getListStyleValue(
                        listType,
                        listStyleType,
                        context.listFormat.threadItemCounts[depth]
                    );
                } else {
                    delete format.listStyleType;
                }
            }
        }
    },
};

/**
 * @internal
 */
export const listLevelMetadataApplier: MetadataApplier<
    ListMetadataFormat,
    ContentModelListItemLevelFormat
> = {
    metadataDefinition: ListMetadataDefinition,
    applierFunction: (metadata, format, context) => {
        const depth = context.listFormat.nodeStack.length - 2; // Minus two for the parent element and convert length to index

        if (depth >= 0) {
            const listType = context.listFormat.nodeStack[depth + 1].listType ?? 'OL';
            const listStyleType = getAutoListStyleType(listType, metadata ?? {}, depth);

            if (listStyleType !== undefined) {
                if (!shouldApplyToItem(listStyleType, listType)) {
                    const listStyleTypeFormat = getListStyleValue(
                        listType,
                        listStyleType,
                        context.listFormat.threadItemCounts[depth]
                    );

                    if (listStyleTypeFormat) {
                        format.listStyleType = listStyleTypeFormat;
                    }
                } else {
                    delete format.listStyleType;
                }
            }
        }
    },
};
