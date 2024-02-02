import { ContentPosition, KnownCreateElementDataIndex, PositionType } from 'roosterjs-editor-types';
import {
    createElement,
    createRange,
    findClosestElementAncestor,
    getBlockElementAtNode,
    isNodeEmpty,
    Position,
    safeInstanceOf,
} from 'roosterjs-editor-dom';
import type { EnsureTypeInContainer } from '../publicTypes/ContentModelEditorCore';

/**
 * @internal
 * When typing goes directly under content div, many things can go wrong
 * We fix it by wrapping it with a div and reposition cursor within the div
 */
export const ensureTypeInContainer: EnsureTypeInContainer = (
    core,
    innerCore,
    position,
    keyboardEvent
) => {
    const { contentDiv, api } = innerCore;
    const table = findClosestElementAncestor(position.node, contentDiv, 'table');
    let td: HTMLElement | null;

    if (table && (td = table.querySelector('td,th'))) {
        position = new Position(td, PositionType.Begin);
    }
    position = position.normalize();

    const block = getBlockElementAtNode(contentDiv, position.node);
    let formatNode: HTMLElement | null;

    if (block) {
        formatNode = block.collapseToSingleElement();
        if (isNodeEmpty(formatNode, false /* trimContent */, true /* shouldCountBrAsVisible */)) {
            const brEl = formatNode.ownerDocument.createElement('br');
            formatNode.append(brEl);
        }
        // if the block is empty, apply default format
        // Otherwise, leave it as it is as we don't want to change the style for existing data
        // unless the block was just created by the keyboard event (e.g. ctrl+a & start typing)
        const shouldSetNodeStyles =
            isNodeEmpty(formatNode) ||
            (keyboardEvent && wasNodeJustCreatedByKeyboardEvent(keyboardEvent, formatNode));
        formatNode = formatNode && shouldSetNodeStyles ? formatNode : null;
    } else {
        // Only reason we don't get the selection block is that we have an empty content div
        // which can happen when users removes everything (i.e. select all and DEL, or backspace from very end to begin)
        // The fix is to add a DIV wrapping, apply default format and move cursor over
        formatNode = createElement(
            KnownCreateElementDataIndex.EmptyLine,
            contentDiv.ownerDocument
        ) as HTMLElement;
        core.api.insertNode(core, innerCore, formatNode, {
            position: ContentPosition.End,
            updateCursor: false,
            replaceSelection: false,
            insertOnNewLine: false,
        });

        // element points to a wrapping node we added "<div><br></div>". We should move the selection left to <br>
        position = new Position(formatNode, PositionType.Begin);
    }

    // If this is triggered by a keyboard event, let's select the new position
    if (keyboardEvent) {
        api.setDOMSelection(innerCore, {
            type: 'range',
            range: createRange(new Position(position)),
            isReverted: false,
        });
    }
};

function wasNodeJustCreatedByKeyboardEvent(event: KeyboardEvent, formatNode: HTMLElement) {
    return (
        safeInstanceOf(event.target, 'Node') &&
        event.target.contains(formatNode) &&
        event.key === formatNode.innerText
    );
}
