import type { BorderFormat, BorderKey } from 'roosterjs-content-model-types';

/**
 * Keys of border items
 */
export const BorderKeys: (BorderKey & keyof BorderFormat & keyof CSSStyleDeclaration)[] = [
    'borderTop',
    'borderRight',
    'borderBottom',
    'borderLeft',
];

/**
 * @internal
 */
export const BorderColorKeyMap: {
    [key in BorderKey]: string;
} = {
    borderTop: 'border-top-color',
    borderRight: 'border-right-color',
    borderBottom: 'border-bottom-color',
    borderLeft: 'border-left-color',
};
