import cacheGetEventData from '../eventApi/cacheGetEventData';
import Editor from '../editor/Editor';
import getEntityElement from '../entityApi/getEntityElement';
import tryTriggerEntityEvent from '../entityApi/tryTriggerEntityEvent';
import { ContentEditFeature, Keys } from '../interfaces/ContentEditFeature';
import { Position } from 'roosterjs-editor-dom';
import {
    EntityOperation,
    NodeType,
    PluginKeyboardEvent,
    PositionType,
} from 'roosterjs-editor-types';

export const ClickOnEntityFeature: ContentEditFeature = {
    keys: [Keys.ENTER],
    shouldHandleEvent: cacheGetReadonlyEntityElement,
    handleEvent: (event, editor) => {
        const entityElement = cacheGetReadonlyEntityElement(event, editor);
        tryTriggerEntityEvent(editor, entityElement, EntityOperation.Click, event.rawEvent);
    },
};

export const EscapeFromEntityFeature: ContentEditFeature = {
    keys: [Keys.ESCAPE],
    shouldHandleEvent: cacheGetReadonlyEntityElement,
    handleEvent: (event, editor) => {
        const entityElement = cacheGetReadonlyEntityElement(event, editor);
        tryTriggerEntityEvent(editor, entityElement, EntityOperation.Escape, event.rawEvent);
    },
};

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
                    if (!block.contains(node)) {
                        node = null;
                    }
                }

                entityNode = getEntityElement(editor, node);
            }

            return entityNode;
        }
    );
}
