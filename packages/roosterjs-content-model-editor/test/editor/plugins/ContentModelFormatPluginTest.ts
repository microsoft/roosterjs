import * as pendingFormat from '../../../lib/modelApi/format/pendingFormat';
import ContentModelFormatPlugin from '../../../lib/editor/plugins/ContentModelFormatPlugin';
import { addSegment } from '../../../lib/modelApi/common/addSegment';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createSelectionMarker } from '../../../lib/modelApi/creators/createSelectionMarker';
import { createText } from '../../../lib/modelApi/creators/createText';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';
import { PluginEventType } from 'roosterjs-editor-types';

describe('ContentModelFormatPlugin', () => {
    it('no pending format, trigger key down event', () => {
        spyOn(pendingFormat, 'clearPendingFormat');
        spyOn(pendingFormat, 'getPendingFormat').and.returnValue(null);

        const editor = ({
            cacheContentModel: () => {},
        } as any) as IContentModelEditor;
        const plugin = new ContentModelFormatPlugin();

        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: ({ which: 33 } as any) as KeyboardEvent,
        });

        plugin.dispose();

        expect(pendingFormat.clearPendingFormat).toHaveBeenCalledTimes(1);
        expect(pendingFormat.clearPendingFormat).toHaveBeenCalledWith(editor);
    });

    it('no selection, trigger input event', () => {
        spyOn(pendingFormat, 'clearPendingFormat');
        spyOn(pendingFormat, 'getPendingFormat').and.returnValue({
            fontSize: '10px',
        });

        const setContentModel = jasmine.createSpy('setContentModel');
        const editor = ({
            createContentModel: () => model,
            setContentModel,
            isInIME: () => false,
            cacheContentModel: () => {},
        } as any) as IContentModelEditor;
        const plugin = new ContentModelFormatPlugin();
        const model = createContentModelDocument();

        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: PluginEventType.Input,
            rawEvent: ({ data: 'a' } as any) as InputEvent,
        });

        plugin.dispose();

        expect(setContentModel).toHaveBeenCalledTimes(0);
        expect(pendingFormat.clearPendingFormat).toHaveBeenCalledTimes(1);
        expect(pendingFormat.clearPendingFormat).toHaveBeenCalledWith(editor);
    });

    it('with pending format and selection, has correct text before, trigger input event with isComposing = true', () => {
        spyOn(pendingFormat, 'clearPendingFormat');
        spyOn(pendingFormat, 'getPendingFormat').and.returnValue({
            fontSize: '10px',
        });
        const setContentModel = jasmine.createSpy('setContentModel');
        const model = createContentModelDocument();
        const marker = createSelectionMarker();

        addSegment(model, marker);

        const editor = ({
            createContentModel: () => model,
            setContentModel,
            cacheContentModel: () => {},
        } as any) as IContentModelEditor;
        const plugin = new ContentModelFormatPlugin();

        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: PluginEventType.Input,
            rawEvent: ({ data: 'a', isComposing: true } as any) as InputEvent,
        });
        plugin.dispose();

        expect(setContentModel).toHaveBeenCalledTimes(0);
        expect(pendingFormat.clearPendingFormat).toHaveBeenCalledTimes(0);
    });

    it('with pending format and selection, no correct text before, trigger input event', () => {
        spyOn(pendingFormat, 'clearPendingFormat');
        spyOn(pendingFormat, 'getPendingFormat').and.returnValue({
            fontSize: '10px',
        });

        const setContentModel = jasmine.createSpy('setContentModel');
        const model = createContentModelDocument();
        const marker = createSelectionMarker();

        addSegment(model, marker);

        const editor = ({
            createContentModel: () => model,
            setContentModel,
            isInIME: () => false,
            cacheContentModel: () => {},
        } as any) as IContentModelEditor;
        const plugin = new ContentModelFormatPlugin();

        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: PluginEventType.Input,
            rawEvent: ({ data: 'a' } as any) as InputEvent,
        });
        plugin.dispose();

        expect(setContentModel).toHaveBeenCalledTimes(0);
        expect(pendingFormat.clearPendingFormat).toHaveBeenCalledTimes(1);
        expect(pendingFormat.clearPendingFormat).toHaveBeenCalledWith(editor);
    });

    it('with pending format and selection, has correct text before, trigger input event', () => {
        spyOn(pendingFormat, 'clearPendingFormat');
        spyOn(pendingFormat, 'setPendingFormat');
        spyOn(pendingFormat, 'getPendingFormat').and.returnValue({
            fontSize: '10px',
        });

        const setContentModel = jasmine.createSpy('setContentModel');
        const model = createContentModelDocument();
        const text = createText('a');
        const marker = createSelectionMarker();

        addSegment(model, text);
        addSegment(model, marker);

        const editor = ({
            createContentModel: () => model,
            setContentModel,
            isInIME: () => false,
            focus: () => {},
            addUndoSnapshot: (callback: () => void) => {
                callback();
            },
            cacheContentModel: () => {},
        } as any) as IContentModelEditor;
        const plugin = new ContentModelFormatPlugin();

        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: PluginEventType.Input,
            rawEvent: ({ data: 'a' } as any) as InputEvent,
        });
        plugin.dispose();

        expect(setContentModel).toHaveBeenCalledTimes(1);
        expect(setContentModel).toHaveBeenCalledWith(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        isImplicit: false,
                        segments: [
                            {
                                segmentType: 'Text',
                                format: { fontSize: '10px' },
                                text: 'a',
                            },
                            {
                                segmentType: 'SelectionMarker',
                                format: { fontSize: '10px' },
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            { onNodeCreated: undefined }
        );
        expect(pendingFormat.clearPendingFormat).toHaveBeenCalledTimes(1);
        expect(pendingFormat.clearPendingFormat).toHaveBeenCalledWith(editor);
    });

    it('with pending format and selection, has correct text before, trigger CompositionEnd event', () => {
        spyOn(pendingFormat, 'clearPendingFormat');
        spyOn(pendingFormat, 'getPendingFormat').and.returnValue({
            fontSize: '10px',
        });

        const setContentModel = jasmine.createSpy('setContentModel');
        const model = createContentModelDocument();
        const text = createText('test a test', { fontFamily: 'Arial' });
        const marker = createSelectionMarker();

        addSegment(model, text);
        addSegment(model, marker);

        const editor = ({
            createContentModel: () => model,
            setContentModel,
            focus: () => {},
            addUndoSnapshot: (callback: () => void) => {
                callback();
            },
            cacheContentModel: () => {},
        } as any) as IContentModelEditor;
        const plugin = new ContentModelFormatPlugin();

        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: PluginEventType.CompositionEnd,
            rawEvent: ({ data: 'test' } as any) as CompositionEvent,
        });
        plugin.dispose();

        expect(setContentModel).toHaveBeenCalledTimes(1);
        expect(setContentModel).toHaveBeenCalledWith(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        isImplicit: false,
                        segments: [
                            {
                                segmentType: 'Text',
                                format: { fontFamily: 'Arial' },
                                text: 'test a ',
                            },
                            {
                                segmentType: 'Text',
                                format: { fontSize: '10px', fontFamily: 'Arial' },
                                text: 'test',
                            },
                            {
                                segmentType: 'SelectionMarker',
                                format: { fontSize: '10px' },
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            { onNodeCreated: undefined }
        );
        expect(pendingFormat.clearPendingFormat).toHaveBeenCalledTimes(1);
        expect(pendingFormat.clearPendingFormat).toHaveBeenCalledWith(editor);
    });

    it('Non-input and cursor moving key down should not trigger pending format change', () => {
        spyOn(pendingFormat, 'clearPendingFormat');
        spyOn(pendingFormat, 'getPendingFormat').and.returnValue({
            fontSize: '10px',
        });

        const setContentModel = jasmine.createSpy('setContentModel');
        const model = createContentModelDocument();

        const editor = ({
            createContentModel: () => model,
            setContentModel,
            cacheContentModel: () => {},
        } as any) as IContentModelEditor;
        const plugin = new ContentModelFormatPlugin();

        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: ({ which: 17 } as any) as KeyboardEvent,
        });
        plugin.dispose();

        expect(setContentModel).toHaveBeenCalledTimes(0);
        expect(pendingFormat.clearPendingFormat).toHaveBeenCalledTimes(0);
    });

    it('Content changed event', () => {
        spyOn(pendingFormat, 'clearPendingFormat');
        spyOn(pendingFormat, 'canApplyPendingFormat').and.returnValue(false);
        spyOn(pendingFormat, 'setPendingFormat');
        spyOn(pendingFormat, 'getPendingFormat').and.returnValue({
            fontSize: '10px',
        });

        const setContentModel = jasmine.createSpy('setContentModel');
        const model = createContentModelDocument();

        const editor = ({
            createContentModel: () => model,
            setContentModel,
            addUndoSnapshot: (callback: () => void) => {
                callback();
            },
            cacheContentModel: () => {},
        } as any) as IContentModelEditor;
        const plugin = new ContentModelFormatPlugin();

        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: PluginEventType.ContentChanged,
            source: '',
        });
        plugin.dispose();

        expect(setContentModel).toHaveBeenCalledTimes(0);
        expect(pendingFormat.clearPendingFormat).toHaveBeenCalledTimes(1);
        expect(pendingFormat.clearPendingFormat).toHaveBeenCalledWith(editor);
        expect(pendingFormat.canApplyPendingFormat).toHaveBeenCalledTimes(1);
    });

    it('Mouse up event', () => {
        spyOn(pendingFormat, 'clearPendingFormat');
        spyOn(pendingFormat, 'canApplyPendingFormat').and.returnValue(false);
        spyOn(pendingFormat, 'getPendingFormat').and.returnValue({
            fontSize: '10px',
        });

        const setContentModel = jasmine.createSpy('setContentModel');
        const model = createContentModelDocument();

        const editor = ({
            createContentModel: () => model,
            setContentModel,
            cacheContentModel: () => {},
        } as any) as IContentModelEditor;
        const plugin = new ContentModelFormatPlugin();

        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: PluginEventType.MouseUp,
            rawEvent: ({} as any) as MouseEvent,
        });
        plugin.dispose();

        expect(setContentModel).toHaveBeenCalledTimes(0);
        expect(pendingFormat.clearPendingFormat).toHaveBeenCalledTimes(1);
        expect(pendingFormat.clearPendingFormat).toHaveBeenCalledWith(editor);
        expect(pendingFormat.canApplyPendingFormat).toHaveBeenCalledTimes(1);
    });

    it('Mouse up event and pending format can still be applied', () => {
        spyOn(pendingFormat, 'clearPendingFormat');
        spyOn(pendingFormat, 'canApplyPendingFormat').and.returnValue(true);
        spyOn(pendingFormat, 'getPendingFormat').and.returnValue({
            fontSize: '10px',
        });

        const setContentModel = jasmine.createSpy('setContentModel');
        const model = createContentModelDocument();

        const editor = ({
            createContentModel: () => model,
            setContentModel,
            cacheContentModel: () => {},
        } as any) as IContentModelEditor;
        const plugin = new ContentModelFormatPlugin();

        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: PluginEventType.MouseUp,
            rawEvent: ({} as any) as MouseEvent,
        });
        plugin.dispose();

        expect(setContentModel).toHaveBeenCalledTimes(0);
        expect(pendingFormat.clearPendingFormat).not.toHaveBeenCalled();
        expect(pendingFormat.canApplyPendingFormat).toHaveBeenCalledTimes(1);
    });
});
