import { getListStyleTypeFromString, updateListMetadata } from 'roosterjs-content-model-core';
import type { WordMetadata } from './WordMetadata';
import {
    addBlock,
    createListItem,
    createListLevel,
    parseFormat,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelBlockGroup,
    ContentModelListItemLevelFormat,
    ContentModelListLevel,
    DomToModelContext,
    DomToModelListFormat,
    FormatParser,
} from 'roosterjs-content-model-types';

/** Word list metadata style name */
const MSO_LIST = 'mso-list';
const MSO_LIST_IGNORE = 'ignore';
const WORD_FIRST_LIST = 'l0';

const TEMPLATE_VALUE_REGEX = /%[0-9a-zA-Z]+/g;

interface WordDesktopListFormat extends DomToModelListFormat {
    wordLevel?: number | '';
    wordList?: string;
    wordKnownLevels?: Map<string, ContentModelListLevel[]>;
}

const BULLET_METADATA = 'bullet';
/**
 * @internal
 * @param styles
 * @param group
 * @param element
 * @param context
 * @returns
 */
export function processWordList(
    styles: Record<string, string>,
    group: ContentModelBlockGroup,
    element: HTMLElement,
    context: DomToModelContext,
    metadata: Map<string, WordMetadata>
) {
    const listFormat = context.listFormat as WordDesktopListFormat;
    if (!listFormat.wordKnownLevels) {
        listFormat.wordKnownLevels = new Map<string, ContentModelListLevel[]>();
    }
    const wordListStyle = styles[MSO_LIST] || '';

    // If the element contains Ignore style, do not process it,
    // Usually this element contains the fake bullet used in Word Desktop.
    if (wordListStyle.toLowerCase() === MSO_LIST_IGNORE) {
        return true;
    }

    const [lNumber, level] = wordListStyle.split(' ');
    // Try get the list metadata from word, which follows this format: l1 level1 lfo2
    // If we are able to get the level property means we can process this element to be a list
    listFormat.wordLevel = level && parseInt(level.substr('level'.length));

    listFormat.wordList = lNumber || WORD_FIRST_LIST;
    if (listFormat.levels.length == 0) {
        listFormat.levels =
            (listFormat.wordList && listFormat.wordKnownLevels.get(listFormat.wordList)) || [];
    }

    if (wordListStyle && group && typeof listFormat.wordLevel === 'number') {
        const { wordLevel, wordList } = listFormat;
        // Retrieve the Fake bullet on the element and also the list type
        const listMetadata = metadata.get(`${lNumber}:${level}`);
        const listType =
            listMetadata?.['mso-level-number-format']?.toLowerCase() != BULLET_METADATA
                ? 'OL'
                : 'UL';

        // Create the new level of the list item and parse the format
        const newLevel: ContentModelListLevel = createListLevel(listType);
        parseFormat(element, context.formatParsers.listLevel, newLevel.format, context);

        // If the list format is in a different level, update the array so we get the new item
        // To be in the same level as the provided level metadata.
        if (wordLevel > listFormat.levels.length) {
            while (wordLevel != listFormat.levels.length) {
                listFormat.levels.push(newLevel);
            }
        } else {
            listFormat.levels.splice(wordLevel, listFormat.levels.length - 1);
            listFormat.levels[wordLevel - 1] = newLevel;
        }

        listFormat.listParent = group;

        processAsListItem(listFormat, context, element, group, listMetadata);

        if (
            listFormat.levels.length > 0 &&
            listFormat.wordKnownLevels.get(wordList) != listFormat.levels
        ) {
            listFormat.wordKnownLevels.set(wordList, [...listFormat.levels]);
        }
        return true;
    }

    return false;
}

function processAsListItem(
    listFormat: WordDesktopListFormat,
    context: DomToModelContext,
    element: HTMLElement,
    group: ContentModelBlockGroup,
    listMetadata: WordMetadata | undefined
) {
    const listLevel = listFormat.levels[listFormat.levels.length - 1];
    const { listType } = listLevel;
    const bullet = getBulletFromMetadata(listMetadata, listType);
    if (bullet) {
        updateListMetadata(listFormat.levels[listFormat.levels.length - 1], metadata =>
            Object.assign({}, metadata, {
                unorderedStyleType: listType == 'UL' ? bullet : undefined,
                orderedStyleType: listType == 'OL' ? bullet : undefined,
            })
        );
    }

    const listItem = createListItem(listFormat.levels, context.segmentFormat);

    parseFormat(element, context.formatParsers.segmentOnBlock, context.segmentFormat, context);
    parseFormat(element, context.formatParsers.listItemElement, listItem.format, context);

    if (listType == 'OL') {
        parseFormat(
            element,
            [startNumberOverrideParser(listMetadata)],
            listItem.levels[listItem.levels.length - 1].format,
            context
        );
    }

    context.elementProcessors.child(listItem, element, context);
    addBlock(group, listItem);
}

function getBulletFromMetadata(listMetadata: WordMetadata | undefined, listType: 'OL' | 'UL') {
    const templateType = listMetadata?.['mso-level-number-format'] || 'decimal';
    let templateFinal: string;

    if (listMetadata?.['mso-level-text']) {
        let templateValue: string = '';
        switch (templateType) {
            case 'alpha-upper':
                templateValue = 'UpperAlpha';
                break;
            case 'alpha-lower':
                templateValue = 'LowerAlpha';
                break;
            case 'roman-lower':
                templateValue = 'LowerRoman';
                break;
            case 'roman-upper':
                templateValue = 'UpperRoman';
                break;
            default:
                templateValue = 'Number';
                break;
        }
        const template = (listMetadata['mso-level-text'] || '')
            .replace('\\', '')
            .replace('"', '')
            .replace(TEMPLATE_VALUE_REGEX, '${' + templateValue + '}');

        templateFinal = '"' + template + ' "';
    } else {
        switch (templateType) {
            case 'alpha-lower':
                templateFinal = 'lower-alpha';
                break;
            case 'roman-lower':
                templateFinal = 'lower-roman';
                break;
            case 'roman-upper':
                templateFinal = 'upper-roman';
                break;
            default:
                templateFinal = 'decimal';
                break;
        }
    }

    return getListStyleTypeFromString(listType, templateFinal);
}

function startNumberOverrideParser(
    listMetadata: WordMetadata | undefined
): FormatParser<ContentModelListItemLevelFormat> | null {
    return (format, _, context) => {
        const {
            wordKnownLevels,
            wordLevel,
            wordList,
            levels,
        } = context.listFormat as WordDesktopListFormat;
        if (typeof wordLevel === 'number' && wordList) {
            const start = parseInt(listMetadata?.['mso-level-start-at'] || '1');
            const knownLevel = wordKnownLevels?.get(wordList) || [];

            if (start != undefined && !isNaN(start) && knownLevel.length != levels.length) {
                format.startNumberOverride = start;
            }
        }
    };
}
