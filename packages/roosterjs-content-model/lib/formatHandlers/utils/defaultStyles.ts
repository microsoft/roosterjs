import { DefaultImplicitSegmentFormatMap } from '../../publicTypes/context/ModelToDomSettings';
import { DefaultStyleMap } from '../../publicTypes/context/DomToModelSettings';

const blockElement: Partial<CSSStyleDeclaration> = {
    display: 'block',
};

export const HyperLinkColorPlaceholder = '__hyperLinkColor';

/**
 * @internal
 */
export const defaultStyleMap: DefaultStyleMap = {
    a: {
        textDecoration: 'underline',
        color: HyperLinkColorPlaceholder,
    },
    address: blockElement,
    article: blockElement,
    aside: blockElement,
    b: {
        fontWeight: 'bold',
    },
    EM: {
        fontStyle: 'italic',
    },
    fieldset: blockElement,
    figcaption: blockElement,
    figure: blockElement,
    footer: blockElement,
    form: blockElement,
    h1: {
        display: 'block',
        fontWeight: 'bold',
        fontSize: '2em',
    },
    h2: {
        display: 'block',
        fontWeight: 'bold',
        fontSize: '1.5em',
    },
    h3: {
        display: 'block',
        fontWeight: 'bold',
        fontSize: '1.17em',
    },
    h4: {
        display: 'block',
        fontWeight: 'bold',
    },
    h5: {
        display: 'block',
        fontWeight: 'bold',
        fontSize: '0.83em',
    },
    h6: {
        display: 'block',
        fontWeight: 'bold',
        fontSize: '0.67em',
    },
    header: blockElement,
    hr: blockElement,
    i: {
        fontStyle: 'italic',
    },
    li: {
        display: 'list-item',
    },
    main: blockElement,
    nav: blockElement,
    ol: blockElement,
    p: {
        display: 'block',
        marginTop: '1em',
        marginBottom: '1em',
    },
    pre: {
        display: 'block',
        fontFamily: 'monospace',
        whiteSpace: 'pre',
        marginTop: '1em',
        marginBottom: '1em',
    },
    s: {
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

export const defaultImplicitSegmentFormatMap: DefaultImplicitSegmentFormatMap = {
    a: {
        underline: true,
        textColor: HyperLinkColorPlaceholder,
    },
    h1: {
        fontWeight: 'bold',
        fontSize: '2em',
    },
    h2: {
        fontWeight: 'bold',
        fontSize: '1.5em',
    },
    h3: {
        fontWeight: 'bold',
        fontSize: '1.17em',
    },
    h4: {
        fontWeight: 'bold',
    },
    h5: {
        fontWeight: 'bold',
        fontSize: '0.83em',
    },
    h6: {
        fontWeight: 'bold',
        fontSize: '0.67em',
    },
};
