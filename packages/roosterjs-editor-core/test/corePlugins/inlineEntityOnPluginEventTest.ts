import { inlineEntityOnPluginEvent } from '../../lib/corePlugins/utils/InlineEntityHandlers/inlineEntityOnPluginEvent';
import { commitEntity } from 'roosterjs-editor-dom';
import {
    EntityOperation,
    EntityOperationEvent,
    IEditor,
    Entity,
    PluginEventType,
} from 'roosterjs-editor-types';

describe('Inline Entity On Plugin Event | ', () => {
    let editor: IEditor;
    let triggerPluginEvent: jasmine.Spy;
    let triggerContentChangedEvent: jasmine.Spy;
    let select: jasmine.Spy;
    let queryElements: jasmine.Spy;
    let wrapper: HTMLElement;

    beforeEach(() => {
        triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');
        triggerContentChangedEvent = jasmine.createSpy('triggerContentChangedEvent');
        select = jasmine.createSpy('select');
        queryElements = jasmine.createSpy('queryElements');

        editor = <IEditor>(<any>{
            getDocument: () => document,
            getElementAtCursor: (selector: string, node: Node) => node,
            addContentEditFeature: () => {},
            triggerPluginEvent,
            queryElements: (selector: string) => {
                queryElements();
                return document.querySelectorAll(selector);
            },
            triggerContentChangedEvent,
            runAsync: (callback: () => void) => callback(),
            select,
            getSelectionRange: () =>
                <Range>{
                    collapsed: true,
                },
        });

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

    describe('New Entity | ', () => {
        it('Insert new inline editable entity', () => {
            const entity = <Entity>{
                id: 'Test',
                isReadonly: false,
                type: 'Test',
                wrapper,
            };
            inlineEntityOnPluginEvent(
                <EntityOperationEvent>{
                    entity,
                    eventType: PluginEventType.EntityOperation,
                    operation: EntityOperation.NewEntity,
                },
                editor
            );

            expect(triggerContentChangedEvent).toHaveBeenCalledTimes(0);
            expect(select).toHaveBeenCalledTimes(0);
        });

        it('Insert new inline readonly entity', () => {
            const entity = <Entity>{
                id: 'Test',
                isReadonly: true,
                type: 'Test',
                wrapper,
            };
            inlineEntityOnPluginEvent(
                <EntityOperationEvent>{
                    entity,
                    eventType: PluginEventType.EntityOperation,
                    operation: EntityOperation.NewEntity,
                },
                editor
            );

            expect(triggerContentChangedEvent).toHaveBeenCalledTimes(0);
            expect(select).toHaveBeenCalledTimes(1);
            const delimiterBefore = getDelimiter(entity, false /* after */);
            const delimiterAfter = getDelimiter(entity, true /* after */);

            expect(delimiterBefore).toBeDefined();
            expect(delimiterAfter).toBeDefined();
            expect(entity.wrapper.nextElementSibling).toBe(delimiterAfter);
            expect(entity.wrapper.previousElementSibling).toBe(delimiterBefore);
        });

        it('Insert new block readonly entity', () => {
            wrapper.parentElement?.removeChild(wrapper);
            wrapper = document.createElement('DIV');
            wrapper.innerHTML = 'Test';
            document.body.appendChild(wrapper);

            const entity = <Entity>{
                id: 'Test',
                isReadonly: false,
                type: 'Test',
                wrapper,
            };
            inlineEntityOnPluginEvent(
                <EntityOperationEvent>{
                    entity,
                    eventType: PluginEventType.EntityOperation,
                    operation: EntityOperation.NewEntity,
                },
                editor
            );

            expect(triggerContentChangedEvent).toHaveBeenCalledTimes(0);
            expect(select).toHaveBeenCalledTimes(0);
        });

        it('Insert new block editable entity', () => {
            wrapper.parentElement?.removeChild(wrapper);
            wrapper = document.createElement('DIV');
            wrapper.innerHTML = 'Test';
            document.body.appendChild(wrapper);

            const entity = <Entity>{
                id: 'Test',
                isReadonly: true,
                type: 'Test',
                wrapper,
            };
            inlineEntityOnPluginEvent(
                <EntityOperationEvent>{
                    entity,
                    eventType: PluginEventType.EntityOperation,
                    operation: EntityOperation.NewEntity,
                },
                editor
            );

            expect(triggerContentChangedEvent).toHaveBeenCalledTimes(0);
            expect(select).toHaveBeenCalledTimes(0);
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

            inlineEntityOnPluginEvent(
                <EntityOperationEvent>{
                    entity,
                    eventType: PluginEventType.EntityOperation,
                    operation: EntityOperation.NewEntity,
                },
                editor
            );

            delimiterAfter = getDelimiter(entity, true /* after */);
            delimiterBefore = getDelimiter(entity, false /* after */);
        });

        removeOperations.forEach(operation => {
            it('removeDelimiter when Deleting entity between them', () => {
                inlineEntityOnPluginEvent(
                    <EntityOperationEvent>{
                        entity,
                        eventType: PluginEventType.EntityOperation,
                        operation,
                    },
                    editor
                );

                expect(document.contains(delimiterAfter)).toBeFalse();
                expect(document.contains(delimiterBefore)).toBeFalse();
                expect(queryElements).toHaveBeenCalledTimes(0);
                expect(triggerPluginEvent).toHaveBeenCalledTimes(0);
            });
        });
    });
});
function getDelimiter(entity: Entity, after: boolean) {
    return (after
        ? entity.wrapper.nextElementSibling!
        : entity.wrapper.previousElementSibling!) as HTMLElement;
}
