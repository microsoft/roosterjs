import getInheritableStyles from './getInheritableStyles';
import htmlToDom from './htmlToDom';
import isHTMLElement from '../typeUtils/isHTMLElement';
import { cloneObject } from './cloneObject';
import {
    getAllowedTags,
    getAllowedAttributes,
    getDefaultStyleValues,
    getStyleCallbacks,
    getAllowedCssClassesRegex,
} from './getAllowedValues';
import {
    HtmlSanitizerOptions,
    SanitizeHtmlOptions,
    StringMap,
    StyleCallbackMap,
    ElementCallbackMap,
    AttributeCallbackMap,
    NodeType,
} from 'roosterjs-editor-types';

/**
 * HTML sanitizer class provides two featuers:
 * 1. Convert global CSS to inline CSS
 * 2. Sanitize an HTML document, remove unnecessary/dangerous attribute/nodes
 */
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
        let currentStyles = isHTMLElement(options.currentElementOrStyle)
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
    private allowedCssClassesRegex: RegExp;
    private defaultStyleValues: StringMap;
    private additionalGlobalStyleNodes: HTMLStyleElement[];
    private allowPreserveWhiteSpace: boolean;

    /**
     * Construct a new instance of HtmlSanitizer
     * @param options Options for HtmlSanitizer
     */
    constructor(options?: HtmlSanitizerOptions) {
        options = options || {};
        this.elementCallbacks = cloneObject(options.elementCallbacks);
        this.styleCallbacks = getStyleCallbacks(options.styleCallbacks);
        this.attributeCallbacks = cloneObject(options.attributeCallbacks);
        this.allowedTags = getAllowedTags(options.additionalAllowedTags);
        this.allowedAttributes = getAllowedAttributes(options.additionalAllowAttributes);
        this.allowedCssClassesRegex = getAllowedCssClassesRegex(
            options.additionalAllowedCssClasses
        );
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
     * @param preserveFragmentOnly If set to true, only preserve the html content between &lt;!--StartFragment--&gt; and &lt;!--Endfragment--&gt;
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

    /**
     * Sanitize an HTML element, remove unnecessary or dangerous elements/attribute/CSS rules
     * @param rootNode Root node to sanitize
     * @param currentStyles Current CSS styles. Inheritable styles in the given node which has
     * the same value with current styles will be ignored.
     */
    sanitize(rootNode: Node, currentStyles?: StringMap) {
        if (!rootNode) {
            return '';
        }
        currentStyles = cloneObject(currentStyles, getInheritableStyles(null));
        this.processNode(rootNode, currentStyles, {});
    }

    /**
     * Convert global CSS into inline CSS
     * @param rootNode The HTML Document
     */
    convertGlobalCssToInlineCss(rootNode: ParentNode) {
        let styleNodes = toArray(rootNode.querySelectorAll('style'));
        let styleSheets = this.additionalGlobalStyleNodes
            .reverse()
            .map(node => node.sheet as CSSStyleSheet)
            .concat(styleNodes.map(node => node.sheet as CSSStyleSheet).reverse())
            .filter(sheet => sheet);
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
        const nodeType = node.nodeType;
        const isElement = nodeType == NodeType.Element;
        const isText = nodeType == NodeType.Text;
        const isFragment = nodeType == NodeType.DocumentFragment;

        let element = <HTMLElement>node;
        let tag = isElement ? element.tagName.toUpperCase() : '';

        if (
            (isElement && !this.allowElement(element, tag, context)) ||
            (isText && /^[\r\n]*$/g.test(node.nodeValue) && !currentStyle.insidePRE) ||
            (!isElement && !isText && !isFragment)
        ) {
            node.parentNode.removeChild(node);
        } else if (
            isText &&
            !this.allowPreserveWhiteSpace &&
            currentStyle['white-space'] == 'pre'
        ) {
            node.nodeValue = node.nodeValue.replace(/^ /gm, '\u00A0').replace(/ {2}/g, ' \u00A0');
        } else if (isElement || isFragment) {
            let thisStyle = cloneObject(currentStyle);
            if (isElement) {
                this.processAttributes(element, context);
                this.processCss(element, tag, thisStyle, context);

                // Special handling for PRE tag, need to preserve \r\n inside PRE
                if (tag == 'PRE') {
                    thisStyle.insidePRE = 'true';
                }
            }

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

            let newValue = callback
                ? callback(value, element, context)
                : this.allowedAttributes.indexOf(name) >= 0 || name.indexOf('data-') == 0
                ? value
                : null;

            if (name == 'class' && this.allowedCssClassesRegex) {
                newValue = this.processCssClass(value, newValue);
            }

            if (
                newValue === null ||
                newValue === undefined ||
                newValue.match(/s\n*c\n*r\n*i\n*p\n*t\n*:/i) // match script: with any NewLine inside. Browser will ignore those NewLine char and still treat it as script prefix
            ) {
                element.removeAttribute(name);
            } else {
                attribute.value = newValue;
            }
        }
    }

    private processCssClass(originalValue: string, calculatedValue: string): string {
        const originalClasses = originalValue ? originalValue.split(' ') : [];
        const calculatedClasses = calculatedValue ? calculatedValue.split(' ') : [];

        originalClasses.forEach(className => {
            if (
                this.allowedCssClassesRegex.test(className) &&
                calculatedClasses.indexOf(className) < 0
            ) {
                calculatedClasses.push(className);
            }
        });

        return calculatedClasses.length > 0 ? calculatedClasses.join(' ') : null;
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
