import getTagOfNode from '../utils/getTagOfNode';
import { PredefinedCssMap, StringMap } from 'roosterjs-editor-types';

const PREDEFINED_CSS_FOR_ELEMENT: PredefinedCssMap = {
    B: {
        'font-weight': 'bold',
    },
    EM: {
        'font-style': 'italic',
    },
    I: {
        'font-style': 'italic',
    },
    U: {
        'text-decoration': 'underline',
    },
    P: {
        'margin-top': '1em',
        'margin-bottom': '1em',
    },
    PRE: {
        'white-space': 'pre',
    },
    S: {
        'text-decoration': 'line-through',
    },
    STRIKE: {
        'text-decoration': 'line-through',
    },
    SUB: {
        'vertical-align': 'sub',
        'font-size': 'smaller',
    },
    SUP: {
        'vertical-align': 'super',
        'font-size': 'smaller',
    },
};

/**
 * @internal
 * Get a map for browser built-in CSS definitions of elements
 */
export default function getPredefinedCssForElement(
    element: HTMLElement,
    additionalPredefinedCssForElement?: PredefinedCssMap | null
): StringMap {
    const tag = getTagOfNode(element);
    return PREDEFINED_CSS_FOR_ELEMENT[tag] || (additionalPredefinedCssForElement || {})[tag];
}
