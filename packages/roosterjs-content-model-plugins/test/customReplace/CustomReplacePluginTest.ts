import * as formatTextSegmentBeforeSelectionMarker from 'roosterjs-content-model-api/lib/publicApi/utils/formatTextSegmentBeforeSelectionMarker';
import { CustomReplace, CustomReplacePlugin } from '../../lib/customReplace/CustomReplacePlugin';
import {
    ContentModelDocument,
    ContentModelParagraph,
    ContentModelSegmentFormat,
    ContentModelText,
    FormatContentModelContext,
    IEditor,
} from 'roosterjs-content-model-types';

function replaceEmojis(
    previousSegment: ContentModelText,
    stringToReplace: string,
    replacement: string
) {
    const { text } = previousSegment;
    if (text === stringToReplace) {
        previousSegment.text = text.replace(stringToReplace, replacement);
        return true;
    }
    return false;
}

describe('Content Model Custom Replace Plugin Test', () => {
    let editor: IEditor;
    let formatTextSegmentBeforeSelectionMarkerSpy: jasmine.Spy;
    let customReplacePlugin: CustomReplacePlugin;
    const customReplacements: CustomReplace[] = [
        {
            stringToReplace: ':)',
            replacementString: '😀',
            replacementHandler: replaceEmojis,
        },
        {
            stringToReplace: 'B)',
            replacementString: '😎',
            replacementHandler: replaceEmojis,
        },
    ];

    beforeEach(() => {
        formatTextSegmentBeforeSelectionMarkerSpy = spyOn(
            formatTextSegmentBeforeSelectionMarker,
            'formatTextSegmentBeforeSelectionMarker'
        );

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
        } as any) as IEditor;

        customReplacePlugin = new CustomReplacePlugin(customReplacements);

        customReplacePlugin.initialize(editor);
    });

    afterEach(() => {
        customReplacePlugin.dispose();
    });

    it('replaceEmojis should replace the text with emoji', () => {
        customReplacePlugin.onPluginEvent({
            eventType: 'input',
            rawEvent: {
                inputType: 'insertText',
                data: ':',
            } as any,
        });

        customReplacePlugin.onPluginEvent({
            eventType: 'input',
            rawEvent: {
                inputType: 'insertText',
                data: ')',
            } as any,
        });

        formatTextSegmentBeforeSelectionMarkerSpy.and.callFake((editor, callback) => {
            expect(callback).toBe(
                editor,
                (
                    _model: ContentModelDocument,
                    previousSegment: ContentModelText,
                    paragraph: ContentModelParagraph,
                    _markerFormat: ContentModelSegmentFormat,
                    context: FormatContentModelContext
                ) => {
                    const replaced = customReplacements.some(
                        ({ stringToReplace, replacementString, replacementHandler }) => {
                            return replacementHandler(
                                previousSegment,
                                stringToReplace,
                                replacementString,
                                paragraph
                            );
                        }
                    );
                    if (replaced) {
                        context.canUndoByBackspace = true;
                        return true;
                    }
                    return false;
                }
            );
        });
    });

    it('replaceEmojis not should replace the text with emoji', () => {
        customReplacePlugin.onPluginEvent({
            eventType: 'input',
            rawEvent: {
                inputType: 'insertText',
                data: '(',
            } as any,
        });
        expect(formatTextSegmentBeforeSelectionMarkerSpy).not.toHaveBeenCalled();
    });
});

describe('CustomReplacePlugin guard branches and replacement callback', () => {
    let editor: IEditor;
    let getDOMSelectionSpy: jasmine.Spy;
    let formatTextSegmentBeforeSelectionMarkerSpy: jasmine.Spy;
    let plugin: CustomReplacePlugin;

    const replacements: CustomReplace[] = [
        {
            stringToReplace: ':)',
            replacementString: '😀',
            replacementHandler: replaceEmojis,
        },
    ];

    function collapsedRangeSelection() {
        return {
            type: 'range',
            range: { collapsed: true },
        } as any;
    }

    function inputEvent(data: string | null, inputType: string = 'insertText'): any {
        return {
            eventType: 'input',
            rawEvent: {
                inputType,
                data,
            } as any,
        };
    }

    beforeEach(() => {
        formatTextSegmentBeforeSelectionMarkerSpy = spyOn(
            formatTextSegmentBeforeSelectionMarker,
            'formatTextSegmentBeforeSelectionMarker'
        );
        getDOMSelectionSpy = jasmine
            .createSpy('getDOMSelection')
            .and.returnValue(collapsedRangeSelection());

        editor = ({
            getDOMSelection: getDOMSelectionSpy,
            formatContentModel: () => {},
        } as any) as IEditor;
    });

    afterEach(() => {
        plugin?.dispose();
    });

    function createPlugin(rules: CustomReplace[] = replacements) {
        plugin = new CustomReplacePlugin(rules);
        plugin.initialize(editor);
        return plugin;
    }

    it('getName', () => {
        createPlugin();
        expect(plugin.getName()).toBe('CustomReplace');
    });

    it('does nothing for non-input events', () => {
        createPlugin();

        plugin.onPluginEvent({ eventType: 'keyDown', rawEvent: {} as any });

        expect(getDOMSelectionSpy).not.toHaveBeenCalled();
        expect(formatTextSegmentBeforeSelectionMarkerSpy).not.toHaveBeenCalled();
    });

    it('does nothing when editor is disposed', () => {
        createPlugin();
        plugin.dispose();

        plugin.onPluginEvent(inputEvent(')'));

        expect(getDOMSelectionSpy).not.toHaveBeenCalled();
        expect(formatTextSegmentBeforeSelectionMarkerSpy).not.toHaveBeenCalled();
    });

    it('does not replace when there are no custom replacements', () => {
        createPlugin([]);

        plugin.onPluginEvent(inputEvent(')'));

        expect(formatTextSegmentBeforeSelectionMarkerSpy).not.toHaveBeenCalled();
    });

    it('does not replace when inputType is not insertText', () => {
        createPlugin();

        plugin.onPluginEvent(inputEvent(')', 'deleteContentBackward'));

        expect(formatTextSegmentBeforeSelectionMarkerSpy).not.toHaveBeenCalled();
    });

    it('does not replace when there is no selection', () => {
        createPlugin();
        getDOMSelectionSpy.and.returnValue(null);

        plugin.onPluginEvent(inputEvent(')'));

        expect(formatTextSegmentBeforeSelectionMarkerSpy).not.toHaveBeenCalled();
    });

    it('does not replace when selection is not a range', () => {
        createPlugin();
        getDOMSelectionSpy.and.returnValue({ type: 'image' } as any);

        plugin.onPluginEvent(inputEvent(')'));

        expect(formatTextSegmentBeforeSelectionMarkerSpy).not.toHaveBeenCalled();
    });

    it('does not replace when range is not collapsed', () => {
        createPlugin();
        getDOMSelectionSpy.and.returnValue({
            type: 'range',
            range: { collapsed: false },
        } as any);

        plugin.onPluginEvent(inputEvent(')'));

        expect(formatTextSegmentBeforeSelectionMarkerSpy).not.toHaveBeenCalled();
    });

    it('does not replace when key data is empty', () => {
        createPlugin();

        plugin.onPluginEvent(inputEvent(null));

        expect(formatTextSegmentBeforeSelectionMarkerSpy).not.toHaveBeenCalled();
    });

    it('does not replace when the typed key is not a trigger key', () => {
        createPlugin();

        plugin.onPluginEvent(inputEvent('a'));

        expect(formatTextSegmentBeforeSelectionMarkerSpy).not.toHaveBeenCalled();
    });

    it('invokes formatTextSegmentBeforeSelectionMarker on a trigger key', () => {
        createPlugin();

        plugin.onPluginEvent(inputEvent(')'));

        expect(formatTextSegmentBeforeSelectionMarkerSpy).toHaveBeenCalledTimes(1);
        expect(formatTextSegmentBeforeSelectionMarkerSpy.calls.argsFor(0)[0]).toBe(editor);
    });

    it('callback replaces matching text and sets canUndoByBackspace', () => {
        createPlugin();

        plugin.onPluginEvent(inputEvent(')'));

        const callback = formatTextSegmentBeforeSelectionMarkerSpy.calls.argsFor(0)[1];
        const previousSegment = { text: ':)' } as ContentModelText;
        const paragraph = {} as ContentModelParagraph;
        const context = {} as FormatContentModelContext;

        const result = callback(
            {} as ContentModelDocument,
            previousSegment,
            paragraph,
            {} as ContentModelSegmentFormat,
            context
        );

        expect(result).toBe(true);
        expect(previousSegment.text).toBe('😀');
        expect(context.canUndoByBackspace).toBe(true);
    });

    it('callback returns false when no replacement matches', () => {
        createPlugin();

        plugin.onPluginEvent(inputEvent(')'));

        const callback = formatTextSegmentBeforeSelectionMarkerSpy.calls.argsFor(0)[1];
        const previousSegment = { text: 'no match' } as ContentModelText;
        const context = {} as FormatContentModelContext;

        const result = callback(
            {} as ContentModelDocument,
            previousSegment,
            {} as ContentModelParagraph,
            {} as ContentModelSegmentFormat,
            context
        );

        expect(result).toBe(false);
        expect(previousSegment.text).toBe('no match');
        expect(context.canUndoByBackspace).toBeUndefined();
    });
});
