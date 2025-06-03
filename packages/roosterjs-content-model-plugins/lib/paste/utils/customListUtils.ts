import { removeNegativeTextIndentParser } from '../parsers/removeNegativeTextIndentParser';
import {
    createListLevel,
    parseFormat,
    updateListMetadata,
    createListItem,
    addBlock,
    isElementOfType,
} from 'roosterjs-content-model-dom';
import type {
    DomToModelContext,
    DomToModelListFormat,
    ContentModelBlockGroup,
    ContentModelListLevel,
    ListMetadataFormat,
    ContentModelListItem,
    ContentModelListItemLevelFormat,
    ContentModelListItemFormat,
    FormatParser,
    ContentModelSegmentFormat,
} from 'roosterjs-content-model-types';

const removeMargin = (format: ContentModelListItemFormat): void => {
    delete format.marginLeft;
};

/**
 * @internal
 */
export function setupListFormat(
    listType: 'OL' | 'UL',
    element: HTMLElement,
    context: DomToModelContext,
    listDepth: number,
    listFormat: DomToModelListFormat,
    group: ContentModelBlockGroup,
    additionalParsers: FormatParser<ContentModelListItemLevelFormat>[] = []
) {
    const newLevel: ContentModelListLevel = createListLevel(listType);
    parseFormat(element, context.formatParsers.listLevel, newLevel.format, context);
    parseFormat(element, additionalParsers.concat(removeMargin), newLevel.format, context);

    // If the list format is in a different level, update the array so we get the new item
    // To be in the same level as the provided level metadata.
    if (listDepth > listFormat.levels.length) {
        while (listDepth != listFormat.levels.length) {
            listFormat.levels.push(newLevel);
        }
    } else {
        listFormat.levels.splice(listDepth, listFormat.levels.length - 1);
        listFormat.levels[listDepth - 1] = newLevel;
    }

    listFormat.listParent = group;
}

/**
 * @internal
 */
export function processAsListItem(
    context: DomToModelContext,
    element: HTMLElement,
    group: ContentModelBlockGroup,
    listFormatMetadata: ListMetadataFormat | undefined,
    bulletElement: HTMLElement | undefined,
    beforeProcessingChildren?: (listItem: ContentModelListItem) => void
) {
    const listFormat = context.listFormat;
    if (listFormatMetadata) {
        updateListMetadata(listFormat.levels[listFormat.levels.length - 1], metadata =>
            Object.assign({}, metadata, listFormatMetadata)
        );
    }

    const listItem = createListItem(listFormat.levels, context.segmentFormat);

    parseFormat(element, context.formatParsers.segmentOnBlock, context.segmentFormat, context);
    parseFormat(element, context.formatParsers.listItemElement, listItem.format, context);
    parseFormat(
        element,
        [removeNegativeTextIndentParser, nonListElementParser],
        listItem.format,
        context
    );
    if (bulletElement) {
        const format: ContentModelSegmentFormat = { ...context.segmentFormat };
        parseFormat(bulletElement, context.formatParsers.segmentOnBlock, format, context);
        listItem.formatHolder.format = format;
    }

    beforeProcessingChildren?.(listItem);

    context.elementProcessors.child(listItem, element, context);
    addBlock(group, listItem);
}

const nonListElementParser: FormatParser<ContentModelListItemFormat> = (
    format,
    element,
    _context,
    defaultStyle
): void => {
    if (!isElementOfType(element, 'li')) {
        Object.keys(defaultStyle).forEach(keyInput => {
            const key = keyInput as keyof CSSStyleDeclaration;
            const formatKey = keyInput as keyof ContentModelListItemFormat;
            if (
                key != 'display' &&
                format[formatKey] != undefined &&
                format[formatKey] == defaultStyle[key]
            ) {
                delete format[formatKey];
            }
        });
    }
};
