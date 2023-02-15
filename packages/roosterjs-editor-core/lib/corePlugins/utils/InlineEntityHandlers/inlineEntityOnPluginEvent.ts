import { DELIMITER_AFTER, DELIMITER_BEFORE, DelimiterType } from './constants';
import { isDelimiter } from './isDelimiter';
import {
    ChangeSource,
    EntityOperation,
    PluginEventType,
    PositionType,
} from 'roosterjs-editor-types';
import {
    commitEntity,
    createRange,
    getEntityFromElement,
    getEntitySelector,
    isBlockElement,
    matchesSelector,
    Position,
    safeInstanceOf,
} from 'roosterjs-editor-dom';
import type { Entity, EntityOperationEvent, IEditor, PluginEvent } from 'roosterjs-editor-types';

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

                        const elementBefore = insertNode(
                            `${ZERO_WIDTH_SPACE}`,
                            element,
                            'beforebegin'
                        );
                        const elementAfter = insertNode(`${ZERO_WIDTH_SPACE}`, element, 'afterend');

                        delimiterId++;

                        const idBefore = delimiterId + DELIMITER_BEFORE;
                        const idAfter = delimiterId + DELIMITER_AFTER;
                        commitEntity(elementBefore, idBefore, false, idAfter);
                        commitEntity(elementAfter, idAfter, false, idBefore);

                        editor.triggerContentChangedEvent(ChangeSource.InsertEntity, elementBefore);
                        editor.triggerContentChangedEvent(ChangeSource.InsertEntity, elementAfter);

                        editor.runAsync(() => {
                            editor.select(new Position(new Position(wrapper, PositionType.After)));
                        });
                    }
                    break;
                case EntityOperation.RemoveFromStart:
                case EntityOperation.RemoveFromEnd:
                case EntityOperation.Overwrite:
                    const entity = event.entity;
                    const id = entity.id;

                    const delimiter = isDelimiter(entity);

                    // If the current deleted entity is a delimiter, Remove the other delimiter pair and remove the Readonly entity between the delimiters.
                    // Trigger the same event for the entity between the delimiters to allow other plugins to dispose resources accordingly.
                    if (delimiter) {
                        const [delimiterType, entity] = delimiter;

                        if (delimiterType == DelimiterType.After) {
                            const elBefore = editor.queryElements(getEntitySelector(id))[0];

                            if (elBefore) {
                                editor.select(
                                    createRange(
                                        new Position(elBefore, 0),
                                        new Position(entity.wrapper, PositionType.After)
                                    )
                                );

                                triggerEntityEvent(entity, event);
                            }
                        } else if (delimiterType == DelimiterType.Before) {
                            const elAfter = editor.queryElements(getEntitySelector(id))[0];

                            if (elAfter) {
                                editor.select(
                                    createRange(
                                        new Position(entity.wrapper, PositionType.Before),
                                        new Position(elAfter, 0)
                                    )
                                );
                                triggerEntityEvent(entity, event, true /* deletedFromBefore */);
                            }
                        }
                    }

                    // If the entity removed is a readonly entity, try to remove delimiters around it.
                    if (isReadOnly(entity)) {
                        removeDelimiters(entity.wrapper);
                    }
                    break;

                case EntityOperation.Click:
                    const range = editor.getSelectionRange();
                    // If the Entity is ReadOnly inline is clicked modify the selection to be the delimiter after. So we can see the cursor.
                    if (isReadOnly(event.entity) && range?.collapsed) {
                        const [_, delimiterAfter] = getDelimitersFromReadOnlyEntity(event.entity);

                        if (delimiterAfter) {
                            editor.select(createRange(delimiterAfter.wrapper, 1));
                        }
                    }
                    break;
            }
            break;
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

    function triggerEntityEvent(
        entity: Entity,
        event: EntityOperationEvent,
        deletedFromBefore: boolean = false
    ) {
        const elBetweenDelimiter = deletedFromBefore
            ? entity.wrapper.nextElementSibling
            : entity.wrapper.previousElementSibling;
        if (elBetweenDelimiter && safeInstanceOf(elBetweenDelimiter, 'HTMLElement')) {
            const entityBetweenDelimiter = getEntityFromElement(elBetweenDelimiter);
            if (entityBetweenDelimiter) {
                editor.triggerPluginEvent(event.eventType, {
                    operation: event.operation,
                    eventDataCache: event.eventDataCache,
                    rawEvent: event.rawEvent,
                    entity: entityBetweenDelimiter,
                });
            }
        }
    }
}

function getDelimiter(entityWrapper: HTMLElement, after: boolean): HTMLElement | undefined {
    const el = after ? entityWrapper.nextElementSibling : entityWrapper.previousElementSibling;
    return el &&
        matchesSelector(el, `[class*=${after ? DELIMITER_AFTER : DELIMITER_BEFORE}]`) &&
        safeInstanceOf(el, 'HTMLElement')
        ? el
        : undefined;
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

function getDelimitersFromReadOnlyEntity(entity: Entity): [Entity | undefined, Entity | undefined] {
    const wrapper = entity.wrapper;
    return [
        isDelimiter(wrapper.previousElementSibling)?.[1],
        isDelimiter(wrapper.nextElementSibling)?.[1],
    ];
}

function isBetweenDelimiter(element: HTMLElement): boolean {
    return !!(
        isDelimiter(element.nextElementSibling) && isDelimiter(element.previousElementSibling)
    );
}
