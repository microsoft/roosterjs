const VARIABLE_REGEX = /^\s*var\(\s*[a-zA-Z0-9-_]+\s*(,\s*(.*))?\)\s*$/;
const VARIABLE_PREFIX = 'var(';

const AllowedAttributes = [
    'accept',
    'align',
    'alt',
    'checked',
    'cite',
    'class',
    'color',
    'cols',
    'colspan',
    'contextmenu',
    'coords',
    'datetime',
    'default',
    'dir',
    'dirname',
    'disabled',
    'download',
    'face',
    'headers',
    'height',
    'hidden',
    'high',
    'href',
    'hreflang',
    'ismap',
    'kind',
    'label',
    'lang',
    'list',
    'low',
    'max',
    'maxlength',
    'media',
    'min',
    'multiple',
    'open',
    'optimum',
    'pattern',
    'placeholder',
    'readonly',
    'rel',
    'required',
    'reversed',
    'rows',
    'rowspan',
    'scope',
    'selected',
    'shape',
    'size',
    'sizes',
    'span',
    'spellcheck',
    'src',
    'srclang',
    'srcset',
    'start',
    'step',
    'style',
    'tabindex',
    'target',
    'title',
    'translate',
    'type',
    'usemap',
    'valign',
    'value',
    'width',
    'wrap',
    'bgColor',
];

const DefaultStyleValue: { [name: string]: string } = {
    'background-color': 'transparent',
    'border-bottom-color': 'rgb(0, 0, 0)',
    'border-bottom-style': 'none',
    'border-bottom-width': '0px',
    'border-image-outset': '0',
    'border-image-repeat': 'stretch',
    'border-image-slice': '100%',
    'border-image-source': 'none',
    'border-image-width': '1',
    'border-left-color': 'rgb(0, 0, 0)',
    'border-left-style': 'none',
    'border-left-width': '0px',
    'border-right-color': 'rgb(0, 0, 0)',
    'border-right-style': 'none',
    'border-right-width': '0px',
    'border-top-color': 'rgb(0, 0, 0)',
    'border-top-style': 'none',
    'border-top-width': '0px',
    'outline-color': 'transparent',
    'outline-style': 'none',
    'outline-width': '0px',
    overflow: 'visible',
    '-webkit-text-stroke-width': '0px',
    'word-wrap': 'break-word',
    'margin-left': '0px',
    'margin-right': '0px',
    padding: '0px',
    'padding-top': '0px',
    'padding-left': '0px',
    'padding-right': '0px',
    'padding-bottom': '0px',
    border: '0px',
    'border-top': '0px',
    'border-left': '0px',
    'border-right': '0px',
    'border-bottom': '0px',
    'vertical-align': 'baseline',
    float: 'none',
    'font-style': 'normal',
    'font-variant-ligatures': 'normal',
    'font-variant-caps': 'normal',
    'font-weight': '400',
    'letter-spacing': 'normal',
    orphans: '2',
    'text-align': 'start',
    'text-indent': '0px',
    'text-transform': 'none',
    widows: '2',
    'word-spacing': '0px',
    'white-space': 'normal',
};

/**
 * @internal
 * Sanitize single element. This is mostly used by paste
 * @param element
 */
export function getSanitizedElement(
    doc: Document,
    tag: string,
    attributes: NamedNodeMap
): HTMLElement {
    const element = doc.createElement('tag');

    for (let i = attributes.length - 1; i >= 0; i--) {
        const attribute = attributes[i];
        const name = attribute.name.toLowerCase().trim();
        const value = attribute.value;

        const newValue =
            name == 'style'
                ? processStyles(value)
                : AllowedAttributes.indexOf(name) >= 0 || name.indexOf('data-') == 0
                ? value
                : null;

        if (
            newValue !== null &&
            newValue !== undefined &&
            !newValue.match(/s\n*c\n*r\n*i\n*p\n*t\n*:/i) // match script: with any NewLine inside. Browser will ignore those NewLine char and still treat it as script prefix
        ) {
            element.setAttribute(name, newValue);
        }
    }

    return element;
}

function processStyles(value: string) {
    const pairs = value.split(';');
    const result: string[] = [];

    pairs.forEach(pair => {
        const valueIndex = pair.indexOf(':');
        const name = pair.slice(0, valueIndex).trim();
        let value = pair.slice(valueIndex + 1).trim();

        if (name && value) {
            if (isCssVariable(value)) {
                value = processCssVariable(value);
            }

            if (
                !!value &&
                value != 'inherit' &&
                value != 'initial' &&
                value.indexOf('expression') < 0 &&
                !name.startsWith('-') &&
                DefaultStyleValue[name] != value
            ) {
                result.push(`${name}:${value}`);
            }
        }
    });

    return result.join(';');
}

function processCssVariable(value: string): string {
    const match = VARIABLE_REGEX.exec(value);
    return match?.[2] || ''; // Without fallback value, we don't know what does the original value mean, so ignore it
}

function isCssVariable(value: string): boolean {
    return value.indexOf(VARIABLE_PREFIX) == 0;
}
