import { isElementOfType } from '../../domUtils/isElementOfType';
import type { FormatHandler } from '../FormatHandler';
import type { SizeFormat } from 'roosterjs-content-model-types';

const PercentageRegex = /[\d\.]+%/;

/**
 * @internal
 */
export const sizeFormatHandler: FormatHandler<SizeFormat> = {
    parse: (format, element, context) => {
        const width = element.style.width || tryParseSize(element, 'width');
        const height = element.style.height || tryParseSize(element, 'height');
        const maxWidth = element.style.maxWidth;
        const maxHeight = element.style.maxHeight;
        const minWidth = element.style.minWidth;
        const minHeight = element.style.minHeight;
        const widthAttr = element.getAttribute('width') || element.clientWidth.toString();
        const heightAttr = element.getAttribute('height') || element.clientHeight.toString();

        if (width) {
            format.width = width;
        }
        if (height) {
            format.height = height;
        }
        if (maxWidth) {
            format.maxWidth = maxWidth;
        }
        if (maxHeight) {
            format.maxHeight = maxHeight;
        }
        if (minWidth) {
            format.minWidth = minWidth;
        }
        if (minHeight) {
            format.minHeight = minHeight;
        }
        if (widthAttr) {
            format.widthAttr = widthAttr;
        }
        if (heightAttr) {
            format.heightAttr = heightAttr;
        }
    },
    apply: (format, element) => {
        if (format.width) {
            element.style.width = format.width;
        }
        if (format.height) {
            element.style.height = format.height;
        }
        if (format.maxWidth) {
            element.style.maxWidth = format.maxWidth;
        }
        if (format.maxHeight) {
            element.style.maxHeight = format.maxHeight;
        }
        if (format.minWidth) {
            element.style.minWidth = format.minWidth;
        }
        if (format.minHeight) {
            element.style.minHeight = format.minHeight;
        }
        if (format.widthAttr && isElementOfType(element, 'img')) {
            element.width = parseInt(format.widthAttr);
        }
        if (format.heightAttr && isElementOfType(element, 'img')) {
            element.height = parseInt(format.heightAttr);
        }
    },
};

function tryParseSize(element: HTMLElement, attrName: 'width' | 'height'): string | undefined {
    const attrValue = element.getAttribute(attrName);
    const value = parseInt(attrValue || '');

    return attrValue && PercentageRegex.test(attrValue)
        ? attrValue
        : Number.isNaN(value) || value == 0
        ? undefined
        : value + 'px';
}
