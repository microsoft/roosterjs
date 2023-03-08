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
    DelimiterClasses,
    PluginEvent,
    NodeType,
    ExperimentalFeatures,
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
        const entity = getEntityFromElement(element);
        if (entity) {
            editor.triggerPluginEvent(PluginEventType.EntityOperation, {
                operation,
                rawEvent: event.rawEvent,
                entity,
            });
        }
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
        if (!range) {
            return;
        }

        const node = Position.getEnd(range).normalize().node;
        const br = editor.getDocument().createElement('BR');
        node.parentNode?.insertBefore(br, node.nextSibling);

        const block = editor.getBlockElementAtNode(node);
        let newContainer: HTMLElement | undefined;

        if (block) {
            newContainer = block.collapseToSingleElement();
            br.parentNode?.removeChild(br);
        }

        editor.getSelectionRange()?.deleteContents();

        if (newContainer?.nextSibling) {
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
): HTMLElement | null {
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
            let entityNode: HTMLElement | null = null;

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
                    if (!block || (node && !block.contains(node))) {
                        node = null;
                    }
                }

                entityNode = node && editor.getElementAtCursor(getEntitySelector(), node);
            }

            return entityNode;
        }
    );

    if (element && operation !== undefined) {
        const entity = getEntityFromElement(element);
        if (entity) {
            editor.triggerPluginEvent(PluginEventType.EntityOperation, {
                operation,
                rawEvent: event.rawEvent,
                entity,
            });
        }
    }

    return element;
}

/**
 * @deprecated
 * Content edit feature to move the cursor from Delimiters around Entities when using Right or Left Arrow Keys
 */
const MoveBetweenDelimitersFeature: BuildInEditFeature<PluginKeyboardEvent> = {
    keys: [],
    shouldHandleEvent: () => false,
    handleEvent: () => {},
};

/**
 * @requires ExperimentalFeatures.InlineEntityReadOnlyDelimiters to be enabled
 * Content edit Feature to trigger a Delete Entity Operation when one of the Delimiter is about to be removed with DELETE or Backspace
 */
const RemoveEntityBetweenDelimitersFeature: BuildInEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.BACKSPACE, Keys.DELETE],
    shouldHandleEvent(event: PluginKeyboardEvent, editor: IEditor) {
        if (!editor.isFeatureEnabled(ExperimentalFeatures.InlineEntityReadOnlyDelimiters)) {
            return false;
        }

        const range = editor.getSelectionRange();
        if (!range?.collapsed) {
            return false;
        }
        const checkBefore = event.rawEvent.which === Keys.DELETE;
        const isDelimiter = getIsDelimiterAtCursor(event, editor, checkBefore);

        if (isDelimiter) {
            const delimiter = cacheDelimiter(event, checkBefore);
            const entityElement = checkBefore
                ? delimiter?.nextElementSibling
                : delimiter?.previousElementSibling;

            return !!cacheEntityBetweenDelimiter(event, editor, checkBefore, entityElement);
        }

        return false;
    },
    handleEvent(event: PluginKeyboardEvent, editor: IEditor) {
        const checkBefore = event.rawEvent.which === Keys.DELETE;
        cacheEntityBetweenDelimiter(
            event,
            editor,
            checkBefore,
            null,
            checkBefore ? EntityOperation.RemoveFromStart : EntityOperation.RemoveFromEnd
        );
    },
};

function getIsDelimiterAtCursor(event: PluginKeyboardEvent, editor: IEditor, checkBefore: boolean) {
    const position = editor.getFocusedPosition();
    cacheGetCheckBefore(event, checkBefore);

    if (!position) {
        return false;
    }

    const focusedElement =
        position.node.nodeType == NodeType.Text
            ? position.node
            : position.node == position.element && position.element.childNodes.length > 0
            ? position.element.childNodes.item(position.offset)
            : position.element;

    const searcher = editor.getContentSearcherOfCursor(event);
    const data = checkBefore
        ? {
              class: DelimiterClasses.DELIMITER_BEFORE,
              pairClass: DelimiterClasses.DELIMITER_AFTER,
              getDelimiterPair: (element: HTMLElement) =>
                  element.nextElementSibling?.nextElementSibling,
              getNextSibling: () => {
                  return searcher.getInlineElementAfter()?.getContainerNode();
              },
              isAtEndOrBeginning: position.isAtEnd,
          }
        : {
              class: DelimiterClasses.DELIMITER_AFTER,
              pairClass: DelimiterClasses.DELIMITER_BEFORE,
              getDelimiterPair: (element: HTMLElement) =>
                  element.previousElementSibling?.previousElementSibling,
              getNextSibling: () => {
                  return searcher.getInlineElementBefore()?.getContainerNode();
              },
              isAtEndOrBeginning: position.offset == 0,
          };

    position.element.normalize();
    const sibling = data.getNextSibling();
    if (data.isAtEndOrBeginning && sibling) {
        const elAtCursor = editor.getElementAtCursor('.' + data.class, sibling);

        if (elAtCursor && !!shouldHandle(elAtCursor)) {
            return true;
        }
    }

    const entityAtCursor = editor.getElementAtCursor('.' + data.class, focusedElement);
    return !!shouldHandle(entityAtCursor);

    function shouldHandle(element: HTMLElement | null | undefined) {
        return (
            element &&
            (data.getDelimiterPair(element)?.className || '').indexOf(data.pairClass!) > -1 &&
            cacheDelimiter(event, checkBefore, element)
        );
    }
}

function cacheDelimiter(event: PluginEvent, checkBefore: boolean, delimiter?: HTMLElement | null) {
    return cacheGetEventData(event, 'delimiter_cache_key_' + checkBefore, () => delimiter);
}

function cacheEntityBetweenDelimiter(
    event: PluginKeyboardEvent,
    editor: IEditor,
    checkBefore: boolean,
    entity?: Element | null,
    operation?: EntityOperation
) {
    const element = cacheGetEventData(
        event,
        'entity_delimiter_cache_key_' + checkBefore,
        () => entity && editor.getElementAtCursor(getEntitySelector(), entity)
    );

    if (element && operation !== undefined) {
        const entity = getEntityFromElement(element);

        if (entity) {
            editor.triggerPluginEvent(PluginEventType.EntityOperation, {
                operation,
                rawEvent: event.rawEvent,
                entity,
            });
        }
    }

    return element;
}

function cacheGetCheckBefore(event: PluginKeyboardEvent, checkBefore?: boolean): boolean {
    return !!cacheGetEventData(event, 'Check_Before', () => checkBefore);
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
    moveBetweenDelimitersFeature: MoveBetweenDelimitersFeature,
    removeEntityBetweenDelimiters: RemoveEntityBetweenDelimitersFeature,
};
