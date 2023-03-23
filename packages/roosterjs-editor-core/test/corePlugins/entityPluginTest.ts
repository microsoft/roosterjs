import * as commitEntity from 'roosterjs-editor-dom/lib/entity/commitEntity';
import * as getEntityFromElement from 'roosterjs-editor-dom/lib/entity/getEntityFromElement';
import EntityPlugin from '../../lib/corePlugins/EntityPlugin';
import {
    createDefaultHtmlSanitizerOptions,
    moveChildNodes,
    createElement,
} from 'roosterjs-editor-dom';
import {
    ChangeSource,
    EntityClasses,
    EntityOperation,
    EntityOperationEvent,
    EntityPluginState,
    IEditor,
    Keys,
    PluginEventType,
    PluginKeyboardEvent,
    QueryScope,
} from 'roosterjs-editor-types';

describe('EntityPlugin', () => {
    let plugin: EntityPlugin;
    let triggerPluginEvent: jasmine.Spy;
    let state: EntityPluginState;
    let editor: IEditor;

    beforeEach(() => {
        triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');
        plugin = new EntityPlugin();
        state = plugin.getState();
        editor = <IEditor>(<any>{
            getDocument: () => document,
            getElementAtCursor: (selector: string, node: Node) => node,
            addContentEditFeature: () => {},
            triggerPluginEvent,
            isFeatureEnabled: () => false,
        });
        plugin.initialize(editor);
    });

    afterEach(() => {
        plugin.dispose();
        plugin = null;
        editor = null;
    });

    it('init', () => {
        expect(state).toEqual({
            knownEntityElements: [],
            shadowEntityCache: {},
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
        spyOn(getEntityFromElement, 'default').and.callFake(node => <any>node);

        action();

        expect(triggerPluginEvent).toHaveBeenCalledTimes(4);
        expect(triggerPluginEvent.calls.argsFor(0)[0]).toBe(PluginEventType.EntityOperation);
        expect(triggerPluginEvent.calls.argsFor(0)[1]).toEqual({
            operation: EntityOperation.Overwrite,
            entity: <any>entityReadonly,
            rawEvent,
            contentForShadowEntity: undefined,
        });
        expect(triggerPluginEvent.calls.argsFor(1)[0]).toBe(PluginEventType.EntityOperation);
        expect(triggerPluginEvent.calls.argsFor(1)[1]).toEqual({
            operation: EntityOperation.Overwrite,
            entity: <any>entityOnSelection1,
            rawEvent,
            contentForShadowEntity: undefined,
        });
        expect(triggerPluginEvent.calls.argsFor(2)[0]).toBe(PluginEventType.EntityOperation);
        expect(triggerPluginEvent.calls.argsFor(2)[1]).toEqual({
            operation: EntityOperation.PartialOverwrite,
            entity: <any>entityOnSelection2,
            rawEvent,
            contentForShadowEntity: undefined,
        });
        expect(triggerPluginEvent.calls.argsFor(3)[0]).toBe(PluginEventType.EntityOperation);
        expect(triggerPluginEvent.calls.argsFor(3)[1]).toEqual({
            operation: EntityOperation.Overwrite,
            entity: <any>entityInSelection,
            rawEvent,
            contentForShadowEntity: undefined,
        });
    }

    it('mouse down/up event into same point', () => {
        const target = <any>{
            isContentEditable: false,
        };
        const rawEvent = <any>{
            target,
        };

        editor.getElementAtCursor = () => target;

        spyOn(getEntityFromElement, 'default').and.callFake(node => <any>node);

        plugin.onPluginEvent({
            eventType: PluginEventType.MouseUp,
            isClicking: true,
            rawEvent,
        });

        expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.EntityOperation, {
            operation: EntityOperation.Click,
            rawEvent,
            entity: <any>target,
            contentForShadowEntity: undefined,
        });
    });

    it('mouse down/up event into different point', () => {
        const target = <any>{
            isContentEditable: false,
        };

        editor.getElementAtCursor = () => target;

        spyOn(getEntityFromElement, 'default').and.callFake(node => <any>node);

        plugin.onPluginEvent({
            eventType: PluginEventType.MouseUp,
            isClicking: false,
            rawEvent: <any>{
                target,
            },
        });

        expect(triggerPluginEvent).not.toHaveBeenCalled();
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
        const sanitizingOption = createDefaultHtmlSanitizerOptions();
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
            contentForShadowEntity: undefined,
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
            contentForShadowEntity: undefined,
        });
    });

    describe('rehydrate entity', () => {
        const entityType = 'MockEntity';
        let node1: HTMLElement;
        let node2: HTMLElement;
        let node3: HTMLElement;
        let containedNodes: Node[];
        let fragment: DocumentFragment = document.createDocumentFragment();

        beforeEach(() => {
            node1 = document.createElement('div');
            node2 = document.createElement('div');
            node3 = document.createElement('div');

            node1.id = 'node1';
            node2.id = 'node2';
            node3.id = 'node3';

            spyOn(getEntityFromElement, 'default').and.callFake((e: HTMLElement) => {
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
                containedNodes.forEach(callback || (() => {}));
                return containedNodes;
            });

            spyOn(commitEntity, 'default');
            spyOn(document, 'createDocumentFragment').and.returnValue(fragment);
        });

        function verify(inStateNodes: HTMLElement[], commitedNodes: HTMLElement[]) {
            expect(state.knownEntityElements).toEqual(inStateNodes);
            expect(commitEntity.default).toHaveBeenCalledTimes(commitedNodes.length);
            commitedNodes.forEach(node => {
                expect(commitEntity.default).toHaveBeenCalledWith(node, entityType, false, node.id);
                expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.EntityOperation, {
                    operation: EntityOperation.NewEntity,
                    entity: {
                        wrapper: node,
                        id: node.id,
                        type: entityType,
                        isReadonly: false,
                    },
                    rawEvent: undefined,
                    contentForShadowEntity: fragment,
                });
            });
        }

        it('content changed event, no existing known nodes', () => {
            state.knownEntityElements = [];
            containedNodes = [node1];

            plugin.onPluginEvent({
                eventType: PluginEventType.ContentChanged,
                source: '',
            });

            verify([node1], [node1]);
        });

        it('content changed event, has existing known nodes', () => {
            state.knownEntityElements = [node1, node2];
            containedNodes = [node2, node3];

            plugin.onPluginEvent({
                eventType: PluginEventType.ContentChanged,
                source: '',
            });

            verify([node2, node3], [node3]);
        });

        xit('content changed event, reset known nodes', () => {
            state.knownEntityElements = [node1, node2];
            containedNodes = [node2, node3];

            editor.queryElements = <any>((selector: string, callback: (e: HTMLElement) => void) => {
                containedNodes.forEach(callback);
                return containedNodes;
            });

            expect(state.knownEntityElements).toEqual([]);

            plugin.onPluginEvent({
                eventType: PluginEventType.ContentChanged,
                source: ChangeSource.SetContent,
            });

            verify([node2, node3], [node2, node3]);
        });
        it('editor ready event', () => {
            state.knownEntityElements = [node1, node2];
            containedNodes = [node2, node3];

            plugin.onPluginEvent({
                eventType: PluginEventType.EditorReady,
            });

            verify([node2, node3], [node3]);
        });

        xit('handle id duplication', () => {
            node3.id = node2.id;
            state.knownEntityElements = [node1, node2];
            containedNodes = [node2, node3];

            plugin.onPluginEvent({
                eventType: PluginEventType.EditorReady,
            });

            node3.id = 'node2_1';
            verify([node2, node3], [node3]);

            expect(commitEntity.default).toHaveBeenCalledTimes(1);
            expect(commitEntity.default).toHaveBeenCalledWith(node2, entityType, false, 'node2_1');
        });
    });
});

describe('Shadow DOM Entity', () => {
    it('Key press event should be handled exclusively when focus to shadow DOM entity', () => {
        const plugin = new EntityPlugin();
        const event: PluginKeyboardEvent = {
            eventType: PluginEventType.KeyPress,
            rawEvent: <any>{
                target: {
                    shadowRoot: {},
                },
            },
        };
        expect(plugin.willHandleEventExclusively(event)).toBeTrue();
    });

    it('Cache shadow entity before set content', () => {
        const plugin = new EntityPlugin();
        const entity1 = document.createElement('span');
        const entity2 = document.createElement('span');
        const editor: IEditor = <any>{
            getDocument: () => document,
            queryElements: () => [entity1, entity2],
            addContentEditFeature: () => {},
            isFeatureEnabled: () => false,
        };
        const state = plugin.getState();
        const textNode = document.createTextNode('text');

        commitEntity.default(entity1, 'ENTITY1', false, 'TEST1');
        commitEntity.default(entity2, 'ENTITY2', false, 'TEST2');
        entity2.attachShadow({ mode: 'open' }).appendChild(textNode);

        expect(state).toEqual({
            knownEntityElements: [],
            shadowEntityCache: {},
        });

        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: PluginEventType.BeforeSetContent,
            newContent: '',
        });

        expect(Object.keys(state.shadowEntityCache)).toEqual(['TEST2']);
        expect(state.shadowEntityCache.TEST2).toBe(entity2);
        expect(entity2.shadowRoot.firstChild).toBe(textNode);
    });

    it('ContentChange - Check removed shadow entity', () => {
        const plugin = new EntityPlugin();
        const state = plugin.getState();
        const entity1 = document.createElement('span');
        const triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');
        const editor: IEditor = <any>{
            triggerPluginEvent,
            queryElements: () => <HTMLElement[]>[],
            contains: () => false,
            addContentEditFeature: () => {},
            isFeatureEnabled: () => false,
        };

        state.knownEntityElements.push(entity1);
        plugin.initialize(editor);
        commitEntity.default(entity1, 'TEST', false, 'TEST1');
        entity1.attachShadow({ mode: 'open' });

        plugin.onPluginEvent({
            eventType: PluginEventType.ContentChanged,
            source: '',
        });

        expect(state.knownEntityElements).toEqual([]);
        expect(state.shadowEntityCache).toEqual({});
        expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.EntityOperation, {
            operation: EntityOperation.RemoveShadowRoot,
            rawEvent: undefined,
            entity: getEntityFromElement.default(entity1),
            contentForShadowEntity: undefined,
        });
    });

    it('ContentChange - hydrate new entity', () => {
        const plugin = new EntityPlugin();
        const state = plugin.getState();
        const entity1 = document.createElement('span');
        const textNode = document.createTextNode('test');
        const triggerPluginEvent = jasmine
            .createSpy('triggerPluginEvent')
            .and.callFake((type: PluginEventType, param: EntityOperationEvent) => {
                if (
                    type == PluginEventType.EntityOperation &&
                    param.operation == EntityOperation.NewEntity
                ) {
                    param.contentForShadowEntity.appendChild(textNode);
                }
            });
        const editor: IEditor = <any>{
            triggerPluginEvent,
            queryElements: () => [entity1],
            contains: (node: Node) => node == entity1,
            addContentEditFeature: () => {},
            getDocument: () => document,
            isFeatureEnabled: () => false,
        };

        plugin.initialize(editor);
        commitEntity.default(entity1, 'TEST', false, 'TEST1');

        plugin.onPluginEvent({
            eventType: PluginEventType.ContentChanged,
            source: '',
        });

        expect(state.knownEntityElements).toEqual([entity1]);
        expect(state.shadowEntityCache).toEqual({});
        expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.EntityOperation, {
            operation: EntityOperation.NewEntity,
            rawEvent: undefined,
            entity: getEntityFromElement.default(entity1),
            contentForShadowEntity: document.createDocumentFragment(),
        });
        expect(entity1.shadowRoot.firstChild).toBe(textNode);
        expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.EntityOperation, {
            operation: EntityOperation.AddShadowRoot,
            rawEvent: undefined,
            entity: getEntityFromElement.default(entity1),
            contentForShadowEntity: undefined,
        });
    });

    it('ContentChange - hydrate new entity with known entity', () => {
        const plugin = new EntityPlugin();
        const state = plugin.getState();
        const entity1 = document.createElement('span');
        const textNode = document.createTextNode('test');
        const triggerPluginEvent = jasmine
            .createSpy('triggerPluginEvent')
            .and.callFake((type: PluginEventType, param: EntityOperationEvent) => {
                if (
                    type == PluginEventType.EntityOperation &&
                    param.operation == EntityOperation.NewEntity
                ) {
                    param.contentForShadowEntity.appendChild(textNode);
                }
            });
        const editor: IEditor = <any>{
            triggerPluginEvent,
            contains: (node: Node) => node == entity1,
            addContentEditFeature: () => {},
            getDocument: () => document,
            isFeatureEnabled: () => false,
        };

        plugin.initialize(editor);
        commitEntity.default(entity1, 'TEST', false, 'TEST1');

        plugin.onPluginEvent({
            eventType: PluginEventType.ContentChanged,
            source: ChangeSource.InsertEntity,
            data: getEntityFromElement.default(entity1),
        });

        expect(state.knownEntityElements).toEqual([entity1]);
        expect(state.shadowEntityCache).toEqual({});
        expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.EntityOperation, {
            operation: EntityOperation.NewEntity,
            rawEvent: undefined,
            entity: getEntityFromElement.default(entity1),
            contentForShadowEntity: document.createDocumentFragment(),
        });
        expect(entity1.shadowRoot.firstChild).toBe(textNode);
        expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.EntityOperation, {
            operation: EntityOperation.AddShadowRoot,
            rawEvent: undefined,
            entity: getEntityFromElement.default(entity1),
            contentForShadowEntity: undefined,
        });
    });

    it('ContentChange - dehydrate existing entity', () => {
        const plugin = new EntityPlugin();
        const state = plugin.getState();
        const entity1 = document.createElement('span');
        let newEntity: HTMLElement;
        const triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');
        const editor: IEditor = <any>{
            triggerPluginEvent,
            queryElements: () => [entity1],
            contains: (node: Node) => node == entity1,
            replaceNode: (oldNode: HTMLElement, newNode: HTMLElement) => {
                newEntity = newNode;
            },
            addContentEditFeature: () => {},
            getDocument: () => document,
            isFeatureEnabled: () => false,
        };

        plugin.initialize(editor);
        commitEntity.default(entity1, 'TEST', false, 'TEST1');
        entity1.attachShadow({ mode: 'open' });

        plugin.onPluginEvent({
            eventType: PluginEventType.ContentChanged,
            source: '',
        });

        expect(state.knownEntityElements.length).toBe(1);
        expect(state.knownEntityElements[0]).not.toBe(entity1);
        expect(state.knownEntityElements[1]).not.toBe(newEntity);
        expect(state.shadowEntityCache).toEqual({});
        expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.EntityOperation, {
            operation: EntityOperation.NewEntity,
            rawEvent: undefined,
            entity: getEntityFromElement.default(entity1),
            contentForShadowEntity: document.createDocumentFragment(),
        });
        expect(newEntity.shadowRoot).toBe(null);
    });

    it('ContentChange - rehydrate existing entity with different content', () => {
        const plugin = new EntityPlugin();
        const state = plugin.getState();
        const entity1 = document.createElement('span');
        const entity2 = document.createElement('span');
        const triggerPluginEvent = jasmine
            .createSpy('triggerPluginEvent')
            .and.callFake((type: PluginEventType, param: EntityOperationEvent) => {
                if (
                    type == PluginEventType.EntityOperation &&
                    param.operation == EntityOperation.NewEntity
                ) {
                    moveChildNodes(
                        param.contentForShadowEntity,
                        createElement(
                            {
                                tag: 'span',
                                children: ['test2'],
                            },
                            document
                        )
                    );
                }
            });
        const editor: IEditor = <any>{
            triggerPluginEvent,
            queryElements: () => [entity1],
            contains: (node: Node) => node == entity2,
            getDocument: () => document,
            addContentEditFeature: () => {},
            isFeatureEnabled: () => false,
        };

        plugin.initialize(editor);
        commitEntity.default(entity1, 'TEST', false, 'TEST1');
        commitEntity.default(entity2, 'TEST', false, 'TEST1');
        entity1.attachShadow({ mode: 'open' }).appendChild(document.createTextNode('test'));
        state.knownEntityElements.push(entity1);

        plugin.onPluginEvent({
            eventType: PluginEventType.BeforeSetContent,
            newContent: '',
        });

        editor.queryElements = () => [entity2];
        plugin.onPluginEvent({
            eventType: PluginEventType.ContentChanged,
            source: '',
        });

        expect(state.knownEntityElements.length).toBe(1);
        expect(state.knownEntityElements[0]).toBe(entity2);
        expect(state.shadowEntityCache).toEqual({});
        expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.EntityOperation, {
            operation: EntityOperation.NewEntity,
            rawEvent: undefined,
            entity: getEntityFromElement.default(entity2),
            contentForShadowEntity: document.createDocumentFragment(),
        });
        expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.EntityOperation, {
            operation: EntityOperation.RemoveShadowRoot,
            rawEvent: undefined,
            entity: getEntityFromElement.default(entity1),
            contentForShadowEntity: undefined,
        });
    });

    it('EntityOperation event', () => {
        const plugin = new EntityPlugin();
        const state = plugin.getState();
        const entity1 = document.createElement('span');
        const triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');
        const editor: IEditor = <any>{
            triggerPluginEvent,
            queryElements: () => <HTMLElement[]>[],
            contains: () => false,
            runAsync: (callback: Function) => callback(),
            addContentEditFeature: () => {},
            isFeatureEnabled: () => false,
        };

        state.knownEntityElements.push(entity1);
        commitEntity.default(entity1, 'TEST', false, 'TEST1');
        entity1.attachShadow({ mode: 'open' });
        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: PluginEventType.EntityOperation,
            operation: EntityOperation.Overwrite,
            entity: getEntityFromElement.default(entity1),
        });

        expect(state.knownEntityElements).toEqual([]);
        expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.EntityOperation, {
            operation: EntityOperation.RemoveShadowRoot,
            entity: getEntityFromElement.default(entity1),
            rawEvent: undefined,
            contentForShadowEntity: undefined,
        });
    });

    it('Id management', () => {
        const plugin = new EntityPlugin();
        const entity1 = document.createElement('span');
        const entity2 = document.createElement('span');
        const entity3 = document.createElement('span');
        const entity4 = document.createElement('span');
        const state = plugin.getState();
        const editor: IEditor = <any>{
            triggerPluginEvent: jasmine.createSpy('triggerPluginEvent'),
            queryElements: () => [entity1, entity2, entity3, entity4],
            contains: (node: Node) =>
                node == entity1 || node == entity2 || node == entity3 || node == entity4,
            addContentEditFeature: () => {},
            getDocument: () => document,
            isFeatureEnabled: () => false,
        };

        commitEntity.default(entity1, 'TEST', false, 'Test');
        commitEntity.default(entity2, 'TEST', false, 'Test_2');
        commitEntity.default(entity3, 'TEST', false, 'Test');
        commitEntity.default(entity4, 'TEST', false, 'Test_2');
        state.knownEntityElements.push(entity1);
        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: PluginEventType.ContentChanged,
            source: '',
        });

        expect(getEntityFromElement.default(entity1).id).toBe('Test');
        expect(getEntityFromElement.default(entity2).id).toBe('Test_2');
        expect(getEntityFromElement.default(entity3).id).toBe('Test_1');
        expect(getEntityFromElement.default(entity4).id).toBe('Test_3');
    });
});
