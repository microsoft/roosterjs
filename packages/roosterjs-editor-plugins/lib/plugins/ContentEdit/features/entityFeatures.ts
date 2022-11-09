import {
    cacheGetEventData,
    getEntityFromElement,
    getEntitySelector,
    Position,
} from 'roosterjs-editor-dom';
import {
    BuildInEditFeature,
    EntityFeatureSettings,
    EntityOperation,
    IEditor,
    Keys,
    PluginKeyboardEvent,
    PositionType,
    PluginEventType,
} from 'roosterjs-editor-types';

/**
 * A content edit feature to trigger EntityOperation event with operation "Click" when user
 * clicks on a readonly entity.
 */
const ClickOnEntityFeature: BuildInEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.ENTER],
    shouldHandleEvent: (event, editor) => cacheGetReadonlyEntityElement(event, editor),
    handleEvent: (event, editor) => {
        cacheGetReadonlyEntityElement(event, editor, EntityOperation.Click);
    },
};

/**
 * A content edit feature to trigger EntityOperation event with operation "Escape" when user
 * presses ESC on a readonly entity.
 */
const EscapeFromEntityFeature: BuildInEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.ESCAPE],
    shouldHandleEvent: (event, editor) => cacheGetReadonlyEntityElement(event, editor),
    handleEvent: (event, editor) => {
        cacheGetReadonlyEntityElement(event, editor, EntityOperation.Escape);
    },
};

function cacheGetReadonlyEntityElement(
    event: PluginKeyboardEvent,
    editor: IEditor,
    operation?: EntityOperation
) {
    const element = cacheGetEventData(event, 'READONLY_ENTITY_ELEMENT', () => {
        const node = event.rawEvent.target as Node;
        const entityElement = node && editor.getElementAtCursor(getEntitySelector(), node);
        return entityElement && !entityElement.isContentEditable ? entityElement : null;
    });

    if (element && operation !== undefined) {
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
const EnterBeforeReadonlyEntityFeature: BuildInEditFeature<PluginKeyboardEvent> = {
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
};

/**
 * A content edit feature to trigger EntityOperation event with operation "RemoveFromEnd" when user
 * press BACKSPACE right after an entity
 */
const BackspaceAfterEntityFeature: BuildInEditFeature<PluginKeyboardEvent> = {
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
};

/**
 * A content edit feature to trigger EntityOperation event with operation "RemoveFromStart" when user
 * press DELETE right after an entity
 */
const DeleteBeforeEntityFeature: BuildInEditFeature<PluginKeyboardEvent> = {
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
};

function cacheGetNeighborEntityElement(
    event: PluginKeyboardEvent,
    editor: IEditor,
    isNext: boolean,
    collapseOnly: boolean,
    operation?: EntityOperation
): HTMLElement {
    const element = cacheGetEventData(
        event,
        'NEIGHBOR_ENTITY_ELEMENT_' + isNext + '_' + collapseOnly,
        () => {
            const range = editor.getSelectionRange();

            if (!range || (collapseOnly && !range.collapsed)) {
                return null;
            }

            range.commonAncestorContainer.normalize();
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

                entityNode = node && editor.getElementAtCursor(getEntitySelector(), node);
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

/**
 * @internal
 */
export const EntityFeatures: Record<
    keyof EntityFeatureSettings,
    BuildInEditFeature<PluginKeyboardEvent>
> = {
    clickOnEntity: ClickOnEntityFeature,
    escapeFromEntity: EscapeFromEntityFeature,
    enterBeforeReadonlyEntity: EnterBeforeReadonlyEntityFeature,
    backspaceAfterEntity: BackspaceAfterEntityFeature,
    deleteBeforeEntity: DeleteBeforeEntityFeature,
};
