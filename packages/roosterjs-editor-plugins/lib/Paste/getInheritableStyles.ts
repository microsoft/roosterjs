import { Editor } from 'roosterjs-editor-core';
import { StyleMap, getComputedStyles } from 'roosterjs-editor-dom';
import { NodeType } from 'roosterjs-editor-types';

// Inheritable CSS properties
// Ref: https://www.w3.org/TR/CSS21/propidx.html
const INHERITABLE_PROPERTIES = 'border-collapse,border-spacing,caption-side,color,cursor,direction,empty-cells,font-family,font-size,font-style,font-variant,font-weight,font,letter-spacing,line-height,list-style-image,list-style-position,list-style-type,list-style,orphans,quotes,text-align,text-indent,text-transform,visibility,white-space,widows,word-spacing'.split(
    ','
);

export default function getInheritableStyles(editor: Editor): StyleMap {
    let selection = editor.getDocument().defaultView.getSelection();
    let node = selection.focusNode;
    node = node && node.nodeType != NodeType.Element ? node.parentNode : node;
    let styles = node ? getComputedStyles(node, INHERITABLE_PROPERTIES) : [];
    let result: StyleMap = {};

    for (let i = 0; i < INHERITABLE_PROPERTIES.length; i++) {
        result[INHERITABLE_PROPERTIES[i]] = styles[i] || '';
    }

    return result;
}
