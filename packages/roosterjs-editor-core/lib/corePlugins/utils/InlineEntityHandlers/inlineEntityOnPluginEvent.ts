import {
    DelimiterClasses,
    EntityOperation,
    IEditor,
    NodeType,
    PluginEventType,
    PositionType,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';
import {
    addDelimiterAfter,
    addDelimiterBefore,
    getDelimiterFromElement,
    getEntityFromElement,
    getEntitySelector,
    isBlockElement,
    isCharacterValue,
    Position,
    safeInstanceOf,
    splitTextNode,
} from 'roosterjs-editor-dom';
import type { Entity, PluginEvent } from 'roosterjs-editor-types';

const DELIMITER_SELECTOR =
    '.' + DelimiterClasses.DELIMITER_AFTER + ',.' + DelimiterClasses.DELIMITER_BEFORE;
const ZERO_WIDTH_SPACE = '\u200B';
const INLINE_ENTITY_SELECTOR = 'span' + getEntitySelector();

export function inlineEntityOnPluginEvent(event: PluginEvent, editor: IEditor) {
    switch (event.eventType) {
        case PluginEventType.EditorReady:
            editor.queryElements(INLINE_ENTITY_SELECTOR).forEach(addDelimitersIfNeeded);
            break;

        case PluginEventType.BeforePaste:
            event.fragment.querySelectorAll(INLINE_ENTITY_SELECTOR).forEach(addDelimitersIfNeeded);
            break;

        case PluginEventType.ExtractContentWithDom:
        case PluginEventType.BeforeCutCopy:
            event.clonedRoot.querySelectorAll(DELIMITER_SELECTOR).forEach(node => {
                node.parentElement?.removeChild(node);
            });
            break;

        case PluginEventType.EntityOperation:
            switch (event.operation) {
                case EntityOperation.RemoveFromStart:
                case EntityOperation.RemoveFromEnd:
                case EntityOperation.Overwrite:
                    const entity = event.entity;

                    // If the entity removed is a readonly entity, try to remove delimiters around it.
                    if (isReadOnly(entity)) {
                        removeDelimiters(entity.wrapper);
                    }
                    break;
            }
            break;

        case PluginEventType.KeyDown:
            const range = editor.getSelectionRangeEx();
            if (
                range.type == SelectionRangeTypes.Normal &&
                range.areAllCollapsed &&
                isCharacterValue(event.rawEvent)
            ) {
                const position = editor.getFocusedPosition();

                if (!position) {
                    return;
                }

                const delimiter = editor.getElementAtCursor(DELIMITER_SELECTOR, position.element);

                if (
                    !delimiter ||
                    (!delimiter.classList.contains(DelimiterClasses.DELIMITER_AFTER) &&
                        !delimiter.classList.contains(DelimiterClasses.DELIMITER_BEFORE))
                ) {
                    return;
                }

                delimiter.normalize();
                const textNode = delimiter.firstChild as Node;
                if (textNode?.nodeType == NodeType.Text) {
                    editor.runAsync(() => {
                        const index = textNode.nodeValue?.indexOf(ZERO_WIDTH_SPACE) ?? -1;
                        if (index >= 0) {
                            splitTextNode(
                                <Text>textNode,
                                index == 0 ? 1 : index,
                                false /* returnFirstPart */
                            );
                            let nodeToMove: Node | undefined;
                            delimiter.childNodes.forEach(node => {
                                if (node.nodeValue !== ZERO_WIDTH_SPACE) {
                                    nodeToMove = node;
                                }
                            });
                            if (nodeToMove) {
                                delimiter.parentElement?.insertBefore(
                                    nodeToMove,
                                    delimiter.className == DelimiterClasses.DELIMITER_BEFORE
                                        ? delimiter
                                        : delimiter.nextSibling
                                );
                                const selection = nodeToMove.ownerDocument?.getSelection();

                                if (selection) {
                                    selection.setPosition(
                                        nodeToMove,
                                        new Position(nodeToMove, PositionType.End).offset
                                    );
                                }
                            }
                        }
                    });
                }
            }
    }
}

function getDelimiters(entityWrapper: HTMLElement): (HTMLElement | undefined)[] {
    return [entityWrapper.nextElementSibling, entityWrapper.previousElementSibling].map(el =>
        el && safeInstanceOf(el, 'HTMLElement') && getDelimiterFromElement(el) ? el : undefined
    );
}

function addDelimitersIfNeeded(node: Element) {
    if (safeInstanceOf(node, 'HTMLElement') && isReadOnly(getEntityFromElement(node))) {
        const [delimiterAfter, delimiterBefore] = getDelimiters(node);

        if (!delimiterAfter) {
            addDelimiterAfter(node);
        }
        if (!delimiterBefore) {
            addDelimiterBefore(node);
        }
    }
}

function removeDelimiters(entityWrapper: HTMLElement): void {
    getDelimiters(entityWrapper).forEach(removeNode);
}

function removeNode(el: HTMLElement | undefined) {
    el?.parentElement?.removeChild(el);
}

function isReadOnly(entity: Entity | null) {
    return (
        entity?.isReadonly &&
        !isBlockElement(entity.wrapper) &&
        safeInstanceOf(entity.wrapper, 'HTMLElement')
    );
}
