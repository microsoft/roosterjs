import { contains, getTagOfNode, PendableFormatNames, Position } from 'roosterjs-editor-dom';
import { EditorCore, NodePosition, NodeType, PendableFormatState } from 'roosterjs-editor-types';

/**
 * @internal
 * @param core The EditorCore object
 * @param forceGetStateFromDOM If set to true, will force get the format state from DOM tree.
 * @returns The cached format state if it exists. If the cached postion do not exist, search for pendable elements in the DOM tree and return the pendable format state.
 */
export function getPendableFormatState(
    core: EditorCore,
    forceGetStateFromDOM: boolean = false
): PendableFormatState {
    const range = core.api.getSelectionRange(core, true /* tryGetFromCache*/);
    const isRangeCollapsed = range && range.collapsed;
    const cachedPendableFormatState = core.pendingFormatState.pendableFormatState;
    const cachedPosition = core.pendingFormatState.pendableFormatPosition?.normalize();
    const currentPosition = isRangeCollapsed && Position.getStart(range).normalize();
    const isSamePosition = currentPosition && currentPosition.equalTo(cachedPosition);

    if (range && cachedPendableFormatState && isSamePosition && !forceGetStateFromDOM) {
        return cachedPendableFormatState;
    } else {
        return queryCommandStateFromDOM(core, isRangeCollapsed, currentPosition);
    }
}

const PendableStyleCheckers: Record<
    PendableFormatNames,
    (tagName: string, style: CSSStyleDeclaration) => boolean
> = {
    isBold: (tag, style) =>
        tag == 'B' ||
        tag == 'STRONG' ||
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
    core: EditorCore,
    isCollapsed: boolean,
    currentPosition: NodePosition
): PendableFormatState {
    let node = isCollapsed ? currentPosition?.node : document.getSelection().focusNode;
    let formatState: PendableFormatState = {};
    let pendablekeys: PendableFormatNames[] = [];
    while (contains(core.contentDiv, node)) {
        const tag = getTagOfNode(node);
        const style = node.nodeType == NodeType.Element && (node as HTMLElement).style;
        if (tag && style) {
            Object.keys(PendableStyleCheckers).forEach((key: PendableFormatNames) => {
                if (!(pendablekeys.indexOf(key) >= 0)) {
                    formatState[key] = formatState[key] || PendableStyleCheckers[key](tag, style);
                    if (CssFalsyCheckers[key](style)) {
                        pendablekeys.push(key);
                    }
                }
            });
        }
        node = node.parentNode;
    }
    return formatState;
}
