import { AutoDirectionPlugin } from '../../lib/autoDirection/AutoDirectionPlugin';
import type {
    ContentModelDocument,
    FormatContentModelOptions,
    IEditor,
    PluginEvent,
} from 'roosterjs-content-model-types';

describe('AutoDirectionPlugin', () => {
    let editor: IEditor;
    let formatContentModelSpy: jasmine.Spy;
    let plugin: AutoDirectionPlugin;

    beforeEach(() => {
        formatContentModelSpy = jasmine.createSpy('formatContentModel');
        editor = ({ formatContentModel: formatContentModelSpy } as any) as IEditor;
        plugin = new AutoDirectionPlugin();
        plugin.initialize(editor);
    });

    function runEvent(event: PluginEvent) {
        plugin.onPluginEvent(event);

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);

        const callback = formatContentModelSpy.calls.argsFor(0)[0];
        const options: FormatContentModelOptions = formatContentModelSpy.calls.argsFor(0)[1];
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'עברית',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                },
            ],
        };

        expect(callback(model)).toBeTrue();
        expect(model.blocks[0].format.direction).toBe('rtl');
        expect(options).toEqual({ apiName: 'autoDirection' });
    }

    it('updates direction after inserting text', () => {
        runEvent({
            eventType: 'input',
            rawEvent: { inputType: 'insertText' } as InputEvent,
        });
    });

    it('updates direction after composition ends', () => {
        runEvent({ eventType: 'compositionEnd', rawEvent: {} as CompositionEvent });
    });

    it('does not update direction for other input types', () => {
        plugin.onPluginEvent({
            eventType: 'input',
            rawEvent: { inputType: 'insertFromPaste' } as InputEvent,
        });

        expect(formatContentModelSpy).not.toHaveBeenCalled();
    });

    it('does not update direction after disposal', () => {
        plugin.dispose();
        plugin.onPluginEvent({
            eventType: 'input',
            rawEvent: { inputType: 'insertText' } as InputEvent,
        });

        expect(formatContentModelSpy).not.toHaveBeenCalled();
    });
});
