import { Editor } from 'roosterjs-editor-core';
import { StyleMap, getComputedStyles } from 'roosterjs-editor-dom';

// Inheritable CSS properties
// Ref: https://www.w3.org/TR/CSS21/propidx.html
const INHERITABLE_PROPERTIES = 'border-collapse,border-spacing,caption-side,color,cursor,direction,empty-cells,font-family,font-size,font-style,font-variant,font-weight,font,letter-spacing,line-height,list-style-image,list-style-position,list-style-type,list-style,orphans,quotes,text-align,text-indent,text-transform,visibility,white-space,widows,word-spacing'.split(
    ','
);

export default function getInheritableStyles(editor: Editor): StyleMap {
    let styles = getComputedStyles(editor.getSelectionRange(), INHERITABLE_PROPERTIES);
    let result: StyleMap = {};

    for (let i = 0; i < INHERITABLE_PROPERTIES.length; i++) {
        result[INHERITABLE_PROPERTIES[i]] = styles[i] || '';
    }

    return result;
}
