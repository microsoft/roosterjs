import * as mergeModel from '../../lib/modelApi/common/mergeModel';
import ContentModelPlugin from '../../lib/publicPlugin/ContentModelPlugin';
import { createContentModelDocument } from '../../lib/modelApi/creators/createContentModelDocument';
import { FormatState, PluginEventType } from 'roosterjs-editor-types';
import { IExperimentalContentModelEditor } from '../../lib/publicTypes/IExperimentalContentModelEditor';

describe('ContentModelPlugin', () => {
    it('no pending format, trigger key down event', () => {
        spyOn(mergeModel, 'mergeModel');
        const setPendingFormat = jasmine.createSpy('setPendingFormat');
        const editor = ({
            getPendingFormat: (): FormatState | null => null,
            setPendingFormat,
        } as any) as IExperimentalContentModelEditor;
        const plugin = new ContentModelPlugin();

        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: ({ key: 'a' } as any) as KeyboardEvent,
        });

        expect(mergeModel.mergeModel).not.toHaveBeenCalled();
        expect(setPendingFormat).toHaveBeenCalledTimes(1);
        expect(setPendingFormat).toHaveBeenCalledWith(null);
    });

    it('with pending format, trigger key down event', () => {
        spyOn(mergeModel, 'mergeModel');
        const setPendingFormat = jasmine.createSpy('setPendingFormat');
        const setContentModel = jasmine.createSpy('setContentModel');
        const preventDefault = jasmine.createSpy('preventDefault');
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
            rawEvent: ({ key: 'a', preventDefault } as any) as KeyboardEvent,
        });

        expect(mergeModel.mergeModel).toHaveBeenCalledTimes(1);
        expect(mergeModel.mergeModel).toHaveBeenCalledWith(model, {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'Text',
                            format: { fontSize: '10px' },
                            text: 'a',
                        },
                    ],
                },
            ],
        });
        expect(preventDefault).toHaveBeenCalledTimes(1);
        expect(setContentModel).toHaveBeenCalledTimes(1);
        expect(setContentModel).toHaveBeenCalledWith({
            blockGroupType: 'Document',
            blocks: [],
        });
        expect(setPendingFormat).toHaveBeenCalledTimes(1);
        expect(setPendingFormat).toHaveBeenCalledWith(null);
    });

    it('with pending format, trigger key down event with "Process"', () => {
        spyOn(mergeModel, 'mergeModel');
        const setPendingFormat = jasmine.createSpy('setPendingFormat');
        const setContentModel = jasmine.createSpy('setContentModel');
        const preventDefault = jasmine.createSpy('preventDefault');
        const model = createContentModelDocument();
        const editor = ({
            getPendingFormat: (): FormatState | null => ({ fontSize: '10px' }),
            createContentModel: () => model,
            setPendingFormat,
            setContentModel,
        } as any) as IExperimentalContentModelEditor;
        const plugin = new ContentModelPlugin();

        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: ({ key: 'Process', preventDefault } as any) as KeyboardEvent,
        });

        expect(mergeModel.mergeModel).toHaveBeenCalledTimes(0);
        expect(preventDefault).toHaveBeenCalledTimes(0);
        expect(setContentModel).toHaveBeenCalledTimes(0);
        expect(setPendingFormat).toHaveBeenCalledTimes(0);
    });

    it('with pending format, trigger CompositionEnd event', () => {
        spyOn(mergeModel, 'mergeModel');
        const setPendingFormat = jasmine.createSpy('setPendingFormat');
        const setContentModel = jasmine.createSpy('setContentModel');
        const preventDefault = jasmine.createSpy('preventDefault');
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
            eventType: PluginEventType.CompositionEnd,
            rawEvent: { data: 'test', preventDefault } as any,
        });

        expect(mergeModel.mergeModel).toHaveBeenCalledTimes(1);
        expect(mergeModel.mergeModel).toHaveBeenCalledWith(model, {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'Text',
                            format: { fontSize: '10px' },
                            text: 'test',
                        },
                    ],
                },
            ],
        });
        expect(preventDefault).toHaveBeenCalledTimes(1);
        expect(setContentModel).toHaveBeenCalledTimes(1);
        expect(setContentModel).toHaveBeenCalledWith({
            blockGroupType: 'Document',
            blocks: [],
        });
        expect(setPendingFormat).toHaveBeenCalledTimes(1);
        expect(setPendingFormat).toHaveBeenCalledWith(null);
    });

    it('with pending format, trigger MouseDown event', () => {
        spyOn(mergeModel, 'mergeModel');
        const setPendingFormat = jasmine.createSpy('setPendingFormat');
        const setContentModel = jasmine.createSpy('setContentModel');
        const preventDefault = jasmine.createSpy('preventDefault');
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
            rawEvent: null!,
        });

        expect(mergeModel.mergeModel).toHaveBeenCalledTimes(0);
        expect(preventDefault).toHaveBeenCalledTimes(0);
        expect(setContentModel).toHaveBeenCalledTimes(0);
        expect(setPendingFormat).toHaveBeenCalledTimes(1);
        expect(setPendingFormat).toHaveBeenCalledWith(null);
    });

    it('with pending format, trigger Keydown event with modifier key', () => {
        spyOn(mergeModel, 'mergeModel');
        const setPendingFormat = jasmine.createSpy('setPendingFormat');
        const setContentModel = jasmine.createSpy('setContentModel');
        const preventDefault = jasmine.createSpy('preventDefault');
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
            rawEvent: { ctrlKey: true } as any,
        });

        expect(mergeModel.mergeModel).toHaveBeenCalledTimes(0);
        expect(preventDefault).toHaveBeenCalledTimes(0);
        expect(setContentModel).toHaveBeenCalledTimes(0);
        expect(setPendingFormat).toHaveBeenCalledTimes(0);
    });
});
