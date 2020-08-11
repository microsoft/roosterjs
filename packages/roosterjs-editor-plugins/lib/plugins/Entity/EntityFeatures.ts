import getEntityElement from './getEntityElement';
import tryTriggerEntityEvent from './tryTriggerEntityEvent';
import { cacheGetEventData, ContentEditFeature, Editor, Keys } from 'roosterjs-editor-core';
import { Position } from 'roosterjs-editor-dom';
import {
    EntityOperation,
    NodeType,
    PluginKeyboardEvent,
    PositionType,
} from 'roosterjs-editor-types';

/**
 * @internal
 * A content edit feature to trigger EntityOperation event with operation "Click" when user
 * clicks on a readonly entity.
 */
export const ClickOnEntityFeature: ContentEditFeature = {
    keys: [Keys.ENTER],
    shouldHandleEvent: cacheGetReadonlyEntityElement,
    handleEvent: (event, editor) => {
        const entityElement = cacheGetReadonlyEntityElement(event, editor);
        tryTriggerEntityEvent(editor, entityElement, EntityOperation.Click, event.rawEvent);
    },
};

/**
 * @internal
 * A content edit feature to trigger EntityOperation event with operation "Escape" when user
 * presses ESC on a readonly entity.
 */
export const EscapeFromEntityFeature: ContentEditFeature = {
    keys: [Keys.ESCAPE],
    shouldHandleEvent: cacheGetReadonlyEntityElement,
    handleEvent: (event, editor) => {
        const entityElement = cacheGetReadonlyEntityElement(event, editor);
        tryTriggerEntityEvent(editor, entityElement, EntityOperation.Escape, event.rawEvent);
    },
};

/**
 * @internal
 * A content edit feature to split current line into two lines at the cursor when user presses
 * ENTER right before a readonly entity.
 * Browser's default behavior will insert an extra BR tag before the entity which causes an extra
 * empty line. So we override the default behavior here.
 */
export const EnterBeforeReadonlyEntityFeature: ContentEditFeature = {
    keys: [Keys.ENTER],
    shouldHandleEvent: (event, editor) =>
        cacheGetNeighborEntityElement(
            event,
            editor,
            true /*isNext*/,
            false /*collapseOnly*/,
            true /*checkForSameLine*/
        ),
    handleEvent: (event, editor) => {
        event.rawEvent.preventDefault();

        const range = editor.getSelectionRange();
        const node = Position.getEnd(range).normalize().node;
        const br = editor.getDocument().createElement('BR');
        node.parentNode.insertBefore(br, node.nextSibling);

        const block = editor.getBlockElementAtNode(node);
        let newContainer: HTMLElement;

        if (block) {
            newContainer = block.collapseToSingleElement();
            br.parentNode?.removeChild(br);
        }

        editor.getSelectionRange().deleteContents();

        if (newContainer.nextSibling) {
            editor.select(newContainer.nextSibling, PositionType.Begin);
        }
    },
};

/**
 * @internal
 * A content edit feature to trigger EntityOperation event with operation "RemoveFromEnd" when user
 * press BACKSPACE right after an entity
 */
export const BackspaceAfterEntityFeature: ContentEditFeature = {
    keys: [Keys.BACKSPACE],
    shouldHandleEvent: (event, editor) =>
        cacheGetNeighborEntityElement(event, editor, false /*isNext*/, true /*collapseOnly*/),
    handleEvent: (event, editor) => {
        const element = cacheGetNeighborEntityElement(
            event,
            editor,
            false /*isNext*/,
            true /*collapseOnly*/
        );
        tryTriggerEntityEvent(editor, element, EntityOperation.RemoveFromEnd, event.rawEvent);
    },
};

/**
 * @internal
 * A content edit feature to trigger EntityOperation event with operation "RemoveFromStart" when user
 * press DELETE right after an entity
 */
export const DeleteBeforeEntityFeature: ContentEditFeature = {
    keys: [Keys.DELETE],
    shouldHandleEvent: (event, editor) =>
        cacheGetNeighborEntityElement(event, editor, true /*isNext*/, true /*collapseOnly*/),
    handleEvent: (event, editor) => {
        const element = cacheGetNeighborEntityElement(
            event,
            editor,
            true /*isNext*/,
            true /*collapseOnly*/
        );
        tryTriggerEntityEvent(editor, element, EntityOperation.RemoveFromStart, event.rawEvent);
    },
};

function cacheGetReadonlyEntityElement(event: PluginKeyboardEvent, editor: Editor) {
    return cacheGetEventData(event, 'READONLY_ENTITY_ELEMENT', () => {
        const entityElement = getEntityElement(editor, event.rawEvent.target as Node);
        return entityElement && !entityElement.isContentEditable ? entityElement : null;
    });
}

function cacheGetNeighborEntityElement(
    event: PluginKeyboardEvent,
    editor: Editor,
    isNext: boolean,
    collapseOnly: boolean,
    checkForSameLine?: boolean
): HTMLElement {
    return cacheGetEventData(
        event,
        'NEIGHBOR_ENTITY_ELEMENT_' + isNext + '_' + collapseOnly + '_' + !!checkForSameLine,
        () => {
            const range = editor.getSelectionRange();

            if (collapseOnly && !range.collapsed) {
                return null;
            }

            const pos = Position.getEnd(range);
            const lookForPrev = !isNext && (pos.node.nodeType != NodeType.Text || pos.offset == 0);
            const lookForNext = isNext && (pos.node.nodeType != NodeType.Text || pos.isAtEnd);
            let entityNode: HTMLElement = null;

            if (lookForNext || lookForPrev) {
                const traverser = editor.getBodyTraverser(pos.node);
                const sibling = lookForPrev
                    ? traverser.getPreviousInlineElement()
                    : traverser.getNextInlineElement();
                let node = sibling && sibling.getContainerNode();

                if (checkForSameLine) {
                    const block = editor.getBlockElementAtNode(pos.node);
                    if (!block || !block.contains(node)) {
                        node = null;
                    }
                }

                entityNode = getEntityElement(editor, node);
            }

            return entityNode;
        }
    );
}
