import type { DefaultStyleMap } from 'roosterjs-content-model-types';

const blockElement: Partial<CSSStyleDeclaration> = {
    display: 'block',
};

/**
 * @internal
 */
export const defaultHTMLStyleMap: DefaultStyleMap = {
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
