import { StringMap, StyleCallbackMap } from '../types/maps';
import cloneObject from './cloneObject';

const ALLOWED_HTML_TAGS = (
    'BODY,H1,H2,H3,H4,H5,H6,FORM,P,BR,NOBR,HR,ACRONYM,ABBR,ADDRESS,B,' +
    'BDI,BDO,BIG,BLOCKQUOTE,CENTER,CITE,CODE,DEL,DFN,EM,FONT,I,INS,KBD,MARK,METER,PRE,PROGRESS,' +
    'Q,RP,RT,RUBY,S,SAMP,SMALL,STRIKE,STRONG,SUB,SUP,TEMPLATE,TIME,TT,U,VAR,WBR,XMP,INPUT,TEXTAREA,' +
    'BUTTON,SELECT,OPTGROUP,OPTION,LABEL,FIELDSET,LEGEND,DATALIST,OUTPUT,IMG,MAP,AREA,CANVAS,FIGCAPTION,' +
    'FIGURE,PICTURE,A,NAV,UL,OL,LI,DIR,UL,DL,DT,DD,MENU,MENUITEM,TABLE,CAPTION,TH,TR,TD,THEAD,TBODY,' +
    'TFOOT,COL,COLGROUP,DIV,SPAN,HEADER,FOOTER,MAIN,SECTION,ARTICLE,ASIDE,DETAILS,DIALOG,SUMMARY,DATA'
).split(',');

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

export function getAllowedTags(additionalTags: string[]): string[] {
    return unique(ALLOWED_HTML_TAGS.concat(additionalTags || [])).map(tag => tag.toUpperCase());
}

export function getAllowedAttributes(additionalAttributes: string[]): string[] {
    return unique(ALLOWED_HTML_ATTRIBUTES.concat(additionalAttributes || [])).map(attr =>
        attr.toLocaleLowerCase()
    );
}

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

export function getStyleCallbacks(callbacks: StyleCallbackMap): StyleCallbackMap {
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
