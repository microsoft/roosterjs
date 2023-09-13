import * as formatWithContentModel from '../../../lib/publicApi/utils/formatWithContentModel';
import * as keyboardDelete from '../../../lib/publicApi/editing/keyboardDelete';
import * as pendingFormat from '../../../lib/modelApi/format/pendingFormat';
import ContentModelEditPlugin from '../../../lib/editor/plugins/ContentModelEditPlugin';
import { ContentModelEditPluginState } from '../../../lib/publicTypes/pluginState/ContentModelEditPluginState';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';
import { Position } from 'roosterjs-editor-dom';
import {
    EntityOperation,
    Keys,
    PluginEventType,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';

describe('ContentModelEditPlugin', () => {
    let editor: IContentModelEditor;
    let pluginState: ContentModelEditPluginState;
    let getContentModelDefaultFormat: jasmine.Spy;
    let plugin: ContentModelEditPlugin;

    beforeEach(() => {
        pluginState = {};
        getContentModelDefaultFormat = jasmine
            .createSpy('getContentModelDefaultFormat')
            .and.returnValue({});

        editor = ({
            getContentModelDefaultFormat,
            getDocument: () => document,
            isInShadowEdit: () => false,
            getSelectionRangeEx: () =>
                ({
                    type: -1,
                } as any), // Force return invalid range to go through content model code
        } as any) as IContentModelEditor;
    });

    afterEach(() => {
        plugin?.dispose();
    });

    describe('onPluginEvent', () => {
        let keyboardDeleteSpy: jasmine.Spy;

        beforeEach(() => {
            keyboardDeleteSpy = spyOn(keyboardDelete, 'default').and.returnValue(true);
        });

        it('Backspace', () => {
            plugin = new ContentModelEditPlugin(pluginState);
            const rawEvent = { which: Keys.BACKSPACE } as any;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent,
            });

            expect(keyboardDeleteSpy).toHaveBeenCalledWith(editor, rawEvent);
            expect(pluginState).toEqual({});
        });

        it('Delete', () => {
            plugin = new ContentModelEditPlugin(pluginState);
            const rawEvent = { which: Keys.DELETE } as any;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent,
            });

            expect(keyboardDeleteSpy).toHaveBeenCalledWith(editor, rawEvent);
            expect(pluginState).toEqual({});
        });

        it('Other key', () => {
            plugin = new ContentModelEditPlugin(pluginState);
            const rawEvent = { which: 41 } as any;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent,
            });

            expect(keyboardDeleteSpy).not.toHaveBeenCalled();
            expect(pluginState).toEqual({});
        });

        it('Default prevented', () => {
            plugin = new ContentModelEditPlugin(pluginState);
            const rawEvent = { which: Keys.DELETE, defaultPrevented: true } as any;

            plugin.initialize(editor);
            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent,
            });

            expect(keyboardDeleteSpy).not.toHaveBeenCalled();
            expect(pluginState).toEqual({ cachedModel: undefined, cachedRangeEx: undefined });
        });

        it('Trigger entity event first', () => {
            plugin = new ContentModelEditPlugin(pluginState);
            const wrapper = 'WRAPPER' as any;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: PluginEventType.EntityOperation,
                operation: EntityOperation.Overwrite,
                rawEvent: {
                    type: 'keydown',
                } as any,
                entity: wrapper,
            });

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent: { which: Keys.DELETE } as any,
            });

            expect(keyboardDeleteSpy).toHaveBeenCalledWith(editor, {
                which: Keys.DELETE,
            } as any);

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent: { which: Keys.DELETE } as any,
            });

            expect(keyboardDeleteSpy).toHaveBeenCalledTimes(2);
            expect(keyboardDeleteSpy).toHaveBeenCalledWith(editor, {
                which: Keys.DELETE,
            } as any);
            expect(pluginState).toEqual({});
        });

        it('SelectionChanged event should clear cached model', () => {
            plugin = new ContentModelEditPlugin(pluginState);

            plugin.initialize(editor);
            plugin.onPluginEvent({
                eventType: PluginEventType.SelectionChanged,
                selectionRangeEx: null!,
            });

            expect(pluginState).toEqual({ cachedModel: undefined, cachedRangeEx: undefined });
        });

        it('keyboardDelete returns false', () => {
            plugin = new ContentModelEditPlugin(pluginState);

            keyboardDeleteSpy.and.returnValue(false);

            plugin.initialize(editor);
            plugin.onPluginEvent({
                eventType: PluginEventType.SelectionChanged,
                selectionRangeEx: null!,
            });

            expect(pluginState).toEqual({
                cachedModel: undefined,
                cachedRangeEx: undefined,
            });
        });
    });
});

describe('ContentModelEditPlugin for default format', () => {
    let editor: IContentModelEditor;
    let contentDiv: HTMLDivElement;
    let getSelectionRangeEx: jasmine.Spy;
    let getPendingFormatSpy: jasmine.Spy;
    let setPendingFormatSpy: jasmine.Spy;
    let cacheContentModelSpy: jasmine.Spy;
    let addUndoSnapshotSpy: jasmine.Spy;
    let plugin: ContentModelEditPlugin;
    let pluginState: ContentModelEditPluginState;

    beforeEach(() => {
        pluginState = {};
        setPendingFormatSpy = spyOn(pendingFormat, 'setPendingFormat');
        getPendingFormatSpy = spyOn(pendingFormat, 'getPendingFormat');
        getSelectionRangeEx = jasmine.createSpy('getSelectionRangeEx');
        cacheContentModelSpy = jasmine.createSpy('cacheContentModel');
        addUndoSnapshotSpy = jasmine.createSpy('addUndoSnapshot');

        contentDiv = document.createElement('div');

        editor = ({
            contains: (e: Node) => contentDiv != e && contentDiv.contains(e),
            getSelectionRangeEx,
            getContentModelDefaultFormat: () => ({
                fontFamily: 'Arial',
            }),
            cacheContentModel: cacheContentModelSpy,
            addUndoSnapshot: addUndoSnapshotSpy,
            getDocument: () => document,
        } as any) as IContentModelEditor;
    });

    afterEach(() => {
        plugin?.dispose();
    });

    it('Collapsed range, text input, under editor directly', () => {
        plugin = new ContentModelEditPlugin(pluginState);
        const rawEvent = { key: 'a' } as any;

        getSelectionRangeEx.and.returnValue({
            type: SelectionRangeTypes.Normal,
            ranges: [
                {
                    collapsed: true,
                    startContainer: contentDiv,
                    startOffset: 0,
                },
            ],
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
        plugin = new ContentModelEditPlugin(pluginState);
        const rawEvent = { key: 'a' } as any;

        getSelectionRangeEx.and.returnValue({
            type: SelectionRangeTypes.Normal,
            ranges: [
                {
                    collapsed: false,
                    startContainer: contentDiv,
                    startOffset: 0,
                },
            ],
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
        plugin = new ContentModelEditPlugin(pluginState);
        const rawEvent = { key: 'Process' } as any;

        getSelectionRangeEx.and.returnValue({
            type: SelectionRangeTypes.Normal,
            ranges: [
                {
                    collapsed: true,
                    startContainer: contentDiv,
                    startOffset: 0,
                },
            ],
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
        plugin = new ContentModelEditPlugin(pluginState);
        const rawEvent = { key: 'Up' } as any;

        getSelectionRangeEx.and.returnValue({
            type: SelectionRangeTypes.Normal,
            ranges: [
                {
                    collapsed: true,
                    startContainer: contentDiv,
                    startOffset: 0,
                },
            ],
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
        plugin = new ContentModelEditPlugin(pluginState);
        const rawEvent = { key: 'a' } as any;
        const div = document.createElement('div');

        contentDiv.appendChild(div);

        getSelectionRangeEx.and.returnValue({
            type: SelectionRangeTypes.Normal,
            ranges: [
                {
                    collapsed: true,
                    startContainer: div,
                    startOffset: 0,
                },
            ],
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
        plugin = new ContentModelEditPlugin(pluginState);
        const rawEvent = { key: 'a' } as any;

        getSelectionRangeEx.and.returnValue({
            type: SelectionRangeTypes.Normal,
            ranges: [
                {
                    collapsed: true,
                    startContainer: contentDiv,
                    startOffset: 0,
                },
            ],
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
