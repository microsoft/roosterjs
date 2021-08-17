import { contains, getTagOfNode, PendableFormatNames, Position } from 'roosterjs-editor-dom';
import { EditorCore, NodePosition, NodeType, PendableFormatState } from 'roosterjs-editor-types';

/**
 *
 * @param core The EditorCore object
 * @param tryGetFromCache this function will try to  get the pendable form from cached.
 * @returns The cached format state if it exists. If the cached postion do not exist, search for pendable elements in the DOM tree and return the pendable format state.
 */
export function getPendableFormatState(
    core: EditorCore,
    tryGetFromCache: boolean = true
): PendableFormatState {
    const range = core.api.getSelectionRange(core, true);
    const cachedPendableFormatState = core.pendingFormatState.pendableFormatState;
    const cachedPosition =
        cachedPendableFormatState && core.pendingFormatState.pendableFormatPosition.normalize();
    const currentPosition = range && Position.getStart(range).normalize();
    const isSamePosition = range && currentPosition.equalTo(cachedPosition);
    if (
        range &&
        cachedPendableFormatState &&
        range.collapsed &&
        isSamePosition &&
        tryGetFromCache
    ) {
        return cachedPendableFormatState;
    } else {
        return queryCommandState(core, currentPosition);
    }
}

const StyleCheckers: Record<
    PendableFormatNames,
    (tagName: string, style: CSSStyleDeclaration) => boolean
> = {
    isBold: (tag, style) => tag == 'B' || tag == 'STRONG' || style.fontWeight >= '700',
    isUnderline: (tag, style) => tag == 'U' || style.textDecoration.indexOf('underline') >= 0,
    isItalic: (tag, style) => tag == 'I' || tag == 'EM' || style.fontStyle === 'italic',
    isSubscript: (tag, style) => tag == 'SUB' || style.verticalAlign === 'sub',
    isSuperscript: (tag, style) => tag == 'SUP' || style.verticalAlign === 'super',
    isStrikeThrough: (tag, style) =>
        tag == 'S' || tag == 'STRIKE' || style.textDecoration.indexOf('line-through') >= 0,
};

function queryCommandState(core: EditorCore, currentPosition: NodePosition): PendableFormatState {
    let node = currentPosition && currentPosition.node;
    let formatState: PendableFormatState = {};
    if (node) {
        while (contains(core.contentDiv, node)) {
            const tag = getTagOfNode(node);
            const style = node.nodeType == NodeType.Element && (node as HTMLElement).style;
            if (tag && style) {
                Object.keys(StyleCheckers).forEach((key: PendableFormatNames) => {
                    formatState[key] = formatState[key] || StyleCheckers[key](tag, style);
                });
            }
            node = node.parentNode;
        }
    }
    return formatState;
}
