import * as formatWithContentModel from '../../../lib/publicApi/utils/formatWithContentModel';
import * as pendingFormat from '../../../lib/modelApi/format/pendingFormat';
import ContentModelFormatPlugin from '../../../lib/editor/corePlugins/ContentModelFormatPlugin';
import { ChangeSource, PluginEventType } from 'roosterjs-editor-types';
import { ContentModelFormatPluginState } from '../../../lib/publicTypes/pluginState/ContentModelFormatPluginState';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';
import { Position } from 'roosterjs-editor-dom';
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
            focus: jasmine.createSpy('focus'),
            createContentModel: () => model,
            setContentModel,
            isInIME: () => false,
            cacheContentModel: () => {},
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

        const setContentModel = jasmine.createSpy('setContentModel');
        const model = createContentModelDocument();
        const marker = createSelectionMarker();

        addSegment(model, marker);

        const editor = ({
            focus: jasmine.createSpy('focus'),
            createContentModel: () => model,
            setContentModel,
            isInIME: () => false,
            cacheContentModel: () => {},
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
            isDarkMode: () => false,
            triggerPluginEvent: jasmine.createSpy('triggerPluginEvent'),
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
            undefined,
            undefined
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
        const triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');
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
            isDarkMode: () => false,
            triggerPluginEvent,
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

        expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.ContentChanged, {
            contentModel: model,
            selection: undefined,
            data: undefined,
            source: ChangeSource.Format,
            additionalData: {
                formatApiName: 'applyPendingFormat',
            },
        });
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
            undefined,
            undefined
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

    beforeEach(() => {
        setPendingFormatSpy = spyOn(pendingFormat, 'setPendingFormat');
        getPendingFormatSpy = spyOn(pendingFormat, 'getPendingFormat');
        getDOMSelection = jasmine.createSpy('getDOMSelection');
        cacheContentModelSpy = jasmine.createSpy('cacheContentModel');
        addUndoSnapshotSpy = jasmine.createSpy('addUndoSnapshot');

        contentDiv = document.createElement('div');

        editor = ({
            contains: (e: Node) => contentDiv != e && contentDiv.contains(e),
            getDOMSelection,
            cacheContentModel: cacheContentModelSpy,
            addUndoSnapshot: addUndoSnapshotSpy,
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

        spyOn(formatWithContentModel, 'formatWithContentModel').and.callFake(
            (_1: any, _2: any, callback: Function) => {
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
            }
        );

        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent,
        });

        expect(setPendingFormatSpy).toHaveBeenCalledWith(
            editor,
            { fontFamily: 'Arial' },
            new Position(contentDiv, 0)
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

        spyOn(formatWithContentModel, 'formatWithContentModel').and.callFake(
            (_1: any, _2: any, callback: Function) => {
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
            }
        );

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

        spyOn(formatWithContentModel, 'formatWithContentModel').and.callFake(
            (_1: any, _2: any, callback: Function) => {
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
            }
        );

        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent,
        });

        expect(setPendingFormatSpy).toHaveBeenCalledWith(
            editor,
            { fontFamily: 'Arial' },
            new Position(contentDiv, 0)
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

        spyOn(formatWithContentModel, 'formatWithContentModel').and.callFake(
            (_1: any, _2: any, callback: Function) => {
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
            }
        );

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

        spyOn(formatWithContentModel, 'formatWithContentModel').and.callFake(
            (_1: any, _2: any, callback: Function) => {
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
            }
        );

        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent,
        });

        expect(setPendingFormatSpy).toHaveBeenCalledWith(
            editor,
            { fontFamily: 'Arial' },
            new Position(div, 0)
        );
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

        spyOn(formatWithContentModel, 'formatWithContentModel').and.callFake(
            (_1: any, _2: any, callback: Function) => {
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
            }
        );

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
            new Position(contentDiv, 0)
        );
    });
});
