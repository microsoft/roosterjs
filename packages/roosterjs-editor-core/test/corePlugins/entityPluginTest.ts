import * as commitEntity from 'roosterjs-editor-dom/lib/entity/commitEntity';
import * as getEntityFromElement from 'roosterjs-editor-dom/lib/entity/getEntityFromElement';
import EntityPlugin from '../../lib/corePlugins/EntityPlugin';
import { createDefaultHtmlSanitizerOptions } from 'roosterjs-editor-dom';
import {
    ChangeSource,
    EntityClasses,
    EntityOperation,
    EntityPluginState,
    IEditor,
    Keys,
    PasteType,
    PluginEventType,
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
                pasteType: PasteType.Normal,
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
