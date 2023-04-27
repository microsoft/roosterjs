import getObjectKeys from '../jsUtils/getObjectKeys';
import { cloneObject } from './cloneObject';
import { CssStyleCallbackMap, StringMap } from 'roosterjs-editor-types';

const HTML_TAG_REPLACEMENT: Record<string, string | null> = {
    // Allowed tags
    a: '*',
    abbr: '*',
    address: '*',
    area: '*',
    article: '*',
    aside: '*',
    b: '*',
    bdi: '*',
    bdo: '*',
    blockquote: '*',
    body: '*',
    br: '*',
    button: '*',
    canvas: '*',
    caption: '*',
    center: '*',
    cite: '*',
    code: '*',
    col: '*',
    colgroup: '*',
    data: '*',
    datalist: '*',
    dd: '*',
    del: '*',
    details: '*',
    dfn: '*',
    dialog: '*',
    dir: '*',
    div: '*',
    dl: '*',
    dt: '*',
    em: '*',
    fieldset: '*',
    figcaption: '*',
    figure: '*',
    font: '*',
    footer: '*',
    h1: '*',
    h2: '*',
    h3: '*',
    h4: '*',
    h5: '*',
    h6: '*',
    head: '*',
    header: '*',
    hgroup: '*',
    hr: '*',
    html: '*',
    i: '*',
    img: '*',
    input: '*',
    ins: '*',
    kbd: '*',
    label: '*',
    legend: '*',
    li: '*',
    main: '*',
    map: '*',
    mark: '*',
    menu: '*',
    menuitem: '*',
    meter: '*',
    nav: '*',
    ol: '*',
    optgroup: '*',
    option: '*',
    output: '*',
    p: '*',
    picture: '*',
    pre: '*',
    progress: '*',
    q: '*',
    rp: '*',
    rt: '*',
    ruby: '*',
    s: '*',
    samp: '*',
    section: '*',
    select: '*',
    small: '*',
    span: '*',
    strike: '*',
    strong: '*',
    sub: '*',
    summary: '*',
    sup: '*',
    table: '*',
    tbody: '*',
    td: '*',
    textarea: '*',
    tfoot: '*',
    th: '*',
    thead: '*',
    time: '*',
    tr: '*',
    tt: '*',
    u: '*',
    ul: '*',
    var: '*',
    wbr: '*',
    xmp: '*',

    // Replaced tags:
    form: 'SPAN',

    // Disallowed tags
    applet: null,
    audio: null,
    base: null,
    basefont: null,
    embed: null,
    frame: null,
    frameset: null,
    iframe: null,
    link: null,
    meta: null,
    noscript: null,
    object: null,
    param: null,
    script: null,
    slot: null,
    source: null,
    style: null,
    template: null,
    title: null,
    track: null,
    video: null,
};

const ALLOWED_HTML_ATTRIBUTES = (
    'accept,align,alt,checked,cite,color,cols,colspan,contextmenu,' +
    'coords,datetime,default,dir,dirname,disabled,download,face,headers,height,hidden,high,href,' +
    'hreflang,ismap,kind,label,lang,list,low,max,maxlength,media,min,multiple,open,optimum,pattern,' +
    'placeholder,readonly,rel,required,reversed,rows,rowspan,scope,selected,shape,size,sizes,span,' +
    'spellcheck,src,srclang,srcset,start,step,style,tabindex,target,title,translate,type,usemap,valign,value,' +
    'width,wrap'
).split(',');

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

// This is to preserve entity related CSS classes when paste.
const ALLOWED_CSS_CLASSES: string[] = [];

/**
 * @internal
 */
export function getTagReplacement(
    additionalReplacements: Record<string, string | null> | undefined
): Record<string, string | null> {
    const result = { ...HTML_TAG_REPLACEMENT };
    const replacements = additionalReplacements || {};
    getObjectKeys(replacements).forEach(key => {
        if (key) {
            result[key.toLowerCase()] = replacements[key];
        }
    });

    return result;
}

/**
 * @internal
 */
export function getAllowedAttributes(additionalAttributes: string[] | undefined): string[] {
    return unique(ALLOWED_HTML_ATTRIBUTES.concat(additionalAttributes || [])).map(attr =>
        attr.toLocaleLowerCase()
    );
}

/**
 * @internal
 */
export function getAllowedCssClassesRegex(
    additionalCssClasses: string[] | undefined
): RegExp | null {
    const patterns = ALLOWED_CSS_CLASSES.concat(additionalCssClasses || []);
    return patterns.length > 0 ? new RegExp(patterns.join('|')) : null;
}

/**
 * @internal
 */
export function getDefaultStyleValues(additionalDefaultStyles: StringMap | undefined): StringMap {
    let result = cloneObject(DEFAULT_STYLE_VALUES);
    if (additionalDefaultStyles) {
        Object.keys(additionalDefaultStyles).forEach(name => {
            let value = additionalDefaultStyles[name];
            if (value !== null && value !== undefined) {
                result[name] = value;
            } else {
                delete result[name];
            }
        });
    }

    return result;
}

/**
 * @internal
 */
export function getStyleCallbacks(
    callbacks: CssStyleCallbackMap | null | undefined
): CssStyleCallbackMap {
    let result = cloneObject(callbacks);
    result.position = result.position || removeValue;
    result.width = result.width || removeWidthForLiAndDiv;
    return result;
}

function removeValue(): null {
    return null;
}

function removeWidthForLiAndDiv(value: string, element: HTMLElement) {
    let tag = element.tagName;
    return !(tag == 'LI' || tag == 'DIV');
}

function unique<T>(array: T[]): T[] {
    return array.filter((value, index, self) => self.indexOf(value) == index);
}
