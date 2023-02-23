import { DELIMITER_AFTER, DELIMITER_BEFORE, DelimiterType } from './constants';
import { EntityOperation, NodeType, PluginEventType, PositionType } from 'roosterjs-editor-types';
import { isDelimiter } from './isDelimiter';
import {
    isBlockElement,
    isCharacterValue,
    Position,
    safeInstanceOf,
    splitParentNode,
    splitTextNode,
} from 'roosterjs-editor-dom';
import type { Entity, IEditor, PluginEvent } from 'roosterjs-editor-types';

const ZERO_WIDTH_SPACE = '\u200B';

let delimiterId = 0;

export function inlineEntityOnPluginEvent(event: PluginEvent, editor: IEditor) {
    switch (event.eventType) {
        case PluginEventType.EntityOperation:
            const { wrapper } = event.entity;
            switch (event.operation) {
                case EntityOperation.NewEntity:
                    // If the new entity is Read Only and inline, add delimiters to it
                    if (isReadOnly(event.entity)) {
                        const element = wrapper as HTMLElement;

                        // Do not add delimiters if the entity already have them, in scenarios such as Remove + Undo
                        if (isBetweenDelimiter(element)) {
                            return;
                        }

                        const elementBefore = insertNode(ZERO_WIDTH_SPACE, element, 'beforebegin');
                        const elementAfter = insertNode(ZERO_WIDTH_SPACE, element, 'afterend');

                        commitDelimiters(elementBefore, elementAfter);

                        editor.runAsync(() => {
                            editor.select(new Position(wrapper, PositionType.After));
                        });
                    }
                    break;
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
                    '[id*=DelimiterBefore], [id*=DelimiterAfter]',
                    position.element
                );
                const delimiterType = isDelimiter(elementAtCursor);

                if (!delimiterType || !elementAtCursor) {
                    return;
                }

                if (delimiterType == DelimiterType.After) {
                    elementAtCursor.normalize();
                    const textNode = elementAtCursor.firstChild as Node;
                    if (textNode.nodeType == NodeType.Text) {
                        const index = textNode.nodeValue?.indexOf(ZERO_WIDTH_SPACE) ?? -1;
                        if (index >= 0) {
                            const text = splitTextNode(
                                <Text>textNode,
                                index + 1,
                                false /* returnFirstPart */
                            );
                            splitParentNode(text, true /* splitBefore */);
                            editor.getElementAtCursor('span', text)?.removeAttribute('class');
                            editor.getDocument().getSelection()?.setPosition(text, 1);
                        }
                    }
                } else if (delimiterType == DelimiterType.Before) {
                    elementAtCursor.normalize();
                    const textNode = elementAtCursor.firstChild as Node;
                    if (textNode.nodeType == NodeType.Text) {
                        editor.getDocument().getSelection()?.setPosition(textNode, 0);

                        editor.runAsync(() => {
                            const index = textNode.nodeValue?.indexOf(ZERO_WIDTH_SPACE) ?? -1;
                            if (index >= 0) {
                                const text = splitTextNode(
                                    <Text>textNode,
                                    index,
                                    true /* returnFirstPart */
                                );
                                elementAtCursor.parentElement?.insertBefore(text, elementAtCursor);
                            }
                        });
                    }
                }
            }
    }

    function insertNode(
        text: string,
        scopeElement: HTMLElement,
        insertPosition: InsertPosition
    ): HTMLElement {
        const span = editor.getDocument().createElement('span');
        span.textContent = text;
        return scopeElement.insertAdjacentElement(insertPosition, span) as HTMLElement;
    }
}

function getDelimiter(entityWrapper: HTMLElement, after: boolean): HTMLElement | undefined {
    const el = after ? entityWrapper.nextElementSibling : entityWrapper.previousElementSibling;
    return el && isDelimiter(el) && safeInstanceOf(el, 'HTMLElement') ? el : undefined;
}

function removeDelimiters(entityWrapper: HTMLElement): void {
    let el: HTMLElement | undefined = undefined;
    if ((el = getDelimiter(entityWrapper, true /* after */))) {
        el.parentElement?.removeChild(el);
    }
    if ((el = getDelimiter(entityWrapper, false /* after */))) {
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

function isBetweenDelimiter(element: HTMLElement): boolean {
    return !!(
        isDelimiter(element.nextElementSibling) && isDelimiter(element.previousElementSibling)
    );
}

function commitDelimiters(delimiterBefore: HTMLElement, delimiterAfter: HTMLElement) {
    delimiterId++;

    delimiterBefore.id = delimiterId + DELIMITER_BEFORE;
    delimiterAfter.id = delimiterId + DELIMITER_AFTER;
}
