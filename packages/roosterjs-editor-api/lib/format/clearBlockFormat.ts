import blockFormat from '../utils/blockFormat';
import { IEditor } from 'roosterjs-editor-types';
import {
    collapseNodesInRegion,
    getSelectedBlockElementsInRegion,
    getTagOfNode,
    isBlockElement,
    isNodeInRegion,
    isVoidHtmlElement,
    safeInstanceOf,
    splitBalancedNodeRange,
    toArray,
    unwrap,
    wrap,
} from 'roosterjs-editor-dom';

const TAGS_TO_UNWRAP = 'B,I,U,STRONG,EM,SUB,SUP,STRIKE,FONT,CENTER,H1,H2,H3,H4,H5,H6,UL,OL,LI,SPAN,P,BLOCKQUOTE,CODE,S,PRE'.split(
    ','
);
const ATTRIBUTES_TO_PRESERVE = ['href', 'src'];
const TAGS_TO_STOP_UNWRAP = ['TD', 'TH', 'TR', 'TABLE', 'TBODY', 'THEAD'];

/**
 * Clear all formats of selected blocks.
 * When selection is collapsed, only clear format of current block.
 * @param editor The editor instance
 */
export default function clearBlockFormat(editor: IEditor) {
    blockFormat(editor, region => {
        const blocks = getSelectedBlockElementsInRegion(region);
        let nodes = collapseNodesInRegion(region, blocks);

        if (editor.contains(region.rootNode)) {
            // If there are styles on table cell, wrap all its children and move down all non-border styles.
            // So that we can preserve styles for unselected blocks as well as border styles for table
            const nonborderStyles = removeNonBorderStyles(region.rootNode);
            if (nonborderStyles) {
                const wrapper = wrap(toArray(region.rootNode.childNodes));
                wrapper.setAttribute('style', nonborderStyles);
            }
        }

        while (nodes.length > 0 && isNodeInRegion(region, nodes[0].parentNode)) {
            nodes = [splitBalancedNodeRange(nodes)];
        }

        nodes.forEach(clearNodeFormat);
    });
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

    for (let attr of toArray(element.attributes)) {
        if (isTableCell && attr.name == 'style') {
            removeNonBorderStyles(element);
        } else if (
            ATTRIBUTES_TO_PRESERVE.indexOf(attr.name.toLowerCase()) < 0 &&
            attr.name.indexOf('data-') != 0
        ) {
            element.removeAttribute(attr.name);
        }
    }
}

function removeNonBorderStyles(element: HTMLElement): string {
    let borders: string[] = [];
    let nonborders: string[] = [];
    const style = element.getAttribute('style') || '';

    style
        .split(';')
        .forEach(pair => (pair.trim().indexOf('border') >= 0 ? borders : nonborders).push(pair));

    if (nonborders.length > 0) {
        if (borders.length > 0) {
            element.setAttribute('style', borders.join(';'));
        } else {
            element.removeAttribute('style');
        }
        return nonborders.join(';');
    } else {
        return '';
    }
}
