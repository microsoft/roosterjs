import {
    DelimiterClasses,
    EntityOperation,
    IEditor,
    NodeType,
    PluginEventType,
    PositionType,
} from 'roosterjs-editor-types';
import {
    getDelimiterFromElement,
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

export function inlineEntityOnPluginEvent(event: PluginEvent, editor: IEditor) {
    switch (event.eventType) {
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
        case PluginEventType.KeyUp:
            if (isCharacterValue(event.rawEvent)) {
                const position = editor.getFocusedPosition();

                if (!position) {
                    return;
                }

                const elementAtCursor = editor.getElementAtCursor(
                    DELIMITER_SELECTOR,
                    position.element
                );
                const delimiter = getDelimiterFromElement(elementAtCursor);

                if (!delimiter || !elementAtCursor) {
                    return;
                }

                elementAtCursor.normalize();
                const textNode = elementAtCursor.firstChild as Node;
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
                            elementAtCursor.childNodes.forEach(node => {
                                if (node.nodeValue !== ZERO_WIDTH_SPACE) {
                                    nodeToMove = node;
                                }
                            });
                            if (nodeToMove) {
                                elementAtCursor.parentElement?.insertBefore(
                                    nodeToMove,
                                    delimiter.className == DelimiterClasses.DELIMITER_BEFORE
                                        ? elementAtCursor
                                        : elementAtCursor.nextSibling
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

function getDelimiter(entityWrapper: HTMLElement, after: boolean): HTMLElement | undefined {
    const el = after ? entityWrapper.nextElementSibling : entityWrapper.previousElementSibling;
    return el && safeInstanceOf(el, 'HTMLElement') && getDelimiterFromElement(el) ? el : undefined;
}

function removeDelimiters(entityWrapper: HTMLElement): void {
    let el: HTMLElement | undefined = undefined;
    if ((el = getDelimiter(entityWrapper, true))) {
        el.parentElement?.removeChild(el);
    }
    if ((el = getDelimiter(entityWrapper, false))) {
        el.parentElement?.removeChild(el);
    }
}

function isReadOnly(entity: Entity) {
    return (
        entity.isReadonly &&
        !isBlockElement(entity.wrapper) &&
        safeInstanceOf(entity.wrapper, 'HTMLElement')
    );
}
