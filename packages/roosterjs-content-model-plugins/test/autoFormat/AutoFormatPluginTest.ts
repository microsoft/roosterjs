import * as createLink from '../../lib/autoFormat/link/createLink';
import * as formatTextSegmentBeforeSelectionMarker from 'roosterjs-content-model-api/lib/publicApi/utils/formatTextSegmentBeforeSelectionMarker';
import * as unlink from '../../lib/autoFormat/link/unlink';
import { AutoFormatOptions } from '../../lib/autoFormat/interface/AutoFormatOptions';
import { AutoFormatPlugin } from '../../lib/autoFormat/AutoFormatPlugin';
import {
    ContentChangedEvent,
    ContentModelDocument,
    ContentModelParagraph,
    ContentModelSelectionMarker,
    ContentModelText,
    EditorInputEvent,
    IEditor,
    KeyDownEvent,
} from 'roosterjs-content-model-types';

describe('Content Model Auto Format Plugin Test', () => {
    let editor: IEditor;
    let formatTextSegmentBeforeSelectionMarkerSpy: jasmine.Spy<typeof formatTextSegmentBeforeSelectionMarker.formatTextSegmentBeforeSelectionMarker>;
    let triggerEventSpy: jasmine.Spy;

    beforeEach(() => {
        formatTextSegmentBeforeSelectionMarkerSpy = spyOn(
            formatTextSegmentBeforeSelectionMarker,
            'formatTextSegmentBeforeSelectionMarker'
        );
        triggerEventSpy = jasmine.createSpy('triggerEvent');
        editor = ({
            focus: () => {},
            getDOMSelection: () =>
                ({
                    type: 'range',
                    range: {
                        collapsed: true,
                    },
                } as any), // Force return invalid range to go through content model code
            formatContentModel: () => {},
            triggerEvent: triggerEventSpy,
        } as any) as IEditor;
    });

    describe('onPluginEvent - keyboardListTrigger', () => {
        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            format: {},
            isSelected: true,
        };
        function runTest(
            event: EditorInputEvent,
            testBullet: boolean,
            expectResult: ContentModelDocument,
            options: AutoFormatOptions,
            shouldCallFormat: boolean
        ) {
            const plugin = new AutoFormatPlugin(options);
            plugin.initialize(editor);

            const textSegment: ContentModelText = {
                segmentType: 'Text',
                text: testBullet ? '*' : '1)',
                format: {},
            };
            const paragraph: ContentModelParagraph = {
                blockType: 'Paragraph',
                segments: [textSegment, marker],
                format: {},
            };
            const inputModel: ContentModelDocument = {
                blockGroupType: 'Document',
                blocks: [paragraph],
                format: {},
            };

            formatTextSegmentBeforeSelectionMarkerSpy.and.callFake((editor, callback, options) => {
                callback(
                    inputModel,
                    textSegment,
                    paragraph,
                    {},
                    { deletedEntities: [], newEntities: [], newImages: [] }
                );

                return true;
            });

            plugin.onPluginEvent(event);

            expect(formatTextSegmentBeforeSelectionMarkerSpy).toHaveBeenCalledTimes(
                shouldCallFormat ? 1 : 0
            );
            expect(inputModel).toEqual(expectResult);
        }

        it('should trigger keyboardListTrigger', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', defaultPrevented: false, inputType: 'insertText' } as any,
            };
            runTest(
                event,
                true,
                {
                    blockGroupType: 'Document',
                    format: {},
                    blocks: [
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            levels: [
                                {
                                    listType: 'UL',
                                    format: {
                                        startNumberOverride: 1,
                                        direction: undefined,
                                        textAlign: undefined,
                                        marginBottom: undefined,
                                        marginTop: undefined,
                                    },
                                    dataset: {
                                        editingInfo:
                                            '{"applyListStyleFromLevel":false,"unorderedStyleType":1}',
                                    },
                                },
                            ],

                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {
                                    fontFamily: undefined,
                                    fontSize: undefined,
                                    textColor: undefined,
                                },
                            },
                            format: {},
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    format: {},
                                    segments: [
                                        marker,
                                        {
                                            segmentType: 'Br',
                                            format: {},
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    autoBullet: true,
                    autoNumbering: true,
                },
                true
            );
        });

        it('should not trigger keyboardListTrigger', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: '*', defaultPrevented: false, inputType: 'insertText' } as any,
            };
            runTest(
                event,
                true,
                {
                    blockGroupType: 'Document',
                    format: {},
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    format: {},
                                    text: '*',
                                },
                                marker,
                            ],
                        },
                    ],
                },
                {
                    autoBullet: true,
                    autoNumbering: true,
                },
                false
            );
        });

        it('should not trigger keyboardListTrigger', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', defaultPrevented: false, inputType: 'insertText' } as any,
            };
            runTest(
                event,
                false,
                {
                    blockGroupType: 'Document',
                    format: {},
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    format: {},
                                    text: '1)',
                                },
                                marker,
                            ],
                        },
                    ],
                },
                { autoBullet: false, autoNumbering: false },
                true
            );
        });

        it('should trigger keyboardListTrigger with auto bullet only', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', defaultPrevented: false, inputType: 'insertText' } as any,
            };
            runTest(
                event,
                true,
                {
                    blockGroupType: 'Document',
                    format: {},
                    blocks: [
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            levels: [
                                {
                                    listType: 'UL',
                                    format: {
                                        startNumberOverride: 1,
                                        direction: undefined,
                                        textAlign: undefined,
                                        marginBottom: undefined,
                                        marginTop: undefined,
                                    },
                                    dataset: {
                                        editingInfo:
                                            '{"applyListStyleFromLevel":false,"unorderedStyleType":1}',
                                    },
                                },
                            ],

                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {
                                    fontFamily: undefined,
                                    fontSize: undefined,
                                    textColor: undefined,
                                },
                            },
                            format: {},
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    format: {},
                                    segments: [
                                        marker,
                                        {
                                            segmentType: 'Br',
                                            format: {},
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                { autoBullet: true, autoNumbering: false },
                true
            );
        });

        it('should trigger keyboardListTrigger with auto numbering only', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', defaultPrevented: false, inputType: 'insertText' } as any,
            };
            runTest(
                event,
                false,
                {
                    blockGroupType: 'Document',
                    format: {},
                    blocks: [
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        startNumberOverride: 1,
                                        direction: undefined,
                                        textAlign: undefined,
                                        marginBottom: undefined,
                                        marginTop: undefined,
                                    },
                                    dataset: {
                                        editingInfo:
                                            '{"applyListStyleFromLevel":false,"orderedStyleType":3}',
                                    },
                                },
                            ],

                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {
                                    fontFamily: undefined,
                                    fontSize: undefined,
                                    textColor: undefined,
                                },
                            },
                            format: {},
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    format: {},
                                    segments: [
                                        marker,
                                        {
                                            segmentType: 'Br',
                                            format: {},
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                { autoBullet: false, autoNumbering: true },
                true
            );
        });

        it('should not trigger keyboardListTrigger if the input type is different from insertText', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { key: ' ', defaultPrevented: false, inputType: 'test' } as any,
            };
            runTest(
                event,
                true,
                {
                    blockGroupType: 'Document',
                    format: {},
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    format: {},
                                    text: '*',
                                },
                                marker,
                            ],
                        },
                    ],
                },
                { autoBullet: true, autoNumbering: true },
                false
            );
        });
    });

    describe('onPluginEvent - [TAB] - keyboardListTrigger', () => {
        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            isSelected: true,
            format: {},
        };
        function runTest(
            event: KeyDownEvent,
            testBullet: boolean,
            expectResult: ContentModelDocument,
            options: AutoFormatOptions,
            shouldCallFormat: boolean,
            shouldPreventDefault: boolean
        ) {
            const plugin = new AutoFormatPlugin(options);
            plugin.initialize(editor);

            const textSegment: ContentModelText = {
                segmentType: 'Text',
                text: testBullet ? '*' : '1)',
                format: {},
            };
            const paragraph: ContentModelParagraph = {
                blockType: 'Paragraph',
                segments: [textSegment, marker],
                format: {},
            };
            const inputModel: ContentModelDocument = {
                blockGroupType: 'Document',
                blocks: [paragraph],
                format: {},
            };

            formatTextSegmentBeforeSelectionMarkerSpy.and.callFake((editor, callback, options) => {
                callback(
                    inputModel,
                    textSegment,
                    paragraph,
                    {},
                    { newEntities: [], newImages: [], deletedEntities: [] }
                );

                return true;
            });

            plugin.onPluginEvent(event);

            expect(formatTextSegmentBeforeSelectionMarkerSpy).toHaveBeenCalledTimes(
                shouldCallFormat ? 1 : 0
            );
            expect(inputModel).toEqual(expectResult);
            expect(event.rawEvent.preventDefault).toHaveBeenCalledTimes(
                shouldPreventDefault ? 1 : 0
            );
        }

        it('[TAB] should trigger keyboardListTrigger bullet ', () => {
            const event: KeyDownEvent = {
                eventType: 'keyDown',
                rawEvent: {
                    key: 'Tab',
                    defaultPrevented: false,
                    handledByEditFeature: false,
                    preventDefault: jasmine.createSpy('preventDefault'),
                } as any,
            };
            runTest(
                event,
                true,
                {
                    blockGroupType: 'Document',
                    format: {},
                    blocks: [
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [marker, { segmentType: 'Br', format: {} }],
                                    format: {},
                                },
                            ],
                            levels: [
                                {
                                    listType: 'UL',
                                    format: {
                                        startNumberOverride: 1,
                                        direction: undefined,
                                        textAlign: undefined,
                                        marginBottom: undefined,
                                        marginTop: undefined,
                                    },
                                    dataset: {
                                        editingInfo:
                                            '{"applyListStyleFromLevel":false,"unorderedStyleType":1}',
                                    },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {
                                    fontFamily: undefined,
                                    fontSize: undefined,
                                    textColor: undefined,
                                },
                            },
                            format: {},
                        },
                    ],
                },
                { autoBullet: true, autoNumbering: false },
                true,
                true
            );
        });

        it('[TAB] should trigger keyboardListTrigger numbering ', () => {
            const event: KeyDownEvent = {
                eventType: 'keyDown',
                rawEvent: {
                    key: 'Tab',
                    defaultPrevented: false,
                    handledByEditFeature: false,
                    preventDefault: jasmine.createSpy('preventDefault'),
                } as any,
            };
            runTest(
                event,
                false,
                {
                    blockGroupType: 'Document',
                    format: {},
                    blocks: [
                        {
                            blockType: 'BlockGroup',
                            blockGroupType: 'ListItem',
                            blocks: [
                                {
                                    blockType: 'Paragraph',
                                    segments: [marker, { segmentType: 'Br', format: {} }],
                                    format: {},
                                },
                            ],
                            levels: [
                                {
                                    listType: 'OL',
                                    format: {
                                        startNumberOverride: 1,
                                        direction: undefined,
                                        textAlign: undefined,
                                        marginBottom: undefined,
                                        marginTop: undefined,
                                    },
                                    dataset: {
                                        editingInfo:
                                            '{"applyListStyleFromLevel":false,"orderedStyleType":3}',
                                    },
                                },
                            ],
                            formatHolder: {
                                segmentType: 'SelectionMarker',
                                isSelected: false,
                                format: {
                                    fontFamily: undefined,
                                    fontSize: undefined,
                                    textColor: undefined,
                                },
                            },
                            format: {},
                        },
                    ],
                },
                { autoBullet: true, autoNumbering: true },
                true,
                true
            );
        });

        it('[TAB] should not trigger keyboardListTrigger numbering ', () => {
            const event: KeyDownEvent = {
                eventType: 'keyDown',
                rawEvent: {
                    key: 'Tab',
                    defaultPrevented: false,
                    handledByEditFeature: false,
                    preventDefault: jasmine.createSpy('preventDefault'),
                } as any,
            };
            runTest(
                event,
                false,
                {
                    blockGroupType: 'Document',
                    format: {},
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: '1)',
                                    format: {},
                                },
                                marker,
                            ],
                        },
                    ],
                },
                { autoBullet: true, autoNumbering: false },
                true,
                false
            );
        });

        it('[TAB] should not trigger keyboardListTrigger bullet ', () => {
            const event: KeyDownEvent = {
                eventType: 'keyDown',
                rawEvent: {
                    key: 'Tab',
                    defaultPrevented: false,
                    handledByEditFeature: false,
                    preventDefault: jasmine.createSpy('preventDefault'),
                } as any,
            };
            runTest(
                event,
                true,
                {
                    blockGroupType: 'Document',
                    format: {},
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: '*',
                                    format: {},
                                },
                                marker,
                            ],
                        },
                    ],
                },
                { autoBullet: false, autoNumbering: false },
                true,
                false
            );
        });

        it('[TAB] should not trigger keyboardListTrigger - not tab ', () => {
            const event: KeyDownEvent = {
                eventType: 'keyDown',
                rawEvent: {
                    key: 'Ctrl',
                    defaultPrevented: false,
                    handledByEditFeature: false,
                    preventDefault: jasmine.createSpy('preventDefault'),
                } as any,
            };
            runTest(
                event,
                true,
                {
                    blockGroupType: 'Document',
                    format: {},
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: '*',
                                    format: {},
                                },
                                marker,
                            ],
                        },
                    ],
                },
                { autoBullet: true, autoNumbering: true },
                false,
                false
            );
        });

        it('[TAB] should not trigger keyboardListTrigger - default prevented ', () => {
            const event: KeyDownEvent = {
                eventType: 'keyDown',
                rawEvent: {
                    key: 'Tab',
                    defaultPrevented: true,
                    handledByEditFeature: false,
                    preventDefault: jasmine.createSpy('preventDefault'),
                } as any,
            };
            runTest(
                event,
                true,
                {
                    blockGroupType: 'Document',
                    format: {},
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: '*',
                                    format: {},
                                },
                                marker,
                            ],
                        },
                    ],
                },
                { autoBullet: true, autoNumbering: true },
                false,
                false
            );
        });

        it('[TAB] should not trigger keyboardListTrigger - handledByEditFeature', () => {
            const event: KeyDownEvent = {
                eventType: 'keyDown',
                rawEvent: {
                    key: 'Tab',
                    defaultPrevented: false,
                    preventDefault: jasmine.createSpy('preventDefault'),
                } as any,
                handledByEditFeature: true,
            };
            runTest(
                event,
                true,
                {
                    blockGroupType: 'Document',
                    format: {},
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: '*',
                                    format: {},
                                },
                                marker,
                            ],
                        },
                    ],
                },
                { autoBullet: true, autoNumbering: true },
                false,
                false
            );
        });

        it('[TAB] should not trigger keyboardListTrigger - shift key', () => {
            const event: KeyDownEvent = {
                eventType: 'keyDown',
                rawEvent: {
                    key: 'Tab',
                    defaultPrevented: false,
                    shiftKey: true,
                    preventDefault: jasmine.createSpy('preventDefault'),
                } as any,
                handledByEditFeature: true,
            };
            runTest(
                event,
                true,
                {
                    blockGroupType: 'Document',
                    format: {},
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: '*',
                                    format: {},
                                },
                                marker,
                            ],
                        },
                    ],
                },
                { autoBullet: true, autoNumbering: true },
                false,
                false
            );
        });
    });

    describe('onPluginEvent - createLink', () => {
        let createLinkSpy: jasmine.Spy;

        beforeEach(() => {
            createLinkSpy = spyOn(createLink, 'createLink');
        });

        function runTest(
            event: ContentChangedEvent,
            shouldCallTrigger: boolean,
            options: AutoFormatOptions
        ) {
            const plugin = new AutoFormatPlugin(options as AutoFormatOptions);
            plugin.initialize(editor);

            plugin.onPluginEvent(event);

            if (shouldCallTrigger) {
                expect(createLinkSpy).toHaveBeenCalledWith(editor, options);
            } else {
                expect(createLinkSpy).not.toHaveBeenCalled();
            }
        }

        it('should call createLink', () => {
            const event: ContentChangedEvent = {
                eventType: 'contentChanged',
                source: 'Paste',
            };
            runTest(event, true, {
                autoLink: true,
                autoMailto: true,
                autoTel: true,
            });
        });

        it('should not  call createLink - autolink disabled', () => {
            const event: ContentChangedEvent = {
                eventType: 'contentChanged',
                source: 'Paste',
            };
            runTest(event, false, { autoLink: false, autoMailto: false, autoTel: false });
        });

        it('should not  call createLink - not paste', () => {
            const event: ContentChangedEvent = {
                eventType: 'contentChanged',
                source: 'Format',
            };
            runTest(event, false, {
                autoLink: true,
                autoMailto: true,
                autoTel: true,
            });
        });
    });

    describe('onPluginEvent - unlink', () => {
        let unlinkSpy: jasmine.Spy;

        beforeEach(() => {
            unlinkSpy = spyOn(unlink, 'unlink');
        });

        function runTest(
            event: KeyDownEvent,
            shouldCallTrigger: boolean,
            options?: {
                autoUnlink: boolean;
            }
        ) {
            const plugin = new AutoFormatPlugin(options as AutoFormatOptions);
            plugin.initialize(editor);

            plugin.onPluginEvent(event);

            if (shouldCallTrigger) {
                expect(unlinkSpy).toHaveBeenCalledWith(editor, event.rawEvent);
            } else {
                expect(unlinkSpy).not.toHaveBeenCalled();
            }
        }

        it('should call unlink', () => {
            const event: KeyDownEvent = {
                eventType: 'keyDown',
                rawEvent: { key: 'Backspace', preventDefault: () => {} } as any,
            };
            runTest(event, true, {
                autoUnlink: true,
            });
        });

        it('should not call unlink - disable options', () => {
            const event: KeyDownEvent = {
                eventType: 'keyDown',
                rawEvent: { key: 'Backspace', preventDefault: () => {} } as any,
            };
            runTest(event, false, {
                autoUnlink: false,
            });
        });

        it('should not call unlink - not backspace', () => {
            const event: KeyDownEvent = {
                eventType: 'keyDown',
                rawEvent: { key: ' ', preventDefault: () => {} } as any,
            };
            runTest(event, false);
        });
    });

    describe('onPluginEvent - promoteLink', () => {
        function runTest(
            event: EditorInputEvent,
            expectResult: ContentModelParagraph,
            options: AutoFormatOptions,
            shouldCallFormat: boolean
        ) {
            const plugin = new AutoFormatPlugin(options as AutoFormatOptions);
            plugin.initialize(editor);

            const segment: ContentModelText = {
                segmentType: 'Text',
                text: 'www.test.com',
                format: {},
            };
            const paragraph: ContentModelParagraph = {
                blockType: 'Paragraph',
                segments: [segment],
                format: {},
            };

            formatTextSegmentBeforeSelectionMarkerSpy.and.callFake((editor, callback) => {
                callback(
                    null!,
                    segment,
                    paragraph,
                    {},
                    { deletedEntities: [], newEntities: [], newImages: [] }
                );

                return true;
            });

            plugin.onPluginEvent(event);

            expect(formatTextSegmentBeforeSelectionMarkerSpy).toHaveBeenCalledTimes(
                shouldCallFormat ? 1 : 0
            );
            expect(paragraph).toEqual(expectResult);
        }

        it('should call promoteLink', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', preventDefault: () => {}, inputType: 'insertText' } as any,
            };
            runTest(
                event,
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'www.test.com',
                            format: {},
                            isSelected: undefined,
                            link: {
                                format: {
                                    href: 'http://www.test.com',
                                    underline: true,
                                },
                                dataset: {},
                            },
                        },
                    ],
                },
                {
                    autoLink: true,
                },
                true
            );
        });

        it('should call promoteLink | autoTel', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', preventDefault: () => {}, inputType: 'insertText' } as any,
            };
            runTest(
                event,
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'www.test.com',
                            format: {},
                        },
                    ],
                },
                {
                    autoTel: true,
                },
                true
            );
        });

        it('should call promoteLink | autoMailto', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', preventDefault: () => {}, inputType: 'insertText' } as any,
            };
            runTest(
                event,
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'www.test.com',
                            format: {},
                        },
                    ],
                },
                {
                    autoMailto: true,
                },
                true
            );
        });

        it('should not call promoteLink - disable options', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', preventDefault: () => {}, inputType: 'insertText' } as any,
            };
            runTest(
                event,
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'www.test.com',
                            format: {},
                        },
                    ],
                },
                {
                    autoLink: false,
                },
                true
            );
        });

        it('should not call promoteLink - not space', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: {
                    data: 'Backspace',
                    preventDefault: () => {},
                    inputType: 'insertText',
                } as any,
            };
            runTest(
                event,
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'www.test.com',
                            format: {},
                        },
                    ],
                },
                {
                    autoLink: true,
                },
                false
            );
        });
    });

    describe('onPluginEvent - transformHyphen', () => {
        function runTest(
            event: EditorInputEvent,
            expectedResult: ContentModelDocument,
            options: AutoFormatOptions,
            shouldCallFormat: boolean
        ) {
            const plugin = new AutoFormatPlugin(options);
            plugin.initialize(editor);

            const segment: ContentModelText = {
                segmentType: 'Text',
                text: 'test--test ',
                format: {},
            };
            const selectionMarker: ContentModelSelectionMarker = {
                segmentType: 'SelectionMarker',
                format: {},
                isSelected: true,
            };
            const paragraph: ContentModelParagraph = {
                blockType: 'Paragraph',
                segments: [segment, selectionMarker],
                format: {},
            };
            const model: ContentModelDocument = {
                blockGroupType: 'Document',
                blocks: [paragraph],
            };

            formatTextSegmentBeforeSelectionMarkerSpy.and.callFake((editor, callback, options) => {
                callback(
                    model,
                    segment,
                    paragraph,
                    {},
                    { newEntities: [], newImages: [], deletedEntities: [] }
                );

                return true;
            });

            plugin.onPluginEvent(event);

            expect(formatTextSegmentBeforeSelectionMarkerSpy).toHaveBeenCalledTimes(
                shouldCallFormat ? 1 : 0
            );
            expect(model).toEqual(expectedResult);
        }

        it('should call transformHyphen', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', preventDefault: () => {}, inputType: 'insertText' } as any,
            };
            runTest(
                event,
                {
                    blockGroupType: 'Document',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test—test',
                                    format: {},
                                    isSelected: undefined,
                                },
                                {
                                    segmentType: 'Text',
                                    text: ' ',
                                    format: {},
                                    isSelected: undefined,
                                },
                                {
                                    segmentType: 'SelectionMarker',
                                    format: {},
                                    isSelected: true,
                                },
                            ],
                            format: {},
                        },
                    ],
                },
                {
                    autoHyphen: true,
                },
                true
            );
        });

        it('should not call transformHyphen - disable options', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', preventDefault: () => {}, inputType: 'insertText' } as any,
            };
            runTest(
                event,
                {
                    blockGroupType: 'Document',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test--test ',
                                    format: {},
                                },
                                {
                                    segmentType: 'SelectionMarker',
                                    format: {},
                                    isSelected: true,
                                },
                            ],
                            format: {},
                        },
                    ],
                },
                {
                    autoHyphen: false,
                },
                true
            );
        });

        it('should not call transformHyphen - not space', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: {
                    data: 'Backspace',
                    preventDefault: () => {},
                    inputType: 'insertText',
                } as any,
            };
            runTest(
                event,
                {
                    blockGroupType: 'Document',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test--test ',
                                    format: {},
                                },
                                {
                                    segmentType: 'SelectionMarker',
                                    format: {},
                                    isSelected: true,
                                },
                            ],
                            format: {},
                        },
                    ],
                },
                {
                    autoHyphen: true,
                },
                false
            );
        });
    });

    describe('onPluginEvent - transformFraction', () => {
        function runTest(
            event: EditorInputEvent,
            expectResult: ContentModelDocument,
            options: AutoFormatOptions,
            shouldCallFormat: boolean
        ) {
            const plugin = new AutoFormatPlugin(options);
            plugin.initialize(editor);

            const segment: ContentModelText = {
                segmentType: 'Text',
                text: '1/2 ',
                format: {},
            };
            const paragraph: ContentModelParagraph = {
                blockType: 'Paragraph',
                format: {},
                segments: [segment],
            };
            const model: ContentModelDocument = {
                blockGroupType: 'Document',
                blocks: [paragraph],
            };

            formatTextSegmentBeforeSelectionMarkerSpy.and.callFake((editor, callback, options) => {
                callback(
                    model,
                    segment,
                    paragraph,
                    {},
                    { newEntities: [], newImages: [], deletedEntities: [] }
                );

                return true;
            });

            plugin.onPluginEvent(event);

            expect(formatTextSegmentBeforeSelectionMarkerSpy).toHaveBeenCalledTimes(
                shouldCallFormat ? 1 : 0
            );
            expect(model).toEqual(expectResult);
        }

        it('should call transformFraction', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', preventDefault: () => {}, inputType: 'insertText' } as any,
            };
            runTest(
                event,
                {
                    blockGroupType: 'Document',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: '½',
                                    format: {},
                                    isSelected: undefined,
                                },
                                {
                                    segmentType: 'Text',
                                    text: ' ',
                                    format: {},
                                    isSelected: undefined,
                                },
                            ],
                        },
                    ],
                },
                {
                    autoFraction: true,
                },
                true
            );
        });

        it('should not call transformFraction - disable options', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', preventDefault: () => {}, inputType: 'insertText' } as any,
            };
            runTest(
                event,
                {
                    blockGroupType: 'Document',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [{ segmentType: 'Text', text: '1/2 ', format: {} }],
                        },
                    ],
                },
                {
                    autoFraction: false,
                },
                true
            );
        });
    });

    describe('onPluginEvent - transformOrdinals', () => {
        function runTest(
            event: EditorInputEvent,
            expectResult: ContentModelDocument,
            options: AutoFormatOptions,
            shouldCallFormat: boolean
        ) {
            const plugin = new AutoFormatPlugin(options);
            plugin.initialize(editor);

            const segment: ContentModelText = {
                segmentType: 'Text',
                text: '1st ',
                format: {},
            };
            const paragraph: ContentModelParagraph = {
                blockType: 'Paragraph',
                format: {},
                segments: [segment],
            };
            const model: ContentModelDocument = {
                blockGroupType: 'Document',
                blocks: [paragraph],
            };

            formatTextSegmentBeforeSelectionMarkerSpy.and.callFake((editor, callback, options) => {
                callback(
                    model,
                    segment,
                    paragraph,
                    {},
                    { newEntities: [], newImages: [], deletedEntities: [] }
                );

                return true;
            });

            plugin.onPluginEvent(event);

            expect(formatTextSegmentBeforeSelectionMarkerSpy).toHaveBeenCalledTimes(
                shouldCallFormat ? 1 : 0
            );
            expect(model).toEqual(expectResult);
        }

        it('should call transformOrdinals', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', preventDefault: () => {}, inputType: 'insertText' } as any,
            };
            runTest(
                event,
                {
                    blockGroupType: 'Document',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: '1',
                                    format: {},
                                    isSelected: undefined,
                                },
                                {
                                    segmentType: 'Text',
                                    text: 'st',
                                    format: { superOrSubScriptSequence: 'super' },
                                    isSelected: undefined,
                                },
                                {
                                    segmentType: 'Text',
                                    text: ' ',
                                    format: {},
                                    isSelected: undefined,
                                },
                            ],
                        },
                    ],
                },
                {
                    autoOrdinals: true,
                },
                true
            );
        });

        it('should not call transformOrdinals - disable options', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', preventDefault: () => {}, inputType: 'insertText' } as any,
            };
            runTest(
                event,
                {
                    blockGroupType: 'Document',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [{ segmentType: 'Text', text: '1st ', format: {} }],
                        },
                    ],
                },
                {
                    autoOrdinals: false,
                },
                true
            );
        });
    });
});
