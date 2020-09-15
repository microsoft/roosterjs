import { cloneObject } from './cloneObject';
import { PredefinedCssMap, StringMap, StyleCallbackMap } from 'roosterjs-editor-types';

const ALLOWED_HTML_TAG_MAP = {
    // Allowed tags
    a: true,
    abbr: true,
    address: true,
    area: true,
    article: true,
    aside: true,
    b: true,
    bdi: true,
    bdo: true,
    blockquote: true,
    body: true,
    br: true,
    button: true,
    canvas: true,
    caption: true,
    center: true,
    cite: true,
    code: true,
    col: true,
    colgroup: true,
    data: true,
    datalist: true,
    dd: true,
    del: true,
    details: true,
    dfn: true,
    dialog: true,
    dir: true,
    div: true,
    dl: true,
    dt: true,
    em: true,
    fieldset: true,
    figcaption: true,
    figure: true,
    font: true,
    footer: true,
    form: true,
    h1: true,
    h2: true,
    h3: true,
    h4: true,
    h5: true,
    h6: true,
    head: true,
    header: true,
    hgroup: true,
    hr: true,
    html: true,
    i: true,
    img: true,
    input: true,
    ins: true,
    kbd: true,
    label: true,
    legend: true,
    li: true,
    main: true,
    map: true,
    mark: true,
    menu: true,
    menuitem: true,
    meter: true,
    nav: true,
    ol: true,
    optgroup: true,
    option: true,
    output: true,
    p: true,
    picture: true,
    pre: true,
    progress: true,
    q: true,
    rp: true,
    rt: true,
    ruby: true,
    s: true,
    samp: true,
    section: true,
    select: true,
    small: true,
    span: true,
    strike: true,
    strong: true,
    sub: true,
    summary: true,
    sup: true,
    table: true,
    tbody: true,
    td: true,
    template: true,
    textarea: true,
    tfoot: true,
    th: true,
    thead: true,
    time: true,
    tr: true,
    tt: true,
    u: true,
    ul: true,
    var: true,
    wbr: true,
    xmp: true,

    // Disallowed tags
    applet: false,
    audio: false,
    base: false,
    basefont: false,
    embed: false,
    frame: false,
    frameset: false,
    iframe: false,
    link: false,
    meta: false,
    noscript: false,
    object: false,
    param: false,
    script: false,
    slot: false,
    source: false,
    style: false,
    title: false,
    track: false,
    video: false,
};

const ALLOWED_HTML_ATTRIBUTES = (
    'accept,align,alt,checked,cite,color,cols,colspan,contextmenu,' +
    'coords,datetime,default,dir,dirname,disabled,download,face,headers,height,hidden,high,href,' +
    'hreflang,ismap,kind,label,lang,list,low,max,maxlength,media,min,multiple,open,optimum,pattern,' +
    'placeholder,readonly,rel,required,reversed,rows,rowspan,scope,selected,shape,size,sizes,span,' +
    'spellcheck,src,srclang,srcset,start,step,style,tabindex,target,title,translate,type,usemap,value,' +
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

// This is to preserve entity related CSS classes when paste.
const ALLOWED_CSS_CLASSES: string[] = [];

const PREDEFINED_CSS_FOR_ELEMENT: PredefinedCssMap = {
    PRE: {
        'white-space': 'pre',
    },
};

/**
 * @internal
 */
export function getAllowedTags(additionalTags: string[]): string[] {
    return Object.keys(ALLOWED_HTML_TAG_MAP)
        .filter((name: keyof typeof ALLOWED_HTML_TAG_MAP) => ALLOWED_HTML_TAG_MAP[name])
        .concat(additionalTags || [])
        .map(name => name.toUpperCase());
}

/**
 * @internal
 */
export function getDisallowedTags(): string[] {
    return Object.keys(ALLOWED_HTML_TAG_MAP)
        .filter((name: keyof typeof ALLOWED_HTML_TAG_MAP) => !ALLOWED_HTML_TAG_MAP[name])
        .map(name => name.toUpperCase());
}

/**
 * @internal
 */
export function getAllowedAttributes(additionalAttributes: string[]): string[] {
    return unique(ALLOWED_HTML_ATTRIBUTES.concat(additionalAttributes || [])).map(attr =>
        attr.toLocaleLowerCase()
    );
}

/**
 * @internal
 */
export function getAllowedCssClassesRegex(additionalCssClasses: string[]): RegExp {
    const patterns = ALLOWED_CSS_CLASSES.concat(additionalCssClasses || []);
    return patterns.length > 0 ? new RegExp(patterns.join('|')) : null;
}

/**
 * @internal
 */
export function getDefaultStyleValues(additionalDefaultStyles: StringMap): StringMap {
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
export function getStyleCallbacks(callbacks: StyleCallbackMap): StyleCallbackMap {
    let result = cloneObject(callbacks);
    result.position = result.position || removeValue;
    result.width = result.width || removeWidthForLiAndDiv;
    return result;
}

/**
 * @internal
 */
export function getPredefinedCssForElement(
    additionalPredefinedCssForElement: PredefinedCssMap
): PredefinedCssMap {
    return { ...PREDEFINED_CSS_FOR_ELEMENT, ...(additionalPredefinedCssForElement || {}) };
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
