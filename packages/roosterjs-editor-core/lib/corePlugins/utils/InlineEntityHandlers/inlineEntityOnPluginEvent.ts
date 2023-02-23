import { getDelimiterFromElement, isBlockElement, safeInstanceOf } from 'roosterjs-editor-dom';
import { DelimiterClasses, EntityOperation, PluginEventType } from 'roosterjs-editor-types';
import type { Entity, PluginEvent } from 'roosterjs-editor-types';

const DELIMITER_SELECTOR =
    '.' + DelimiterClasses.DELIMITER_AFTER + ',.' + DelimiterClasses.DELIMITER_BEFORE;

export function inlineEntityOnPluginEvent(event: PluginEvent) {
    switch (event.eventType) {
        case PluginEventType.ExtractContentWithDom:
            event.clonedRoot.querySelectorAll(DELIMITER_SELECTOR).forEach(node => {
                node.parentElement?.removeChild(node);
            });
            break;

        case PluginEventType.EntityOperation:
            const { wrapper } = event.entity;
            switch (event.operation) {
                case EntityOperation.RemoveFromStart:
                case EntityOperation.RemoveFromEnd:
                case EntityOperation.Overwrite:
                    const entity = event.entity;

                    // If the entity removed is a readonly entity, try to remove delimiters around it.
                    if (isReadOnly(entity)) {
                        removeDelimiters(wrapper);
                    }
                    break;
            }
            break;
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
