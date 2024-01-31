import { getObjectKeys, isNodeOfType } from 'roosterjs-content-model-dom';
import type CreateElementData from './CreateElementData';

/**
 * Create DOM element from the given CreateElementData
 * @param elementData The CreateElementData or an index of a known CreateElementData used for creating this element
 * @param document The document to create the element from
 * @returns The root DOM element just created
 */
export default function createElement(
    elementData: CreateElementData,
    document: Document
): Element | null {
    if (!elementData || !elementData.tag) {
        return null;
    }

    const { tag, namespace, className, style, dataset, attributes, children } = elementData;
    const result = namespace
        ? document.createElementNS(namespace, tag)
        : document.createElement(tag);

    if (style) {
        result.setAttribute('style', style);
    }

    if (className) {
        result.className = className;
    }

    if (dataset && isNodeOfType(result, 'ELEMENT_NODE')) {
        getObjectKeys(dataset).forEach(datasetName => {
            result.dataset[datasetName] = dataset[datasetName];
        });
    }

    if (attributes) {
        getObjectKeys(attributes).forEach(attrName => {
            result.setAttribute(attrName, attributes[attrName]);
        });
    }

    if (children) {
        children.forEach(child => {
            if (typeof child === 'string') {
                result.appendChild(document.createTextNode(child));
            } else if (child) {
                const childElement = createElement(child, document);
                if (childElement) {
                    result.appendChild(childElement);
                }
            }
        });
    }

    return result;
}
