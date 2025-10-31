import * as updateHighlight from '../../lib/findReplace/utils/updateHighlight';
import { DOMHelper, IEditor } from 'roosterjs-content-model-types';
import { FindReplaceContext } from '../../lib/findReplace/types/FindReplaceContext';
import { FindReplacePlugin } from '../../lib/findReplace/FindReplacePlugin';

describe('FindReplacePlugin', () => {
    let mockedEditor: IEditor;
    let context: FindReplaceContext;
    let mockedDOMHelper: DOMHelper;

    let findHighlightHelperInitializeSpy: jasmine.Spy;
    let findHighlightHelperDisposeSpy: jasmine.Spy;
    let replaceHighlightHelperDisposeSpy: jasmine.Spy;
    let replaceHighlightHelperInitializeSpy: jasmine.Spy;

    let getDOMSelectionSpy: jasmine.Spy;
    let findClosestBlockElementSpy: jasmine.Spy;
    let isNodeInEditorSpy: jasmine.Spy;
    let updateHighlightSpy: jasmine.Spy;

    const mockedWindow = 'MockedWindow' as any;
    const range1 = 'RANGE1' as any;
    const range2 = 'RANGE2' as any;

    beforeEach(() => {
        findHighlightHelperInitializeSpy = jasmine.createSpy('initializeHighlightHelper');
        findHighlightHelperDisposeSpy = jasmine.createSpy('disposeHighlightHelper');
        replaceHighlightHelperInitializeSpy = jasmine.createSpy('initializeReplaceHighlightHelper');
        replaceHighlightHelperDisposeSpy = jasmine.createSpy('disposeReplaceHighlightHelper');
        updateHighlightSpy = spyOn(updateHighlight, 'updateHighlight');

        context = {
            findHighlight: {
                initialize: findHighlightHelperInitializeSpy,
                dispose: findHighlightHelperDisposeSpy,
            } as any,
            replaceHighlight: {
                dispose: replaceHighlightHelperDisposeSpy,
                initialize: replaceHighlightHelperInitializeSpy,
            } as any,
            text: null,
            matchCase: false,
            wholeWord: false,
            ranges: [],
            markedIndex: -1,
            scrollMargin: 20,
        };

        findClosestBlockElementSpy = jasmine.createSpy('findClosestBlockElement');
        isNodeInEditorSpy = jasmine.createSpy('isNodeInEditor').and.returnValue(true);

        mockedDOMHelper = {
            findClosestBlockElement: findClosestBlockElementSpy,
            isNodeInEditor: isNodeInEditorSpy,
        } as any;

        getDOMSelectionSpy = jasmine.createSpy('getDOMSelection');

        mockedEditor = {
            setEditorStyle: jasmine.createSpy('setEditorStyle'),
            getDocument: () => {
                return {
                    defaultView: mockedWindow,
                };
            },
            getDOMHelper: () => mockedDOMHelper,
            getDOMSelection: getDOMSelectionSpy,
        } as any;
    });

    describe('init and dispose', () => {
        it('should create an instance', () => {
            const plugin = new FindReplacePlugin(context);

            expect(plugin).toBeTruthy();
            expect(plugin.getName()).toBe('FindReplace');
        });

        it('initialize and dispose', () => {
            const plugin = new FindReplacePlugin(context);

            plugin.initialize(mockedEditor);

            expect(mockedEditor.setEditorStyle).toHaveBeenCalledTimes(2);
            expect(mockedEditor.setEditorStyle).toHaveBeenCalledWith(
                '_RoosterjsFindHighlight',
                'background-color: yellow;',
                ['::highlight(roostersFindHighlight)']
            );

            expect(mockedEditor.setEditorStyle).toHaveBeenCalledWith(
                '_RoosterjsReplaceHighlight',
                'background-color: orange;',
                ['::highlight(roostersReplaceHighlight)']
            );
            expect(findHighlightHelperInitializeSpy).toHaveBeenCalledWith(mockedWindow);
            expect(replaceHighlightHelperInitializeSpy).toHaveBeenCalledWith(mockedWindow);
            expect(findHighlightHelperDisposeSpy).not.toHaveBeenCalled();
            expect(replaceHighlightHelperDisposeSpy).not.toHaveBeenCalled();

            plugin.dispose();

            expect(mockedEditor.setEditorStyle).toHaveBeenCalledTimes(4);
            expect(mockedEditor.setEditorStyle).toHaveBeenCalledWith(
                '_RoosterjsFindHighlight',
                null /*cssRule*/
            );
            expect(mockedEditor.setEditorStyle).toHaveBeenCalledWith(
                '_RoosterjsReplaceHighlight',
                null /*cssRule*/
            );
            expect(findHighlightHelperDisposeSpy).toHaveBeenCalled();
            expect(replaceHighlightHelperDisposeSpy).toHaveBeenCalled();
        });
    });

    describe('onPluginEvent', () => {
        it('input event without current find', () => {
            const plugin = new FindReplacePlugin(context);

            plugin.initialize(mockedEditor);

            plugin.onPluginEvent({ eventType: 'input', rawEvent: {} as any });

            expect(updateHighlightSpy).not.toHaveBeenCalled();
        });

        it('input event with current find', () => {
            context.ranges = [range1, range2];
            context.text = 'test';

            const plugin = new FindReplacePlugin(context);

            plugin.initialize(mockedEditor);

            const mockedStartContainer = 'START_CONTAINER' as any;
            getDOMSelectionSpy.and.returnValue({
                type: 'range',
                range: {
                    startContainer: mockedStartContainer,
                } as any,
            });

            const mockedBlockElement = {
                contains: () => false,
            } as any;
            findClosestBlockElementSpy.and.returnValue(mockedBlockElement);

            plugin.onPluginEvent({ eventType: 'input', rawEvent: {} as any });

            expect(updateHighlightSpy).toHaveBeenCalledWith(
                mockedEditor,
                context,
                [mockedBlockElement],
                [mockedBlockElement]
            );
        });

        it('contentChanged event with current find, with content model', () => {
            context.ranges = [range1, range2];
            context.text = 'test';

            const plugin = new FindReplacePlugin(context);
            plugin.initialize(mockedEditor);

            plugin.onPluginEvent({ eventType: 'contentChanged', contentModel: {} } as any);

            expect(updateHighlightSpy).not.toHaveBeenCalled();
        });

        it('contentChanged event with current find, without content model, source=Replace', () => {
            context.ranges = [range1, range2];
            context.text = 'test';

            const plugin = new FindReplacePlugin(context);

            plugin.initialize(mockedEditor);

            plugin.onPluginEvent({ eventType: 'contentChanged', source: 'Replace' } as any);

            expect(updateHighlightSpy).not.toHaveBeenCalled();
        });

        it('contentChanged event with current find, without content model, source=Format', () => {
            context.ranges = [range1, range2];
            context.text = 'test';

            const plugin = new FindReplacePlugin(context);

            plugin.initialize(mockedEditor);

            plugin.onPluginEvent({ eventType: 'contentChanged', source: 'Format' } as any);

            expect(updateHighlightSpy).toHaveBeenCalledWith(mockedEditor, context);
        });

        it('rewriteFromModel event with current find', () => {
            context.ranges = [range1, range2];
            context.text = 'test';

            const plugin = new FindReplacePlugin(context);

            plugin.initialize(mockedEditor);

            const mockedBlockElement1 = 'Element1' as any;
            const mockedBlockElement2 = 'Element2' as any;

            plugin.onPluginEvent({
                eventType: 'rewriteFromModel',
                addedBlockElements: [mockedBlockElement2],
                removedBlockElements: [mockedBlockElement1],
            });

            expect(updateHighlightSpy).toHaveBeenCalledWith(
                mockedEditor,
                context,
                [mockedBlockElement2],
                [mockedBlockElement1]
            );
        });
    });
});
