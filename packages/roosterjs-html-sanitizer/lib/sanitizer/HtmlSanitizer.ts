import cloneObject from '../utils/cloneObject';
import getInheritableStyles from '../utils/getInheritableStyles';
import HtmlSanitizerOptions from '../types/HtmlSanitizerOptions';
import htmlToDom from '../utils/htmlToDom';
import SanitizeHtmlOptions from '../types/SanitizeHtmlOptions';
import {
    StringMap,
    StyleCallbackMap,
    ElementCallbackMap,
    AttributeCallbackMap,
} from '../types/maps';
import {
    getAllowedAttributes,
    getAllowedTags,
    getDefaultStyleValues,
    getStyleCallbacks,
} from '../utils/getAllowedValues';

export default class HtmlSanitizer {
    /**
     * Convert global CSS to inline CSS if any
     * @param html HTML source
     * @param additionalStyleNodes (Optional) additional HTML STYLE elements used as global CSS
     */
    static convertInlineCss(html: string, additionalStyleNodes?: HTMLStyleElement[]) {
        let sanitizer = new HtmlSanitizer({
            additionalGlobalStyleNodes: additionalStyleNodes,
        });
        return sanitizer.exec(html, true /*convertCssOnly*/);
    }

    /**
     * Sanitize HTML string, remove any unuseful HTML node/attribute/CSS.
     * @param html HTML source string
     * @param options Options used for this sanitizing process
     */
    static sanitizeHtml(html: string, options?: SanitizeHtmlOptions) {
        options = options || {};
        let sanitizer = new HtmlSanitizer(options);
        let currentStyles =
            options.currentElementOrStyle instanceof HTMLElement
                ? getInheritableStyles(options.currentElementOrStyle)
                : options.currentElementOrStyle;
        return sanitizer.exec(
            html,
            options.convertCssOnly,
            options.preserveFragmentOnly,
            currentStyles
        );
    }

    private elementCallbacks: ElementCallbackMap;
    private styleCallbacks: StyleCallbackMap;
    private attributeCallbacks: AttributeCallbackMap;
    private allowedTags: string[];
    private allowedAttributes: string[];
    private defaultStyleValues: StringMap;
    private additionalGlobalStyleNodes: HTMLStyleElement[];
    private allowPreserveWhiteSpace: boolean;

    constructor(options?: HtmlSanitizerOptions) {
        options = options || {};
        this.elementCallbacks = cloneObject(options.elementCallbacks);
        this.styleCallbacks = getStyleCallbacks(options.styleCallbacks);
        this.attributeCallbacks = cloneObject(options.attributeCallbacks);
        this.allowedTags = getAllowedTags(options.additionalAllowedTags);
        this.allowedAttributes = getAllowedAttributes(options.additionalAllowAttributes);
        this.defaultStyleValues = getDefaultStyleValues(options.additionalDefaultStyleValues);
        this.additionalGlobalStyleNodes = options.additionalGlobalStyleNodes || [];
        this.allowPreserveWhiteSpace = options.allowPreserveWhiteSpace;
    }

    /**
     * Sanitize HTML string
     * This function will do the following work:
     * 1. Convert global CSS into inline CSS
     * 2. Remove dangerous HTML tags and attributes
     * 3. Remove useless CSS properties
     * @param html The input HTML
     * @param convertInlineCssOnly Whether only convert inline css and skip html content sanitizing
     * @param preserveFragmentOnly If set to true, only preserve the html content between <!--StartFragment--> and <!--Endfragment-->
     * @param currentStyles Current inheritable CSS styles
     */
    exec(
        html: string,
        convertCssOnly?: boolean,
        preserveFragmentOnly?: boolean,
        currentStyles?: StringMap
    ): string {
        let doc = htmlToDom(html, preserveFragmentOnly);
        if (doc) {
            this.convertGlobalCssToInlineCss(doc);
            if (!convertCssOnly) {
                this.sanitize(doc.body, currentStyles);
            }
        }
        return (doc && doc.body && doc.body.innerHTML) || '';
    }

    sanitize(rootNode: HTMLElement, currentStyles?: StringMap) {
        if (!rootNode) {
            return '';
        }
        currentStyles = cloneObject(currentStyles, getInheritableStyles(null));
        this.processNode(rootNode, currentStyles, {});
    }

    convertGlobalCssToInlineCss(rootNode: HTMLDocument) {
        let styleNodes = toArray(rootNode.querySelectorAll('style'));
        let styleSheets = this.additionalGlobalStyleNodes
            .reverse()
            .map(node => node.sheet as CSSStyleSheet)
            .concat(styleNodes.map(node => node.sheet as CSSStyleSheet).reverse());
        for (let styleSheet of styleSheets) {
            for (let j = styleSheet.cssRules.length - 1; j >= 0; j--) {
                // Skip any none-style rule, i.e. @page
                let styleRule = styleSheet.cssRules[j] as CSSStyleRule;
                let text = styleRule && styleRule.style ? styleRule.style.cssText : null;
                if (styleRule.type != CSSRule.STYLE_RULE || !text || !styleRule.selectorText) {
                    continue;
                }
                // Make sure the selector is not empty
                for (let selector of styleRule.selectorText.split(',')) {
                    if (!selector || !selector.trim() || selector.indexOf(':') >= 0) {
                        continue;
                    }
                    let nodes = toArray(rootNode.querySelectorAll(selector));
                    // Always put existing styles after so that they have higher priority
                    // Which means if both global style and inline style apply to the same element,
                    // inline style will have higher priority
                    nodes.forEach(node =>
                        node.setAttribute('style', text + (node.getAttribute('style') || ''))
                    );
                }
            }
        }

        styleNodes.forEach(node => {
            if (node.parentNode) {
                node.parentNode.removeChild(node);
            }
        });
    }

    private processNode(node: Node, currentStyle: StringMap, context: Object) {
        let nodeType = node.nodeType;
        let isElement = nodeType == Node.ELEMENT_NODE;
        let isText = nodeType == Node.TEXT_NODE;
        let element = <HTMLElement>node;
        let tag = isElement ? element.tagName.toUpperCase() : '';

        if (
            (isElement && !this.allowElement(element, tag, context)) ||
            (isText && /^[\r\n]*$/g.test(node.nodeValue)) ||
            (!isElement && !isText)
        ) {
            node.parentNode.removeChild(node);
        } else if (
            isText &&
            !this.allowPreserveWhiteSpace &&
            currentStyle['white-space'] == 'pre'
        ) {
            node.nodeValue = node.nodeValue.replace(/^ /gm, '\u00A0').replace(/ {2}/g, ' \u00A0');
        } else if (isElement) {
            let thisStyle = cloneObject(currentStyle);
            this.processAttributes(element, context);
            this.processCss(element, tag, thisStyle, context);

            let child: Node = element.firstChild;
            let next: Node;
            for (; child; child = next) {
                next = child.nextSibling;
                this.processNode(child, thisStyle, context);
            }
        }
    }

    private processCss(element: HTMLElement, tag: string, thisStyle: StringMap, context: Object) {
        let styleNode = element.getAttributeNode('style');
        if (!styleNode) {
            return;
        }

        let source = styleNode.value.split(';');
        let result = source.filter(style => {
            let pair: string[];

            if (!style || style.trim() == '' || (pair = style.split(':')).length != 2) {
                return false;
            }

            let name = pair[0].trim().toLowerCase();
            let value = pair[1].trim().toLowerCase();
            let callback = this.styleCallbacks[name];
            let isInheritable = thisStyle[name] != undefined;
            let keep =
                (!callback || callback(value, element, context)) &&
                value != 'inherit' &&
                value.indexOf('expression') < 0 &&
                name.substr(0, 1) != '-' &&
                this.defaultStyleValues[name] != value &&
                ((isInheritable && value != thisStyle[name]) ||
                    (!isInheritable && value != 'initial' && value != 'normal'));
            if (keep && isInheritable) {
                thisStyle[name] = value;
            }
            return keep && (this.allowPreserveWhiteSpace || name != 'white-space');
        });

        if (source.length != result.length) {
            if (result.length > 0) {
                element.setAttribute('style', result.map(s => s.trim()).join('; '));
            } else {
                element.removeAttribute('style');
            }
        }
    }

    private processAttributes(element: HTMLElement, context: Object) {
        for (let i = element.attributes.length - 1; i >= 0; i--) {
            let attribute = element.attributes[i];
            let name = attribute.name.toLowerCase().trim();
            let value = attribute.value;
            let callback = this.attributeCallbacks[name];

            if (callback) {
                value = callback(value, element, context);
            } else if (this.allowedAttributes.indexOf(name) < 0) {
                value = null;
            }

            if (
                value === null ||
                value === undefined ||
                value.toLowerCase().indexOf('script:') >= 0
            ) {
                element.removeAttribute(name);
            } else {
                attribute.value = value;
            }
        }
    }

    private allowElement(element: HTMLElement, tag: string, context: Object): boolean {
        let callback = this.elementCallbacks[tag];
        return callback
            ? callback(element, context)
            : this.allowedTags.indexOf(tag) >= 0 || tag.indexOf(':') > 0;
    }
}

function toArray<T extends Node>(list: NodeListOf<T>): T[] {
    return [].slice.call(list) as T[];
}
