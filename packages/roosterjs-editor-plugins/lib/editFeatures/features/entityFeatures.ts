import { cacheGetEventData, ContentEditFeature, Editor, Keys } from 'roosterjs-editor-core';
import { getEntityElement, getEntityFromElement } from '../../Entity';
import { Position } from 'roosterjs-editor-dom';
import {
    EntityOperation,
    PluginKeyboardEvent,
    PositionType,
    PluginEventType,
} from 'roosterjs-editor-types';

/**
 * A content edit feature to trigger EntityOperation event with operation "Click" when user
 * clicks on a readonly entity.
 */
const ClickOnEntityFeature: ContentEditFeature = {
    keys: [Keys.ENTER],
    shouldHandleEvent: (event, editor) => cacheGetReadonlyEntityElement(event, editor),
    handleEvent: (event, editor) => {
        cacheGetReadonlyEntityElement(event, editor, EntityOperation.Click);
    },
    description: 'Fire an event when click on a readonly entity',
};

/**
 * A content edit feature to trigger EntityOperation event with operation "Escape" when user
 * presses ESC on a readonly entity.
 */
const EscapeFromEntityFeature: ContentEditFeature = {
    keys: [Keys.ESCAPE],
    shouldHandleEvent: (event, editor) => cacheGetReadonlyEntityElement(event, editor),
    handleEvent: (event, editor) => {
        cacheGetReadonlyEntityElement(event, editor, EntityOperation.Escape);
    },
    description: 'Fire an event when Escape from a readonly entity',
};

function cacheGetReadonlyEntityElement(
    event: PluginKeyboardEvent,
    editor: Editor,
    operation?: EntityOperation
) {
    const element = cacheGetEventData(event, 'READONLY_ENTITY_ELEMENT', () => {
        const entityElement = getEntityElement(editor, event.rawEvent.target as Node);
        return entityElement && !entityElement.isContentEditable ? entityElement : null;
    });

    if (element && operation != undefined) {
        editor.triggerPluginEvent(PluginEventType.EntityOperation, {
            operation,
            rawEvent: event.rawEvent,
            entity: getEntityFromElement(element),
        });
    }

    return element;
}

/**
 * A content edit feature to split current line into two lines at the cursor when user presses
 * ENTER right before a readonly entity.
 * Browser's default behavior will insert an extra BR tag before the entity which causes an extra
 * empty line. So we override the default behavior here.
 */
const EnterBeforeReadonlyEntityFeature: ContentEditFeature = {
    keys: [Keys.ENTER],
    shouldHandleEvent: (event, editor) =>
        cacheGetNeighborEntityElement(event, editor, true /*isNext*/, false /*collapseOnly*/),
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
    description: 'Start a new line when Enter before an event',
};

/**
 * A content edit feature to trigger EntityOperation event with operation "RemoveFromEnd" when user
 * press BACKSPACE right after an entity
 */
const BackspaceAfterEntityFeature: ContentEditFeature = {
    keys: [Keys.BACKSPACE],
    shouldHandleEvent: (event, editor) =>
        cacheGetNeighborEntityElement(event, editor, false /*isNext*/, true /*collapseOnly*/),
    handleEvent: (event, editor) => {
        cacheGetNeighborEntityElement(
            event,
            editor,
            false /*isNext*/,
            true /*collapseOnly*/,
            EntityOperation.RemoveFromEnd
        );
    },
    description: 'Fire an event when Backspace after an entity',
};

/**
 * A content edit feature to trigger EntityOperation event with operation "RemoveFromStart" when user
 * press DELETE right after an entity
 */
const DeleteBeforeEntityFeature: ContentEditFeature = {
    keys: [Keys.DELETE],
    shouldHandleEvent: (event, editor) =>
        cacheGetNeighborEntityElement(event, editor, true /*isNext*/, true /*collapseOnly*/),
    handleEvent: (event, editor) => {
        cacheGetNeighborEntityElement(
            event,
            editor,
            true /*isNext*/,
            true /*collapseOnly*/,
            EntityOperation.RemoveFromStart
        );
    },
    description: 'Fire an event when Delete before an event',
};

function cacheGetNeighborEntityElement(
    event: PluginKeyboardEvent,
    editor: Editor,
    isNext: boolean,
    collapseOnly: boolean,
    operation?: EntityOperation
): HTMLElement {
    const element = cacheGetEventData(
        event,
        'NEIGHBOR_ENTITY_ELEMENT_' + isNext + '_' + collapseOnly,
        () => {
            const range = editor.getSelectionRange();

            if (collapseOnly && !range.collapsed) {
                return null;
            }

            const pos = Position.getEnd(range).normalize();
            const isAtBeginOrEnd = pos.offset == 0 || pos.isAtEnd;
            let entityNode: HTMLElement = null;

            if (isAtBeginOrEnd) {
                const traverser = editor.getBodyTraverser(pos.node);
                const sibling = isNext
                    ? pos.offset == 0
                        ? traverser.currentInlineElement
                        : traverser.getNextInlineElement()
                    : pos.isAtEnd
                    ? traverser.currentInlineElement
                    : traverser.getPreviousInlineElement();
                let node = sibling && sibling.getContainerNode();

                if (!collapseOnly) {
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

    if (element && operation !== undefined) {
        editor.triggerPluginEvent(PluginEventType.EntityOperation, {
            operation,
            rawEvent: event.rawEvent,
            entity: getEntityFromElement(element),
        });
    }

    return element;
}

export default interface EntityFeatureSettings {
    /**
     * A content edit feature to trigger EntityOperation event with operation "Click" when user
     * clicks on a readonly entity.
     */
    clickOnEntity: boolean;

    /**
     * A content edit feature to trigger EntityOperation event with operation "Escape" when user
     * presses ESC on a readonly entity.
     */
    escapeFromEntity: boolean;

    /**
     * A content edit feature to split current line into two lines at the cursor when user presses
     * ENTER right before a readonly entity.
     * Browser's default behavior will insert an extra BR tag before the entity which causes an extra
     * empty line. So we override the default behavior here.
     */
    enterBeforeReadonlyEntity: boolean;

    /**
     * A content edit feature to trigger EntityOperation event with operation "RemoveFromEnd" when user
     * press BACKSPACE right after an entity
     */
    backspaceAfterEntity: boolean;

    /**
     * A content edit feature to trigger EntityOperation event with operation "RemoveFromStart" when user
     * press DELETE right after an entity
     */
    deleteBeforeEntity: boolean;
}

/**
 * @internal
 */
export const EntityFeatures: {
    [key in keyof EntityFeatureSettings]: ContentEditFeature;
} = {
    clickOnEntity: ClickOnEntityFeature,
    escapeFromEntity: EscapeFromEntityFeature,
    enterBeforeReadonlyEntity: EnterBeforeReadonlyEntityFeature,
    backspaceAfterEntity: BackspaceAfterEntityFeature,
    deleteBeforeEntity: DeleteBeforeEntityFeature,
};
