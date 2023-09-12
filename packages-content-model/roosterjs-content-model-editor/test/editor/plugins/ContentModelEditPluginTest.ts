import * as formatWithContentModel from '../../../lib/publicApi/utils/formatWithContentModel';
import * as keyboardDelete from '../../../lib/publicApi/editing/keyboardDelete';
import * as pendingFormat from '../../../lib/modelApi/format/pendingFormat';
import ContentModelEditPlugin from '../../../lib/editor/plugins/ContentModelEditPlugin';
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
    let cacheContentModel: jasmine.Spy;
    let getContentModelDefaultFormat: jasmine.Spy;

    beforeEach(() => {
        cacheContentModel = jasmine.createSpy('cacheContentModel');
        getContentModelDefaultFormat = jasmine
            .createSpy('getContentModelDefaultFormat')
            .and.returnValue({});

        editor = ({
            cacheContentModel,
            getContentModelDefaultFormat,
            getSelectionRangeEx: () =>
                ({
                    type: -1,
                } as any), // Force return invalid range to go through content model code
        } as any) as IContentModelEditor;
    });

    describe('onPluginEvent', () => {
        let keyboardDeleteSpy: jasmine.Spy;

        beforeEach(() => {
            keyboardDeleteSpy = spyOn(keyboardDelete, 'default').and.returnValue(true);
        });

        it('Backspace', () => {
            const plugin = new ContentModelEditPlugin();
            const rawEvent = { which: Keys.BACKSPACE } as any;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent,
            });

            expect(keyboardDeleteSpy).toHaveBeenCalledWith(editor, rawEvent);
            expect(cacheContentModel).not.toHaveBeenCalled();
        });

        it('Delete', () => {
            const plugin = new ContentModelEditPlugin();
            const rawEvent = { which: Keys.DELETE } as any;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent,
            });

            expect(keyboardDeleteSpy).toHaveBeenCalledWith(editor, rawEvent);
            expect(cacheContentModel).not.toHaveBeenCalled();
        });

        it('Other key', () => {
            const plugin = new ContentModelEditPlugin();
            const rawEvent = { which: 41 } as any;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent,
            });

            expect(keyboardDeleteSpy).not.toHaveBeenCalled();
            expect(cacheContentModel).toHaveBeenCalledWith(null);
        });

        it('Default prevented', () => {
            const plugin = new ContentModelEditPlugin();
            const rawEvent = { which: Keys.DELETE, defaultPrevented: true } as any;

            plugin.initialize(editor);
            plugin.onPluginEvent({
                eventType: PluginEventType.KeyDown,
                rawEvent,
            });

            expect(keyboardDeleteSpy).not.toHaveBeenCalled();
            expect(cacheContentModel).toHaveBeenCalledWith(null);
        });

        it('Trigger entity event first', () => {
            const plugin = new ContentModelEditPlugin();
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
            expect(cacheContentModel).not.toHaveBeenCalled();
        });

        it('SelectionChanged event should clear cached model', () => {
            const plugin = new ContentModelEditPlugin();

            plugin.initialize(editor);
            plugin.onPluginEvent({
                eventType: PluginEventType.SelectionChanged,
                selectionRangeEx: null!,
            });

            expect(cacheContentModel).toHaveBeenCalledWith(null);
        });

        it('keyboardDelete returns false', () => {
            const plugin = new ContentModelEditPlugin();

            keyboardDeleteSpy.and.returnValue(false);

            plugin.initialize(editor);
            plugin.onPluginEvent({
                eventType: PluginEventType.SelectionChanged,
                selectionRangeEx: null!,
            });

            expect(cacheContentModel).toHaveBeenCalledWith(null);
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

    beforeEach(() => {
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
        } as any) as IContentModelEditor;
    });

    it('Collapsed range, text input, under editor directly', () => {
        const plugin = new ContentModelEditPlugin();
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
        const plugin = new ContentModelEditPlugin();
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
        const plugin = new ContentModelEditPlugin();
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
        const plugin = new ContentModelEditPlugin();
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
        const plugin = new ContentModelEditPlugin();
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
        const plugin = new ContentModelEditPlugin();
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
