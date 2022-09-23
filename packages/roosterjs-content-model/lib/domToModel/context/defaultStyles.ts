import { DefaultStyleMap } from '../../publicTypes/context/DomToModelSettings';

/**
 * @internal
 */
export const defaultStyleMap: DefaultStyleMap = {
    B: {
        fontWeight: 'bold',
    },
    EM: {
        fontStyle: 'italic',
    },
    I: {
        fontStyle: 'italic',
    },
    S: {
        textDecoration: 'line-through',
    },
    STRIKE: {
        textDecoration: 'line-through',
    },
    STRONG: {
        fontWeight: 'bold',
    },
    SUB: {
        verticalAlign: 'sub',
        fontSize: 'smaller',
    },
    SUP: {
        verticalAlign: 'super',
        fontSize: 'smaller',
    },
    U: {
        textDecoration: 'underline',
    },
};
