import applyListItemStyleWrap from '../utils/applyListItemWrap';
import blockFormat from '../utils/blockFormat';
import execCommand from '../utils/execCommand';
import formatUndoSnapshot from '../utils/formatUndoSnapshot';
import setBackgroundColor from './setBackgroundColor';
import setFontName from './setFontName';
import setFontSize from './setFontSize';
import setTextColor from './setTextColor';
import toggleBold from './toggleBold';
import toggleItalic from './toggleItalic';
import toggleUnderline from './toggleUnderline';
import {
    ChangeSource,
    ClearFormatMode,
    DocumentCommand,
    IEditor,
    QueryScope,
} from 'roosterjs-editor-types';
import {
    collapseNodesInRegion,
    getObjectKeys,
    getSelectedBlockElementsInRegion,
    getStyles,
    getTagOfNode,
    isBlockElement,
    isNodeInRegion,
    isVoidHtmlElement,
    PartialInlineElement,
    NodeInlineElement,
    safeInstanceOf,
    setStyles,
    splitBalancedNodeRange,
    toArray,
    unwrap,
    wrap,
} from 'roosterjs-editor-dom';
import type { CompatibleClearFormatMode } from 'roosterjs-editor-types/lib/compatibleTypes';

const STYLES_TO_REMOVE = ['font', 'text-decoration', 'color', 'background'];
const TAGS_TO_UNWRAP = 'B,I,U,STRONG,EM,SUB,SUP,STRIKE,FONT,CENTER,H1,H2,H3,H4,H5,H6,UL,OL,LI,SPAN,P,BLOCKQUOTE,CODE,S,PRE'.split(
    ','
);
const ATTRIBUTES_TO_PRESERVE = ['href', 'src', 'cellpadding', 'cellspacing'];
const TAGS_TO_STOP_UNWRAP = ['TD', 'TH', 'TR', 'TABLE', 'TBODY', 'THEAD'];

/**
 * @param editor The editor instance
 * @returns if the current selection is composed of two or more block elements
 */
function isMultiBlockSelection(editor: IEditor): boolean {
    let transverser = editor.getSelectionTraverser();
    let blockElement = transverser?.currentBlockElement;
    if (!blockElement) {
        return false;
    }

    let nextBlockElement = transverser?.getNextBlockElement();

    //At least two blocks are selected
    return !!nextBlockElement;
}

function clearNodeFormat(node: Node): boolean {
    // 1. Recursively clear format of all its child nodes
    const areBlockElements = toArray(node.childNodes).map(clearNodeFormat);
    let areAllChildrenBlock = areBlockElements.every(b => b);
    let returnBlockElement = isBlockElement(node);

    // 2. Unwrap the tag if necessary
    const tag = getTagOfNode(node);
    if (tag) {
        if (
            TAGS_TO_UNWRAP.indexOf(tag) >= 0 ||
            (areAllChildrenBlock &&
                !isVoidHtmlElement(node) &&
                TAGS_TO_STOP_UNWRAP.indexOf(tag) < 0)
        ) {
            if (returnBlockElement && !areAllChildrenBlock) {
                wrap(node);
            }
            unwrap(node);
        } else {
            // 3. Otherwise, remove all attributes
            clearAttribute(node as HTMLElement);
        }
    }

    return returnBlockElement;
}

function clearAttribute(element: HTMLElement) {
    const isTableCell = safeInstanceOf(element, 'HTMLTableCellElement');
    const isTable = safeInstanceOf(element, 'HTMLTableElement');

    for (let attr of toArray(element.attributes)) {
        if (isTableCell && attr.name == 'style') {
            removeNonBorderStyles(element);
        } else if (isTable && attr.name == 'style') {
            removeNotTableDefaultStyles(element);
        } else if (
            ATTRIBUTES_TO_PRESERVE.indexOf(attr.name.toLowerCase()) < 0 &&
            attr.name.indexOf('data-') != 0
        ) {
            element.removeAttribute(attr.name);
        }
    }
}

function updateStyles(
    element: HTMLElement,
    callbackfn: (
        value: string,
        styles: Record<string, string>,
        result: Record<string, string>
    ) => void
) {
    const styles = getStyles(element);
    const result: Record<string, string> = {};

    getObjectKeys(styles).forEach(style => callbackfn(style, styles, result));

    setStyles(element, styles);

    return result;
}

function removeNonBorderStyles(element: HTMLElement): Record<string, string> {
    return updateStyles(element, (name, styles, result) => {
        if (name.indexOf('border') < 0) {
            result[name] = styles[name];
            delete styles[name];
        }
    });
}

function removeNotTableDefaultStyles(element: HTMLTableElement) {
    return updateStyles(element, (name, styles, result) => {
        if (name != 'border-collapse') {
            result[name] = styles[name];
            delete styles[name];
        }
    });
}

/**
 * Verifies recursively if a node and its parents have any siblings with text content
 * Ignoring the children of contentDiv and returning true if any node is LI
 * @returns `true` if this node, and its parents (minus the children of the contentDiv) have no siblings with text content
 */
function isNodeWholeBlock(node: Node, editor: IEditor) {
    let currentNode: ParentNode | Node | null = node;
    while (currentNode && editor.contains(currentNode.parentNode)) {
        if (currentNode.nextSibling || currentNode.previousSibling) {
            if (safeInstanceOf(currentNode, 'HTMLLIElement')) {
                return true;
            }
            let isOnlySiblingWithContent = true;
            currentNode.parentNode?.childNodes.forEach(node => {
                if (node != currentNode && node.textContent?.length) {
                    isOnlySiblingWithContent = false;
                }
            });
            return isOnlySiblingWithContent;
        }
        currentNode = currentNode.parentNode;
    }
    return true;
}

/**
 * Clear the format of the selected text or list of blocks
 * If the current selection is compose of multiple block elements then remove the text and struture format for all the selected blocks
 * If the current selection is compose of a partial inline element then only the text format is removed from the current selection
 * @param editor The editor instance
 */
function clearAutoDetectFormat(editor: IEditor) {
    const isMultiBlock = isMultiBlockSelection(editor);
    if (!isMultiBlock) {
        const transverser = editor.getSelectionTraverser();
        const inlineElement = transverser?.currentInlineElement;
        const isPartial =
            inlineElement instanceof PartialInlineElement ||
            (inlineElement instanceof NodeInlineElement &&
                !isNodeWholeBlock(inlineElement.getContainerNode(), editor));
        if (isPartial) {
            clearFormat(editor);
            return;
        }
    }
    clearBlockFormat(editor);
}

/**
 * Clear all formats of selected blocks.
 * When selection is collapsed, only clear format of current block.
 * @param editor The editor instance
 */
function clearBlockFormat(editor: IEditor) {
    formatUndoSnapshot(
        editor,
        () => {
            blockFormat(editor, region => {
                const blocks = getSelectedBlockElementsInRegion(region);
                let nodes = collapseNodesInRegion(region, blocks);

                if (editor.contains(region.rootNode)) {
                    // If there are styles on table cell, wrap all its children and move down all non-border styles.
                    // So that we can preserve styles for unselected blocks as well as border styles for table
                    const nonborderStyles = removeNonBorderStyles(region.rootNode);
                    if (getObjectKeys(nonborderStyles).length > 0) {
                        const wrapper = wrap(toArray(region.rootNode.childNodes));
                        setStyles(wrapper, nonborderStyles);
                    }
                }

                while (
                    nodes.length > 0 &&
                    nodes[0].parentNode &&
                    isNodeInRegion(region, nodes[0].parentNode)
                ) {
                    const balancedNodes = splitBalancedNodeRange(nodes);
                    nodes = balancedNodes ? [balancedNodes] : [];
                }

                nodes.forEach(clearNodeFormat);
            });
            setDefaultFormat(editor);
        },
        'clearBlockFormat'
    );
}

function clearInlineFormat(editor: IEditor) {
    editor.focus();
    editor.addUndoSnapshot(() => {
        execCommand(editor, DocumentCommand.RemoveFormat);
        editor.queryElements('[class]', QueryScope.OnSelection, node =>
            node.removeAttribute('class')
        );

        setDefaultFormat(editor);

        return 'clearInlineFormat';
    }, ChangeSource.Format);
}

function setDefaultFontWeight(editor: IEditor, fontWeight: string = '400') {
    applyListItemStyleWrap(
        editor,
        'font-weight',
        element => (element.style.fontWeight = fontWeight),
        'setDefaultFontWeight'
    );
}

function setDefaultFormat(editor: IEditor) {
    const defaultFormat = editor.getDefaultFormat();
    const isDefaultFormatEmpty = getObjectKeys(defaultFormat).length === 0;
    editor.queryElements('[style]', QueryScope.InSelection, node => {
        const tag = getTagOfNode(node);
        if (TAGS_TO_STOP_UNWRAP.indexOf(tag) == -1) {
            removeStyles(tag, node, isDefaultFormatEmpty);
        } else {
            node.childNodes.forEach(node => {
                node.childNodes.forEach(cNode => {
                    const tag = getTagOfNode(cNode);
                    if (safeInstanceOf(cNode, 'HTMLElement')) {
                        removeStyles(tag, cNode, isDefaultFormatEmpty);
                    }
                });
            });
        }
    });

    if (!isDefaultFormatEmpty) {
        if (defaultFormat.fontFamily) {
            setFontName(editor, defaultFormat.fontFamily);
        }
        if (defaultFormat.fontSize) {
            setFontSize(editor, defaultFormat.fontSize);
        }
        if (defaultFormat.textColor) {
            const setColorIgnoredElements = editor.queryElements<HTMLElement>(
                'a *, a',
                QueryScope.OnSelection
            );

            let shouldApplyInlineStyle =
                setColorIgnoredElements.length > 0
                    ? (element: HTMLElement) => setColorIgnoredElements.indexOf(element) == -1
                    : undefined;

            if (defaultFormat.textColors) {
                setTextColor(editor, defaultFormat.textColors, shouldApplyInlineStyle);
            } else {
                setTextColor(editor, defaultFormat.textColor, shouldApplyInlineStyle);
            }
        }
        if (defaultFormat.backgroundColor) {
            if (defaultFormat.backgroundColors) {
                setBackgroundColor(editor, defaultFormat.backgroundColors);
            } else {
                setBackgroundColor(editor, defaultFormat.backgroundColor);
            }
        }
        if (defaultFormat.bold) {
            toggleBold(editor);
        } else {
            setDefaultFontWeight(editor);
        }
        if (defaultFormat.italic) {
            toggleItalic(editor);
        }
        if (defaultFormat.underline) {
            toggleUnderline(editor);
        }
    }
}

function removeStyles(tag: string, node: HTMLElement, isDefaultFormatEmpty: boolean) {
    if (TAGS_TO_STOP_UNWRAP.indexOf(tag) == -1) {
        STYLES_TO_REMOVE.forEach(style => node.style.removeProperty(style));

        // when default format is empty, keep the HTML minimum by removing style attribute if there's no style
        // (note: because default format is empty, we're not adding style back in)
        if (isDefaultFormatEmpty && node.getAttribute('style') === '') {
            node.removeAttribute('style');
        }
    }
}

/**
 * Clear the format in current selection, after cleaning, the format will be
 * changed to default format. The format that get cleaned include B/I/U/font name/
 * font size/text color/background color/align left/align right/align center/superscript/subscript
 * @param editor The editor instance
 * @param formatType type of format to apply
 */
export default function clearFormat(
    editor: IEditor,
    formatType: ClearFormatMode | CompatibleClearFormatMode = ClearFormatMode.Inline
) {
    switch (formatType) {
        case ClearFormatMode.Inline:
            clearInlineFormat(editor);
            break;
        case ClearFormatMode.Block:
            clearBlockFormat(editor);
            break;
        default:
            clearAutoDetectFormat(editor);
    }
}
