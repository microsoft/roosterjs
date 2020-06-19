import Editor from '../editor/Editor';
import getEntityFromElement from './getEntityFromElement';
import { EntityOperation, PluginEventType } from 'roosterjs-editor-types';

/**
 * @internal
 * @param editor
 * @param element
 * @param operation
 * @param rawEvent
 */
export default function tryTriggerEntityEvent(
    editor: Editor,
    element: HTMLElement,
    operation: EntityOperation,
    rawEvent: UIEvent
) {
    const entity = element && getEntityFromElement(element);

    if (entity) {
        if (operation == EntityOperation.NewEntity && entity.isReadonly) {
            element.contentEditable = 'false';
        }

        editor.triggerEvent({
            eventType: PluginEventType.EntityOperation,
            operation,
            rawEvent,
            entity,
        });
    }
}
