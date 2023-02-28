import {
    cacheGetEventData,
    getComputedStyle,
    getEntityFromElement,
    getEntitySelector,
    matchesSelector,
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
} from 'roosterjs-editor-types';

const ZERO_WIDTH_SPACE = '\u200B';

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
 * Content edit feature to move the cursor from Delimiters around Entities when using Right or Left Arrow Keys
 */
const MoveBetweenDelimitersFeature: BuildInEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.RIGHT, Keys.LEFT],
    shouldHandleEvent: (event: PluginKeyboardEvent, editor: IEditor) => {
        const element = editor.getElementAtCursor();
        const isRTL = getComputedStyle(element, 'direction') === 'rtl';
        const shouldCheckBefore = isRTL == (event.rawEvent.which === Keys.LEFT);

        return getIsDelimiterAtCursor(event, editor, shouldCheckBefore);
    },
    handleEvent(event: PluginKeyboardEvent, editor: IEditor) {
        const checkBefore = cacheGetCheckBefore(event);
        const delimiter = cacheDelimiter(event, checkBefore);

        if (!delimiter) {
            return;
        }

        const { delimiterPair, entity } = getRelatedElements(delimiter, checkBefore);

        if (delimiterPair && matchesSelector(entity, getEntitySelector())) {
            event.rawEvent.preventDefault();
            editor.runAsync(() => {
                let offset = 0;
                delimiterPair.childNodes.forEach((node, index) => {
                    if (node.textContent === ZERO_WIDTH_SPACE) {
                        offset = index;
                    }
                });

                const position = checkBefore
                    ? new Position(delimiterPair, offset + 1)
                    : new Position(delimiterPair, PositionType.Before);

                if (event.rawEvent.shiftKey) {
                    const selection = delimiterPair.ownerDocument.getSelection();
                    selection?.extend(position.element, position.offset);
                } else {
                    editor.select(position);
                }
            });
        }
    },
};

/**
 * Content edit Feature to trigger a Delete Entity Operation when one of the Delimiter is about to be removed with DELETE or Backspace
 */
const RemoveEntityBetweenDelimitersFeature: BuildInEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.BACKSPACE, Keys.DELETE],
    shouldHandleEvent(event: PluginKeyboardEvent, editor: IEditor) {
        const range = editor.getSelectionRange();
        if (!range.collapsed) {
            return false;
        }
        const checkBefore = event.rawEvent.which === Keys.DELETE;
        const isDelimiter = getIsDelimiterAtCursor(event, editor, checkBefore);

        if (isDelimiter) {
            const delimiter = cacheDelimiter(event, checkBefore);
            const entityElement = checkBefore
                ? delimiter.nextElementSibling
                : delimiter.previousElementSibling;

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
            : position.node == position.element
            ? position.element.childNodes.item(position.offset)
            : position.element;

    const data = checkBefore
        ? {
              class: DelimiterClasses.DELIMITER_BEFORE,
              pairClass: DelimiterClasses.DELIMITER_AFTER,
              getDelimiterPair: (element: HTMLElement) =>
                  element.nextElementSibling?.nextElementSibling,
              getNextSibling: () => {
                  if (position.node.nodeType == NodeType.Text) {
                      return position.node.nextSibling != null
                          ? position.node.nextSibling
                          : (position.node.parentNode as HTMLElement).className ===
                            DelimiterClasses.DELIMITER_BEFORE
                          ? position.node.parentElement
                          : null;
                  } else if (position.node == position.element) {
                      return position.element.childNodes.item(position.offset);
                  } else {
                      return null;
                  }
              },
              isAtEndOrBeginning: position.isAtEnd,
          }
        : {
              class: DelimiterClasses.DELIMITER_AFTER,
              pairClass: DelimiterClasses.DELIMITER_BEFORE,
              getDelimiterPair: (element: HTMLElement) =>
                  element.previousElementSibling?.previousElementSibling,
              getNextSibling: () => {
                  if (position.node.nodeType == NodeType.Text) {
                      return position.node.previousSibling != null
                          ? position.node.previousSibling
                          : (position.node.parentNode as HTMLElement).className ===
                            DelimiterClasses.DELIMITER_AFTER
                          ? position.node.parentElement
                          : null;
                  } else if (position.node == position.element) {
                      return position.element.childNodes.item(position.offset);
                  } else {
                      return null;
                  }
              },
              isAtEndOrBeginning: position.offset == 0,
          };

    position.element.normalize();
    if (data.isAtEndOrBeginning && data.getNextSibling()) {
        const elAtCursor = editor.getElementAtCursor('.' + data.class, data.getNextSibling());

        if (!!shouldHandle(elAtCursor)) {
            return true;
        }
    }

    const entityAtCursor = editor.getElementAtCursor('.' + data.class, focusedElement);

    return !!shouldHandle(entityAtCursor);

    function shouldHandle(element: HTMLElement) {
        return (
            element &&
            data.getDelimiterPair(element)?.className.indexOf(data.pairClass) > -1 &&
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
    const element = cacheGetEventData(event, 'entity_delimiter_cache_key_' + checkBefore, () =>
        editor.getElementAtCursor(getEntitySelector(), entity)
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

function cacheGetCheckBefore(event: PluginKeyboardEvent, checkBefore?: boolean) {
    return cacheGetEventData(event, 'Check_Before', () => checkBefore);
}

function getRelatedElements(delimiter: HTMLElement, checkBefore: boolean) {
    let entity: Element;
    let delimiterPair: Element;
    if (checkBefore) {
        entity = delimiter.nextElementSibling;
        delimiterPair = entity.nextElementSibling;
    } else {
        entity = delimiter.previousElementSibling;
        delimiterPair = entity.previousElementSibling;
    }

    return { entity, delimiterPair };
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
