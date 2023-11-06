import * as pendingFormat from '../../../lib/modelApi/format/pendingFormat';
import ContentModelFormatPlugin from '../../../lib/editor/corePlugins/ContentModelFormatPlugin';
import { ContentModelFormatPluginState } from '../../../lib/publicTypes/pluginState/ContentModelFormatPluginState';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';
import { PluginEventType } from 'roosterjs-editor-types';
import {
    ContentModelFormatter,
    FormatWithContentModelOptions,
} from '../../../lib/publicTypes/parameter/FormatWithContentModelContext';
import {
    addSegment,
    createContentModelDocument,
    createSelectionMarker,
    createText,
} from 'roosterjs-content-model-dom';

describe('ContentModelFormatPlugin', () => {
    it('no pending format, trigger key down event', () => {
        spyOn(pendingFormat, 'clearPendingFormat');
        spyOn(pendingFormat, 'getPendingFormat').and.returnValue(null);

        const editor = ({
            cacheContentModel: () => {},
            isDarkMode: () => false,
        } as any) as IContentModelEditor;
        const state = {
            defaultFormat: {},
        };
        const plugin = new ContentModelFormatPlugin(state);
        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: ({ key: 'PageUp' } as any) as KeyboardEvent,
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
        let formatResult: boolean | undefined;

        const formatContentModel = jasmine
            .createSpy('formatContentModel')
            .and.callFake(
                (callback: ContentModelFormatter, options: FormatWithContentModelOptions) => {
                    formatResult = callback(model, {
                        newEntities: [],
                        deletedEntities: [],
                        newImages: [],
                        rawEvent: options.rawEvent,
                    });
                }
            );

        const editor = ({
            focus: jasmine.createSpy('focus'),
            createContentModel: () => model,
            isInIME: () => false,
            cacheContentModel: () => {},
            getEnvironment: () => ({}),
            formatContentModel,
        } as any) as IContentModelEditor;
        const state = {
            defaultFormat: {},
        };
        const plugin = new ContentModelFormatPlugin(state);
        const model = createContentModelDocument();

        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: PluginEventType.Input,
            rawEvent: ({ data: 'a' } as any) as InputEvent,
        });

        plugin.dispose();

        expect(formatResult).toBeFalse();
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
            getEnvironment: () => ({}),
        } as any) as IContentModelEditor;
        const state = {
            defaultFormat: {},
        };
        const plugin = new ContentModelFormatPlugin(state);
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

        let formatResult: boolean | undefined;
        const model = createContentModelDocument();
        const marker = createSelectionMarker();

        addSegment(model, marker);

        const formatContentModel = jasmine
            .createSpy('formatContentModel')
            .and.callFake(
                (callback: ContentModelFormatter, options: FormatWithContentModelOptions) => {
                    formatResult = callback(model, {
                        newEntities: [],
                        deletedEntities: [],
                        newImages: [],
                        rawEvent: options.rawEvent,
                    });
                }
            );

        const editor = ({
            focus: jasmine.createSpy('focus'),
            createContentModel: () => model,
            isInIME: () => false,
            cacheContentModel: () => {},
            getEnvironment: () => ({}),
            formatContentModel,
        } as any) as IContentModelEditor;
        const state = {
            defaultFormat: {},
        };
        const plugin = new ContentModelFormatPlugin(state);
        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: PluginEventType.Input,
            rawEvent: ({ data: 'a' } as any) as InputEvent,
        });
        plugin.dispose();

        expect(formatResult).toBeFalse();
        expect(pendingFormat.clearPendingFormat).toHaveBeenCalledTimes(1);
        expect(pendingFormat.clearPendingFormat).toHaveBeenCalledWith(editor);
    });

    it('with pending format and selection, has correct text before, trigger input event', () => {
        spyOn(pendingFormat, 'clearPendingFormat');
        spyOn(pendingFormat, 'setPendingFormat');
        spyOn(pendingFormat, 'getPendingFormat').and.returnValue({
            fontSize: '10px',
        });

        const model = createContentModelDocument();
        const text = createText('a');
        const marker = createSelectionMarker();
        let formatResult: boolean | undefined;

        addSegment(model, text);
        addSegment(model, marker);

        const formatContentModel = jasmine
            .createSpy('formatContentModel')
            .and.callFake(
                (callback: ContentModelFormatter, options: FormatWithContentModelOptions) => {
                    formatResult = callback(model, {
                        newEntities: [],
                        deletedEntities: [],
                        newImages: [],
                        rawEvent: options.rawEvent,
                    });
                }
            );

        const editor = ({
            createContentModel: () => model,
            formatContentModel,
            isInIME: () => false,
            focus: () => {},
            addUndoSnapshot: (callback: () => void) => {
                callback();
            },
            cacheContentModel: () => {},
            isDarkMode: () => false,
            triggerPluginEvent: jasmine.createSpy('triggerPluginEvent'),
            getVisibleViewport: jasmine.createSpy('getVisibleViewport'),
            getEnvironment: () => ({}),
        } as any) as IContentModelEditor;
        const state = {
            defaultFormat: {},
        };
        const plugin = new ContentModelFormatPlugin(state);
        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: PluginEventType.Input,
            rawEvent: ({ data: 'a' } as any) as InputEvent,
        });
        plugin.dispose();

        expect(formatResult).toBeTrue();
        expect(model).toEqual({
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
        });
        expect(pendingFormat.clearPendingFormat).toHaveBeenCalledTimes(1);
        expect(pendingFormat.clearPendingFormat).toHaveBeenCalledWith(editor);
    });

    it('with pending format and selection, has correct text before, trigger CompositionEnd event', () => {
        spyOn(pendingFormat, 'clearPendingFormat');
        spyOn(pendingFormat, 'getPendingFormat').and.returnValue({
            fontSize: '10px',
        });

        let formatResult: boolean | undefined;
        const triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');
        const getVisibleViewport = jasmine.createSpy('getVisibleViewport');
        const model = createContentModelDocument();
        const text = createText('test a test', { fontFamily: 'Arial' });
        const marker = createSelectionMarker();
        const formatContentModel = jasmine
            .createSpy('formatContentModel')
            .and.callFake(
                (callback: ContentModelFormatter, options: FormatWithContentModelOptions) => {
                    formatResult = callback(model, {
                        newEntities: [],
                        deletedEntities: [],
                        newImages: [],
                    });
                }
            );

        addSegment(model, text);
        addSegment(model, marker);

        const editor = ({
            createContentModel: () => model,
            formatContentModel,
            focus: () => {},
            addUndoSnapshot: (callback: () => void) => {
                callback();
            },
            cacheContentModel: () => {},
            isDarkMode: () => false,
            triggerPluginEvent,
            getVisibleViewport,
        } as any) as IContentModelEditor;
        const state = {
            defaultFormat: {},
        };
        const plugin = new ContentModelFormatPlugin(state);

        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: PluginEventType.CompositionEnd,
            rawEvent: ({ data: 'test' } as any) as CompositionEvent,
        });
        plugin.dispose();

        expect(formatResult).toBeTrue();
        expect(model).toEqual({
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
        });
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
        const state = {
            defaultFormat: {},
        };
        const plugin = new ContentModelFormatPlugin(state);
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
        const state = {
            defaultFormat: {},
        };
        const plugin = new ContentModelFormatPlugin(state);
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
        const state = {
            defaultFormat: {},
        };
        const plugin = new ContentModelFormatPlugin(state);

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
            getEnvironment: () => ({}),
        } as any) as IContentModelEditor;
        const state = {
            defaultFormat: {},
        };
        const plugin = new ContentModelFormatPlugin(state);

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

describe('ContentModelFormatPlugin for default format', () => {
    let editor: IContentModelEditor;
    let contentDiv: HTMLDivElement;
    let getDOMSelection: jasmine.Spy;
    let getPendingFormatSpy: jasmine.Spy;
    let setPendingFormatSpy: jasmine.Spy;
    let cacheContentModelSpy: jasmine.Spy;
    let addUndoSnapshotSpy: jasmine.Spy;
    let formatContentModelSpy: jasmine.Spy;

    beforeEach(() => {
        setPendingFormatSpy = spyOn(pendingFormat, 'setPendingFormat');
        getPendingFormatSpy = spyOn(pendingFormat, 'getPendingFormat');
        getDOMSelection = jasmine.createSpy('getDOMSelection');
        cacheContentModelSpy = jasmine.createSpy('cacheContentModel');
        addUndoSnapshotSpy = jasmine.createSpy('addUndoSnapshot');
        formatContentModelSpy = jasmine.createSpy('formatContentModelSpy');

        contentDiv = document.createElement('div');

        editor = ({
            contains: (e: Node) => contentDiv != e && contentDiv.contains(e),
            getDOMSelection,
            cacheContentModel: cacheContentModelSpy,
            addUndoSnapshot: addUndoSnapshotSpy,
            formatContentModel: formatContentModelSpy,
        } as any) as IContentModelEditor;
    });

    it('Collapsed range, text input, under editor directly', () => {
        const state: ContentModelFormatPluginState = {
            defaultFormat: { fontFamily: 'Arial' },
        };
        const plugin = new ContentModelFormatPlugin(state);
        const rawEvent = { key: 'a' } as any;

        getDOMSelection.and.returnValue({
            type: 'range',
            range: {
                collapsed: true,
                startContainer: contentDiv,
                startOffset: 0,
            },
        });

        formatContentModelSpy.and.callFake((callback: Function) => {
            callback({
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        isImplicit: true,
                        segments: [
                            {
                                segmentType: 'SelectionMarker',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
            });
        });

        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent,
        });

        expect(setPendingFormatSpy).toHaveBeenCalledWith(
            editor,
            { fontFamily: 'Arial' },
            contentDiv,
            0
        );
    });

    it('Expanded range, text input, under editor directly', () => {
        const state = {
            defaultFormat: { fontFamily: 'Arial' },
        };
        const plugin = new ContentModelFormatPlugin(state);
        const rawEvent = { key: 'a' } as any;

        getDOMSelection.and.returnValue({
            type: 'range',
            range: {
                collapsed: false,
                startContainer: contentDiv,
                startOffset: 0,
            },
        });

        formatContentModelSpy.and.callFake((callback: Function) => {
            callback({
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
                                text: 'test',
                                isSelected: true,
                            },
                        ],
                    },
                ],
            });
        });

        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent,
        });

        expect(setPendingFormatSpy).not.toHaveBeenCalled();
        expect(addUndoSnapshotSpy).toHaveBeenCalledTimes(1);
    });

    it('Collapsed range, IME input, under editor directly', () => {
        const state = {
            defaultFormat: { fontFamily: 'Arial' },
        };
        const plugin = new ContentModelFormatPlugin(state);
        const rawEvent = { key: 'Process' } as any;

        getDOMSelection.and.returnValue({
            type: 'range',
            range: {
                collapsed: true,
                startContainer: contentDiv,
                startOffset: 0,
            },
        });

        formatContentModelSpy.and.callFake((callback: Function) => {
            callback({
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        isImplicit: true,
                        segments: [
                            {
                                segmentType: 'SelectionMarker',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
            });
        });

        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent,
        });

        expect(setPendingFormatSpy).toHaveBeenCalledWith(
            editor,
            { fontFamily: 'Arial' },
            contentDiv,
            0
        );
    });

    it('Collapsed range, other input, under editor directly', () => {
        const state = {
            defaultFormat: { fontFamily: 'Arial' },
        };
        const plugin = new ContentModelFormatPlugin(state);
        const rawEvent = { key: 'Up' } as any;

        getDOMSelection.and.returnValue({
            type: 'range',
            range: {
                collapsed: true,
                startContainer: contentDiv,
                startOffset: 0,
            },
        });

        formatContentModelSpy.and.callFake((callback: Function) => {
            callback({
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        isImplicit: true,
                        segments: [
                            {
                                segmentType: 'SelectionMarker',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
            });
        });

        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent,
        });

        expect(setPendingFormatSpy).not.toHaveBeenCalled();
    });

    it('Collapsed range, normal input, not under editor directly, no style', () => {
        const state = {
            defaultFormat: { fontFamily: 'Arial' },
        };
        const plugin = new ContentModelFormatPlugin(state);
        const rawEvent = { key: 'a' } as any;
        const div = document.createElement('div');

        contentDiv.appendChild(div);

        getDOMSelection.and.returnValue({
            type: 'range',
            range: {
                collapsed: true,
                startContainer: div,
                startOffset: 0,
            },
        });

        formatContentModelSpy.and.callFake((callback: Function) => {
            callback({
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'SelectionMarker',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
            });
        });

        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent,
        });

        expect(setPendingFormatSpy).toHaveBeenCalledWith(editor, { fontFamily: 'Arial' }, div, 0);
    });

    it('Collapsed range, text input, under editor directly, has pending format', () => {
        const state = {
            defaultFormat: { fontFamily: 'Arial' },
        };
        const plugin = new ContentModelFormatPlugin(state);
        const rawEvent = { key: 'a' } as any;

        getDOMSelection.and.returnValue({
            type: 'range',
            range: {
                collapsed: true,
                startContainer: contentDiv,
                startOffset: 0,
            },
        });

        formatContentModelSpy.and.callFake((callback: Function) => {
            callback({
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        isImplicit: true,
                        segments: [
                            {
                                segmentType: 'SelectionMarker',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
            });
        });

        getPendingFormatSpy.and.returnValue({
            fontSize: '10pt',
        });

        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent,
        });

        expect(setPendingFormatSpy).toHaveBeenCalledWith(
            editor,
            { fontFamily: 'Arial', fontSize: '10pt' },
            contentDiv,
            0
        );
    });
});
