import * as handleDroppedContentFile from '../../lib/dragAndDrop/utils/handleDroppedExternalContent';
import * as handleDroppedInternalContentFile from '../../lib/dragAndDrop/utils/handleDroppedInternalContent';
import * as deleteSelectionFile from 'roosterjs-content-model-dom/lib/modelApi/editing/deleteSelection';
import { DragAndDropPlugin } from '../../lib/dragAndDrop/DragAndDropPlugin';
import { reorderList } from '../../lib/dragAndDrop/utils/reorderList';
import {
    ContentModelDocument,
    ContentModelFormatter,
    FormatContentModelContext,
    IEditor,
} from 'roosterjs-content-model-types';
import { ChangeSource } from 'roosterjs-content-model-dom';

describe('DragAndDropPlugin', () => {
    let plugin: DragAndDropPlugin;
    let editor: IEditor;
    let attachDomEventSpy: jasmine.Spy;
    let disposerSpy: jasmine.Spy;
    let isExperimentalFeatureEnabledSpy: jasmine.Spy;
    let eventMap: Record<string, any>;
    let getDOMSelectionSpy: jasmine.Spy;
    let formatContentModelSpy: jasmine.Spy;
    let deleteSelectionSpy: jasmine.Spy;
    let contentModel: ContentModelDocument;
    let formatContext: FormatContentModelContext;

    beforeEach(() => {
        disposerSpy = jasmine.createSpy('disposer');
        attachDomEventSpy = jasmine.createSpy('attachDomEvent').and.callFake((map: any) => {
            eventMap = map;
            return disposerSpy;
        });
        isExperimentalFeatureEnabledSpy = jasmine
            .createSpy('isExperimentalFeatureEnabled')
            .and.returnValue(true);
        getDOMSelectionSpy = jasmine.createSpy('getDOMSelection');
        deleteSelectionSpy = spyOn(deleteSelectionFile, 'deleteSelection');
        contentModel = {
            blockGroupType: 'Document',
            blocks: [],
        };
        formatContext = {
            deletedEntities: [],
            newEntities: [],
            newImages: [],
        };
        formatContentModelSpy = jasmine
            .createSpy('formatContentModel')
            .and.callFake((callback: ContentModelFormatter) =>
                callback(contentModel, formatContext)
            );

        editor = ({
            attachDomEvent: attachDomEventSpy,
            isExperimentalFeatureEnabled: isExperimentalFeatureEnabledSpy,
            getDOMSelection: getDOMSelectionSpy,
            formatContentModel: formatContentModelSpy,
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
            expect(eventMap.beforeinput).toBeDefined();
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
            spyOn(handleDroppedInternalContentFile, 'handleDroppedInternalContent');
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

    describe('beforeinput event', () => {
        it('should delete the selection for deleteByDrag after an internal drag', () => {
            plugin = new DragAndDropPlugin();
            plugin.initialize(editor);

            eventMap.dragstart.beforeDispatch({} as DragEvent);
            const preventDefaultSpy = jasmine.createSpy('preventDefault');

            eventMap.beforeinput.beforeDispatch({
                inputType: 'deleteByDrag',
                preventDefault: preventDefaultSpy,
            } as any);

            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
            expect(deleteSelectionSpy).toHaveBeenCalled();
            expect(formatContentModelSpy).toHaveBeenCalledWith(jasmine.any(Function), {
                changeSource: ChangeSource.DragOutOfEditor,
            });
            expect(formatContentModelSpy.calls.mostRecent().returnValue).toBeTrue();
        });

        it('should reorder the list when dragging a list item out of the editor', () => {
            plugin = new DragAndDropPlugin();
            plugin.initialize(editor);

            eventMap.dragstart.beforeDispatch({} as DragEvent);
            eventMap.beforeinput.beforeDispatch({
                inputType: 'deleteByDrag',
                preventDefault: jasmine.createSpy('preventDefault'),
            } as any);

            expect(deleteSelectionSpy).toHaveBeenCalledWith(
                contentModel,
                [reorderList],
                formatContext
            );
        });

        it('should not delete the selection for another input type', () => {
            plugin = new DragAndDropPlugin();
            plugin.initialize(editor);

            eventMap.dragstart.beforeDispatch({} as DragEvent);
            const preventDefaultSpy = jasmine.createSpy('preventDefault');

            eventMap.beforeinput.beforeDispatch({
                inputType: 'insertText',
                preventDefault: preventDefaultSpy,
            } as any);

            expect(preventDefaultSpy).not.toHaveBeenCalled();
            expect(deleteSelectionSpy).not.toHaveBeenCalled();
            expect(formatContentModelSpy).not.toHaveBeenCalled();
        });

        it('should not delete the selection without an internal drag', () => {
            plugin = new DragAndDropPlugin();
            plugin.initialize(editor);
            const preventDefaultSpy = jasmine.createSpy('preventDefault');

            eventMap.beforeinput.beforeDispatch({
                inputType: 'deleteByDrag',
                preventDefault: preventDefaultSpy,
            } as any);

            expect(preventDefaultSpy).not.toHaveBeenCalled();
            expect(deleteSelectionSpy).not.toHaveBeenCalled();
            expect(formatContentModelSpy).not.toHaveBeenCalled();
        });

        it('should reset the internal drag flag after beforeinput', () => {
            plugin = new DragAndDropPlugin();
            plugin.initialize(editor);

            eventMap.dragstart.beforeDispatch({} as DragEvent);
            eventMap.beforeinput.beforeDispatch({
                inputType: 'insertText',
            } as any);
            eventMap.beforeinput.beforeDispatch({
                inputType: 'deleteByDrag',
                preventDefault: jasmine.createSpy('preventDefault'),
            } as any);

            expect(deleteSelectionSpy).not.toHaveBeenCalled();
            expect(formatContentModelSpy).not.toHaveBeenCalled();
        });
    });

    describe('onPluginEvent - beforeDrop', () => {
        let handleDroppedExternalContentSpy: jasmine.Spy;

        beforeEach(() => {
            handleDroppedExternalContentSpy = spyOn(
                handleDroppedContentFile,
                'handleDroppedExternalContent'
            );
            spyOn(handleDroppedInternalContentFile, 'handleDroppedInternalContent');
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

            expect(handleDroppedExternalContentSpy).toHaveBeenCalledWith(editor, dropEvent, [
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

            expect(handleDroppedExternalContentSpy).toHaveBeenCalledWith(editor, dropEvent, [
                'script',
                'object',
            ]);
        });

        it('should call handleDroppedContent even when dataTransfer has no HTML', () => {
            const dropEvent = {
                dataTransfer: {
                    getData: () => '',
                },
            } as any;

            plugin.onPluginEvent({
                eventType: 'beforeDrop',
                rawEvent: dropEvent,
            });

            expect(handleDroppedExternalContentSpy).toHaveBeenCalledWith(editor, dropEvent, [
                'iframe',
            ]);
        });

        it('should call handleDroppedContent when only plain text is dropped', () => {
            const text = 'dropped plain text';
            const dropEvent = {
                dataTransfer: {
                    getData: (format: string) => (format == 'text/plain' ? text : ''),
                },
            } as any;

            plugin.onPluginEvent({
                eventType: 'beforeDrop',
                rawEvent: dropEvent,
            });

            expect(handleDroppedExternalContentSpy).toHaveBeenCalledWith(editor, dropEvent, [
                'iframe',
            ]);
        });

        it('should call handleDroppedContent when both HTML and plain text are present', () => {
            const html = '<div>dropped html</div>';
            const text = 'dropped plain text';
            const dropEvent = {
                dataTransfer: {
                    getData: (format: string) => (format == 'text/html' ? html : text),
                },
            } as any;

            plugin.onPluginEvent({
                eventType: 'beforeDrop',
                rawEvent: dropEvent,
            });

            expect(handleDroppedExternalContentSpy).toHaveBeenCalledWith(editor, dropEvent, [
                'iframe',
            ]);
        });

        it('should call handleDroppedContent even when dataTransfer is null', () => {
            const dropEvent = {
                dataTransfer: null,
            } as any;

            plugin.onPluginEvent({
                eventType: 'beforeDrop',
                rawEvent: dropEvent,
            });

            expect(handleDroppedExternalContentSpy).toHaveBeenCalledWith(editor, dropEvent, [
                'iframe',
            ]);
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

    describe('onPluginEvent - beforeDrop - internal drag', () => {
        let handleDroppedInternalContentSpy: jasmine.Spy;
        let handleDroppedExternalContentSpy: jasmine.Spy;

        beforeEach(() => {
            handleDroppedInternalContentSpy = spyOn(
                handleDroppedInternalContentFile,
                'handleDroppedInternalContent'
            );
            handleDroppedExternalContentSpy = spyOn(
                handleDroppedContentFile,
                'handleDroppedExternalContent'
            );

            plugin = new DragAndDropPlugin();
            plugin.initialize(editor);
        });

        it('should call handleDroppedInternalContent on drop after an internal drag', () => {
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

            expect(isExperimentalFeatureEnabledSpy).toHaveBeenCalledWith(
                'HandleDropInternalContent'
            );
            expect(handleDroppedInternalContentSpy).toHaveBeenCalledWith(editor, dropEvent);
            expect(handleDroppedExternalContentSpy).not.toHaveBeenCalled();
        });

        it('should not call handleDroppedInternalContent when the experiment is disabled', () => {
            isExperimentalFeatureEnabledSpy.and.returnValue(false);

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

            expect(isExperimentalFeatureEnabledSpy).toHaveBeenCalledWith(
                'HandleDropInternalContent'
            );
            expect(handleDroppedInternalContentSpy).not.toHaveBeenCalled();
            expect(handleDroppedExternalContentSpy).not.toHaveBeenCalled();
        });

        it('should reset the internal drag flag after a drop so it is only handled once', () => {
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

            // Second drop is treated as external, so internal handling only runs once
            expect(handleDroppedInternalContentSpy).toHaveBeenCalledTimes(1);
            expect(handleDroppedExternalContentSpy).toHaveBeenCalledTimes(1);
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

            expect(handleDroppedExternalContentSpy).toHaveBeenCalledWith(editor, dropEvent, []);
        });
    });
});
