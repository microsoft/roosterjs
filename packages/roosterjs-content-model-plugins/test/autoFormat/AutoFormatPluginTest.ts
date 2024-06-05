import * as createLink from '../../lib/autoFormat/link/createLink';
import * as formatTextSegmentBeforeSelectionMarker from 'roosterjs-content-model-api/lib/publicApi/utils/formatTextSegmentBeforeSelectionMarker';
import * as unlink from '../../lib/autoFormat/link/unlink';
import { AutoFormatOptions, AutoFormatPlugin } from '../../lib/autoFormat/AutoFormatPlugin';
import { ChangeSource } from '../../../roosterjs-content-model-dom/lib/constants/ChangeSource';
import { createLinkAfterSpace } from '../../lib/autoFormat/link/createLinkAfterSpace';
import { keyboardListTrigger } from '../../lib/autoFormat/list/keyboardListTrigger';
import { transformFraction } from '../../lib/autoFormat/numbers/transformFraction';
import { transformHyphen } from '../../lib/autoFormat/hyphen/transformHyphen';
import { transformOrdinals } from '../../lib/autoFormat/numbers/transformOrdinals';
import {
    ContentChangedEvent,
    ContentModelDocument,
    ContentModelParagraph,
    ContentModelText,
    EditorInputEvent,
    FormatContentModelContext,
    IEditor,
    KeyDownEvent,
} from 'roosterjs-content-model-types';

describe('Content Model Auto Format Plugin Test', () => {
    let editor: IEditor;
    let formatTextSegmentBeforeSelectionMarkerSpy: jasmine.Spy;
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
        function runTest(
            event: EditorInputEvent,
            testBullet: boolean,
            expectResult: boolean,
            options?: AutoFormatOptions
        ) {
            const plugin = new AutoFormatPlugin(options);
            plugin.initialize(editor);

            plugin.onPluginEvent(event);

            const formatOptions = {
                apiName: '',
            };

            const inputModel = (bullet: boolean): ContentModelDocument => ({
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: bullet ? '*' : '1)',
                                format: {},
                            },
                            {
                                segmentType: 'SelectionMarker',
                                isSelected: true,
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                format: {},
            });

            formatTextSegmentBeforeSelectionMarkerSpy.and.callFake((editor, callback, options) => {
                expect(callback).toBe(
                    editor,
                    (
                        _model: ContentModelDocument,
                        _previousSegment: ContentModelText,
                        paragraph: ContentModelParagraph,
                        context: FormatContentModelContext
                    ) => {
                        const result = keyboardListTrigger(
                            inputModel(testBullet),
                            paragraph,
                            context,
                            options!.autoBullet,
                            options!.autoNumbering
                        );
                        expect(result).toBe(expectResult);
                        formatOptions.apiName = result ? 'autoToggleList' : '';
                        return result;
                    }
                );
                expect(options).toEqual({
                    changeSource: 'AutoFormat',
                    apiName: formatOptions.apiName,
                });
                expect(triggerEventSpy).toHaveBeenCalledWith('contentChanged', {
                    source: 'AutoFormat',
                    formatApiName: formatOptions.apiName,
                });
            });
        }

        it('should trigger keyboardListTrigger', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', defaultPrevented: false, inputType: 'insertText' } as any,
            };
            runTest(event, true, true, {
                autoBullet: true,
                autoNumbering: true,
            });
        });

        it('should not trigger keyboardListTrigger', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: '*', defaultPrevented: false, inputType: 'insertText' } as any,
            };
            runTest(event, true, false, {
                autoBullet: true,
                autoNumbering: true,
            });
        });

        it('should not trigger keyboardListTrigger', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', defaultPrevented: false, inputType: 'insertText' } as any,
            };
            runTest(event, false, false, { autoBullet: false, autoNumbering: false });
        });

        it('should trigger keyboardListTrigger with auto bullet only', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', defaultPrevented: false, inputType: 'insertText' } as any,
            };
            runTest(event, true, false, { autoBullet: true, autoNumbering: false });
        });

        it('should trigger keyboardListTrigger with auto numbering only', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', defaultPrevented: false, inputType: 'insertText' } as any,
            };
            runTest(event, false, true, { autoBullet: false, autoNumbering: true });
        });

        it('should not trigger keyboardListTrigger if the input type is different from insertText', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { key: ' ', defaultPrevented: false, inputType: 'test' } as any,
            };
            runTest(event, true, false, { autoBullet: true, autoNumbering: true });
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
            options?: {
                autoLink: boolean;
            }
        ) {
            const plugin = new AutoFormatPlugin(options as AutoFormatOptions);
            plugin.initialize(editor);

            plugin.onPluginEvent(event);

            if (shouldCallTrigger) {
                expect(createLinkSpy).toHaveBeenCalledWith(editor);
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
            });
        });

        it('should not  call createLink - autolink disabled', () => {
            const event: ContentChangedEvent = {
                eventType: 'contentChanged',
                source: 'Paste',
            };
            runTest(event, false, { autoLink: false });
        });

        it('should not  call createLink - not paste', () => {
            const event: ContentChangedEvent = {
                eventType: 'contentChanged',
                source: 'Format',
            };
            runTest(event, false, {
                autoLink: true,
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

    describe('onPluginEvent - createLinkAfterSpace', () => {
        function runTest(
            event: EditorInputEvent,
            expectResult: boolean,
            options: AutoFormatOptions
        ) {
            const plugin = new AutoFormatPlugin(options as AutoFormatOptions);
            plugin.initialize(editor);

            const segment: ContentModelText = {
                segmentType: 'Text',
                text: 'www.test.com',
                format: {},
            };
            const formatOptions = {
                changeSource: '',
            };

            plugin.onPluginEvent(event);
            formatTextSegmentBeforeSelectionMarkerSpy.and.callFake((editor, callback) => {
                expect(callback).toBe(
                    editor,
                    (
                        _model: ContentModelDocument,
                        _previousSegment: ContentModelText,
                        paragraph: ContentModelParagraph,
                        context: FormatContentModelContext
                    ) => {
                        const result =
                            options &&
                            options.autoLink &&
                            createLinkAfterSpace(segment, paragraph, context);

                        expect(result).toBe(expectResult);

                        formatOptions.changeSource = result ? ChangeSource.AutoLink : '';
                        return result;
                    }
                );
            });
        }

        it('should call createLinkAfterSpace', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', preventDefault: () => {}, inputType: 'insertText' } as any,
            };
            runTest(event, true, {
                autoLink: true,
            });
        });

        it('should not call createLinkAfterSpace - disable options', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', preventDefault: () => {}, inputType: 'insertText' } as any,
            };
            runTest(event, false, {
                autoLink: false,
            });
        });

        it('should not call createLinkAfterSpace - not space', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: {
                    data: 'Backspace',
                    preventDefault: () => {},
                    inputType: 'insertText',
                } as any,
            };
            runTest(event, false, {
                autoLink: true,
            });
        });
    });

    describe('onPluginEvent - transformHyphen', () => {
        function runTest(
            event: EditorInputEvent,
            expectedResult: boolean,
            options?: AutoFormatOptions
        ) {
            const plugin = new AutoFormatPlugin(options);
            plugin.initialize(editor);
            plugin.onPluginEvent(event);
            const formatOption = {
                apiName: '',
            };
            const segment: ContentModelText = {
                segmentType: 'Text',
                text: 'test--test',
                format: {},
            };
            formatTextSegmentBeforeSelectionMarkerSpy.and.callFake((editor, callback, options) => {
                expect(callback).toBe(
                    editor,
                    (
                        _model: ContentModelDocument,
                        _previousSegment: ContentModelText,
                        paragraph: ContentModelParagraph,
                        context: FormatContentModelContext
                    ) => {
                        let result = false;

                        if (options && options.autoHyphen) {
                            result = transformHyphen(segment, paragraph, context);
                        }
                        expect(result).toBe(expectedResult);
                        formatOption.apiName = result ? 'autoHyphen' : '';
                        return result;
                    }
                );
                expect(options).toEqual({
                    changeSource: 'AutoFormat',
                    apiName: formatOption.apiName,
                });
                expect(triggerEventSpy).toHaveBeenCalledWith('contentChanged', {
                    source: 'AutoFormat',
                    formatApiName: formatOption.apiName,
                });
            });
        }

        it('should call transformHyphen', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', preventDefault: () => {}, inputType: 'insertText' } as any,
            };
            runTest(event, true, {
                autoHyphen: true,
            });
        });

        it('should not call transformHyphen - disable options', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', preventDefault: () => {}, inputType: 'insertText' } as any,
            };
            runTest(event, false, {
                autoHyphen: false,
            });
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
            runTest(event, false, {
                autoHyphen: true,
            });
        });
    });

    describe('onPluginEvent - transformFraction', () => {
        function runTest(
            event: EditorInputEvent,
            expectResult: boolean,
            options?: AutoFormatOptions
        ) {
            const plugin = new AutoFormatPlugin(options);
            plugin.initialize(editor);
            plugin.onPluginEvent(event);
            const formatOption = {
                apiName: '',
            };

            const segment: ContentModelText = {
                segmentType: 'Text',
                text: '1/2',
                format: {},
            };

            formatTextSegmentBeforeSelectionMarkerSpy.and.callFake((editor, callback, options) => {
                expect(callback).toBe(
                    editor,
                    (
                        _model: ContentModelDocument,
                        _previousSegment: ContentModelText,
                        paragraph: ContentModelParagraph,
                        context: FormatContentModelContext
                    ) => {
                        let result = false;

                        if (options && options.autoHyphen) {
                            result = transformFraction(segment, paragraph, context);
                        }
                        expect(result).toBe(expectResult);
                        formatOption.apiName = '';
                        return result;
                    }
                );
                expect(options).toEqual({
                    changeSource: 'AutoFormat',
                    apiName: formatOption.apiName,
                });

                expect(triggerEventSpy).toHaveBeenCalledWith('contentChanged', {
                    source: 'AutoFormat',
                    formatApiName: formatOption.apiName,
                });
            });
        }

        it('should call transformFraction', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', preventDefault: () => {}, inputType: 'insertText' } as any,
            };
            runTest(event, true, {
                autoFraction: true,
            });
        });

        it('should not call transformHyphen - disable options', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', preventDefault: () => {}, inputType: 'insertText' } as any,
            };
            runTest(event, false, {
                autoFraction: false,
            });
        });
    });

    describe('onPluginEvent - transformOrdinals', () => {
        function runTest(
            event: EditorInputEvent,
            expectResult: boolean,
            options?: AutoFormatOptions
        ) {
            const plugin = new AutoFormatPlugin(options);
            plugin.initialize(editor);
            plugin.onPluginEvent(event);
            const formatOption = {
                apiName: '',
            };

            const segment: ContentModelText = {
                segmentType: 'Text',
                text: '1st',
                format: {},
            };

            formatTextSegmentBeforeSelectionMarkerSpy.and.callFake((editor, callback, options) => {
                expect(callback).toBe(
                    editor,
                    (
                        _model: ContentModelDocument,
                        _previousSegment: ContentModelText,
                        paragraph: ContentModelParagraph,
                        context: FormatContentModelContext
                    ) => {
                        let result = false;

                        if (options && options.autoHyphen) {
                            result = transformOrdinals(segment, paragraph, context);
                        }
                        expect(result).toBe(expectResult);
                        formatOption.apiName = '';
                        return result;
                    }
                );
                expect(options).toEqual({
                    changeSource: 'AutoFormat',
                    apiName: formatOption.apiName,
                });

                expect(triggerEventSpy).toHaveBeenCalledWith('contentChanged', {
                    source: 'AutoFormat',
                    formatApiName: formatOption.apiName,
                });
            });
        }

        it('should call transformOrdinals', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', preventDefault: () => {}, inputType: 'insertText' } as any,
            };
            runTest(event, true, {
                autoOrdinals: true,
            });
        });

        it('should not call transformOrdinals - disable options', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', preventDefault: () => {}, inputType: 'insertText' } as any,
            };
            runTest(event, false, {
                autoOrdinals: false,
            });
        });
    });
});
