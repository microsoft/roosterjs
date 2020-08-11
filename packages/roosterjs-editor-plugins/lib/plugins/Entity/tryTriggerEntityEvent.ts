import getEntityFromElement from './getEntityFromElement';
import { Editor } from 'roosterjs-editor-core';
import { EntityOperation, PluginEventType } from 'roosterjs-editor-types';

/**
 * @internal
 * Try to trigger an EntityOperation event with a given element. An event will only be
 * triggered when the specified is an element root element.
 * @param editor The editor which contains the entity
 * @param element The root element of the entity
 * @param operation Operation of the EntityOperation event
 * @param rawEvent (Optional) Original UI event which causes this event
 */
export default function tryTriggerEntityEvent(
    editor: Editor,
    element: HTMLElement,
    operation: EntityOperation,
    rawEvent?: UIEvent
) {
    const entity = element && getEntityFromElement(element);

    if (entity) {
        if (operation == EntityOperation.NewEntity && entity.isReadonly) {
            element.contentEditable = 'false';
        }

        editor.triggerPluginEvent(PluginEventType.EntityOperation, {
            operation,
            rawEvent,
            entity,
        });
    }
}
