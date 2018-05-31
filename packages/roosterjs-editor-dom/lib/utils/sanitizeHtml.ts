import { NodeType } from 'roosterjs-editor-types';
import getTagOfNode from './getTagOfNode';

const HTML_REGEX = /<html[^>]*>[\s\S]*<\/html>/i;
const START_FRAGMENT = '<!--StartFragment-->';
const END_FRAGMENT = '<!--EndFragment-->';
const LAST_TD_END_REGEX = /<\/\s*td\s*>((?!<\/\s*tr\s*>)[\s\S])*$/i;
const LAST_TR_END_REGEX = /<\/\s*tr\s*>((?!<\/\s*table\s*>)[\s\S])*$/i;
const LAST_TR_REGEX = /<tr[^>]*>[^<]*/i;
const LAST_TABLE_REGEX = /<table[^>]*>[^<]*/i;

/**
 * Callback function set for sanitizeHtml().
 * sanitizeHtml() will check if there is a callback function for a given property name,
 * it will call this function to decide what value to set for this property.
 * Return null will cause this property be deleted, otherwise return the value of the property
 */
export type SanitizeHtmlPropertyCallback = { [name: string]: (value: string) => string };

/**
 * A map from CSS style name to its value
 */
export type StyleMap = { [name: string]: string };

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
 * @param preserveFragmentOnly If set to true, only preserve the html content between <!--StartFragment--> and <!--Endfragment-->
 */
export default function sanitizeHtml(
    html: string,
    additionalStyleNodes?: HTMLStyleElement[],
    convertInlineCssOnly?: boolean,
    propertyCallbacks?: SanitizeHtmlPropertyCallback,
    preserveFragmentOnly?: boolean,
    currentStyle?: StyleMap
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

    // 1. Filter out html code outside of Fragment tags if need
    if (preserveFragmentOnly) {
        html = trimWithFragment(html);
        doc.body.innerHTML = html;
    }

    // 2. Convert global CSS into inline CSS
    convertInlineCss(doc, additionalStyleNodes);

    // 3, 4: Remove dangerous HTML tags and attributes, remove useless CSS properties
    if (!convertInlineCssOnly) {
        let callbackPropertyNames = (propertyCallbacks ? Object.keys(propertyCallbacks) : []).map(
            name => name.toLowerCase()
        );
        removeUnusedCssAndDangerousContent(
            doc.body,
            callbackPropertyNames,
            propertyCallbacks,
            currentStyle || {}
        );
    }

    return doc.body.innerHTML;
}

const ALLOWED_HTML_TAGS = 'BODY,H1,H2,H3,H4,H5,H6,FORM,P,BR,NOBR,HR,ACRONYM,ABBR,ADDRESS,B,BDI,BDO,BIG,BLOCKQUOTE,CENTER,CITE,CODE,DEL,DFN,EM,FONT,I,INS,KBD,MARK,METER,PRE,PROGRESS,Q,RP,RT,RUBY,S,SAMP,SMALL,STRIKE,STRONG,SUB,SUP,TEMPLATE,TIME,TT,U,VAR,WBR,XMP,INPUT,TEXTAREA,BUTTON,SELECT,OPTGROUP,OPTION,LABEL,FIELDSET,LEGEND,DATALIST,OUTPUT,IMG,MAP,AREA,CANVAS,FIGCAPTION,FIGURE,PICTURE,A,NAV,UL,OL,LI,DIR,UL,DL,DT,DD,MENU,MENUITEM,TABLE,CAPTION,TH,TR,TD,THEAD,TBODY,TFOOT,COL,COLGROUP,DIV,SPAN,HEADER,FOOTER,MAIN,SECTION,ARTICLE,ASIDE,DETAILS,DIALOG,SUMMARY,DATA'.split(
    ','
);
const ALLOWED_HTML_ATTRIBUTES = 'accept,align,alt,checked,cite,color,cols,colspan,contextmenu,coords,datetime,default,dir,dirname,disabled,download,face,headers,height,hidden,high,href,hreflang,ismap,kind,label,lang,list,low,max,maxlength,media,min,multiple,open,optimum,pattern,placeholder,readonly,rel,required,reversed,rows,rowspan,scope,selected,shape,size,sizes,span,spellcheck,src,srclang,srcset,start,step,style,tabindex,target,title,translate,type,usemap,value,width,wrap'.split(
    ','
);
const DROPPED_STYLE = ['white-space'];

const DEFAULT_STYLE_VALUES: { [name: string]: string } = {
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
    'text-decoration': 'none',
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
};

function convertInlineCss(doc: Document, additionalStyleNodes: HTMLStyleElement[]) {
    let styleNodes = toArray(doc.querySelectorAll('style'));
    let styleSheets = (additionalStyleNodes || [])
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

type ObjectForAssign<T> = { [key: string]: T };

function nativeAssign<T>(source: ObjectForAssign<T>): ObjectForAssign<T> {
    return Object.assign({}, source);
}

function customAssign<T>(source: ObjectForAssign<T>): ObjectForAssign<T> {
    let result: ObjectForAssign<T> = {};
    for (let key of Object.keys(source)) {
        result[key] = source[key];
    }
    return result;
}

const assign = Object.assign ? nativeAssign : customAssign;

function removeUnusedCssAndDangerousContent(
    node: Node,
    callbackPropertyNames: string[],
    propertyCallbacks: SanitizeHtmlPropertyCallback,
    currentStyle: StyleMap
) {
    let thisStyle = assign(currentStyle);
    let nodeType = node.nodeType;
    let tag = getTagOfNode(node) || '';
    let isElement = nodeType == NodeType.Element;
    let isText = nodeType == NodeType.Text;

    if (
        (isElement && ALLOWED_HTML_TAGS.indexOf(tag) < 0 && tag.indexOf(':') < 0) ||
        (isText && /^[\r\n]*$/g.test(node.nodeValue)) ||
        (!isElement && !isText)
    ) {
        node.parentNode.removeChild(node);
    }
    if (isText && currentStyle['white-space'] == 'pre') {
        let text = node.nodeValue;
        let nbsp = '\u00A0';
        text = text.replace(/^ /gm, nbsp);
        text = text.replace(/ {2}/g, ' ' + nbsp);
        node.nodeValue = text;
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

function removeUnusedCss(element: HTMLElement, thisStyle: StyleMap) {
    let tag = getTagOfNode(element);
    let source = element
        .getAttribute('style')
        .split(';')
        .filter(style => style && style.trim() != '');
    let result = source.filter(style => {
        let pair = style.split(':');
        if (pair.length == 2) {
            let name = pair[0].trim().toLowerCase();
            let value = pair[1].trim().toLowerCase();
            let isInheritable = thisStyle[name] != undefined;
            let keep =
                value != 'inherit' &&
                name.substr(0, 1) != '-' &&
                DEFAULT_STYLE_VALUES[name] != value &&
                ((isInheritable && value != thisStyle[name]) ||
                    (!isInheritable && value != 'initial' && value != 'normal')) &&
                !shouldRemove(tag, name, value);
            if (keep && isInheritable) {
                thisStyle[name] = value;
            }
            return keep && DROPPED_STYLE.indexOf(name) < 0;
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

function shouldRemove(tag: string, name: string, value: string) {
    if (name == 'position') {
        return true;
    }

    if (value.indexOf('expression') >= 0) {
        return true;
    }

    if (['LI', 'DIV'].indexOf(tag) >= 0 && name == 'width') {
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
        } else if (
            ALLOWED_HTML_ATTRIBUTES.indexOf(name) < 0 ||
            value.toLowerCase().indexOf('script:') >= 0
        ) {
            element.removeAttribute(attribute.name);
        }
    }
}

function toArray<T extends Node>(list: NodeListOf<T>): T[] {
    return [].slice.call(list) as T[];
}

function trimWithFragment(html: string): string {
    let startIndex = html.indexOf(START_FRAGMENT);
    let endIndex = html.lastIndexOf(END_FRAGMENT);
    if (startIndex >= 0 && endIndex >= 0 && endIndex >= startIndex + START_FRAGMENT.length) {
        let before = html.substr(0, startIndex);
        html = html.substring(startIndex + START_FRAGMENT.length, endIndex);

        // Fix up table for Excel
        if (html.match(LAST_TD_END_REGEX)) {
            let trMatch = before.match(LAST_TR_REGEX);
            let tr = trMatch ? trMatch[0] : '<TR>';
            html = tr + html + '</TR>';
        }
        if (html.match(LAST_TR_END_REGEX)) {
            let tableMatch = before.match(LAST_TABLE_REGEX);
            let table = tableMatch ? tableMatch[0] : '<TABLE>';
            html = table + html + '</TABLE>';
        }
    }

    return html;
}
