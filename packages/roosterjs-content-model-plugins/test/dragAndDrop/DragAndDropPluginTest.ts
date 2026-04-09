import * as handleDroppedContentFile from '../../lib/dragAndDrop/utils/handleDroppedContent';
import { DragAndDropPlugin } from '../../lib/dragAndDrop/DragAndDropPlugin';
import { IEditor } from 'roosterjs-content-model-types';

describe('DragAndDropPlugin', () => {
    let plugin: DragAndDropPlugin;
    let editor: IEditor;
    let attachDomEventSpy: jasmine.Spy;
    let disposerSpy: jasmine.Spy;
    let eventMap: Record<string, any>;

    beforeEach(() => {
        disposerSpy = jasmine.createSpy('disposer');
        attachDomEventSpy = jasmine.createSpy('attachDomEvent').and.callFake((map: any) => {
            eventMap = map;
            return disposerSpy;
        });

        editor = ({
            attachDomEvent: attachDomEventSpy,
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
            const handleDroppedContentSpy = spyOn(handleDroppedContentFile, 'handleDroppedContent');

            plugin.onPluginEvent({
                eventType: 'beforeDrop',
                rawEvent: {
                    dataTransfer: {
                        getData: () => '<div>test</div>',
                    },
                } as any,
            });

            expect(handleDroppedContentSpy).not.toHaveBeenCalled();
        });
    });

    describe('onPluginEvent - beforeDrop', () => {
        let handleDroppedContentSpy: jasmine.Spy;

        beforeEach(() => {
            handleDroppedContentSpy = spyOn(handleDroppedContentFile, 'handleDroppedContent');
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

            expect(handleDroppedContentSpy).toHaveBeenCalledWith(editor, dropEvent, html, [
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

            expect(handleDroppedContentSpy).toHaveBeenCalledWith(editor, dropEvent, html, [
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

            expect(handleDroppedContentSpy).not.toHaveBeenCalled();
        });

        it('should not call handleDroppedContent when dataTransfer is null', () => {
            const dropEvent = {
                dataTransfer: null,
            } as any;

            plugin.onPluginEvent({
                eventType: 'beforeDrop',
                rawEvent: dropEvent,
            });

            expect(handleDroppedContentSpy).not.toHaveBeenCalled();
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

            expect(handleDroppedContentSpy).not.toHaveBeenCalled();
        });

        it('should ignore other event types', () => {
            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent: {} as any,
            } as any);

            expect(handleDroppedContentSpy).not.toHaveBeenCalled();
        });
    });

    describe('edge cases', () => {
        it('should not process events when editor is null', () => {
            const handleDroppedContentSpy = spyOn(handleDroppedContentFile, 'handleDroppedContent');

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

            expect(handleDroppedContentSpy).not.toHaveBeenCalled();
        });

        it('should handle empty forbidden elements array', () => {
            const handleDroppedContentSpy = spyOn(handleDroppedContentFile, 'handleDroppedContent');

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

            expect(handleDroppedContentSpy).toHaveBeenCalledWith(editor, dropEvent, html, []);
        });
    });
});
