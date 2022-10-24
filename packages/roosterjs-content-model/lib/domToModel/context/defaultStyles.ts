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
    h1: blockElement,
    h2: blockElement,
    h3: blockElement,
    h4: blockElement,
    h5: blockElement,
    h6: blockElement,
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
        marginBlock: '1em',
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
