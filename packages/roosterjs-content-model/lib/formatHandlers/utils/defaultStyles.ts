import { DefaultImplicitFormatMap } from '../../publicTypes/context/ModelToDomSettings';
import { DefaultStyleMap } from '../../publicTypes/context/DomToModelSettings';

const blockElement: Partial<CSSStyleDeclaration> = {
    display: 'block',
};

/**
 * @internal
 */
export const defaultStyleMap: DefaultStyleMap = {
    address: blockElement,
    article: blockElement,
    aside: blockElement,
    b: {
        fontWeight: 'bold',
    },
    blockquote: {
        display: 'block',
        marginTop: '1em',
        marginBottom: '1em',
        marginLeft: '40px',
        marginRight: '40px',
    },
    br: blockElement,
    center: {
        display: 'block',
        textAlign: 'center',
    },
    dd: blockElement,
    div: blockElement,
    dl: blockElement,
    dt: blockElement,
    em: {
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
    section: blockElement,
    strike: {
        textDecoration: 'line-through',
    },
    strong: {
        fontWeight: 'bold',
    },
    sub: {
        verticalAlign: 'sub',
        fontSize: 'smaller',
    },
    sup: {
        verticalAlign: 'super',
        fontSize: 'smaller',
    },
    table: {
        display: 'table',
        boxSizing: 'border-box',
    },
    td: {
        display: 'table-cell',
    },
    th: {
        display: 'table-cell',
    },
    u: {
        textDecoration: 'underline',
    },
    ul: blockElement,
};

/**
 * @internal
 */
export const enum PseudoTagNames {
    childOfPre = 'pre *', // This value is not a CSS selector, it just to tell this will impact elements under PRE tag. Any unique value here can work actually
}

/**
 * @internal
 */
export const defaultImplicitFormatMap: DefaultImplicitFormatMap = {
    a: {
        underline: true,
    },
    blockquote: {
        marginTop: '1em',
        marginBottom: '1em',
        marginLeft: '40px',
        marginRight: '40px',
    },
    code: {
        fontFamily: 'monospace',
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
        fontSize: '1em', // Set this default value here to overwrite existing font size when change header level
    },
    h5: {
        fontWeight: 'bold',
        fontSize: '0.83em',
    },
    h6: {
        fontWeight: 'bold',
        fontSize: '0.67em',
    },
    p: {
        marginTop: '1em',
        marginBottom: '1em',
    },
    pre: {
        fontFamily: 'monospace',
        whiteSpace: 'pre',
        marginTop: '1em',
        marginBottom: '1em',
    },

    // For PRE tag, the following styles will be included from the PRE tag.
    // Adding this implicit style here so no need to generate these style for child elements
    [PseudoTagNames.childOfPre]: {
        fontFamily: 'monospace',
        whiteSpace: 'pre',
    },
};
