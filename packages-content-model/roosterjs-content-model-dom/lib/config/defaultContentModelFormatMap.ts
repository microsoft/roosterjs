import { DefaultImplicitFormatMap } from 'roosterjs-content-model-types';

/**
 * @internal
 * A map from tag name to its default implicit formats
 */
export const defaultContentModelFormatMap: DefaultImplicitFormatMap = {
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
        fontSize: '1em', // Set this default value here to overwrite existing font size when change heading level
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
};
