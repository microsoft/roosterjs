import getObjectKeys from '../jsUtils/getObjectKeys';
import safeInstanceOf from './safeInstanceOf';
import { Browser } from './Browser';
import { CreateElementData, KnownCreateElementDataIndex } from 'roosterjs-editor-types';
import type { CompatibleKnownCreateElementDataIndex } from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * All known CreateElementData used by roosterjs to create elements
 */
export const KnownCreateElementData: Record<KnownCreateElementDataIndex, CreateElementData> = {
    [KnownCreateElementDataIndex.None]: { tag: '' },

    // Edge can sometimes lose current format when Enter to new line.
    // So here we add an extra SPAN for Edge to workaround this bug
    [KnownCreateElementDataIndex.EmptyLine]: Browser.isEdge
        ? { tag: 'div', children: [{ tag: 'span', children: [{ tag: 'br' }] }] }
        : { tag: 'div', children: [{ tag: 'br' }] },
    [KnownCreateElementDataIndex.BlockquoteWrapper]: {
        tag: 'blockquote',
        style: 'margin-top:0;margin-bottom:0',
    },
    [KnownCreateElementDataIndex.CopyPasteTempDiv]: {
        tag: 'div',
        style:
            'width: 600px; height: 1px; overflow: hidden; position: fixed; top: 0; left; 0; -webkit-user-select: text',
        attributes: {
            contenteditable: 'true',
        },
    },
    [KnownCreateElementDataIndex.BlockListItem]: { tag: 'li', style: 'display:block' },
    [KnownCreateElementDataIndex.ContextMenuWrapper]: {
        tag: 'div',
        style: 'position: fixed; width: 0; height: 0',
    },
    [KnownCreateElementDataIndex.ImageEditWrapper]: {
        tag: 'span',
        style: 'max-width:100%;position:relative',
        children: [
            {
                tag: 'div',
                style: 'width:100%;height:100%;position:relative;overflow:hidden',
            },
        ],
    },
    [KnownCreateElementDataIndex.TableHorizontalResizer]: {
        tag: 'div',
        style: 'position: fixed; cursor: row-resize; user-select: none',
    },
    [KnownCreateElementDataIndex.TableVerticalResizer]: {
        tag: 'div',
        style: 'position: fixed; cursor: col-resize; user-select: none',
    },
    [KnownCreateElementDataIndex.TableResizerLTR]: {
        tag: 'div',
        style: 'position: fixed; cursor: nw-resize; user-select: none; border: 1px solid #808080',
    },
    [KnownCreateElementDataIndex.TableResizerRTL]: {
        tag: 'div',
        style: 'position: fixed; cursor: ne-resize; user-select: none; border: 1px solid #808080',
    },
    [KnownCreateElementDataIndex.TableSelector]: {
        tag: 'div',
        style: 'position: fixed; cursor: all-scroll; user-select: none; border: 1px solid #808080',
    },
    [KnownCreateElementDataIndex.EmptyLineFormatInSpan]: {
        tag: 'div',
        children: [{ tag: 'span', children: [{ tag: 'br' }] }],
    },
};

/**
 * Create DOM element from the given CreateElementData
 * @param elementData The CreateElementData or an index of a known CreateElementData used for creating this element
 * @param document The document to create the element from
 * @returns The root DOM element just created
 */
export default function createElement(
    elementData:
        | CreateElementData
        | KnownCreateElementDataIndex
        | CompatibleKnownCreateElementDataIndex,
    document: Document
): Element | null {
    if (typeof elementData == 'number') {
        elementData = KnownCreateElementData[elementData];
    }

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

    if (dataset && safeInstanceOf(result, 'HTMLElement')) {
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
