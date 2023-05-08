import { ContentTraverser } from 'roosterjs-editor-dom';
import {
    addDelimiters,
    cacheGetEventData,
    createRange,
    getComputedStyle,
    getDelimiterFromElement,
    getEntityFromElement,
    getEntitySelector,
    isBlockElement,
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
    ExperimentalFeatures,
    Entity,
    IContentTraverser,
    InlineElement,
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
            triggerOperation(entity, editor, operation, event);
        }
    }

    return element;
}

/**
 * @requires ExperimentalFeatures.InlineEntityReadOnlyDelimiters to be enabled
 * Content edit feature to move the cursor from Delimiters around Entities when using Right or Left Arrow Keys
 */
const MoveBetweenDelimitersFeature: BuildInEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.RIGHT, Keys.LEFT],
    allowFunctionKeys: true,
    shouldHandleEvent: (event: PluginKeyboardEvent, editor: IEditor) => {
        if (
            event.rawEvent.altKey ||
            !editor.isFeatureEnabled(ExperimentalFeatures.InlineEntityReadOnlyDelimiters)
        ) {
            return false;
        }

        const element = editor.getElementAtCursor();
        if (!element) {
            return false;
        }

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

        const { delimiterPair, entity } = getRelatedElements(delimiter, checkBefore, editor);

        if (delimiterPair && entity && matchesSelector(entity, getEntitySelector())) {
            event.rawEvent.preventDefault();
            editor.runAsync(() => {
                const positionType = checkBefore
                    ? event.rawEvent.shiftKey
                        ? PositionType.After
                        : PositionType.End
                    : PositionType.Before;
                const position = new Position(delimiterPair, positionType);
                if (event.rawEvent.shiftKey) {
                    const selection = delimiterPair.ownerDocument.getSelection();
                    selection?.extend(position.node, position.offset);
                } else {
                    editor.select(position);
                }
            });
        }
    },
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
    const position = editor.getFocusedPosition()?.normalize();
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
              isAtEndOrBeginning: position.isAtEnd,
          }
        : {
              class: DelimiterClasses.DELIMITER_AFTER,
              pairClass: DelimiterClasses.DELIMITER_BEFORE,
              isAtEndOrBeginning: position.offset == 0,
          };

    const sibling = getNextSibling(editor, focusedElement, checkBefore);
    if (data.isAtEndOrBeginning && sibling) {
        const elAtCursor = editor.getElementAtCursor('.' + data.class, sibling);

        if (elAtCursor && !!shouldHandle(elAtCursor)) {
            return true;
        }
    }

    const entityAtCursor =
        focusedElement && editor.getElementAtCursor('.' + data.class, focusedElement);
    return !!shouldHandle(entityAtCursor);

    function shouldHandle(element: HTMLElement | null | undefined) {
        if (!element) {
            return false;
        }

        const { delimiterPair } = getRelatedElements(element, checkBefore, editor);

        return (
            delimiterPair &&
            (delimiterPair.className || '').indexOf(data.pairClass) > -1 &&
            cacheDelimiter(event, checkBefore, element)
        );
    }
}

function getNextSibling(editor: IEditor, element: Node, checkBefore: boolean) {
    const traverser = getBlockTraverser(editor, element);
    if (!traverser) {
        return undefined;
    }

    const traverseFn = (t: IContentTraverser) =>
        checkBefore ? t.getNextInlineElement() : t.getPreviousInlineElement();

    let currentInline = traverser.currentInlineElement;
    while (currentInline && currentInline.getContainerNode() === element) {
        currentInline = traverseFn(traverser);
    }
    return currentInline?.getContainerNode();
}

function getBlockTraverser(editor: IEditor, element: Node | null | undefined) {
    if (!element) {
        return undefined;
    }
    const blockElement = editor.getBlockElementAtNode(element)?.getStartNode();
    if (!blockElement || !isBlockElement(blockElement)) {
        return undefined;
    }
    return ContentTraverser.createBodyTraverser(blockElement, element);
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
            triggerOperation(entity, editor, operation, event);
        }
    }

    return element;
}

function triggerOperation(
    entity: Entity,
    editor: IEditor,
    operation: EntityOperation,
    event: PluginKeyboardEvent
) {
    const { nextElementSibling, previousElementSibling } = entity.wrapper;
    editor.triggerPluginEvent(PluginEventType.EntityOperation, {
        operation,
        rawEvent: event.rawEvent,
        entity,
    });

    if (
        entity.isReadonly &&
        !isBlockElement(entity.wrapper) &&
        editor.isFeatureEnabled(ExperimentalFeatures.InlineEntityReadOnlyDelimiters)
    ) {
        if (event.rawEvent.defaultPrevented) {
            editor.runAsync(() => {
                if (!editor.contains(entity.wrapper)) {
                    removeDelimiters(nextElementSibling, previousElementSibling);
                } else {
                    const [delimiterAfter] = addDelimiters(entity.wrapper);
                    if (delimiterAfter) {
                        editor.select(delimiterAfter, PositionType.After);
                    }
                }
            });
        } else if (
            getDelimiterFromElement(nextElementSibling) &&
            getDelimiterFromElement(previousElementSibling)
        ) {
            editor.select(createRange(<Node>previousElementSibling, <Node>nextElementSibling));
        }
    }
}

function removeDelimiters(
    nextElementSibling: Element | null,
    previousElementSibling: Element | null
) {
    [nextElementSibling, previousElementSibling].forEach(sibling => {
        if (getDelimiterFromElement(sibling)) {
            sibling?.parentElement?.removeChild(sibling);
        }
    });
}

function cacheGetCheckBefore(event: PluginKeyboardEvent, checkBefore?: boolean): boolean {
    return !!cacheGetEventData(event, 'Check_Before', () => checkBefore);
}

function getRelatedElements(delimiter: HTMLElement, checkBefore: boolean, editor: IEditor) {
    let entity: Element | null = null;
    let delimiterPair: Element | null = null;
    const traverser = getBlockTraverser(editor, delimiter);
    if (!traverser) {
        return { delimiterPair, entity };
    }

    const selector = `.${
        checkBefore ? DelimiterClasses.DELIMITER_AFTER : DelimiterClasses.DELIMITER_BEFORE
    }`;
    const traverseFn = (t: IContentTraverser) =>
        checkBefore ? t.getNextInlineElement() : t.getPreviousInlineElement();
    const getElementFromInline = (element: InlineElement, selector: string) => {
        const node = element?.getContainerNode();
        return (node && editor.getElementAtCursor(selector, node)) ?? null;
    };
    const entitySelector = getEntitySelector();

    let current = traverser.currentInlineElement;
    while (current && (!entity || !delimiterPair)) {
        entity = entity || getElementFromInline(current, entitySelector);
        delimiterPair = delimiterPair || getElementFromInline(current, selector);

        // If we found the entity but the next inline after the entity is not a delimiter,
        // it means that the delimiter pair got removed or is invalid, return null instead.
        if (entity && !delimiterPair && !getElementFromInline(current, entitySelector)) {
            delimiterPair = null;
            break;
        }
        current = traverseFn(traverser);
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
