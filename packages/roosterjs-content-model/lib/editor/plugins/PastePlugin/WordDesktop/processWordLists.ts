import { addBlock } from '../../../../modelApi/common/addBlock';
import { ContentModelBlockGroup } from '../../../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelListItemLevelFormat } from '../../../../publicTypes/format/ContentModelListItemLevelFormat';
import { createListItem } from '../../../../modelApi/creators/createListItem';
import { DomToModelContext } from '../../../../publicTypes/context/DomToModelContext';
import { DomToModelListFormat } from '../../../../publicTypes/context/DomToModelFormatContext';
import { FormatParser } from '../../../../publicTypes/context/DomToModelSettings';
import { getStyles } from 'roosterjs-editor-dom';
import { NodeType } from 'roosterjs-editor-types';
import { parseFormat } from '../../../../domToModel/utils/parseFormat';

/** Word list metadata style name */
const MSO_LIST = 'mso-list';
const MSO_LIST_IGNORE = 'ignore';
const LOOKUP_DEPTH = 5;
const OL_TAG = 'OL';
const WORD_FIRST_LIST = 'l0';

interface WordDesktopListFormat extends DomToModelListFormat {
    wordLevel?: number | '';
    wordList?: string;
    wordKnownLevels?: Map<string, ContentModelListItemLevelFormat[]>;
}

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
    context: DomToModelContext
) {
    const listFormat = context.listFormat as WordDesktopListFormat;
    if (!listFormat.wordKnownLevels) {
        listFormat.wordKnownLevels = new Map<string, ContentModelListItemLevelFormat[]>();
    }
    const wordListStyle = styles[MSO_LIST] || '';

    // If the element contains Ignore style, do not process it,
    // Usually this element contains the fake bullet used in Word Desktop.
    if (wordListStyle.toLowerCase() === MSO_LIST_IGNORE) {
        return true;
    }

    const listProps = wordListStyle.split(' ');
    // Try get the list metadata from word, which follows this format: l1 level1 lfo2
    // If we are able to get the level property means we can process this element to be a list
    listFormat.wordLevel = listProps[1] && parseInt(listProps[1].substr('level'.length));

    listFormat.wordList = listProps[0] || WORD_FIRST_LIST;
    if (listFormat.levels.length == 0) {
        listFormat.levels = listFormat.wordKnownLevels.get(listFormat.wordList) || [];
    }

    if (wordListStyle && group && typeof listFormat.wordLevel === 'number') {
        const { wordLevel } = listFormat;
        // Retrieve the Fake bullet on the element and also the list type
        const fakeBullet = getFakeBulletText(element);
        const listType = getFakeBulletTagName(fakeBullet);

        // Create the new level of the list item and parse the format
        const newLevel: ContentModelListItemLevelFormat = {
            listType,
        };
        parseFormat(element, context.formatParsers.listLevel, newLevel, context);

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

        processAsListItem(listFormat, context, element, group, fakeBullet);

        if (
            listFormat.levels.length > 0 &&
            listFormat.wordKnownLevels.get(listFormat.wordList) != listFormat.levels
        ) {
            listFormat.wordKnownLevels.set(listFormat.wordList, [...listFormat.levels]);
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
    fakeBullet: string
) {
    const listItem = createListItem(listFormat.levels, context.segmentFormat);

    parseFormat(element, context.formatParsers.segmentOnBlock, context.segmentFormat, context);
    parseFormat(element, context.formatParsers.listItemElement, listItem.format, context);
    parseFormat(
        element,
        [startNumberOverrideParser(fakeBullet)],
        listItem.levels[listItem.levels.length - 1],
        context
    );

    context.elementProcessors.child(listItem, element, context);
    addBlock(group, listItem);
}

function startNumberOverrideParser(
    fakeBullet: string
): FormatParser<ContentModelListItemLevelFormat> | null {
    return (format, _, context) => {
        const {
            wordKnownLevels,
            wordLevel,
            wordList,
        } = context.listFormat as WordDesktopListFormat;
        if (format.listType == OL_TAG && typeof wordLevel === 'number' && wordList) {
            const start = parseInt(fakeBullet);
            if (start != undefined && !isNaN(start) && !wordKnownLevels?.has(wordList)) {
                format.startNumberOverride = start;
            }
        }
    };
}

/**
 * Check whether the string is a fake bullet from word Desktop
 */
function isFakeBullet(fakeBullet: string): boolean {
    return ['o', '·', '§', '-'].indexOf(fakeBullet) >= 0;
}

/** Given a fake bullet text, returns the type of list that should be used for it */
function getFakeBulletTagName(fakeBullet: string): 'UL' | 'OL' {
    return isFakeBullet(fakeBullet) ? 'UL' : 'OL';
}

/**
 * Finds the fake bullet text out of the specified node and returns it. For images, it will return
 * a bullet string. If not found, it returns null...
 */
function getFakeBulletText(node: Node, levels?: number): string {
    // Word uses the following format for their bullets:
    // &lt;p style="mso-list:l1 level1 lfo2"&gt;
    // &lt;span style="..."&gt;
    // &lt;span style="mso-list:Ignore"&gt;1.&lt;span style="..."&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/span&gt;&lt;/span&gt;
    // &lt;/span&gt;
    // Content here...
    // &lt;/p&gt;
    //
    // Basically, we need to locate the mso-list:Ignore SPAN, which holds either one text or image node. That
    // text or image node will be the fake bullet we are looking for
    let result: string = '';
    levels = levels || LOOKUP_DEPTH;
    let child: Node | null = node.firstChild;
    while (!result && child) {
        // Check if this is the node that holds the fake bullets (mso-list: Ignore)
        if (isIgnoreNode(child)) {
            // Yes... this is the node that holds either the text or image data
            result = child.textContent?.trim() ?? '';

            // This is the case for image case
            if (result.length == 0) {
                result = 'o';
            }
        } else if (child.nodeType == NodeType.Element && levels > 1) {
            // If this is an element and we are not in the last level, try to get the fake bullet
            // out of the child
            result = getFakeBulletText(child, levels - 1);
        }

        child = child.nextSibling;
    }

    return result;
}
/**
 * Checks if the specified node is marked as a mso-list: Ignore. These
 * nodes need to be ignored when a list item is converted into standard
 * HTML lists
 */
function isIgnoreNode(node: Node): boolean {
    if (node.nodeType == NodeType.Element) {
        let listAttribute = getStyles(node as HTMLElement)[MSO_LIST];
        if (
            listAttribute &&
            listAttribute.length > 0 &&
            listAttribute.trim().toLowerCase() == MSO_LIST_IGNORE
        ) {
            return true;
        }
    }

    return false;
}
