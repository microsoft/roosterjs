import changeElementTag from '../utils/changeElementTag';
import getInheritableStyles from './getInheritableStyles';
import getObjectKeys from '../jsUtils/getObjectKeys';
import getPredefinedCssForElement from './getPredefinedCssForElement';
import getStyles from '../style/getStyles';
import getTagOfNode from '../utils/getTagOfNode';
import safeInstanceOf from '../utils/safeInstanceOf';
import setStyles from '../style/setStyles';
import toArray from '../jsUtils/toArray';
import { cloneObject } from './cloneObject';
import { isCssVariable, processCssVariable } from './processCssVariable';
import {
    getAllowedAttributes,
    getAllowedCssClassesRegex,
    getTagReplacement,
    getDefaultStyleValues,
    getStyleCallbacks,
} from './getAllowedValues';
import {
    AttributeCallbackMap,
    CssStyleCallbackMap,
    ElementCallbackMap,
    HtmlSanitizerOptions,
    NodeType,
    PredefinedCssMap,
    SanitizeHtmlOptions,
    StringMap,
} from 'roosterjs-editor-types';

/**
 * HTML sanitizer class provides two features:
 * 1. Convert global CSS to inline CSS
 * 2. Sanitize an HTML document, remove unnecessary/dangerous attribute/nodes
 */
export default class HtmlSanitizer {
    /**
     * @deprecated Use new HtmlSanitizer().convertGlobalCssToInlineCss() instead
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
     * @deprecated Use new HtmlSanitizer().sanitize() instead
     * Sanitize HTML string, remove any unused HTML node/attribute/CSS.
     * @param html HTML source string
     * @param options Options used for this sanitizing process
     */
    static sanitizeHtml(html: string, options?: SanitizeHtmlOptions) {
        options = options || {};
        let sanitizer = new HtmlSanitizer(options);
        let currentStyles = safeInstanceOf(options.currentElementOrStyle, 'HTMLElement')
            ? getInheritableStyles(options.currentElementOrStyle)
            : options.currentElementOrStyle;
        return sanitizer.exec(html, options.convertCssOnly, currentStyles);
    }

    private elementCallbacks: ElementCallbackMap;
    private styleCallbacks: CssStyleCallbackMap;
    private attributeCallbacks: AttributeCallbackMap;
    private tagReplacements: Record<string, string | null>;
    private allowedAttributes: string[];
    private allowedCssClassesRegex: RegExp | null;
    private defaultStyleValues: StringMap;
    private additionalPredefinedCssForElement: PredefinedCssMap | null;
    private additionalGlobalStyleNodes: HTMLStyleElement[];
    private preserveHtmlComments: boolean;
    private unknownTagReplacement: string | null;

    /**
     * Construct a new instance of HtmlSanitizer
     * @param options Options for HtmlSanitizer
     */
    constructor(options?: HtmlSanitizerOptions) {
        options = options || {};
        this.elementCallbacks = cloneObject(options.elementCallbacks);
        this.styleCallbacks = getStyleCallbacks(options.cssStyleCallbacks);
        this.attributeCallbacks = cloneObject(options.attributeCallbacks);
        this.tagReplacements = getTagReplacement(options.additionalTagReplacements);
        this.allowedAttributes = getAllowedAttributes(options.additionalAllowedAttributes);
        this.allowedCssClassesRegex = getAllowedCssClassesRegex(
            options.additionalAllowedCssClasses
        );
        this.defaultStyleValues = getDefaultStyleValues(options.additionalDefaultStyleValues);
        this.additionalPredefinedCssForElement = options.additionalPredefinedCssForElement || null;
        this.additionalGlobalStyleNodes = options.additionalGlobalStyleNodes || [];
        this.preserveHtmlComments = options.preserveHtmlComments || false;
        this.unknownTagReplacement = options.unknownTagReplacement || null;
    }

    /**
     * @deprecated Use HtmlSanitizer.convertGlobalCssToInlineCss() and HtmlSanitizer.sanitize() instead
     * Sanitize HTML string
     * This function will do the following work:
     * 1. Convert global CSS into inline CSS
     * 2. Remove dangerous HTML tags and attributes
     * 3. Remove useless CSS properties
     * @param html The input HTML
     * @param convertInlineCssOnly Whether only convert inline css and skip html content sanitizing
     * @param currentStyles Current inheritable CSS styles
     */
    exec(html: string, convertCssOnly?: boolean, currentStyles?: StringMap): string {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html || '', 'text/html');

        if (doc && doc.body && doc.body.firstChild) {
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
        const isComment = nodeType == NodeType.Comment;

        let shouldKeep = false;

        if (isElement) {
            const tag = getTagOfNode(node);
            const callback = this.elementCallbacks[tag];
            let replacement: string | null | undefined = this.tagReplacements[tag.toLowerCase()];

            if (replacement === undefined) {
                replacement = this.unknownTagReplacement;
            }

            if (callback) {
                shouldKeep = callback(node as HTMLElement, context);
            } else if (tag.indexOf(':') > 0) {
                shouldKeep = true;
            } else if (tag == replacement || replacement == '*') {
                shouldKeep = true;
            } else if (replacement && /^[a-zA-Z][\w\-]*$/.test(replacement)) {
                node = changeElementTag(node as HTMLElement, replacement)!;
                shouldKeep = true;
            }
        } else if (isText) {
            const whiteSpace = currentStyle['white-space'];
            shouldKeep =
                whiteSpace == 'pre' ||
                whiteSpace == 'pre-line' ||
                whiteSpace == 'pre-wrap' ||
                !/^[\r\n]*$/g.test(node.nodeValue || '');
        } else if (isFragment) {
            shouldKeep = true;
        } else if (isComment) {
            shouldKeep = this.preserveHtmlComments;
        } else {
            shouldKeep = false;
        }

        if (!shouldKeep) {
            node.parentNode?.removeChild(node);
        } else if (
            isText &&
            (currentStyle['white-space'] == 'pre' || currentStyle['white-space'] == 'pre-wrap')
        ) {
            node.nodeValue = (node.nodeValue || '')
                .replace(/^ /gm, '\u00A0')
                .replace(/ {2}/g, ' \u00A0');
        } else if (isElement || isFragment) {
            let thisStyle = cloneObject(currentStyle);
            let element = <HTMLElement>node;
            if (isElement) {
                this.processAttributes(element, context);
                this.preprocessCss(element, thisStyle);
                this.processCss(element, thisStyle, context);
            }

            let child: Node | null = element.firstChild;
            let next: Node | null;
            for (; child; child = next) {
                next = child.nextSibling;
                this.processNode(child, thisStyle, context);
            }
        }
    }

    private preprocessCss(element: HTMLElement, thisStyle: StringMap) {
        const predefinedStyles = getPredefinedCssForElement(
            element,
            this.additionalPredefinedCssForElement
        );
        if (predefinedStyles) {
            getObjectKeys(predefinedStyles).forEach(name => {
                thisStyle[name] = predefinedStyles[name];
            });
        }
    }

    private processCss(element: HTMLElement, thisStyle: StringMap, context: Object) {
        const styles = getStyles(element);
        getObjectKeys(styles).forEach(name => {
            let value = styles[name];
            let callback = this.styleCallbacks[name];
            let isInheritable = thisStyle[name] != undefined;
            let keep = true;

            if (keep && !!callback) {
                keep = callback(value, element, thisStyle, context);
            }

            if (keep && isCssVariable(value)) {
                value = processCssVariable(value);
                keep = !!value;
            }

            keep =
                keep &&
                value != 'inherit' &&
                value.indexOf('expression') < 0 &&
                name.substr(0, 1) != '-' &&
                this.defaultStyleValues[name] != value &&
                ((isInheritable && value != thisStyle[name]) ||
                    (!isInheritable && value != 'initial' && value != 'normal'));
            if (keep && isInheritable) {
                thisStyle[name] = value;
            }

            if (keep) {
                styles[name] = value;
            } else {
                delete styles[name];
            }
        });

        setStyles(element, styles);
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

    private processCssClass(originalValue: string, calculatedValue: string | null): string | null {
        const originalClasses = originalValue ? originalValue.split(' ') : [];
        const calculatedClasses = calculatedValue ? calculatedValue.split(' ') : [];

        originalClasses.forEach(className => {
            if (
                this.allowedCssClassesRegex?.test(className) &&
                calculatedClasses.indexOf(className) < 0
            ) {
                calculatedClasses.push(className);
            }
        });

        return calculatedClasses?.length > 0 ? calculatedClasses.join(' ') : null;
    }
}
