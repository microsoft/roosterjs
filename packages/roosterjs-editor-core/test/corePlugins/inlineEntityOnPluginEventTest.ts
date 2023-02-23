import { commitEntity, findClosestElementAncestor, Position } from 'roosterjs-editor-dom';
import { inlineEntityOnPluginEvent } from '../../lib/corePlugins/utils/InlineEntityHandlers/inlineEntityOnPluginEvent';
import {
    Entity,
    EntityOperation,
    EntityOperationEvent,
    PluginKeyDownEvent,
    IEditor,
    PluginEventType,
} from 'roosterjs-editor-types';

const ZERO_WIDTH_SPACE = '\u200B';

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

    describe('Handle Key Up & Down | ', () => {
        let entity: Entity;
        let delimiterAfter: HTMLElement;
        let delimiterBefore: HTMLElement;
        let textToAdd: Node;

        beforeEach(() => {
            ({ entity } = addEntityBeforeEach(entity, wrapper, editor, delimiterAfter));

            delimiterAfter = getDelimiter(entity, true /* after */);
            delimiterBefore = getDelimiter(entity, false /* after */);
            textToAdd = document.createTextNode('Text');

            editor.getElementAtCursor = (selector: string, selectFrom: Node) =>
                findClosestElementAncestor(selectFrom, document.body, selector);
        });

        const KeyEvents = [PluginEventType.KeyDown, PluginEventType.KeyUp];

        describe('Element Before | ', () => {
            KeyEvents.forEach((ev: PluginEventType) => {
                function arrangeAndAct(ev: PluginEventType) {
                    editor.getFocusedPosition = () => new Position(delimiterBefore, 0);

                    delimiterBefore.insertBefore(textToAdd, delimiterBefore.firstChild);

                    inlineEntityOnPluginEvent(
                        <PluginKeyDownEvent>{
                            eventType: ev,
                            rawEvent: <KeyboardEvent>{
                                which: 66 /* B */,
                                key: 'B',
                            },
                        },
                        editor
                    );
                }

                it('Is Delimiter | ' + ev, () => {
                    arrangeAndAct(ev);

                    expect(delimiterBefore.textContent).toEqual(ZERO_WIDTH_SPACE);
                    expect(delimiterBefore.textContent?.length).toEqual(1);
                    expect(delimiterBefore.childNodes.length).toEqual(1);
                });

                it('Is not Delimiter | ' + ev, () => {
                    delimiterBefore.removeAttribute('id');
                    arrangeAndAct(ev);

                    expect(delimiterBefore.textContent).not.toEqual(ZERO_WIDTH_SPACE);
                    expect(delimiterBefore.textContent?.length).toEqual(5);
                    expect(delimiterBefore.childNodes.length).toEqual(2);
                });
            });
        });

        describe('Element After | ', () => {
            function arrangeAndAct(eventType: PluginEventType) {
                editor.getFocusedPosition = () => new Position(delimiterAfter, 0);

                delimiterAfter.appendChild(textToAdd);

                inlineEntityOnPluginEvent(
                    <PluginKeyDownEvent>{
                        eventType,
                        rawEvent: <KeyboardEvent>{
                            which: 66 /* B */,
                            key: 'B',
                        },
                    },
                    editor
                );
            }

            KeyEvents.forEach((ev: PluginEventType) => {
                it('Is Delimiter' + ev, () => {
                    arrangeAndAct(ev);

                    delimiterAfter = getDelimiter(entity, true);
                    expect(delimiterAfter.textContent).toEqual(ZERO_WIDTH_SPACE);
                    expect(delimiterAfter.textContent?.length).toEqual(1);
                    expect(delimiterAfter.childNodes.length).toEqual(1);
                });

                it('Is not Delimiter' + ev, () => {
                    delimiterAfter.removeAttribute('id');
                    arrangeAndAct(ev);

                    expect(delimiterAfter.textContent).not.toEqual(ZERO_WIDTH_SPACE);
                    expect(delimiterAfter.textContent?.length).toEqual(5);
                    expect(delimiterAfter.childNodes.length).toEqual(2);
                });
            });
        });
    });
});
function addEntityBeforeEach(
    entity: Entity,
    wrapper: HTMLElement,
    editor: IEditor,
    delimiterAfter: HTMLElement
) {
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
    return { entity, delimiterAfter };
}

function getDelimiter(entity: Entity, after: boolean) {
    return (after
        ? entity.wrapper.nextElementSibling!
        : entity.wrapper.previousElementSibling!) as HTMLElement;
}
