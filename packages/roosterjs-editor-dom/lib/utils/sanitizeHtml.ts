import { NodeType } from 'roosterjs-editor-types';
import getTagOfNode from './getTagOfNode';

const HTML_REGEX = /<html[^>]*>[\s\S]*<\/html>/i;

export type SanitizeHtmlPropertyCallback = { [name: string]: (value: string) => string };

/**
 * Sanitize HTML string
 * This function will do the following work:
 * 1. Convert global CSS into inline CSS
 * 2. Remove dangerous HTML tags and attributes
 * 3. Remove useless CSS properties
 * @param html The input HTML
 * @param additionalStyleNodes additional style nodes for inline css converting
 * @param convertInlineCssOnly Whether only convert inline css and skip html content sanitizing
 * @param propertyCallbacks A callback function map to handle HTML properties
 */
export default function sanitizeHtml(
    html: string,
    additionalStyleNodes?: HTMLStyleElement[],
    convertInlineCssOnly?: boolean,
    propertyCallbacks?: SanitizeHtmlPropertyCallback
): string {
    let parser = new DOMParser();
    let matches = HTML_REGEX.exec(html);
    html = matches ? matches[0] : html;
    let doc: Document;

    if (
        !html ||
        !html.trim() ||
        !(doc = parser.parseFromString(html, 'text/html')) ||
        !doc.body ||
        !doc.body.firstChild
    ) {
        return '';
    }

    // 1. Convert global CSS into inline CSS
    applyInlineStyle(doc, additionalStyleNodes);

    // 2, 3: Remove dangerous HTML tags and attributes, remove useless CSS properties
    if (!convertInlineCssOnly) {
        let callbackPropertyNames = (propertyCallbacks ? Object.keys(propertyCallbacks) : []).map(
            name => name.toLowerCase()
        );
        removeUnusedCssAndDangerousContent(doc.body, callbackPropertyNames, propertyCallbacks);
    }

    return doc.body.innerHTML;
}

// Inheritable CSS properties
// Ref: https://www.w3.org/TR/CSS21/propidx.html
const INHERITABLE_PROPERTOES = [
    'azimuth',
    'border-collapse',
    'border-spacing',
    'caption-side',
    'color',
    'cursor',
    'direction',
    'elevation',
    'empty-cells',
    'font-family',
    'font-size',
    'font-style',
    'font-variant',
    'font-weight',
    'font',
    'letter-spacing',
    'line-height',
    'list-style-image',
    'list-style-position',
    'list-style-type',
    'list-style',
    'orphans',
    'pitch-range',
    'pitch',
    'quotes',
    'richness',
    'speak-header',
    'speak-numeral',
    'speak-punctuation',
    'speak',
    'speech-rate',
    'stress',
    'text-align',
    'text-indent',
    'text-transform',
    'visibility',
    'voice-family',
    'volume',
    'white-space',
    'widows',
    'word-spacing',
];

const ALLOWED_HTML_TAGS = [
    'BODY',
    'H1',
    'H2',
    'H3',
    'H4',
    'H5',
    'H6',
    'FORM',
    'P',
    'BR',
    'HR',
    'ACRONYM',
    'ABBR',
    'ADDRESS',
    'B',
    'BDI',
    'BDO',
    'BIG',
    'BLOCKQUOTE',
    'CENTER',
    'CITE',
    'CODE',
    'DEL',
    'DFN',
    'EM',
    'FONT',
    'I',
    'INS',
    'KBD',
    'MARK',
    'METER',
    'PRE',
    'PROGRESS',
    'Q',
    'RP',
    'RT',
    'RUBY',
    'S',
    'SAMP',
    'SMALL',
    'STRIKE',
    'STRONG',
    'SUB',
    'SUP',
    'TEMPLATE',
    'TIME',
    'TT',
    'U',
    'VAR',
    'WBR',
    'XMP',
    'INPUT',
    'TEXTAREA',
    'BUTTON',
    'SELECT',
    'OPTGROUP',
    'OPTION',
    'LABEL',
    'FIELDSET',
    'LEGEND',
    'DATALIST',
    'OUTPUT',
    'IMG',
    'MAP',
    'AREA',
    'CANVAS',
    'FIGCAPTION',
    'FIGURE',
    'PICTURE',
    'A',
    'NAV',
    'UL',
    'OL',
    'LI',
    'DIR',
    'UL',
    'DL',
    'DT',
    'DD',
    'MENU',
    'MENUITEM',
    'TABLE',
    'CAPTION',
    'TH',
    'TR',
    'TD',
    'THEAD',
    'TBODY',
    'TFOOT',
    'COL',
    'COLGROUP',
    'DIV',
    'SPAN',
    'HEADER',
    'FOOTER',
    'MAIN',
    'SECTION',
    'ARTICLE',
    'ASIDE',
    'DETAILS',
    'DIALOG',
    'SUMMARY',
    'DATA',
];

const ALLOWED_HTML_ATTRIBUTES = [
    'accept',
    'align',
    'alt',
    'checked',
    'cite',
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
    'value',
    'width',
    'wrap',
];

function applyInlineStyle(doc: Document, additionalStyleNodes: HTMLStyleElement[]) {
    let styleNodes = toArray(doc.querySelectorAll('style'));
    let styleSheets = (additionalStyleNodes || [])
        .reverse()
        .map(node => node.sheet as CSSStyleSheet)
        .concat(styleNodes.map(node => node.sheet as CSSStyleSheet).reverse());
    for (let styleSheet of styleSheets) {
        for (let j = styleSheet.cssRules.length - 1; j >= 0; j--) {
            // Skip any none-style rule, i.e. @page
            let styleRule = styleSheet.cssRules[j] as CSSStyleRule;
            let text = styleRule.style.cssText;
            if (styleRule.type != CSSRule.STYLE_RULE || !text || !styleRule.selectorText) {
                continue;
            }
            // Make sure the selector is not empty
            for (let selector of styleRule.selectorText.split(',')) {
                if (!selector || !selector.trim() || selector.indexOf(':') >= 0) {
                    continue;
                }
                let nodes = toArray(doc.querySelectorAll(selector));
                // Always put existing styles after so that they have higher priority
                // Which means if both global style and inline style apply to the same element,
                // inline style will have higher priority
                nodes.forEach(node =>
                    node.setAttribute('style', text + (node.getAttribute('style') || ''))
                );
            }
        }
    }
}

function removeUnusedCssAndDangerousContent(
    node: Node,
    callbackPropertyNames: string[],
    propertyCallbacks: SanitizeHtmlPropertyCallback,
    currentStyle: { [name: string]: string } = {}
) {
    let thisStyle = Object.assign ? Object.assign({}, currentStyle) : {};
    let nodeType = node.nodeType;
    let tag = getTagOfNode(node) || '';
    let isElement = nodeType == NodeType.Element;
    let isText = nodeType == NodeType.Text;

    if (
        (isElement && ALLOWED_HTML_TAGS.indexOf(tag) < 0 && tag.indexOf(':') < 0) ||
        (isText &&  /^[\r\n]*$/g.test(node.nodeValue)) ||
        (!isElement && !isText)
    ) {
        node.parentNode.removeChild(node);
    } else if (nodeType == NodeType.Element) {
        let element = <HTMLElement>node;
        if (element.hasAttribute('style')) {
            removeUnusedCss(element, thisStyle);
        }

        removeDisallowedAttributes(element, callbackPropertyNames, propertyCallbacks);

        let child = element.firstChild;
        let next: Node;
        for (; child; child = next) {
            next = child.nextSibling;
            removeUnusedCssAndDangerousContent(
                child,
                callbackPropertyNames,
                propertyCallbacks,
                thisStyle
            );
        }
    }
}

function removeUnusedCss(element: HTMLElement, thisStyle: { [name: string]: string }) {
    let source = element
        .getAttribute('style')
        .split(';')
        .filter(style => style && style.trim() != '');
    let result = source.filter(style => {
        let pair = style.split(':');
        if (pair.length == 2) {
            let name = pair[0].trim().toLowerCase();
            let value = pair[1].trim().toLowerCase();
            let isInheritable = INHERITABLE_PROPERTOES.indexOf(name) >= 0;
            let keep =
                value != 'inherit' &&
                (value != thisStyle[name] || !isInheritable) &&
                !isDangerousCss(name, value);
            if (keep && isInheritable) {
                thisStyle[name] = value;
            }
            return keep;
        } else {
            return false;
        }
    });
    if (source.length != result.length) {
        if (result.length > 0) {
            element.setAttribute('style', result.join(';'));
        } else {
            element.removeAttribute('style');
        }
    }
}

function isDangerousCss(name: string, value: string) {
    if (name == 'position') {
        return true;
    }

    if (value.indexOf('expression') >= 0) {
        return true;
    }

    return false;
}

function removeDisallowedAttributes(
    element: HTMLElement,
    callbackPropertyNames: string[],
    propertyCallbacks: SanitizeHtmlPropertyCallback
) {
    for (let i = element.attributes.length - 1; i >= 0; i--) {
        let attribute = element.attributes[i];
        let name = attribute.name.toLowerCase().trim();
        let value = attribute.value.trim();
        if (callbackPropertyNames.indexOf(name) >= 0) {
            value = propertyCallbacks[name](value);
            if (value != null) {
                attribute.value = value;
            } else {
                element.removeAttribute(name);
            }
        } else if (ALLOWED_HTML_ATTRIBUTES.indexOf(name) < 0 || value.toLowerCase().indexOf('script:') >= 0) {
            element.removeAttribute(attribute.name);
        }
    }
}

function toArray<T extends Node>(list: NodeListOf<T>): T[] {
    return [].slice.call(list) as T[];
}
