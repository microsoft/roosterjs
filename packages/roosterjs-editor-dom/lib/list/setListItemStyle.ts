import ContentTraverser from '../contentTraverser/ContentTraverser';
import findClosestElementAncestor from '../utils/findClosestElementAncestor';
import safeInstanceOf from '../utils/safeInstanceOf';
import { InlineElement } from 'roosterjs-editor-types';

/**
 * Set the Style of a List Item provided, with the styles that the inline child elements have
 * If the child inline elements have different styles, it will not modify the styles of the list item
 * @param element the LI Element to set the styles
 * @param styles The styles that should be applied to the element.
 * @param isCssStyle True means the given styles are CSS style names, false means they are HTML attributes @default true
 */
export default function setListItemStyle(
    element: HTMLLIElement,
    styles: string[],
    isCssStyle: boolean = true
) {
    const elementsStyles = getInlineChildElementsStyle(element, styles, isCssStyle);

    styles.forEach(styleName => {
        const styleValues = elementsStyles.map(style =>
            style[styleName] !== undefined ? style[styleName] : ''
        );

        if (
            styleValues &&
            (styleValues.length == 1 || new Set(styleValues).size == 1) &&
            styleValues[0]
        ) {
            if (isCssStyle) {
                element.style.setProperty(styleName, styleValues[0]);
            } else {
                element.setAttribute(styleName, styleValues[0]);
            }
        }
    });
}

function getInlineChildElementsStyle(element: HTMLElement, styles: string[], isCssStyle: boolean) {
    const result: Record<string, string>[] = [];
    const contentTraverser = ContentTraverser.createBodyTraverser(element);
    let currentInlineElement: InlineElement | null = null;

    while (contentTraverser.currentInlineElement != currentInlineElement) {
        currentInlineElement = contentTraverser.currentInlineElement;
        let currentNode = currentInlineElement?.getContainerNode() || null;
        let currentStyle: Record<string, string> | null = null;

        currentNode = currentNode ? findClosestElementAncestor(currentNode) : null;

        // we should consider of when it is the single child node of element, the parentNode's style should add
        // such as the "i", "b", "span" node in <li><span><b><i>aa</i></b></span></li>
        while (
            currentNode &&
            currentNode !== element &&
            safeInstanceOf(currentNode, 'HTMLElement') &&
            (result.length == 0 || (currentNode.textContent?.trim().length || 0) > 0)
        ) {
            const element: HTMLElement = currentNode;

            styles.forEach(styleName => {
                const styleValue = isCssStyle
                    ? element.style.getPropertyValue(styleName)
                    : element.getAttribute(styleName);

                if (!currentStyle) {
                    currentStyle = {};
                }

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
