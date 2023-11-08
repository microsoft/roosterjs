import * as applyPendingFormat from '../../../lib/modelApi/format/applyPendingFormat';
import ContentModelFormatPlugin from '../../../lib/editor/corePlugins/ContentModelFormatPlugin';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';
import { PluginEventType } from 'roosterjs-editor-types';
import {
    ContentModelFormatPluginState,
    PendingFormat,
} from '../../../lib/publicTypes/pluginState/ContentModelFormatPluginState';
import {
    addSegment,
    createContentModelDocument,
    createSelectionMarker,
} from 'roosterjs-content-model-dom';

describe('ContentModelFormatPlugin', () => {
    const mockedFormat = {
        fontSize: '10px',
    };

    beforeEach(() => {
        spyOn(applyPendingFormat, 'applyPendingFormat');
    });

    it('no pending format, trigger key down event', () => {
        const editor = ({
            cacheContentModel: () => {},
            isDarkMode: () => false,
        } as any) as IContentModelEditor;
        const state = {
            defaultFormat: {},
            pendingFormat: ({} as any) as PendingFormat,
        };
        const plugin = new ContentModelFormatPlugin(state);
        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: ({ key: 'PageUp' } as any) as KeyboardEvent,
        });

        plugin.dispose();

        expect(applyPendingFormat.applyPendingFormat).not.toHaveBeenCalled();
        expect(state.pendingFormat).toBeNull();
    });

    it('no selection, trigger input event', () => {
        const editor = ({
            focus: jasmine.createSpy('focus'),
            createContentModel: () => model,
            isInIME: () => false,
            cacheContentModel: () => {},
            getEnvironment: () => ({}),
        } as any) as IContentModelEditor;
        const state = {
            defaultFormat: {},
            pendingFormat: {
                format: mockedFormat,
            } as any,
        };
        const plugin = new ContentModelFormatPlugin(state);
        const model = createContentModelDocument();

        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: PluginEventType.Input,
            rawEvent: ({ data: 'a' } as any) as InputEvent,
        });

        plugin.dispose();

        expect(applyPendingFormat.applyPendingFormat).toHaveBeenCalledTimes(1);
        expect(applyPendingFormat.applyPendingFormat).toHaveBeenCalledWith(
            editor,
            'a',
            mockedFormat
        );
        expect(state.pendingFormat).toBeNull();
    });

    it('with pending format and selection, trigger input event with isComposing = true', () => {
        const model = createContentModelDocument();
        const marker = createSelectionMarker();

        addSegment(model, marker);

        const editor = ({
            createContentModel: () => model,
            cacheContentModel: () => {},
            getEnvironment: () => ({}),
        } as any) as IContentModelEditor;
        const state = {
            defaultFormat: {},
            pendingFormat: {
                format: mockedFormat,
            } as any,
        };
        const plugin = new ContentModelFormatPlugin(state);
        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: PluginEventType.Input,
            rawEvent: ({ data: 'a', isComposing: true } as any) as InputEvent,
        });
        plugin.dispose();

        expect(applyPendingFormat.applyPendingFormat).not.toHaveBeenCalled();
        expect(state.pendingFormat).toEqual({
            format: mockedFormat,
        });
    });

    it('with pending format and selection, trigger CompositionEnd event', () => {
        const triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');
        const getVisibleViewport = jasmine.createSpy('getVisibleViewport');

        const editor = ({
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
            pendingFormat: {
                format: mockedFormat,
            } as any,
        };
        const plugin = new ContentModelFormatPlugin(state);

        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: PluginEventType.CompositionEnd,
            rawEvent: ({ data: 'test' } as any) as CompositionEvent,
        });
        plugin.dispose();

        expect(applyPendingFormat.applyPendingFormat).toHaveBeenCalledWith(
            editor,
            'test',
            mockedFormat
        );
        expect(state.pendingFormat).toBeNull();
    });

    it('Non-input and cursor moving key down should not trigger pending format change', () => {
        const model = createContentModelDocument();

        const editor = ({
            createContentModel: () => model,
            cacheContentModel: () => {},
        } as any) as IContentModelEditor;
        const state = {
            defaultFormat: {},
            pendingFormat: {
                format: mockedFormat,
            } as any,
        };
        const plugin = new ContentModelFormatPlugin(state);
        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: ({ which: 17 } as any) as KeyboardEvent,
        });
        plugin.dispose();

        expect(applyPendingFormat.applyPendingFormat).not.toHaveBeenCalled();
        expect(state.pendingFormat).toEqual({
            format: mockedFormat,
        });
    });

    it('Content changed event', () => {
        const model = createContentModelDocument();

        const editor = ({
            createContentModel: () => model,
            addUndoSnapshot: (callback: () => void) => {
                callback();
            },
            cacheContentModel: () => {},
        } as any) as IContentModelEditor;
        const state = {
            defaultFormat: {},
            pendingFormat: {
                format: mockedFormat,
            } as any,
        };
        const plugin = new ContentModelFormatPlugin(state);

        spyOn(plugin as any, 'canApplyPendingFormat').and.returnValue(false);

        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: PluginEventType.ContentChanged,
            source: '',
        });
        plugin.dispose();

        expect(applyPendingFormat.applyPendingFormat).not.toHaveBeenCalled();
        expect(state.pendingFormat).toBeNull();
        expect((plugin as any).canApplyPendingFormat).toHaveBeenCalledTimes(1);
    });

    it('Mouse up event', () => {
        const model = createContentModelDocument();

        const editor = ({
            createContentModel: () => model,
            cacheContentModel: () => {},
        } as any) as IContentModelEditor;
        const state = {
            defaultFormat: {},
            pendingFormat: {
                format: mockedFormat,
            } as any,
        };
        const plugin = new ContentModelFormatPlugin(state);

        spyOn(plugin as any, 'canApplyPendingFormat').and.returnValue(false);

        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: PluginEventType.MouseUp,
            rawEvent: ({} as any) as MouseEvent,
        });
        plugin.dispose();

        expect(applyPendingFormat.applyPendingFormat).not.toHaveBeenCalled();
        expect(state.pendingFormat).toBeNull();
        expect((plugin as any).canApplyPendingFormat).toHaveBeenCalledTimes(1);
    });

    it('Mouse up event and pending format can still be applied', () => {
        const model = createContentModelDocument();

        const editor = ({
            createContentModel: () => model,
            cacheContentModel: () => {},
            getEnvironment: () => ({}),
        } as any) as IContentModelEditor;
        const state = {
            defaultFormat: {},
            pendingFormat: {
                format: mockedFormat,
            } as any,
        };
        const plugin = new ContentModelFormatPlugin(state);

        spyOn(plugin as any, 'canApplyPendingFormat').and.returnValue(true);

        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: PluginEventType.MouseUp,
            rawEvent: ({} as any) as MouseEvent,
        });
        plugin.dispose();

        expect(applyPendingFormat.applyPendingFormat).not.toHaveBeenCalled();
        expect(state.pendingFormat).toEqual({
            format: mockedFormat,
        });
        expect((plugin as any).canApplyPendingFormat).toHaveBeenCalledTimes(1);
    });
});

describe('ContentModelFormatPlugin for default format', () => {
    let editor: IContentModelEditor;
    let contentDiv: HTMLDivElement;
    let getDOMSelection: jasmine.Spy;
    let getPendingFormatSpy: jasmine.Spy;
    let cacheContentModelSpy: jasmine.Spy;
    let addUndoSnapshotSpy: jasmine.Spy;
    let formatContentModelSpy: jasmine.Spy;

    beforeEach(() => {
        getPendingFormatSpy = jasmine.createSpy('getPendingFormat');
        getDOMSelection = jasmine.createSpy('getDOMSelection');
        cacheContentModelSpy = jasmine.createSpy('cacheContentModel');
        addUndoSnapshotSpy = jasmine.createSpy('addUndoSnapshot');
        formatContentModelSpy = jasmine.createSpy('formatContentModelSpy');

        contentDiv = document.createElement('div');

        editor = ({
            contains: (e: Node) => contentDiv != e && contentDiv.contains(e),
            getDOMSelection,
            getPendingFormat: getPendingFormatSpy,
            cacheContentModel: cacheContentModelSpy,
            addUndoSnapshot: addUndoSnapshotSpy,
            formatContentModel: formatContentModelSpy,
        } as any) as IContentModelEditor;
    });

    it('Collapsed range, text input, under editor directly', () => {
        const state: ContentModelFormatPluginState = {
            defaultFormat: { fontFamily: 'Arial' },
            pendingFormat: null,
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

        let context = {} as any;

        formatContentModelSpy.and.callFake((callback: Function) => {
            callback(
                {
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
                },
                context
            );
        });

        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent,
        });

        expect(context).toEqual({
            newPendingFormat: { fontFamily: 'Arial' },
        });
    });

    it('Expanded range, text input, under editor directly', () => {
        const state = {
            defaultFormat: { fontFamily: 'Arial' },
            pendingFormat: null as any,
        };
        const plugin = new ContentModelFormatPlugin(state);
        const rawEvent = { key: 'a' } as any;
        const context = {} as any;

        getDOMSelection.and.returnValue({
            type: 'range',
            range: {
                collapsed: false,
                startContainer: contentDiv,
                startOffset: 0,
            },
        });

        formatContentModelSpy.and.callFake((callback: Function) => {
            callback(
                {
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
                },
                context
            );
        });

        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent,
        });

        expect(context).toEqual({});
        expect(addUndoSnapshotSpy).toHaveBeenCalledTimes(1);
    });

    it('Collapsed range, IME input, under editor directly', () => {
        const state = {
            defaultFormat: { fontFamily: 'Arial' },
            pendingFormat: null as any,
        };
        const plugin = new ContentModelFormatPlugin(state);
        const rawEvent = { key: 'Process' } as any;
        const context = {} as any;

        getDOMSelection.and.returnValue({
            type: 'range',
            range: {
                collapsed: true,
                startContainer: contentDiv,
                startOffset: 0,
            },
        });

        formatContentModelSpy.and.callFake((callback: Function) => {
            callback(
                {
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
                },
                context
            );
        });

        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent,
        });

        expect(context).toEqual({
            newPendingFormat: { fontFamily: 'Arial' },
        });
    });

    it('Collapsed range, other input, under editor directly', () => {
        const state: ContentModelFormatPluginState = {
            defaultFormat: { fontFamily: 'Arial' },
            pendingFormat: null as any,
        };
        const plugin = new ContentModelFormatPlugin(state);
        const rawEvent = { key: 'Up' } as any;
        const context = {} as any;

        getDOMSelection.and.returnValue({
            type: 'range',
            range: {
                collapsed: true,
                startContainer: contentDiv,
                startOffset: 0,
            },
        });

        formatContentModelSpy.and.callFake((callback: Function) => {
            callback(
                {
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
                },
                context
            );
        });

        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent,
        });

        expect(context).toEqual({});
    });

    it('Collapsed range, normal input, not under editor directly, no style', () => {
        const state = {
            defaultFormat: { fontFamily: 'Arial' },
            pendingFormat: null as any,
        };
        const plugin = new ContentModelFormatPlugin(state);
        const rawEvent = { key: 'a' } as any;
        const div = document.createElement('div');
        const context = {} as any;

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
            callback(
                {
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
                },
                context
            );
        });

        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent,
        });

        expect(context).toEqual({
            newPendingFormat: { fontFamily: 'Arial' },
        });
    });

    it('Collapsed range, text input, under editor directly, has pending format', () => {
        const state = {
            defaultFormat: { fontFamily: 'Arial' },
            pendingFormat: null as any,
        };
        const plugin = new ContentModelFormatPlugin(state);
        const rawEvent = { key: 'a' } as any;
        const context = {} as any;

        getPendingFormatSpy.and.returnValue(null);

        getDOMSelection.and.returnValue({
            type: 'range',
            range: {
                collapsed: true,
                startContainer: contentDiv,
                startOffset: 0,
            },
        });

        formatContentModelSpy.and.callFake((callback: Function) => {
            callback(
                {
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
                },
                context
            );
        });

        getPendingFormatSpy.and.returnValue({
            fontSize: '10pt',
        });

        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent,
        });

        expect(context).toEqual({
            newPendingFormat: { fontFamily: 'Arial', fontSize: '10pt' },
        });
    });
});
