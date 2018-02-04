import { NodeType } from 'roosterjs-editor-types';

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

export default function removeUselessCss(node: Node, currentStyle: {[name: string]: string} = {}): boolean {
    let changed = false;
    let element = <HTMLElement>node;
    let style: string;
    let thisStyle = Object.assign ? Object.assign({}, currentStyle) : {};

    if (node.nodeType == NodeType.Element && (style = element.getAttribute('style'))) {
        let styles = style.split(';');
        for (let i = 0; i < styles.length; i++) {
            let pair = styles[i].split(':');
            if (pair.length == 2) {
                let name = pair[0].trim();
                let value = pair[1].trim();
                let isInheritable = INHERITABLE_PROPERTOES.indexOf(name) >= 0;
                if (value == 'inherit' || (value == thisStyle[name] && isInheritable)) {
                    delete styles[i];
                    changed = true;
                } else if (isInheritable) {
                    thisStyle[name] = value;
                }
            }
        }

        if (changed) {
            style = styles.join(';').replace(/;+/g, ';');
            if (!style || style == ';') {
                element.removeAttribute('style');
            } else {
                element.setAttribute('style', style);
            }
        }
    }

    for (let child = node.firstChild; child; child = child.nextSibling) {
        changed = removeUselessCss(child, thisStyle) || changed;
    }

    return changed;
}