import { addDelimiters, commitEntity } from 'roosterjs-editor-dom';
import { inlineEntityOnPluginEvent } from '../../lib/corePlugins/utils/InlineEntityHandlers/inlineEntityOnPluginEvent';
import {
    EntityOperation,
    EntityOperationEvent,
    Entity,
    PluginEventType,
} from 'roosterjs-editor-types';

describe('Inline Entity On Plugin Event | ', () => {
    let wrapper: HTMLElement;

    beforeEach(() => {
        wrapper = document.createElement('span');
        wrapper.innerHTML = 'Test';
        document.body.appendChild(wrapper);
    });

    afterEach(() => {
        wrapper.parentElement?.removeChild(wrapper);
        document.body.childNodes.forEach(cn => {
            document.body.removeChild(cn);
        });
    });

    describe('Remove Entity Operations | ', () => {
        const removeOperations = [
            EntityOperation.RemoveFromStart,
            EntityOperation.RemoveFromEnd,
            EntityOperation.Overwrite,
        ];
        let entity: Entity;
        let delimiterAfter: HTMLElement;
        let delimiterBefore: HTMLElement;

        beforeEach(() => {
            entity = <Entity>{
                id: 'test',
                isReadonly: true,
                type: 'Test',
                wrapper,
            };

            commitEntity(wrapper, 'test', true, 'test');
            addDelimiters(wrapper);

            inlineEntityOnPluginEvent(<EntityOperationEvent>{
                entity,
                eventType: PluginEventType.EntityOperation,
                operation: EntityOperation.NewEntity,
            });

            delimiterAfter = getDelimiter(entity, true /* after */);
            delimiterBefore = getDelimiter(entity, false /* after */);
        });

        removeOperations.forEach(operation => {
            it('removeDelimiter when Deleting entity between them', () => {
                inlineEntityOnPluginEvent(<EntityOperationEvent>{
                    entity,
                    eventType: PluginEventType.EntityOperation,
                    operation,
                });

                expect(document.contains(delimiterAfter)).toBeFalse();
                expect(document.contains(delimiterBefore)).toBeFalse();
            });
        });
    });
});

function getDelimiter(entity: Entity, after: boolean) {
    return (after
        ? entity.wrapper.nextElementSibling!
        : entity.wrapper.previousElementSibling!) as HTMLElement;
}
