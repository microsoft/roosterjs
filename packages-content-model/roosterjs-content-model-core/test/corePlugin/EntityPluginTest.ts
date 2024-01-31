import * as entityUtils from 'roosterjs-content-model-dom/lib/domUtils/entityUtils';
import * as transformColor from '../../lib/publicApi/color/transformColor';
import { createContentModelDocument, createEntity } from '../../../roosterjs-content-model-dom/lib';
import { createEntityPlugin } from '../../lib/corePlugin/EntityPlugin';
import {
    ContentModelDocument,
    DarkColorHandler,
    EntityPluginState,
    IStandaloneEditor,
    PluginWithState,
} from 'roosterjs-content-model-types';

describe('EntityPlugin', () => {
    let editor: IStandaloneEditor;
    let plugin: PluginWithState<EntityPluginState>;
    let formatContentModelSpy: jasmine.Spy;
    let triggerPluginEventSpy: jasmine.Spy;
    let isDarkModeSpy: jasmine.Spy;
    let isNodeInEditorSpy: jasmine.Spy;
    let transformColorSpy: jasmine.Spy;
    let mockedDarkColorHandler: DarkColorHandler;
    let mockedModel: ContentModelDocument;

    beforeEach(() => {
        formatContentModelSpy = jasmine
            .createSpy('formatContentModel')
            .and.callFake((callback: Function) => {
                callback(mockedModel);
            });
        triggerPluginEventSpy = jasmine.createSpy('triggerEvent');
        isDarkModeSpy = jasmine.createSpy('isDarkMode');
        isNodeInEditorSpy = jasmine.createSpy('isNodeInEditor');
        transformColorSpy = spyOn(transformColor, 'transformColor');
        mockedDarkColorHandler = 'COLOR' as any;

        editor = {
            formatContentModel: formatContentModelSpy,
            triggerEvent: triggerPluginEventSpy,
            isDarkMode: isDarkModeSpy,
            getDOMHelper: () => ({
                isNodeInEditor: isNodeInEditorSpy,
            }),
            getColorManager: () => mockedDarkColorHandler,
        } as any;
        plugin = createEntityPlugin();
        plugin.initialize(editor);
    });

    it('ctor', () => {
        const state = plugin.getState();

        expect(state).toEqual({
            entityMap: {},
        });
    });

    describe('EditorReady event', () => {
        it('empty doc', () => {
            mockedModel = createContentModelDocument();

            plugin.onPluginEvent({
                eventType: 'editorReady',
            });

            const state = plugin.getState();
            expect(state).toEqual({
                entityMap: {},
            });
            expect(transformColorSpy).not.toHaveBeenCalled();
        });

        it('Doc with entity', () => {
            const wrapper = document.createElement('div');
            const entity = createEntity(wrapper, true, undefined, 'Entity1');
            const doc = createContentModelDocument();

            doc.blocks.push(entity);

            mockedModel = doc;

            plugin.onPluginEvent({
                eventType: 'editorReady',
            });

            const state = plugin.getState();
            expect(state).toEqual({
                entityMap: {
                    Entity1: {
                        element: wrapper,
                        canPersist: undefined,
                    },
                },
            });
            expect(wrapper.outerHTML).toBe(
                '<div class="_Entity _EType_Entity1 _EId_Entity1 _EReadonly_1" contenteditable="false"></div>'
            );
            expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);
            expect(triggerPluginEventSpy).toHaveBeenCalledWith('entityOperation', {
                operation: 'newEntity',
                rawEvent: undefined,
                entity: {
                    id: 'Entity1',
                    type: 'Entity1',
                    isReadonly: true,
                    wrapper: wrapper,
                },
                state: undefined,
            });
            expect(transformColorSpy).not.toHaveBeenCalled();
        });

        it('Doc with entity, can persist', () => {
            const wrapper = document.createElement('div');
            const entity = createEntity(wrapper, true, undefined, 'Entity1');
            const doc = createContentModelDocument();

            doc.blocks.push(entity);

            mockedModel = doc;
            triggerPluginEventSpy.and.returnValue({
                shouldPersist: true,
            });

            plugin.onPluginEvent({
                eventType: 'editorReady',
            });

            const state = plugin.getState();
            expect(state).toEqual({
                entityMap: {
                    Entity1: {
                        element: wrapper,
                        canPersist: true,
                    },
                },
            });
            expect(wrapper.outerHTML).toBe(
                '<div class="_Entity _EType_Entity1 _EId_Entity1 _EReadonly_1" contenteditable="false"></div>'
            );
            expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);
            expect(triggerPluginEventSpy).toHaveBeenCalledWith('entityOperation', {
                operation: 'newEntity',
                rawEvent: undefined,
                entity: {
                    id: 'Entity1',
                    type: 'Entity1',
                    isReadonly: true,
                    wrapper: wrapper,
                },
                state: undefined,
            });
            expect(transformColorSpy).not.toHaveBeenCalled();
        });
    });

    describe('ContentChanged event', () => {
        it('No changedEntity param', () => {
            const wrapper = document.createElement('div');
            const entity = createEntity(wrapper, true, undefined, 'Entity1');
            const doc = createContentModelDocument();

            doc.blocks.push(entity);

            mockedModel = doc;

            plugin.onPluginEvent({
                eventType: 'contentChanged',
            } as any);

            const state = plugin.getState();
            expect(state).toEqual({
                entityMap: {
                    Entity1: {
                        element: wrapper,
                        canPersist: undefined,
                    },
                },
            });
            expect(wrapper.outerHTML).toBe(
                '<div class="_Entity _EType_Entity1 _EId_Entity1 _EReadonly_1" contenteditable="false"></div>'
            );
            expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);
            expect(triggerPluginEventSpy).toHaveBeenCalledWith('entityOperation', {
                operation: 'newEntity',
                rawEvent: undefined,
                entity: {
                    id: 'Entity1',
                    type: 'Entity1',
                    isReadonly: true,
                    wrapper: wrapper,
                },
                state: undefined,
            });
            expect(transformColorSpy).not.toHaveBeenCalled();
        });

        it('New entity in dark mode', () => {
            const wrapper = document.createElement('div');
            const entity = createEntity(wrapper, true, undefined, 'Entity1');
            const doc = createContentModelDocument();

            doc.blocks.push(entity);

            mockedModel = doc;
            isDarkModeSpy.and.returnValue(true);

            plugin.onPluginEvent({
                eventType: 'contentChanged',
            } as any);

            const state = plugin.getState();
            expect(state).toEqual({
                entityMap: {
                    Entity1: {
                        element: wrapper,
                        canPersist: undefined,
                    },
                },
            });
            expect(wrapper.outerHTML).toBe(
                '<div class="_Entity _EType_Entity1 _EId_Entity1 _EReadonly_1" contenteditable="false"></div>'
            );
            expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);
            expect(triggerPluginEventSpy).toHaveBeenCalledWith('entityOperation', {
                operation: 'newEntity',
                rawEvent: undefined,
                entity: {
                    id: 'Entity1',
                    type: 'Entity1',
                    isReadonly: true,
                    wrapper: wrapper,
                },
                state: undefined,
            });
            expect(transformColorSpy).toHaveBeenCalledTimes(1);
            expect(transformColorSpy).toHaveBeenCalledWith(
                wrapper,
                true,
                'lightToDark',
                mockedDarkColorHandler
            );
        });

        it('No changedEntity param, has deleted entity', () => {
            const wrapper = document.createElement('div');
            const entity = createEntity(wrapper, true, undefined, 'Entity1');
            const doc = createContentModelDocument();

            doc.blocks.push(entity);

            mockedModel = doc;
            const state = plugin.getState();

            const wrapper2 = document.createElement('div');
            wrapper2.className = '_Entity _EType_T2 _EId_T2 _EReadonly_1';

            state.entityMap['T2'] = {
                element: wrapper2,
            };

            plugin.onPluginEvent({
                eventType: 'contentChanged',
            } as any);

            expect(state).toEqual({
                entityMap: {
                    Entity1: {
                        element: wrapper,
                        canPersist: undefined,
                    },
                    T2: {
                        element: wrapper2,
                        isDeleted: true,
                    },
                },
            });
            expect(wrapper.outerHTML).toBe(
                '<div class="_Entity _EType_Entity1 _EId_Entity1 _EReadonly_1" contenteditable="false"></div>'
            );
            expect(triggerPluginEventSpy).toHaveBeenCalledTimes(2);
            expect(triggerPluginEventSpy).toHaveBeenCalledWith('entityOperation', {
                operation: 'newEntity',
                rawEvent: undefined,
                entity: {
                    id: 'Entity1',
                    type: 'Entity1',
                    isReadonly: true,
                    wrapper: wrapper,
                },
                state: undefined,
            });
            expect(triggerPluginEventSpy).toHaveBeenCalledWith('entityOperation', {
                operation: 'overwrite',
                rawEvent: undefined,
                entity: {
                    id: 'T2',
                    type: 'T2',
                    isReadonly: true,
                    wrapper: wrapper2,
                },
                state: undefined,
            });
            expect(transformColorSpy).not.toHaveBeenCalled();
        });

        it('Do not trigger event for already deleted entity', () => {
            const doc = createContentModelDocument();

            mockedModel = doc;
            const state = plugin.getState();

            const wrapper2 = document.createElement('div');
            wrapper2.className = '_Entity _EType_T2 _EId_T2 _EReadonly_1';

            state.entityMap['T2'] = {
                element: wrapper2,
                isDeleted: true,
            };

            plugin.onPluginEvent({
                eventType: 'contentChanged',
            } as any);

            expect(state).toEqual({
                entityMap: {
                    T2: {
                        element: wrapper2,
                        isDeleted: true,
                    },
                },
            });
            expect(triggerPluginEventSpy).toHaveBeenCalledTimes(0);
            expect(transformColorSpy).not.toHaveBeenCalled();
        });

        it('Add back a deleted entity', () => {
            const wrapper = document.createElement('div');
            const entity = createEntity(wrapper, true, undefined, 'Entity1');
            const doc = createContentModelDocument();

            doc.blocks.push(entity);

            mockedModel = doc;
            const state = plugin.getState();

            state.entityMap['Entity1'] = {
                element: wrapper,
                isDeleted: true,
            };

            plugin.onPluginEvent({
                eventType: 'contentChanged',
            } as any);

            expect(state).toEqual({
                entityMap: {
                    Entity1: {
                        element: wrapper,
                        canPersist: undefined,
                    },
                },
            });
            expect(wrapper.outerHTML).toBe(
                '<div class="_Entity _EType_Entity1 _EId_Entity1 _EReadonly_1" contenteditable="false"></div>'
            );
            expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);
            expect(triggerPluginEventSpy).toHaveBeenCalledWith('entityOperation', {
                operation: 'newEntity',
                rawEvent: undefined,
                entity: {
                    id: 'Entity1',
                    type: 'Entity1',
                    isReadonly: true,
                    wrapper: wrapper,
                },
                state: undefined,
            });
            expect(transformColorSpy).not.toHaveBeenCalled();
        });

        it('Has changedEntities parameter', () => {
            const wrapper1 = document.createElement('div');
            const wrapper2 = document.createElement('div');

            wrapper1.className = '_Entity _EType_E1 _EId_E1 _EReadonly_1';
            wrapper2.className = '_Entity _EType_E2 _EId_E2 _EReadonly_1';

            const entity1 = createEntity(wrapper1, true, undefined, 'E1', 'E1');
            const entity2 = createEntity(wrapper2, true, undefined, 'E2', 'E2');
            const mockedEvent = 'EVENT' as any;
            const state = plugin.getState();

            state.entityMap['E1'] = {
                element: wrapper1,
            };

            plugin.onPluginEvent({
                eventType: 'contentChanged',
                changedEntities: [
                    {
                        entity: entity1,
                        operation: 'removeFromStart',
                        rawEvent: mockedEvent,
                    },
                    {
                        entity: entity2,
                        operation: 'newEntity',
                        rawEvent: mockedEvent,
                    },
                ],
            } as any);

            expect(state).toEqual({
                entityMap: {
                    E1: {
                        element: wrapper1,
                        isDeleted: true,
                    },
                    E2: {
                        element: wrapper2,
                        canPersist: undefined,
                    },
                },
            });
            expect(wrapper1.outerHTML).toBe(
                '<div class="_Entity _EType_E1 _EId_E1 _EReadonly_1"></div>'
            );
            expect(wrapper2.outerHTML).toBe(
                '<div class="_Entity _EType_E2 _EId_E2 _EReadonly_1" contenteditable="false"></div>'
            );
            expect(triggerPluginEventSpy).toHaveBeenCalledTimes(2);
            expect(triggerPluginEventSpy).toHaveBeenCalledWith('entityOperation', {
                operation: 'newEntity',
                rawEvent: mockedEvent,
                entity: {
                    id: 'E2',
                    type: 'E2',
                    isReadonly: true,
                    wrapper: wrapper2,
                },
                state: undefined,
            });
            expect(triggerPluginEventSpy).toHaveBeenCalledWith('entityOperation', {
                operation: 'removeFromStart',
                rawEvent: mockedEvent,
                entity: {
                    id: 'E1',
                    type: 'E1',
                    isReadonly: true,
                    wrapper: wrapper1,
                },
                state: undefined,
            });
            expect(transformColorSpy).not.toHaveBeenCalled();
        });

        it('Handle conflict id', () => {
            const wrapper1 = document.createElement('div');
            const wrapper2 = document.createElement('div');

            wrapper1.className = '_Entity _EType_E1 _EId_E1 _EReadonly_1';
            wrapper2.className = '_Entity _EType_E2 _EId_E1 _EReadonly_1';

            const entity2 = createEntity(wrapper2, true, undefined, 'E2', 'E1');
            const mockedEvent = 'EVENT' as any;
            const state = plugin.getState();

            state.entityMap['E1'] = {
                element: wrapper1,
            };

            plugin.onPluginEvent({
                eventType: 'contentChanged',
                changedEntities: [
                    {
                        entity: entity2,
                        operation: 'newEntity',
                        rawEvent: mockedEvent,
                    },
                ],
            } as any);

            expect(state).toEqual({
                entityMap: {
                    E1: {
                        element: wrapper1,
                    },
                    E1_1: {
                        element: wrapper2,
                        canPersist: undefined,
                    },
                },
            });
            expect(wrapper1.outerHTML).toBe(
                '<div class="_Entity _EType_E1 _EId_E1 _EReadonly_1"></div>'
            );
            expect(wrapper2.outerHTML).toBe(
                '<div class="_Entity _EType_E2 _EId_E1_1 _EReadonly_1" contenteditable="false"></div>'
            );
            expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);
            expect(triggerPluginEventSpy).toHaveBeenCalledWith('entityOperation', {
                operation: 'newEntity',
                rawEvent: mockedEvent,
                entity: {
                    id: 'E1_1',
                    type: 'E2',
                    isReadonly: true,
                    wrapper: wrapper2,
                },
                state: undefined,
            });
            expect(transformColorSpy).not.toHaveBeenCalled();
        });

        it('With content state', () => {
            const id = 'ID';
            const entityType = 'Entity1';
            const entityState = 'STATE';
            const state = plugin.getState();
            const wrapper = document.createElement('div');
            const entity = createEntity(wrapper, true, undefined, entityType, id);
            const doc = createContentModelDocument();

            wrapper.className = entityUtils.generateEntityClassNames({
                entityType,
                id: id,
                isReadonly: true,
            });
            doc.blocks.push(entity);
            mockedModel = doc;

            state.entityMap[id] = {
                element: wrapper,
            };

            plugin.onPluginEvent({
                eventType: 'contentChanged',
                entityStates: [
                    {
                        id,
                        state: entityState,
                    },
                ],
            } as any);

            expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);
            expect(triggerPluginEventSpy).toHaveBeenCalledWith('entityOperation', {
                operation: 'updateEntityState',
                rawEvent: undefined,
                entity: {
                    id,
                    type: entityType,
                    isReadonly: true,
                    wrapper,
                },
                state: entityState,
            });
        });
    });

    describe('MouseUp event', () => {
        it('Not on entity', () => {
            const mockedNode = {
                parentNode: null as any,
            } as any;
            const mockedEvent = {
                target: mockedNode,
            } as any;

            isNodeInEditorSpy.and.returnValue(true);

            plugin.onPluginEvent({
                eventType: 'mouseUp',
                rawEvent: mockedEvent,
                isClicking: true,
            } as any);

            expect(triggerPluginEventSpy).toHaveBeenCalledTimes(0);
        });

        it('Click on entity', () => {
            const mockedNode = {
                parentNode: null as any,
                classList: ['_ENtity', '_EType_A', '_EId_A'],
            } as any;
            const mockedEvent = {
                target: mockedNode,
            } as any;

            isNodeInEditorSpy.and.returnValue(true);
            spyOn(entityUtils, 'isEntityElement').and.returnValue(true);

            plugin.onPluginEvent({
                eventType: 'mouseUp',
                rawEvent: mockedEvent,
                isClicking: true,
            } as any);

            expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);
            expect(triggerPluginEventSpy).toHaveBeenCalledWith('entityOperation', {
                operation: 'click',
                rawEvent: mockedEvent,
                entity: {
                    id: 'A',
                    type: 'A',
                    isReadonly: false,
                    wrapper: mockedNode,
                },
                state: undefined,
            });
        });

        it('Click on child of entity', () => {
            const mockedNode1 = {
                parentNode: null as any,
                classList: ['_ENtity', '_EType_A', '_EId_A'],
            } as any;

            const mockedNode2 = {
                parentNode: mockedNode1,
            } as any;
            const mockedEvent = {
                target: mockedNode2,
            } as any;

            isNodeInEditorSpy.and.returnValue(true);
            spyOn(entityUtils, 'isEntityElement').and.callFake(node => node == mockedNode1);

            plugin.onPluginEvent({
                eventType: 'mouseUp',
                rawEvent: mockedEvent,
                isClicking: true,
            } as any);

            expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);
            expect(triggerPluginEventSpy).toHaveBeenCalledWith('entityOperation', {
                operation: 'click',
                rawEvent: mockedEvent,
                entity: {
                    id: 'A',
                    type: 'A',
                    isReadonly: false,
                    wrapper: mockedNode1,
                },
                state: undefined,
            });
        });

        it('Not clicking', () => {
            const mockedNode = {
                parentNode: null as any,
                classList: ['_ENtity', '_EType_A', '_EId_A'],
            } as any;
            const mockedEvent = {
                target: mockedNode,
            } as any;

            isNodeInEditorSpy.and.returnValue(true);
            spyOn(entityUtils, 'isEntityElement').and.returnValue(true);

            plugin.onPluginEvent({
                eventType: 'mouseUp',
                rawEvent: mockedEvent,
                isClicking: false,
            } as any);

            expect(triggerPluginEventSpy).toHaveBeenCalledTimes(0);
        });
    });

    describe('ExtractContentWithDom event', () => {
        it('no entity', () => {
            spyOn(entityUtils, 'getAllEntityWrappers').and.returnValue([]);

            plugin.onPluginEvent({
                eventType: 'extractContentWithDom',
            } as any);

            expect(triggerPluginEventSpy).toHaveBeenCalledTimes(0);
        });

        it('Has entity', () => {
            const wrapper1 = document.createElement('div');
            const wrapper2 = document.createElement('div');

            wrapper1.className = '_Entity _EType_E1 _EId_E1 _EReadonly_1';
            wrapper2.className = '_Entity _EType_E2 _EId_E2 _EReadonly_1';

            spyOn(entityUtils, 'getAllEntityWrappers').and.returnValue([wrapper1, wrapper2]);

            plugin.onPluginEvent({
                eventType: 'extractContentWithDom',
            } as any);

            expect(triggerPluginEventSpy).toHaveBeenCalledTimes(2);
            expect(triggerPluginEventSpy).toHaveBeenCalledWith('entityOperation', {
                operation: 'replaceTemporaryContent',
                rawEvent: undefined,
                entity: {
                    id: 'E1',
                    type: 'E1',
                    isReadonly: true,
                    wrapper: wrapper1,
                },
                state: undefined,
            });
            expect(triggerPluginEventSpy).toHaveBeenCalledWith('entityOperation', {
                operation: 'replaceTemporaryContent',
                rawEvent: undefined,
                entity: {
                    id: 'E2',
                    type: 'E2',
                    isReadonly: true,
                    wrapper: wrapper2,
                },
                state: undefined,
            });
        });
    });
});
