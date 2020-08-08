import * as dom from 'roosterjs-editor-dom';
import Editor from '../../lib/editor/Editor';
import EntityPlugin, { EntityPluginState } from '../../lib/corePlugins/entity/EntityPlugin';
import { Keys } from 'roosterjs/lib';
import {
    EntityClasses,
    EntityOperation,
    PluginEventType,
    QueryScope,
    Wrapper,
    ChangeSource,
} from 'roosterjs-editor-types';

describe('EntityPlugin', () => {
    let plugin: EntityPlugin;
    let eventMap: Record<string, (event: UIEvent) => void>;
    let triggerPluginEvent: jasmine.Spy;
    let state: Wrapper<EntityPluginState>;
    let editor: Editor;

    beforeEach(() => {
        triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');
        plugin = new EntityPlugin();
        state = plugin.getState();
        editor = <Editor>(<any>{
            addDomEventHandler: (map: Record<string, (event: UIEvent) => void>) => {
                eventMap = map;
                return () => {};
            },
            getElementAtCursor: (selector: string, node: Node) => node,
            triggerPluginEvent,
        });
        plugin.initialize(editor);
    });

    afterEach(() => {
        plugin.dispose();
        plugin = null;
        eventMap = null;
        editor = null;
    });

    it('init', () => {
        expect(eventMap).toBeDefined();
        expect(eventMap.contextmenu).toBeDefined();
        expect(eventMap.cut).toBeDefined();
        expect(state.value).toEqual({
            clickingPoint: null,
            knownEntityElements: [],
        });
    });

    it('context menu event', () => {
        const target = {};
        const preventDefault = jasmine.createSpy('preventDefault');
        const rawEvent = <UIEvent>(<any>{ target, preventDefault });
        spyOn(dom, 'getEntityFromElement').and.callFake(node => <any>node);
        eventMap.contextmenu(rawEvent);

        expect(preventDefault).toHaveBeenCalled();
        expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.EntityOperation, {
            operation: EntityOperation.ContextMenu,
            rawEvent,
            entity: target,
        });
    });

    function verifyRemoveEntities(rawEvent: UIEvent, action: () => any) {
        const entityReadonly = document.createElement('span');
        const entityOnSelection1 = document.createElement('span');
        const entityOnSelection2 = document.createElement('span');
        const entityInSelection = document.createElement('span');
        entityReadonly.contentEditable = 'false';
        entityOnSelection1.contentEditable = 'true';
        entityOnSelection2.contentEditable = 'true';
        entityInSelection.contentEditable = 'true';
        entityReadonly.innerHTML = 'entityReadonly';
        entityOnSelection1.innerHTML = 'entityOnSelection';
        entityOnSelection2.innerHTML = 'entityOnSelection';
        entityInSelection.innerHTML = 'entityReadonly';

        editor.getSelectionRange = () => {
            return <Range>(<any>{
                collapse: false,
            });
        };

        editor.queryElements = <any>((
            selector: string,
            scope: QueryScope,
            callback: (element: HTMLElement) => any
        ) => {
            const entityElements =
                scope == QueryScope.OnSelection
                    ? [entityReadonly, entityOnSelection1, entityOnSelection2, entityInSelection]
                    : [entityReadonly, entityOnSelection1, entityInSelection];

            if (callback) {
                entityElements.forEach(callback);
            }
            return entityElements;
        });

        const triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');
        editor.triggerPluginEvent = triggerPluginEvent;
        spyOn(dom, 'getEntityFromElement').and.callFake(node => <any>node);

        action();

        expect(triggerPluginEvent).toHaveBeenCalledTimes(4);
        expect(triggerPluginEvent.calls.argsFor(0)[0]).toBe(PluginEventType.EntityOperation);
        expect(triggerPluginEvent.calls.argsFor(0)[1]).toEqual({
            operation: EntityOperation.Overwrite,
            entity: <any>entityReadonly,
            rawEvent,
        });
        expect(triggerPluginEvent.calls.argsFor(1)[0]).toBe(PluginEventType.EntityOperation);
        expect(triggerPluginEvent.calls.argsFor(1)[1]).toEqual({
            operation: EntityOperation.Overwrite,
            entity: <any>entityOnSelection1,
            rawEvent,
        });
        expect(triggerPluginEvent.calls.argsFor(2)[0]).toBe(PluginEventType.EntityOperation);
        expect(triggerPluginEvent.calls.argsFor(2)[1]).toEqual({
            operation: EntityOperation.PartialOverwrite,
            entity: <any>entityOnSelection2,
            rawEvent,
        });
        expect(triggerPluginEvent.calls.argsFor(3)[0]).toBe(PluginEventType.EntityOperation);
        expect(triggerPluginEvent.calls.argsFor(3)[1]).toEqual({
            operation: EntityOperation.Overwrite,
            entity: <any>entityInSelection,
            rawEvent,
        });
    }

    it('cut event', () => {
        const target = {};
        const preventDefault = jasmine.createSpy('preventDefault');
        const rawEvent = <UIEvent>(<any>{ target, preventDefault });

        verifyRemoveEntities(rawEvent, () => eventMap.cut(rawEvent));
    });

    it('mouse down/up event into same point', () => {
        const target = <any>{
            isContentEditable: false,
        };
        const preventDefault = jasmine.createSpy();
        const rawEvent = <any>{
            target,
            pageX: 1,
            pageY: 2,
            preventDefault,
        };

        expect(state.value.clickingPoint).toBeNull();
        plugin.onPluginEvent({
            eventType: PluginEventType.MouseDown,
            rawEvent,
        });
        editor.getElementAtCursor = () => target;
        expect(preventDefault).toHaveBeenCalled();
        expect(state.value.clickingPoint).toEqual({
            pageX: 1,
            pageY: 2,
        });

        spyOn(dom, 'getEntityFromElement').and.callFake(node => <any>node);

        plugin.onPluginEvent({
            eventType: PluginEventType.MouseUp,
            rawEvent,
        });

        expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.EntityOperation, {
            operation: EntityOperation.Click,
            rawEvent,
            entity: <any>target,
        });
        expect(state.value.clickingPoint).toBeNull();
    });

    it('mouse down/up event into different point', () => {
        const target = <any>{
            isContentEditable: false,
        };
        const preventDefault = jasmine.createSpy();

        expect(state.value.clickingPoint).toBeNull();

        plugin.onPluginEvent({
            eventType: PluginEventType.MouseDown,
            rawEvent: <any>{
                target,
                pageX: 1,
                pageY: 2,
                preventDefault,
            },
        });

        editor.getElementAtCursor = () => target;
        expect(preventDefault).toHaveBeenCalled();
        expect(state.value.clickingPoint).toEqual({
            pageX: 1,
            pageY: 2,
        });

        spyOn(dom, 'getEntityFromElement').and.callFake(node => <any>node);

        plugin.onPluginEvent({
            eventType: PluginEventType.MouseUp,
            rawEvent: <any>{
                target,
                pageX: 2,
                pageY: 2,
                preventDefault,
            },
        });

        expect(triggerPluginEvent).not.toHaveBeenCalled();
        expect(state.value.clickingPoint).toBeNull();
    });

    it('key down event for a range', () => {
        const target = {};
        const preventDefault = jasmine.createSpy('preventDefault');
        const rawEvent = <KeyboardEvent>(<any>{ target, preventDefault, which: Keys.BACKSPACE });

        verifyRemoveEntities(rawEvent, () =>
            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent,
            })
        );
    });

    it('key down event for a collapsed range', () => {
        const target = {};
        const preventDefault = jasmine.createSpy('preventDefault');
        const rawEvent = <KeyboardEvent>(<any>{ target, preventDefault, which: Keys.BACKSPACE });

        editor.getSelectionRange = () => {
            return <any>{
                collapsed: true,
            };
        };

        const queryElements = jasmine.createSpy('queryElements');
        editor.queryElements = queryElements;

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent,
        });

        expect(queryElements).not.toHaveBeenCalled();
    });

    it('before paste event', () => {
        const sanitizingOption = dom.createDefaultHtmlSanitizerOptions();
        verifyRemoveEntities(null, () =>
            plugin.onPluginEvent({
                eventType: PluginEventType.BeforePaste,
                clipboardData: <any>{},
                fragment: <any>{},
                sanitizingOption,
                htmlBefore: '',
                htmlAfter: '',
                htmlAttributes: {},
            })
        );

        expect(sanitizingOption.additionalAllowedCssClasses).toEqual([
            '^' + EntityClasses.ENTITY_INFO_NAME + '$',
            '^' + EntityClasses.ENTITY_ID_PREFIX,
            '^' + EntityClasses.ENTITY_TYPE_PREFIX,
            '^' + EntityClasses.ENTITY_READONLY_PREFIX,
        ]);
    });

    it('extract content event', () => {
        const root = document.createElement('div');
        root.innerHTML =
            '<div class="_Entity _EId_entity1 _EType_entity _EReadonly_1" contenteditable="false">test</div><div class="_Entity _EId_entity2 _EType_entity _EReadonly_0">test</div>';
        const node1 = root.firstChild as HTMLElement;
        const node2 = node1.nextSibling as HTMLElement;

        plugin.onPluginEvent({
            eventType: PluginEventType.ExtractContentWithDom,
            clonedRoot: root,
        });

        expect(node1.contentEditable).toBe('inherit');
        expect(node2.contentEditable).toBe('inherit');

        expect(triggerPluginEvent).toHaveBeenCalledTimes(2);
        expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.EntityOperation, {
            operation: EntityOperation.ReplaceTemporaryContent,
            entity: {
                wrapper: node1,
                id: 'entity1',
                type: 'entity',
                isReadonly: true,
            },
            rawEvent: undefined,
        });

        expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.EntityOperation, {
            operation: EntityOperation.ReplaceTemporaryContent,
            entity: {
                wrapper: node2,
                id: 'entity2',
                type: 'entity',
                isReadonly: false,
            },
            rawEvent: undefined,
        });
    });

    describe('rehydrate entity', () => {
        const entityType = 'MockEntity';
        let node1: HTMLElement;
        let node2: HTMLElement;
        let node3: HTMLElement;
        let containedNodes: Node[];

        beforeEach(() => {
            node1 = document.createElement('div');
            node2 = document.createElement('div');
            node3 = document.createElement('div');

            node1.id = 'node1';
            node2.id = 'node2';
            node3.id = 'node3';

            spyOn(dom, 'getEntityFromElement').and.callFake((e: HTMLElement) => {
                return {
                    wrapper: e,
                    id: e.id,
                    type: entityType,
                    isReadonly: false,
                };
            });

            editor.contains = <any>((node: Node) => {
                return containedNodes.indexOf(node) >= 0;
            });

            editor.queryElements = <any>((selector: string, callback: (e: HTMLElement) => void) => {
                containedNodes.forEach(callback);
                return containedNodes;
            });

            spyOn(dom, 'commitEntity');
        });

        function verify(inStateNodes: HTMLElement[], commitedNodes: HTMLElement[]) {
            expect(state.value.knownEntityElements).toEqual(inStateNodes);
            expect(dom.commitEntity).toHaveBeenCalledTimes(commitedNodes.length);
            commitedNodes.forEach(node => {
                expect(dom.commitEntity).toHaveBeenCalledWith(node, entityType, false, node.id);
                expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.EntityOperation, {
                    operation: EntityOperation.NewEntity,
                    entity: {
                        wrapper: node,
                        id: node.id,
                        type: entityType,
                        isReadonly: false,
                    },
                    rawEvent: undefined,
                });
            });
        }

        it('content changed event, no existing known nodes', () => {
            state.value.knownEntityElements = [];
            containedNodes = [node1];

            plugin.onPluginEvent({
                eventType: PluginEventType.ContentChanged,
                source: '',
            });

            verify([node1], [node1]);
        });

        it('content changed event, has existing known nodes', () => {
            state.value.knownEntityElements = [node1, node2];
            containedNodes = [node2, node3];

            plugin.onPluginEvent({
                eventType: PluginEventType.ContentChanged,
                source: '',
            });

            verify([node2, node3], [node3]);
        });

        it('content changed event, reset known nodes', () => {
            state.value.knownEntityElements = [node1, node2];
            containedNodes = [node2, node3];

            editor.queryElements = <any>((selector: string, callback: (e: HTMLElement) => void) => {
                containedNodes.forEach(callback);
                return containedNodes;
            });

            plugin.onPluginEvent({
                eventType: PluginEventType.ContentChanged,
                source: ChangeSource.SetContent,
            });

            verify([node2, node3], [node2, node3]);
        });

        it('editor ready event', () => {
            state.value.knownEntityElements = [node1, node2];
            containedNodes = [node2, node3];

            plugin.onPluginEvent({
                eventType: PluginEventType.EditorReady,
                startPosition: null,
            });

            verify([node2, node3], [node2, node3]);
        });

        it('handle id duplication', () => {
            node3.id = node2.id;
            state.value.knownEntityElements = [node1, node2];
            containedNodes = [node2, node3];

            plugin.onPluginEvent({
                eventType: PluginEventType.EditorReady,
                startPosition: null,
            });

            verify([node2, node3], [node2, node3]);

            expect(dom.commitEntity).toHaveBeenCalledTimes(2);
            expect(dom.commitEntity).toHaveBeenCalledWith(node2, entityType, false, 'node2');
            expect(dom.commitEntity).toHaveBeenCalledWith(node3, entityType, false, 'node2_1');
        });
    });
});
