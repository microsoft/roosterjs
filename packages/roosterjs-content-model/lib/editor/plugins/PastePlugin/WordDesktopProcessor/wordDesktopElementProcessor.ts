import { addBlock } from 'roosterjs-content-model/lib/modelApi/common/addBlock';
import { ContentModelBlockGroup, DomToModelContext } from '../../../../publicTypes';
import { createListItem } from 'roosterjs-content-model/lib/modelApi/creators/createListItem';
import { getStyles, safeInstanceOf } from 'roosterjs-editor-dom';
import { NodeType } from 'roosterjs-editor-types';
import { parseFormat } from 'roosterjs-content-model/lib/domToModel/utils/parseFormat';
import { PasteElementProcessor } from '../../../../publicTypes/event/PasteElementProcessor';

const MSO_COMMENT_ANCHOR_HREF_REGEX = /#_msocom_/;
const MSO_SPECIAL_CHARACTER = 'mso-special-character';
const MSO_SPECIAL_CHARACTER_COMMENT = 'comment';
const MSO_ELEMENT = 'mso-element';
const MSO_ELEMENT_COMMENT_LIST = 'comment-list';
const MSO_LIST = 'mso-list';
const MSO_LIST_IGNORE = 'ignore';

export const wordDesktopElementProcessor: PasteElementProcessor<HTMLElement> = (
    group,
    element,
    context
) => {
    const styles = getStyles(element);
    return processWordList(styles, group, element, context) || processWordCommand(styles, element);
};

function processWordCommand(styles: Record<string, string>, element: HTMLElement) {
    if (
        styles[MSO_SPECIAL_CHARACTER] == MSO_SPECIAL_CHARACTER_COMMENT ||
        (safeInstanceOf(element, 'HTMLAnchorElement') &&
            MSO_COMMENT_ANCHOR_HREF_REGEX.test(element.href)) ||
        styles[MSO_ELEMENT] == MSO_ELEMENT_COMMENT_LIST
    ) {
        return true;
    }
    return false;
}

function processWordList(
    styles: Record<string, string>,
    group: ContentModelBlockGroup,
    element: HTMLElement,
    context: DomToModelContext
) {
    const wordListStyle = styles[MSO_LIST] || '';
    const { listFormat } = context;

    if (wordListStyle.toLowerCase() === MSO_LIST_IGNORE) {
        return true;
    }

    const listProps = wordListStyle.split(' ');
    let level = listProps[1] && parseInt(listProps[1].substr('level'.length));
    if (wordListStyle && group && typeof level === 'number') {
        const fakeBullet = getFakeBulletText(element, 5);
        const listType = getFakeBulletTagName(fakeBullet);
        const startNumberOverride = listType == 'OL' ? parseInt(fakeBullet) || 1 : undefined;

        const newLevel = {
            listType,
            startNumberOverride,
        };
        console.log(newLevel);
        if (level > listFormat.levels.length) {
            while (level != listFormat.levels.length) {
                listFormat.levels.push(newLevel);
            }
        } else {
            listFormat.levels.splice(level, listFormat.levels.length - 1);
            listFormat.levels[level - 1] = newLevel;
        }

        listFormat.listParent = group;

        const listItem = createListItem(listFormat.levels, context.segmentFormat);

        parseFormat(element, context.formatParsers.segmentOnBlock, context.segmentFormat, context);
        parseFormat(element, context.formatParsers.listItemElement, listItem.format, context);
        context.elementProcessors.child(listItem, element, context);
        addBlock(group, listItem);
        return true;
    }

    return false;
}

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
function getFakeBulletText(node: Node, levels: number): string {
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
