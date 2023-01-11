import ContentModelPlugin from '../../lib/publicPlugin/ContentModelPlugin';
import { addSegment } from '../../lib/modelApi/common/addSegment';
import { createContentModelDocument } from '../../lib/modelApi/creators/createContentModelDocument';
import { createSelectionMarker } from '../../lib/modelApi/creators/createSelectionMarker';
import { createText } from '../../lib/modelApi/creators/createText';
import { FormatState, PluginEventType } from 'roosterjs-editor-types';
import { IExperimentalContentModelEditor } from '../../lib/publicTypes/IExperimentalContentModelEditor';

describe('ContentModelPlugin', () => {
    it('no pending format, trigger key down event', () => {
        const setPendingFormat = jasmine.createSpy('setPendingFormat');
        const editor = ({
            getPendingFormat: (): FormatState | null => null,
            setPendingFormat,
        } as any) as IExperimentalContentModelEditor;
        const plugin = new ContentModelPlugin();

        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: ({ which: 33 } as any) as KeyboardEvent,
        });

        plugin.dispose();

        expect(setPendingFormat).toHaveBeenCalledTimes(1);
        expect(setPendingFormat).toHaveBeenCalledWith(null);
    });

    it('no selection, trigger input event', () => {
        const setPendingFormat = jasmine.createSpy('setPendingFormat');
        const setContentModel = jasmine.createSpy('setContentModel');
        const editor = ({
            getPendingFormat: (): FormatState | null => ({
                fontSize: '10px',
            }),
            createContentModel: () => model,
            setPendingFormat,
            setContentModel,
        } as any) as IExperimentalContentModelEditor;
        const plugin = new ContentModelPlugin();
        const model = createContentModelDocument();

        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: PluginEventType.Input,
            rawEvent: ({ data: 'a' } as any) as InputEvent,
        });

        plugin.dispose();

        expect(setContentModel).toHaveBeenCalledTimes(0);
        expect(setPendingFormat).toHaveBeenCalledTimes(1);
        expect(setPendingFormat).toHaveBeenCalledWith(null);
    });

    it('with pending format and selection, has correct text before, trigger input event with isComposing = true', () => {
        const setPendingFormat = jasmine.createSpy('setPendingFormat');
        const setContentModel = jasmine.createSpy('setContentModel');
        const model = createContentModelDocument();
        const marker = createSelectionMarker();

        addSegment(model, marker);

        const editor = ({
            getPendingFormat: (): FormatState | null => ({
                fontSize: '10px',
            }),
            createContentModel: () => model,
            setPendingFormat,
            setContentModel,
        } as any) as IExperimentalContentModelEditor;
        const plugin = new ContentModelPlugin();

        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: PluginEventType.Input,
            rawEvent: ({ data: 'a', isComposing: true } as any) as InputEvent,
        });
        plugin.dispose();

        expect(setContentModel).toHaveBeenCalledTimes(0);
        expect(setPendingFormat).toHaveBeenCalledTimes(0);
    });

    it('with pending format and selection, no correct text before, trigger input event', () => {
        const setPendingFormat = jasmine.createSpy('setPendingFormat');
        const setContentModel = jasmine.createSpy('setContentModel');
        const model = createContentModelDocument();
        const marker = createSelectionMarker();

        addSegment(model, marker);

        const editor = ({
            getPendingFormat: (): FormatState | null => ({
                fontSize: '10px',
            }),
            createContentModel: () => model,
            setPendingFormat,
            setContentModel,
        } as any) as IExperimentalContentModelEditor;
        const plugin = new ContentModelPlugin();

        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: PluginEventType.Input,
            rawEvent: ({ data: 'a' } as any) as InputEvent,
        });
        plugin.dispose();

        expect(setContentModel).toHaveBeenCalledTimes(0);
        expect(setPendingFormat).toHaveBeenCalledTimes(1);
        expect(setPendingFormat).toHaveBeenCalledWith(null);
    });

    it('with pending format and selection, has correct text before, trigger input event', () => {
        const setPendingFormat = jasmine.createSpy('setPendingFormat');
        const setContentModel = jasmine.createSpy('setContentModel');
        const model = createContentModelDocument();
        const text = createText('a');
        const marker = createSelectionMarker();

        addSegment(model, text);
        addSegment(model, marker);

        const editor = ({
            getPendingFormat: (): FormatState | null => ({
                fontSize: '10px',
            }),
            createContentModel: () => model,
            setPendingFormat,
            setContentModel,
        } as any) as IExperimentalContentModelEditor;
        const plugin = new ContentModelPlugin();

        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: PluginEventType.Input,
            rawEvent: ({ data: 'a' } as any) as InputEvent,
        });
        plugin.dispose();

        expect(setContentModel).toHaveBeenCalledTimes(1);
        expect(setContentModel).toHaveBeenCalledWith({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'Text',
                            format: {},
                            text: '',
                        },
                        {
                            segmentType: 'Text',
                            format: { fontSize: '10px' },
                            text: 'a',
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
        expect(setPendingFormat).toHaveBeenCalledTimes(1);
        expect(setPendingFormat).toHaveBeenCalledWith(null);
    });

    it('with pending format and selection, has correct text before, trigger CompositionEnd event', () => {
        const setPendingFormat = jasmine.createSpy('setPendingFormat');
        const setContentModel = jasmine.createSpy('setContentModel');
        const model = createContentModelDocument();
        const text = createText('test a test', { fontFamily: 'Arial' });
        const marker = createSelectionMarker();

        addSegment(model, text);
        addSegment(model, marker);

        const editor = ({
            getPendingFormat: (): FormatState | null => ({
                fontSize: '10px',
            }),
            createContentModel: () => model,
            setPendingFormat,
            setContentModel,
        } as any) as IExperimentalContentModelEditor;
        const plugin = new ContentModelPlugin();

        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: PluginEventType.CompositionEnd,
            rawEvent: ({ data: 'test' } as any) as CompositionEvent,
        });
        plugin.dispose();

        expect(setContentModel).toHaveBeenCalledTimes(1);
        expect(setContentModel).toHaveBeenCalledWith({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    isImplicit: true,
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
                            format: {},
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
        expect(setPendingFormat).toHaveBeenCalledTimes(1);
        expect(setPendingFormat).toHaveBeenCalledWith(null);
    });

    it('Non-input and cursor moving key down should not trigger pending format change', () => {
        const setPendingFormat = jasmine.createSpy('setPendingFormat');
        const setContentModel = jasmine.createSpy('setContentModel');
        const model = createContentModelDocument();

        const editor = ({
            getPendingFormat: (): FormatState | null => ({
                fontSize: '10px',
            }),
            createContentModel: () => model,
            setPendingFormat,
            setContentModel,
        } as any) as IExperimentalContentModelEditor;
        const plugin = new ContentModelPlugin();

        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: ({ which: 17 } as any) as KeyboardEvent,
        });
        plugin.dispose();

        expect(setContentModel).toHaveBeenCalledTimes(0);
        expect(setPendingFormat).toHaveBeenCalledTimes(0);
    });

    it('Content changed event', () => {
        const setPendingFormat = jasmine.createSpy('setPendingFormat');
        const setContentModel = jasmine.createSpy('setContentModel');
        const model = createContentModelDocument();

        const editor = ({
            getPendingFormat: (): FormatState | null => ({
                fontSize: '10px',
            }),
            createContentModel: () => model,
            setPendingFormat,
            setContentModel,
        } as any) as IExperimentalContentModelEditor;
        const plugin = new ContentModelPlugin();

        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: PluginEventType.ContentChanged,
            source: '',
        });
        plugin.dispose();

        expect(setContentModel).toHaveBeenCalledTimes(0);
        expect(setPendingFormat).toHaveBeenCalledTimes(1);
        expect(setPendingFormat).toHaveBeenCalledWith(null);
    });

    it('Mouse down event', () => {
        const setPendingFormat = jasmine.createSpy('setPendingFormat');
        const setContentModel = jasmine.createSpy('setContentModel');
        const model = createContentModelDocument();

        const editor = ({
            getPendingFormat: (): FormatState | null => ({
                fontSize: '10px',
            }),
            createContentModel: () => model,
            setPendingFormat,
            setContentModel,
        } as any) as IExperimentalContentModelEditor;
        const plugin = new ContentModelPlugin();

        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: PluginEventType.MouseDown,
            rawEvent: ({} as any) as MouseEvent,
        });
        plugin.dispose();

        expect(setContentModel).toHaveBeenCalledTimes(0);
        expect(setPendingFormat).toHaveBeenCalledTimes(1);
        expect(setPendingFormat).toHaveBeenCalledWith(null);
    });
});
