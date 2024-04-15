import * as formatTextSegmentBeforeSelectionMarker from 'roosterjs-content-model-api/lib/publicApi/utils/formatTextSegmentBeforeSelectionMarker';
import { PickerPlugin } from '../../lib/picker/PickerPlugin';
import {
    PickerDirection,
    PickerHandler,
    PickerSelectionChangMode,
} from '../../lib/picker/PickerHandler';
import {
    ContentModelSegment,
    IEditor,
    KeyDownEvent,
    ContentModelParagraph,
} from 'roosterjs-content-model-types';

describe('PickerPlugin', () => {
    let mockedHandler: PickerHandler;
    let onInitializeSpy: jasmine.Spy;
    let getDOMSelectionSpy: jasmine.Spy;
    let onTriggerSpy: jasmine.Spy;
    let onClosePickerSpy: jasmine.Spy;
    let onQueryStringChangedSpy: jasmine.Spy;
    let isRightToLeftSpy: jasmine.Spy;
    let mockedEditor: IEditor;
    let mockedSegment: ContentModelSegment;
    let mockedParagraph: ContentModelParagraph;

    beforeEach(() => {
        onInitializeSpy = jasmine.createSpy('onInitialize');
        getDOMSelectionSpy = jasmine.createSpy('getDOMSelection').and.returnValue({
            type: 'range',
            range: document.createRange(),
        });
        onTriggerSpy = jasmine.createSpy('onTrigger');
        onQueryStringChangedSpy = jasmine.createSpy('onQueryStringChanged');
        onClosePickerSpy = jasmine.createSpy('onClosePicker');
        isRightToLeftSpy = jasmine.createSpy('isRightToLeft').and.returnValue(false);

        spyOn(
            formatTextSegmentBeforeSelectionMarker,
            'formatTextSegmentBeforeSelectionMarker'
        ).and.callFake((_: IEditor, callback: Function) => {
            const result = callback(null!, mockedSegment, mockedParagraph);

            expect(result).toBeFalse();

            return true;
        });

        mockedHandler = {
            onInitialize: onInitializeSpy,
            onTrigger: onTriggerSpy,
            onQueryStringChanged: onQueryStringChangedSpy,
            onClosePicker: onClosePickerSpy,
        } as any;

        mockedEditor = {
            getEnvironment: () => ({}),
            getDOMSelection: getDOMSelectionSpy,
            getDOMHelper: () => ({
                isRightToLeft: isRightToLeftSpy,
            }),
        } as any;
        mockedSegment = {
            segmentType: 'Text',
            text: '@',
            format: {},
        };
        mockedParagraph = {
            blockType: 'Paragraph',
            format: {},
            segments: [mockedSegment],
        };
    });

    it('willHandleEventExclusively', () => {
        const plugin = new PickerPlugin('@', mockedHandler);

        plugin.initialize(mockedEditor);

        const event: KeyDownEvent = {
            eventType: 'keyDown',
            rawEvent: {
                key: 'ArrowUp',
            } as any,
        };

        expect(plugin.willHandleEventExclusively(event)).toBeFalse();

        onTriggerSpy.and.returnValue('both');

        plugin.onPluginEvent({
            eventType: 'input',
            rawEvent: {
                inputType: 'insertText',
                data: '@',
            } as any,
        });

        expect(plugin.willHandleEventExclusively(event)).toBeTrue();
        expect(
            plugin.willHandleEventExclusively({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'a',
                } as any,
            })
        ).toBeFalse();
    });

    it('content changed event', () => {
        const plugin = new PickerPlugin('@', mockedHandler);

        plugin.initialize(mockedEditor);

        onTriggerSpy.and.returnValue('both');

        // Not suggesting
        plugin.onPluginEvent({
            eventType: 'contentChanged',
            source: 'Test',
        });

        expect(onQueryStringChangedSpy).toHaveBeenCalledTimes(0);

        plugin.onPluginEvent({
            eventType: 'input',
            rawEvent: {
                inputType: 'insertText',
                data: '@',
            } as any,
        });

        // Suggesting
        plugin.onPluginEvent({
            eventType: 'contentChanged',
            source: 'Test',
        });

        expect(onQueryStringChangedSpy).toHaveBeenCalledTimes(1);
        expect(onQueryStringChangedSpy).toHaveBeenCalledWith('@');
        expect(onClosePickerSpy).not.toHaveBeenCalled();

        plugin.onPluginEvent({
            eventType: 'contentChanged',
            source: 'SetContent',
        });

        expect(onQueryStringChangedSpy).toHaveBeenCalledTimes(1);
        expect(onClosePickerSpy).toHaveBeenCalledTimes(1);
    });

    describe('keyDown', () => {
        it('not suggesting', () => {
            const plugin = new PickerPlugin('@', mockedHandler);

            plugin.initialize(mockedEditor);

            const preventDefaultSpy = jasmine.createSpy('preventDefault');
            const onSelectionChangedSpy = jasmine.createSpy('onSelectionChanged');

            mockedHandler.onSelectionChanged = onSelectionChangedSpy;

            // Not suggesting
            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'PageUp',
                    preventDefault: preventDefaultSpy,
                } as any,
            });

            expect(onSelectionChangedSpy).not.toHaveBeenCalled();
            expect(preventDefaultSpy).not.toHaveBeenCalled();
        });

        function runTest(
            dir: PickerDirection,
            ctrl: boolean,
            key: string,
            expectedMode: PickerSelectionChangMode | null
        ) {
            const plugin = new PickerPlugin('@', mockedHandler);
            const onSelectionChangedSpy = jasmine.createSpy('onSelectionChanged');
            const onSelectSpy = jasmine.createSpy('onSelect');

            mockedHandler.onSelectionChanged = onSelectionChangedSpy;
            mockedHandler.onSelect = onSelectSpy;

            plugin.initialize(mockedEditor);

            const preventDefaultSpy = jasmine.createSpy('preventDefault');

            onTriggerSpy.and.returnValue(dir);
            plugin.onPluginEvent({
                eventType: 'input',
                rawEvent: {
                    inputType: 'insertText',
                    data: '@',
                } as any,
            });

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent: {
                    key,
                    preventDefault: preventDefaultSpy,
                    ctrlKey: ctrl,
                } as any,
            });

            if (expectedMode) {
                expect(onSelectionChangedSpy).toHaveBeenCalledTimes(1);
                expect(onSelectionChangedSpy).toHaveBeenCalledWith(expectedMode);
            } else {
                expect(onSelectionChangedSpy).not.toHaveBeenCalled();
            }

            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
            expect(onSelectSpy).not.toHaveBeenCalled();
        }

        it('Suggesting: horizontal, LTR', () => {
            runTest('horizontal', false, 'ArrowLeft', 'previous');
            runTest('horizontal', false, 'ArrowRight', 'next');
            runTest('horizontal', false, 'ArrowUp', null);
            runTest('horizontal', false, 'ArrowDown', null);
            runTest('horizontal', false, 'PageUp', 'previousPage');
            runTest('horizontal', false, 'PageDown', 'nextPage');
            runTest('horizontal', false, 'Home', 'firstInRow');
            runTest('horizontal', false, 'End', 'lastInRow');
            runTest('horizontal', true, 'Home', 'first');
            runTest('horizontal', true, 'End', 'last');
        });

        it('Suggesting: horizontal, RTL', () => {
            isRightToLeftSpy.and.returnValue(true);

            runTest('horizontal', false, 'ArrowLeft', 'next');
            runTest('horizontal', false, 'ArrowRight', 'previous');
            runTest('horizontal', false, 'ArrowUp', null);
            runTest('horizontal', false, 'ArrowDown', null);
            runTest('horizontal', false, 'PageUp', 'previousPage');
            runTest('horizontal', false, 'PageDown', 'nextPage');
            runTest('horizontal', false, 'Home', 'firstInRow');
            runTest('horizontal', false, 'End', 'lastInRow');
            runTest('horizontal', true, 'Home', 'first');
            runTest('horizontal', true, 'End', 'last');
        });

        it('Suggesting: both, LTR', () => {
            runTest('both', false, 'ArrowLeft', 'previous');
            runTest('both', false, 'ArrowRight', 'next');
            runTest('both', false, 'ArrowUp', 'previousRow');
            runTest('both', false, 'ArrowDown', 'nextRow');
            runTest('both', false, 'PageUp', 'previousPage');
            runTest('both', false, 'PageDown', 'nextPage');
            runTest('both', false, 'Home', 'firstInRow');
            runTest('both', false, 'End', 'lastInRow');
            runTest('both', true, 'Home', 'first');
            runTest('both', true, 'End', 'last');
        });

        it('Suggesting: both, RTL', () => {
            isRightToLeftSpy.and.returnValue(true);

            runTest('both', false, 'ArrowLeft', 'next');
            runTest('both', false, 'ArrowRight', 'previous');
            runTest('both', false, 'ArrowUp', 'previousRow');
            runTest('both', false, 'ArrowDown', 'nextRow');
            runTest('both', false, 'PageUp', 'previousPage');
            runTest('both', false, 'PageDown', 'nextPage');
            runTest('both', false, 'Home', 'firstInRow');
            runTest('both', false, 'End', 'lastInRow');
            runTest('both', true, 'Home', 'first');
            runTest('both', true, 'End', 'last');
        });

        it('Suggesting: vertical', () => {
            runTest('vertical', false, 'ArrowLeft', null);
            runTest('vertical', false, 'ArrowRight', null);
            runTest('vertical', false, 'ArrowUp', 'previous');
            runTest('vertical', false, 'ArrowDown', 'next');
            runTest('vertical', false, 'PageUp', 'previousPage');
            runTest('vertical', false, 'PageDown', 'nextPage');
            runTest('vertical', false, 'Home', 'firstInRow');
            runTest('vertical', false, 'End', 'lastInRow');
            runTest('vertical', true, 'Home', 'first');
            runTest('vertical', true, 'End', 'last');
        });

        it('Suggesting: ESCAPE', () => {
            const plugin = new PickerPlugin('@', mockedHandler);
            const onSelectionChangedSpy = jasmine.createSpy('onSelectionChanged');

            mockedHandler.onSelectionChanged = onSelectionChangedSpy;

            plugin.initialize(mockedEditor);

            const preventDefaultSpy = jasmine.createSpy('preventDefault');

            onTriggerSpy.and.returnValue('both');
            plugin.onPluginEvent({
                eventType: 'input',
                rawEvent: {
                    inputType: 'insertText',
                    data: '@',
                } as any,
            });

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'Escape',
                    preventDefault: preventDefaultSpy,
                } as any,
            });

            expect(onSelectionChangedSpy).not.toHaveBeenCalled();
            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
            expect(onClosePickerSpy).toHaveBeenCalledTimes(1);
        });

        it('Suggesting: ENTER', () => {
            const plugin = new PickerPlugin('@', mockedHandler);
            const onSelectionChangedSpy = jasmine.createSpy('onSelectionChanged');
            const onSelectSpy = jasmine.createSpy('onSelect');

            mockedHandler.onSelectionChanged = onSelectionChangedSpy;
            mockedHandler.onSelect = onSelectSpy;

            plugin.initialize(mockedEditor);

            const preventDefaultSpy = jasmine.createSpy('preventDefault');

            onTriggerSpy.and.returnValue('both');
            plugin.onPluginEvent({
                eventType: 'input',
                rawEvent: {
                    inputType: 'insertText',
                    data: '@',
                } as any,
            });

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent: {
                    key: 'Enter',
                    preventDefault: preventDefaultSpy,
                } as any,
            });

            expect(onSelectionChangedSpy).not.toHaveBeenCalled();
            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
            expect(onClosePickerSpy).toHaveBeenCalledTimes(0);
            expect(onSelectSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('input', () => {
        it('Not suggesting', () => {
            const plugin = new PickerPlugin('@', mockedHandler);

            plugin.initialize(mockedEditor);

            plugin.onPluginEvent({
                eventType: 'input',
                rawEvent: {
                    inputType: 'insertText',
                    data: '@',
                } as any,
            });

            expect(onQueryStringChangedSpy).toHaveBeenCalledTimes(0);
            expect(onClosePickerSpy).not.toHaveBeenCalled();
            expect(onTriggerSpy).toHaveBeenCalledWith('@', jasmine.anything());
        });

        it('Suggesting', () => {
            const plugin = new PickerPlugin('@', mockedHandler);

            plugin.initialize(mockedEditor);

            onTriggerSpy.and.returnValue('both');

            plugin.onPluginEvent({
                eventType: 'input',
                rawEvent: {
                    inputType: 'insertText',
                    data: '@',
                } as any,
            });

            // Suggesting
            plugin.onPluginEvent({
                eventType: 'input',
                rawEvent: {} as any,
            });

            expect(onQueryStringChangedSpy).toHaveBeenCalledTimes(1);
            expect(onQueryStringChangedSpy).toHaveBeenCalledWith('@');
            expect(onClosePickerSpy).not.toHaveBeenCalled();

            plugin.onPluginEvent({
                eventType: 'contentChanged',
                source: 'SetContent',
            });

            expect(onQueryStringChangedSpy).toHaveBeenCalledTimes(1);
            expect(onClosePickerSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('mouseup', () => {
        it('Not suggesting', () => {
            const plugin = new PickerPlugin('@', mockedHandler);

            plugin.initialize(mockedEditor);

            // Suggesting
            plugin.onPluginEvent({
                eventType: 'mouseUp',
                rawEvent: {} as any,
            });

            expect(onQueryStringChangedSpy).toHaveBeenCalledTimes(0);
            expect(onClosePickerSpy).not.toHaveBeenCalled();
        });

        it('Suggesting', () => {
            const plugin = new PickerPlugin('@', mockedHandler);

            plugin.initialize(mockedEditor);

            onTriggerSpy.and.returnValue('both');

            plugin.onPluginEvent({
                eventType: 'input',
                rawEvent: {
                    inputType: 'insertText',
                    data: '@',
                } as any,
            });

            // Suggesting
            plugin.onPluginEvent({
                eventType: 'mouseUp',
                rawEvent: {} as any,
            });

            expect(onQueryStringChangedSpy).toHaveBeenCalledTimes(0);
            expect(onClosePickerSpy).toHaveBeenCalledTimes(1);
        });
    });
});
