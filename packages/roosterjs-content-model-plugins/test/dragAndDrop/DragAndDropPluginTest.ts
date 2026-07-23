import * as handleDroppedContentFile from '../../lib/dragAndDrop/utils/handleDroppedExternalContent';
import * as handleDroppedInternalContentFile from '../../lib/dragAndDrop/utils/handleDroppedInternalContent';
import * as trimModelForSelectionFile from 'roosterjs-content-model-dom/lib/domUtils/selection/trimModelForSelection';
import { ContentModelDocument, DOMSelection, IEditor } from 'roosterjs-content-model-types';
import { DragAndDropPlugin } from '../../lib/dragAndDrop/DragAndDropPlugin';

describe('DragAndDropPlugin', () => {
    let plugin: DragAndDropPlugin;
    let editor: IEditor;
    let attachDomEventSpy: jasmine.Spy;
    let disposerSpy: jasmine.Spy;
    let eventMap: Record<string, any>;
    let getContentModelCopySpy: jasmine.Spy;
    let getDOMSelectionSpy: jasmine.Spy;

    beforeEach(() => {
        disposerSpy = jasmine.createSpy('disposer');
        attachDomEventSpy = jasmine.createSpy('attachDomEvent').and.callFake((map: any) => {
            eventMap = map;
            return disposerSpy;
        });
        getContentModelCopySpy = jasmine.createSpy('getContentModelCopy');
        getDOMSelectionSpy = jasmine.createSpy('getDOMSelection');

        editor = ({
            attachDomEvent: attachDomEventSpy,
            isExperimentalFeatureEnabled: () => true,
            getContentModelCopy: getContentModelCopySpy,
            getDOMSelection: getDOMSelectionSpy,
        } as any) as IEditor;
    });

    afterEach(() => {
        plugin?.dispose();
    });

    describe('initialization', () => {
        it('should return correct name', () => {
            plugin = new DragAndDropPlugin();
            expect(plugin.getName()).toBe('DragAndDrop');
        });

        it('should initialize with default options', () => {
            plugin = new DragAndDropPlugin();
            plugin.initialize(editor);

            expect(attachDomEventSpy).toHaveBeenCalled();
            expect(eventMap.dragstart).toBeDefined();
        });

        it('should initialize with custom forbidden elements', () => {
            plugin = new DragAndDropPlugin({ forbiddenElements: ['script', 'object'] });
            plugin.initialize(editor);

            expect(attachDomEventSpy).toHaveBeenCalled();
        });

        it('should dispose correctly', () => {
            plugin = new DragAndDropPlugin();
            plugin.initialize(editor);

            plugin.dispose();

            expect(disposerSpy).toHaveBeenCalled();
        });
    });

    describe('dragstart event', () => {
        it('should set isInternalDragging to true when drag starts', () => {
            plugin = new DragAndDropPlugin();
            plugin.initialize(editor);

            const target = document.createElement('div');

            eventMap.dragstart.beforeDispatch({ target } as any);

            // Verify by checking that beforeDrop event with HTML does not call handleDroppedContent
            const handleDroppedExternalContentSpy = spyOn(
                handleDroppedContentFile,
                'handleDroppedExternalContent'
            );

            plugin.onPluginEvent({
                eventType: 'beforeDrop',
                rawEvent: {
                    dataTransfer: {
                        getData: () => '<div>test</div>',
                    },
                } as any,
            });

            expect(handleDroppedExternalContentSpy).not.toHaveBeenCalled();
        });
    });

    describe('onPluginEvent - beforeDrop', () => {
        let handleDroppedExternalContentSpy: jasmine.Spy;

        beforeEach(() => {
            handleDroppedExternalContentSpy = spyOn(
                handleDroppedContentFile,
                'handleDroppedExternalContent'
            );
            plugin = new DragAndDropPlugin();
            plugin.initialize(editor);
        });

        it('should call handleDroppedContent when HTML is dropped from external source', () => {
            const html = '<div>dropped content</div>';
            const dropEvent = {
                dataTransfer: {
                    getData: () => html,
                },
            } as any;

            plugin.onPluginEvent({
                eventType: 'beforeDrop',
                rawEvent: dropEvent,
            });

            expect(handleDroppedExternalContentSpy).toHaveBeenCalledWith(editor, dropEvent, html, [
                'iframe',
            ]);
        });

        it('should use custom forbidden elements', () => {
            plugin.dispose();
            plugin = new DragAndDropPlugin({ forbiddenElements: ['script', 'object'] });
            plugin.initialize(editor);

            const html = '<div>dropped content</div>';
            const dropEvent = {
                dataTransfer: {
                    getData: () => html,
                },
            } as any;

            plugin.onPluginEvent({
                eventType: 'beforeDrop',
                rawEvent: dropEvent,
            });

            expect(handleDroppedExternalContentSpy).toHaveBeenCalledWith(editor, dropEvent, html, [
                'script',
                'object',
            ]);
        });

        it('should not call handleDroppedContent when no HTML in dataTransfer', () => {
            const dropEvent = {
                dataTransfer: {
                    getData: () => '',
                },
            } as any;

            plugin.onPluginEvent({
                eventType: 'beforeDrop',
                rawEvent: dropEvent,
            });

            expect(handleDroppedExternalContentSpy).not.toHaveBeenCalled();
        });

        it('should not call handleDroppedContent when dataTransfer is null', () => {
            const dropEvent = {
                dataTransfer: null,
            } as any;

            plugin.onPluginEvent({
                eventType: 'beforeDrop',
                rawEvent: dropEvent,
            });

            expect(handleDroppedExternalContentSpy).not.toHaveBeenCalled();
        });

        it('should not call handleDroppedContent for internal drag and drop', () => {
            // Simulate internal drag start
            const target = document.createElement('div');
            eventMap.dragstart.beforeDispatch({ target } as any);

            const html = '<div>dragged content</div>';
            const dropEvent = {
                dataTransfer: {
                    getData: () => html,
                },
            } as any;

            plugin.onPluginEvent({
                eventType: 'beforeDrop',
                rawEvent: dropEvent,
            });

            expect(handleDroppedExternalContentSpy).not.toHaveBeenCalled();
        });

        it('should ignore other event types', () => {
            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent: {} as any,
            } as any);

            expect(handleDroppedExternalContentSpy).not.toHaveBeenCalled();
        });
    });

    describe('onPluginEvent - beforeDrop - HandleDropInternalContent enabled', () => {
        let handleDroppedInternalContentSpy: jasmine.Spy;
        let handleDroppedExternalContentSpy: jasmine.Spy;
        let trimModelForSelectionSpy: jasmine.Spy;
        let draggedModel: ContentModelDocument;
        let selection: DOMSelection;

        beforeEach(() => {
            handleDroppedInternalContentSpy = spyOn(
                handleDroppedInternalContentFile,
                'handleDroppedInternalContent'
            );
            handleDroppedExternalContentSpy = spyOn(
                handleDroppedContentFile,
                'handleDroppedExternalContent'
            );
            trimModelForSelectionSpy = spyOn(trimModelForSelectionFile, 'trimModelForSelection');

            draggedModel = { blockGroupType: 'Document', blocks: [] } as ContentModelDocument;
            selection = { type: 'range' } as any;

            getContentModelCopySpy.and.returnValue(draggedModel);
            getDOMSelectionSpy.and.returnValue(selection);

            plugin = new DragAndDropPlugin();
            plugin.initialize(editor);
        });

        it('should capture dragged model on dragstart and trim it for the selection', () => {
            const target = document.createElement('div');

            eventMap.dragstart.beforeDispatch({ target } as any);

            expect(getContentModelCopySpy).toHaveBeenCalledWith('disconnected');
            expect(getDOMSelectionSpy).toHaveBeenCalled();
            expect(trimModelForSelectionSpy).toHaveBeenCalledWith(draggedModel, selection);
        });

        it('should call handleDroppedInternalContent with the dragged model on drop', () => {
            const target = document.createElement('div');
            eventMap.dragstart.beforeDispatch({ target } as any);

            const dropEvent = {
                dataTransfer: {
                    getData: () => '<div>internal content</div>',
                },
            } as any;

            plugin.onPluginEvent({
                eventType: 'beforeDrop',
                rawEvent: dropEvent,
            });

            expect(handleDroppedInternalContentSpy).toHaveBeenCalledWith(
                editor,
                dropEvent,
                draggedModel
            );
            expect(handleDroppedExternalContentSpy).not.toHaveBeenCalled();
        });

        it('should clear the dragged model after a drop so it is only handled once', () => {
            const target = document.createElement('div');
            eventMap.dragstart.beforeDispatch({ target } as any);

            const dropEvent = {
                dataTransfer: {
                    getData: () => '<div>internal content</div>',
                },
            } as any;

            plugin.onPluginEvent({
                eventType: 'beforeDrop',
                rawEvent: dropEvent,
            });
            plugin.onPluginEvent({
                eventType: 'beforeDrop',
                rawEvent: dropEvent,
            });

            expect(handleDroppedInternalContentSpy).toHaveBeenCalledTimes(1);
        });

        it('should not capture a dragged model when there is no selection', () => {
            getDOMSelectionSpy.and.returnValue(null);

            const target = document.createElement('div');
            eventMap.dragstart.beforeDispatch({ target } as any);

            expect(trimModelForSelectionSpy).not.toHaveBeenCalled();

            const dropEvent = {
                dataTransfer: {
                    getData: () => '',
                },
            } as any;

            plugin.onPluginEvent({
                eventType: 'beforeDrop',
                rawEvent: dropEvent,
            });

            expect(handleDroppedInternalContentSpy).not.toHaveBeenCalled();
        });

        it('should not capture a dragged model when the feature is disabled', () => {
            plugin.dispose();

            editor = ({
                attachDomEvent: attachDomEventSpy,
                isExperimentalFeatureEnabled: () => false,
                getContentModelCopy: getContentModelCopySpy,
                getDOMSelection: getDOMSelectionSpy,
            } as any) as IEditor;

            plugin = new DragAndDropPlugin();
            plugin.initialize(editor);

            const target = document.createElement('div');
            eventMap.dragstart.beforeDispatch({ target } as any);

            expect(getContentModelCopySpy).not.toHaveBeenCalled();
            expect(trimModelForSelectionSpy).not.toHaveBeenCalled();

            const dropEvent = {
                dataTransfer: {
                    getData: () => '',
                },
            } as any;

            plugin.onPluginEvent({
                eventType: 'beforeDrop',
                rawEvent: dropEvent,
            });

            expect(handleDroppedInternalContentSpy).not.toHaveBeenCalled();
        });
    });

    describe('edge cases', () => {
        it('should not process events when editor is null', () => {
            const handleDroppedExternalContentSpy = spyOn(
                handleDroppedContentFile,
                'handleDroppedExternalContent'
            );

            plugin = new DragAndDropPlugin();
            // Don't initialize, so editor is null

            plugin.onPluginEvent({
                eventType: 'beforeDrop',
                rawEvent: {
                    dataTransfer: {
                        getData: () => '<div>test</div>',
                    },
                } as any,
            });

            expect(handleDroppedExternalContentSpy).not.toHaveBeenCalled();
        });

        it('should handle empty forbidden elements array', () => {
            const handleDroppedExternalContentSpy = spyOn(
                handleDroppedContentFile,
                'handleDroppedExternalContent'
            );

            plugin = new DragAndDropPlugin({ forbiddenElements: [] });
            plugin.initialize(editor);

            const html = '<div>content</div>';
            const dropEvent = {
                dataTransfer: {
                    getData: () => html,
                },
            } as any;

            plugin.onPluginEvent({
                eventType: 'beforeDrop',
                rawEvent: dropEvent,
            });

            expect(handleDroppedExternalContentSpy).toHaveBeenCalledWith(
                editor,
                dropEvent,
                html,
                []
            );
        });
    });
});
