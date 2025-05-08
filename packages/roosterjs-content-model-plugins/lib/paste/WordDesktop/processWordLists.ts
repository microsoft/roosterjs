import { getListStyleTypeFromString, isEmpty } from 'roosterjs-content-model-dom';
import { processAsListItem, setupListFormat } from '../utils/customListUtils';
import type { WordMetadata } from './WordMetadata';
import type {
    ContentModelBlockGroup,
    ContentModelListItem,
    ContentModelListItemFormat,
    ContentModelListItemLevelFormat,
    ContentModelListLevel,
    DomToModelContext,
    DomToModelListFormat,
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

interface WordListFormat extends ContentModelListItemFormat {
    wordList?: string;
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
        setupListFormat(listType, element, context, wordLevel, listFormat, group, [
            wordListPaddingParser,
        ]);
        (listFormat.levels[listFormat.levels.length - 1]
            .format as WordListFormat).wordList = wordList;

        const bullet = getBulletFromMetadata(listMetadata, listType);
        const listFormatMetadata = bullet
            ? {
                  unorderedStyleType: listType == 'UL' ? bullet : undefined,
                  orderedStyleType: listType == 'OL' ? bullet : undefined,
              }
            : undefined;

        processAsListItem(context, element, group, listFormatMetadata, listItem => {
            if (listType == 'OL') {
                setStartNumber(listItem, context, listMetadata);
            }
        });

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

function setStartNumber(
    listItem: ContentModelListItem,
    context: DomToModelContext,
    listMetadata: WordMetadata | undefined
) {
    const {
        listParent,
        wordList,
        wordKnownLevels,
        wordLevel,
        levels,
    } = context.listFormat as WordDesktopListFormat;

    const block = getLastNotEmptyBlock(listParent);
    if (
        (block?.blockType != 'BlockGroup' ||
            block.blockGroupType != 'ListItem' ||
            (wordLevel &&
                (block.levels[wordLevel]?.format as WordListFormat)?.wordList != wordList)) &&
        wordList
    ) {
        const start = listMetadata?.['mso-level-start-at']
            ? parseInt(listMetadata['mso-level-start-at'])
            : NaN;
        const knownLevel = wordKnownLevels?.get(wordList) || [];

        if (start != undefined && !isNaN(start) && knownLevel.length != levels.length) {
            listItem.levels[listItem.levels.length - 1].format.startNumberOverride = start;
        }
    }
}

function getLastNotEmptyBlock(listParent: ContentModelBlockGroup | undefined) {
    for (let index = (listParent?.blocks.length || 0) - 1; index > 0; index--) {
        const result = listParent?.blocks[index];
        if (result && !isEmpty(result)) {
            return result;
        }
    }

    return undefined;
}

function wordListPaddingParser(
    format: ContentModelListItemLevelFormat,
    element: HTMLElement
): void {
    if (element.style.marginLeft && element.style.marginLeft != '0in') {
        format.paddingLeft = '0px';
    }
    if (element.style.marginRight && element.style.marginRight != '0in') {
        format.paddingRight = '0px';
    }
}
