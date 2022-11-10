import ContentTraverser from '../contentTraverser/ContentTraverser';
import findClosestElementAncestor from '../utils/findClosestElementAncestor';
import getStyles from '../style/getStyles';
import safeInstanceOf from '../utils/safeInstanceOf';
import setStyles from '../style/setStyles';
import { InlineElement } from 'roosterjs-editor-types';

/**
 * Set the Style of a List Item provided, with the styles that the inline child elements have
 * If the child inline elements have different styles, it will not modify the styles of the list item
 * @param element the LI Element to set the styles
 * @param styles The styles that should be applied to the element.
 */
export default function setListItemStyle(element: HTMLLIElement, styles: string[]) {
    const elementsStyles = getInlineChildElementsStyle(element, styles);
    let stylesToApply: Record<string, string> = getStyles(element);

    styles.forEach(styleName => {
        const styleValues = elementsStyles.map(style =>
            style[styleName] !== undefined ? style[styleName] : ''
        );

        if (
            styleValues &&
            (styleValues.length == 1 || new Set(styleValues).size == 1) &&
            styleValues[0]
        ) {
            stylesToApply[styleName] = styleValues[0];
        }
    });
    setStyles(element, stylesToApply);
}

function getInlineChildElementsStyle(element: HTMLElement, styles: string[]) {
    const result: Record<string, string>[] = [];
    const contentTraverser = ContentTraverser.createBodyTraverser(element);
    let currentInlineElement: InlineElement | null = null;

    while (contentTraverser.currentInlineElement != currentInlineElement) {
        currentInlineElement = contentTraverser.currentInlineElement;
        let currentNode = currentInlineElement?.getContainerNode() || null;
        const currentStyle: Record<string | number, string> = {};

        currentNode = currentNode ? findClosestElementAncestor(currentNode) : null;

        // we should consider of when it is the single childnode of element, the parentNode's style should add
        // such as the "i", "b", "span" node in <li><span><b><i>aa</i></b></span></li>
        while (
            currentNode &&
            currentNode !== element &&
            safeInstanceOf(currentNode, 'HTMLElement') &&
            (currentNode.textContent?.trim().length || 0) > 0
        ) {
            styles.forEach(styleName => {
                const styleValue = (currentNode as HTMLElement).style.getPropertyValue(styleName);
                if (styleValue && !currentStyle[styleName]) {
                    currentStyle[styleName] = styleValue;
                }
            });

            if (currentNode?.parentNode?.childNodes.length === 1) {
                currentNode = currentNode.parentNode;
            } else {
                currentNode = null;
            }
        }

        if (currentStyle) {
            result.push(currentStyle);
        }

        contentTraverser.getNextInlineElement();
    }

    return result;
}
