import { contains, getObjectKeys, getTagOfNode, Position } from 'roosterjs-editor-dom';
import { NodeType } from 'roosterjs-editor-types';
import type { PendableFormatNames } from 'roosterjs-editor-dom';
import type { NodePosition, PendableFormatState } from 'roosterjs-editor-types';
import type { StandaloneEditorCore } from 'roosterjs-content-model-types';

/**
 * @internal
 * @param core The StandaloneEditorCore object
 * @param forceGetStateFromDOM If set to true, will force get the format state from DOM tree.
 * @returns The cached format state if it exists. If the cached position do not exist, search for pendable elements in the DOM tree and return the pendable format state.
 */
export function getPendableFormatState(core: StandaloneEditorCore): PendableFormatState {
    const selection = core.api.getDOMSelection(core);
    const range = selection?.type == 'range' ? selection.range : null;
    const currentPosition = range && Position.getStart(range).normalize();

    return currentPosition ? queryCommandStateFromDOM(core, currentPosition) : {};
}

const PendableStyleCheckers: Record<
    PendableFormatNames,
    (tagName: string, style: CSSStyleDeclaration) => boolean
> = {
    isBold: (tag, style) =>
        tag == 'B' ||
        tag == 'STRONG' ||
        tag == 'H1' ||
        tag == 'H2' ||
        tag == 'H3' ||
        tag == 'H4' ||
        tag == 'H5' ||
        tag == 'H6' ||
        parseInt(style.fontWeight) >= 700 ||
        ['bold', 'bolder'].indexOf(style.fontWeight) >= 0,
    isUnderline: (tag, style) => tag == 'U' || style.textDecoration.indexOf('underline') >= 0,
    isItalic: (tag, style) => tag == 'I' || tag == 'EM' || style.fontStyle === 'italic',
    isSubscript: (tag, style) => tag == 'SUB' || style.verticalAlign === 'sub',
    isSuperscript: (tag, style) => tag == 'SUP' || style.verticalAlign === 'super',
    isStrikeThrough: (tag, style) =>
        tag == 'S' || tag == 'STRIKE' || style.textDecoration.indexOf('line-through') >= 0,
};

/**
 * CssFalsyCheckers checks for non pendable format that might overlay a pendable format, then it can prevent getPendableFormatState return falsy pendable format states.
 */

const CssFalsyCheckers: Record<PendableFormatNames, (style: CSSStyleDeclaration) => boolean> = {
    isBold: style =>
        (style.fontWeight !== '' && parseInt(style.fontWeight) < 700) ||
        style.fontWeight === 'normal',
    isUnderline: style =>
        style.textDecoration !== '' && style.textDecoration.indexOf('underline') < 0,
    isItalic: style => style.fontStyle !== '' && style.fontStyle !== 'italic',
    isSubscript: style => style.verticalAlign !== '' && style.verticalAlign !== 'sub',
    isSuperscript: style => style.verticalAlign !== '' && style.verticalAlign !== 'super',
    isStrikeThrough: style =>
        style.textDecoration !== '' && style.textDecoration.indexOf('line-through') < 0,
};

function queryCommandStateFromDOM(
    core: StandaloneEditorCore,
    currentPosition: NodePosition
): PendableFormatState {
    let node: Node | null = currentPosition.node;
    const formatState: PendableFormatState = {};
    const pendableKeys: PendableFormatNames[] = [];
    while (node && contains(core.contentDiv, node)) {
        const tag = getTagOfNode(node);
        const style = node.nodeType == NodeType.Element && (node as HTMLElement).style;
        if (tag && style) {
            getObjectKeys(PendableStyleCheckers).forEach(key => {
                if (!(pendableKeys.indexOf(key) >= 0)) {
                    formatState[key] = formatState[key] || PendableStyleCheckers[key](tag, style);
                    if (CssFalsyCheckers[key](style)) {
                        pendableKeys.push(key);
                    }
                }
            });
        }
        node = node.parentNode;
    }
    return formatState;
}
