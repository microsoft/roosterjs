import * as formatTextSegmentBeforeSelectionMarker from 'roosterjs-content-model-api/lib/publicApi/utils/formatTextSegmentBeforeSelectionMarker';
import { ContentModelText, EditorInputEvent, IEditor } from 'roosterjs-content-model-types';
import { CustomReplace, CustomReplacePlugin } from '../../lib/customReplace/CustomReplacePlugin';

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
    let triggerEventSpy: jasmine.Spy;
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
            triggerEvent: triggerEventSpy,
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
                data: ':)',
            } as any,
        });

        expect(formatTextSegmentBeforeSelectionMarkerSpy).toHaveBeenCalledWith(
            editor,
            (_model, previousSegment, paragraph, _markerFormat, context) => {
                return true;
            }
        );
    });

    it('replaceEmojis not should replace the text with emoji', () => {
        customReplacePlugin.onPluginEvent({
            eventType: 'input',
            rawEvent: {
                inputType: 'insertText',
                data: ':(',
            } as any,
        });

        expect(formatTextSegmentBeforeSelectionMarkerSpy).toHaveBeenCalledWith(
            editor,
            (_model, previousSegment, paragraph, _markerFormat, context) => {
                return false;
            }
        );
    });
});
