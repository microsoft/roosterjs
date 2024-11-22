import * as applyDefaultFormat from '../../../lib/corePlugin/format/applyDefaultFormat';
import * as applyPendingFormat from '../../../lib/corePlugin/format/applyPendingFormat';
import { createContentModelDocument } from 'roosterjs-content-model-dom';
import { createFormatPlugin } from '../../../lib/corePlugin/format/FormatPlugin';
import { IEditor } from 'roosterjs-content-model-types';

describe('FormatPlugin', () => {
    const mockedFormat = {
        fontSize: '10px',
    };
    const mockedFormat2 = {
        lineSpace: 2,
    };
    let applyPendingFormatSpy: jasmine.Spy;

    beforeEach(() => {
        applyPendingFormatSpy = spyOn(applyPendingFormat, 'applyPendingFormat');
    });

    it('no pending format, trigger key down event', () => {
        const editor = ({
            cacheContentModel: () => {},
            isDarkMode: () => false,
            getEnvironment: () => ({}),
        } as any) as IEditor;
        const plugin = createFormatPlugin({});
        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: 'keyDown',
            rawEvent: ({ key: 'PageUp' } as any) as KeyboardEvent,
        });

        plugin.dispose();

        expect(applyPendingFormatSpy).not.toHaveBeenCalled();
        expect(plugin.getState().pendingFormat).toBeNull();
    });

    it('no selection, trigger input event', () => {
        const editor = ({
            focus: jasmine.createSpy('focus'),
            createContentModel: () => model,
            isInIME: () => false,
            cacheContentModel: () => {},
            getEnvironment: () => ({}),
        } as any) as IEditor;
        const plugin = createFormatPlugin({});
        const model = createContentModelDocument();

        const state = plugin.getState();

        (state.pendingFormat = {
            format: mockedFormat,
            paragraphFormat: mockedFormat2,
        } as any),
            plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: 'input',
            rawEvent: ({ data: 'a' } as any) as InputEvent,
        });

        plugin.dispose();

        expect(applyPendingFormatSpy).toHaveBeenCalledTimes(1);
        expect(applyPendingFormatSpy).toHaveBeenCalledWith(
            editor,
            'a',
            mockedFormat,
            mockedFormat2
        );
        expect(state.pendingFormat).toBeNull();
    });

    it('with pending format and selection, trigger CompositionEnd event', () => {
        const triggerEvent = jasmine.createSpy('triggerEvent');
        const getVisibleViewport = jasmine.createSpy('getVisibleViewport');

        const editor = ({
            focus: () => {},
            addUndoSnapshot: (callback: () => void) => {
                callback();
            },
            cacheContentModel: () => {},
            isDarkMode: () => false,
            triggerEvent,
            getVisibleViewport,
        } as any) as IEditor;
        const plugin = createFormatPlugin({});
        const state = plugin.getState();

        state.pendingFormat = {
            format: mockedFormat,
        } as any;

        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: 'compositionEnd',
            rawEvent: ({ data: 'test' } as any) as CompositionEvent,
        });
        plugin.dispose();

        expect(applyPendingFormatSpy).toHaveBeenCalledWith(editor, 'test', mockedFormat, undefined);
        expect(state.pendingFormat).toBeNull();
    });

    it('Non-input and cursor moving key down should not trigger pending format change', () => {
        const model = createContentModelDocument();

        const editor = ({
            createContentModel: () => model,
            cacheContentModel: () => {},
            getEnvironment: () => ({}),
        } as any) as IEditor;

        const plugin = createFormatPlugin({});
        plugin.initialize(editor);

        const state = plugin.getState();

        state.pendingFormat = {
            paragraphFormat: mockedFormat2,
        } as any;

        plugin.onPluginEvent({
            eventType: 'keyDown',
            rawEvent: ({ which: 17 } as any) as KeyboardEvent,
        });
        plugin.dispose();

        expect(applyPendingFormatSpy).not.toHaveBeenCalled();
        expect(state.pendingFormat).toEqual({
            paragraphFormat: mockedFormat2,
        } as any);
    });

    it('Content changed event', () => {
        const model = createContentModelDocument();

        const editor = ({
            createContentModel: () => model,
            addUndoSnapshot: (callback: () => void) => {
                callback();
            },
            cacheContentModel: () => {},
        } as any) as IEditor;

        const plugin = createFormatPlugin({});
        const state = plugin.getState();

        state.pendingFormat = {
            format: mockedFormat,
        } as any;

        spyOn(plugin as any, 'canApplyPendingFormat').and.returnValue(false);

        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: 'contentChanged',
            source: '',
        });
        plugin.dispose();

        expect(applyPendingFormatSpy).not.toHaveBeenCalled();
        expect(state.pendingFormat).toBeNull();
        expect((plugin as any).canApplyPendingFormat).toHaveBeenCalledTimes(1);
    });

    it('Mouse up event', () => {
        const model = createContentModelDocument();

        const editor = ({
            createContentModel: () => model,
            cacheContentModel: () => {},
        } as any) as IEditor;
        const plugin = createFormatPlugin({});

        const state = plugin.getState();

        state.pendingFormat = {
            format: mockedFormat,
        } as any;

        spyOn(plugin as any, 'canApplyPendingFormat').and.returnValue(false);

        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: 'mouseUp',
            rawEvent: ({} as any) as MouseEvent,
        });
        plugin.dispose();

        expect(applyPendingFormatSpy).not.toHaveBeenCalled();
        expect(state.pendingFormat).toBeNull();
        expect((plugin as any).canApplyPendingFormat).toHaveBeenCalledTimes(1);
    });

    it('Mouse up event and pending format can still be applied', () => {
        const model = createContentModelDocument();

        const editor = ({
            createContentModel: () => model,
            cacheContentModel: () => {},
            getEnvironment: () => ({}),
        } as any) as IEditor;
        const plugin = createFormatPlugin({});
        const state = plugin.getState();

        state.pendingFormat = {
            format: mockedFormat,
        } as any;

        spyOn(plugin as any, 'canApplyPendingFormat').and.returnValue(true);

        plugin.initialize(editor);
        plugin.onPluginEvent({
            eventType: 'mouseUp',
            rawEvent: ({} as any) as MouseEvent,
        });
        plugin.dispose();

        expect(applyPendingFormatSpy).not.toHaveBeenCalled();
        expect(state.pendingFormat).toEqual({
            format: mockedFormat,
        } as any);
        expect((plugin as any).canApplyPendingFormat).toHaveBeenCalledTimes(1);
    });
});

describe('FormatPlugin for default format', () => {
    let editor: IEditor;
    let contentDiv: HTMLDivElement;
    let getDOMSelection: jasmine.Spy;
    let getPendingFormatSpy: jasmine.Spy;
    let cacheContentModelSpy: jasmine.Spy;
    let takeSnapshotSpy: jasmine.Spy;
    let formatContentModelSpy: jasmine.Spy;

    beforeEach(() => {
        getPendingFormatSpy = jasmine.createSpy('getPendingFormat');
        getDOMSelection = jasmine.createSpy('getDOMSelection');
        cacheContentModelSpy = jasmine.createSpy('cacheContentModel');
        takeSnapshotSpy = jasmine.createSpy('takeSnapshot');
        formatContentModelSpy = jasmine.createSpy('formatContentModelSpy');
        contentDiv = document.createElement('div');

        editor = ({
            getDOMHelper: () => ({
                isNodeInEditor: (e: Node) => contentDiv.contains(e),
            }),
            getDOMSelection,
            getPendingFormat: getPendingFormatSpy,
            cacheContentModel: cacheContentModelSpy,
            takeSnapshot: takeSnapshotSpy,
            formatContentModel: formatContentModelSpy,
            getEnvironment: () => ({}),
        } as any) as IEditor;
    });

    it('Collapsed range, text input, under editor directly', () => {
        const plugin = createFormatPlugin({
            defaultSegmentFormat: {
                fontFamily: 'Arial',
            },
        });
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
            eventType: 'keyDown',
            rawEvent,
        });

        expect(context).toEqual({
            newPendingFormat: {
                fontFamily: 'Arial',
            },
        });
    });

    it('Expanded range, text input, under editor directly', () => {
        const plugin = createFormatPlugin({
            defaultSegmentFormat: {
                fontFamily: 'Arial',
            },
        });
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
            eventType: 'keyDown',
            rawEvent,
        });

        expect(context).toEqual({});
        expect(takeSnapshotSpy).toHaveBeenCalledTimes(1);
    });

    it('Collapsed range, IME input, under editor directly', () => {
        const plugin = createFormatPlugin({
            defaultSegmentFormat: {
                fontFamily: 'Arial',
            },
        });
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
            eventType: 'keyDown',
            rawEvent,
        });

        expect(context).toEqual({
            newPendingFormat: {
                fontFamily: 'Arial',
            },
        });
    });

    it('Collapsed range, other input, under editor directly', () => {
        const plugin = createFormatPlugin({
            defaultSegmentFormat: {
                fontFamily: 'Arial',
            },
        });
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
            eventType: 'keyDown',
            rawEvent,
        });

        expect(context).toEqual({});
    });

    it('Collapsed range, normal input, not under editor directly, no style', () => {
        const plugin = createFormatPlugin({
            defaultSegmentFormat: {
                fontFamily: 'Arial',
            },
        });
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
            eventType: 'keyDown',
            rawEvent,
        });

        expect(context).toEqual({
            newPendingFormat: {
                fontFamily: 'Arial',
            },
        });
    });

    it('Collapsed range, text input, under editor directly, has pending format', () => {
        const plugin = createFormatPlugin({
            defaultSegmentFormat: {
                fontFamily: 'Arial',
            },
        });
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
            eventType: 'keyDown',
            rawEvent,
        });

        expect(context).toEqual({
            newPendingFormat: {
                fontFamily: 'Arial',
                fontSize: '10pt',
            },
        });
    });

    it('Collapsed range, already have style but not enough', () => {
        const defaultFormat = {
            fontFamily: 'Arial',
            fontSize: '20px',
            textColor: 'red',
        };
        const plugin = createFormatPlugin({
            defaultSegmentFormat: defaultFormat,
        });
        const rawEvent = { key: 'a' } as any;
        const applyDefaultFormatSpy = spyOn(applyDefaultFormat, 'applyDefaultFormat');
        const div = document.createElement('div');

        contentDiv.appendChild(div);
        div.style.fontFamily = 'Arial';
        div.style.fontSize = '10px';

        (editor as any).defaultFormatKeys = new Set(['fontFamily', 'fontSize', 'textColor']);

        getDOMSelection.and.returnValue({
            type: 'range',
            range: {
                collapsed: true,
                startContainer: div,
                startOffset: 0,
            },
        });

        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: 'keyDown',
            rawEvent,
        });

        expect(applyDefaultFormatSpy).toHaveBeenCalledTimes(1);
        expect(applyDefaultFormatSpy).toHaveBeenCalledWith(editor, defaultFormat);

        // Trigger event again under the same node, no need to apply again
        plugin.onPluginEvent({
            eventType: 'keyDown',
            rawEvent,
        });

        expect(applyDefaultFormatSpy).toHaveBeenCalledTimes(1);

        // Trigger event again under the same node, no need to apply again
        plugin.onPluginEvent({
            eventType: 'keyDown',
            rawEvent: { key: 'ArrowUp' } as any,
        });

        expect(applyDefaultFormatSpy).toHaveBeenCalledTimes(1);

        // Trigger event again under after moving cursor, should check again
        plugin.onPluginEvent({
            eventType: 'keyDown',
            rawEvent,
        });

        expect(applyDefaultFormatSpy).toHaveBeenCalledTimes(2);
    });

    it('Collapsed range, already have style and is enough', () => {
        const defaultFormat = {
            fontFamily: 'Arial',
            fontSize: '20px',
            textColor: 'red',
        };
        const plugin = createFormatPlugin({
            defaultSegmentFormat: defaultFormat,
        });
        const rawEvent = { key: 'a' } as any;
        const applyDefaultFormatSpy = spyOn(applyDefaultFormat, 'applyDefaultFormat');
        const div = document.createElement('div');

        contentDiv.appendChild(div);
        div.style.fontFamily = 'Arial';
        div.style.fontSize = '10px';
        div.style.color = 'green';

        (editor as any).defaultFormatKeys = new Set(['fontFamily', 'fontSize', 'textColor']);

        getDOMSelection.and.returnValue({
            type: 'range',
            range: {
                collapsed: true,
                startContainer: div,
                startOffset: 0,
            },
        });

        plugin.initialize(editor);

        plugin.onPluginEvent({
            eventType: 'keyDown',
            rawEvent,
        });

        expect(applyDefaultFormatSpy).not.toHaveBeenCalled();
    });
});
