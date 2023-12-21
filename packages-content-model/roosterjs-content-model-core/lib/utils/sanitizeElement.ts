import { isNodeOfType } from 'roosterjs-content-model-dom';

/**
 * @internal
 */
export const AllowedTags: ReadonlyArray<string> = [
    'a',
    'abbr',
    'address',
    'area',
    'article',
    'aside',
    'b',
    'bdi',
    'bdo',
    'blockquote',
    'body',
    'br',
    'button',
    'canvas',
    'caption',
    'center',
    'cite',
    'code',
    'col',
    'colgroup',
    'data',
    'datalist',
    'dd',
    'del',
    'details',
    'dfn',
    'dialog',
    'dir',
    'div',
    'dl',
    'dt',
    'em',
    'fieldset',
    'figcaption',
    'figure',
    'font',
    'footer',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'head',
    'header',
    'hgroup',
    'hr',
    'html',
    'i',
    'img',
    'input',
    'ins',
    'kbd',
    'label',
    'legend',
    'li',
    'main',
    'map',
    'mark',
    'menu',
    'menuitem',
    'meter',
    'nav',
    'ol',
    'optgroup',
    'option',
    'output',
    'p',
    'picture',
    'pre',
    'progress',
    'q',
    'rp',
    'rt',
    'ruby',
    's',
    'samp',
    'section',
    'select',
    'small',
    'span',
    'strike',
    'strong',
    'sub',
    'summary',
    'sup',
    'table',
    'tbody',
    'td',
    'textarea',
    'tfoot',
    'th',
    'thead',
    'time',
    'tr',
    'tt',
    'u',
    'ul',
    'var',
    'wbr',
    'xmp',
];

/**
 * @internal
 */
export const DisallowedTags: ReadonlyArray<string> = [
    'applet',
    'audio',
    'base',
    'basefont',
    'embed',
    'frame',
    'frameset',
    'iframe',
    'link',
    'meta',
    'noscript',
    'object',
    'param',
    'script',
    'slot',
    'source',
    'style',
    'template',
    'title',
    'track',
    'video',
];

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
 */
export function sanitizeElement(
    element: HTMLElement,
    allowedTags: ReadonlyArray<string>,
    disallowedTags: ReadonlyArray<string>,
    styleCallbacks?: Record<string, (value: string, tagName: string) => string | null>
): HTMLElement | null {
    const tag = element.tagName.toLowerCase();
    const sanitizedElement =
        disallowedTags.indexOf(tag) >= 0
            ? null
            : createSanitizedElement(
                  element.ownerDocument,
                  allowedTags.indexOf(tag) >= 0 ? tag : 'span',
                  element.attributes,
                  styleCallbacks
              );

    if (sanitizedElement) {
        for (let child = element.firstChild; child; child = child.nextSibling) {
            const newChild = isNodeOfType(child, 'ELEMENT_NODE')
                ? sanitizeElement(child, allowedTags, disallowedTags, styleCallbacks)
                : isNodeOfType(child, 'TEXT_NODE')
                ? child.cloneNode()
                : null;

            if (newChild) {
                sanitizedElement?.appendChild(newChild);
            }
        }
    }

    return sanitizedElement;
}

/**
 * @internal
 */
export function createSanitizedElement(
    doc: Document,
    tag: string,
    attributes: NamedNodeMap,
    styleCallbacks?: Record<string, (value: string, tagName: string) => string | null>
): HTMLElement {
    const element = doc.createElement(tag);

    for (let i = 0; i < attributes.length; i++) {
        const attribute = attributes[i];
        const name = attribute.name.toLowerCase().trim();
        const value = attribute.value;

        const newValue =
            name == 'style'
                ? processStyles(tag, value, styleCallbacks)
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

/**
 * @internal
 */
export function removeStyle(): string | null {
    return null;
}

/**
 * @internal
 */
export function removeDisplayFlex(value: string) {
    return value == 'flex' ? null : value;
}

function processStyles(
    tagName: string,
    value: string,
    styleCallbacks?: Record<string, (value: string, tagName: string) => string | null>
) {
    const pairs = value.split(';');
    const result: string[] = [];

    pairs.forEach(pair => {
        const valueIndex = pair.indexOf(':');
        const name = pair.slice(0, valueIndex).trim();
        let value: string | null = pair.slice(valueIndex + 1).trim();

        if (name && value) {
            if (isCssVariable(value)) {
                value = processCssVariable(value);
            }

            const callback = styleCallbacks?.[name];

            if (callback) {
                value = callback(value, tagName);
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
