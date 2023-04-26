import * as addParser from '../../../lib/editor/plugins/PastePlugin/utils/addParser';
import * as getPasteSource from 'roosterjs-editor-dom/lib/pasteSourceValidations/getPasteSource';
import * as WordDesktopFile from '../../../lib/editor/plugins/PastePlugin/WordDesktop/handleWordDesktopPaste';
import ContentModelPastePlugin from '../../../lib/editor/plugins/PastePlugin/ContentModelPastePlugin';
import deprecatedColorParser from '../../../lib/editor/plugins/PastePlugin/utils/deprecatedColorParser';
import { ContentModelBeforePasteEvent } from '../../../lib/publicTypes';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';
import { KnownPasteSourceType, PluginEventType } from 'roosterjs-editor-types';

describe('Paste', () => {
    let editor: IContentModelEditor;

    beforeEach(() => {
        editor = ({} as any) as IContentModelEditor;
    });

    let event: ContentModelBeforePasteEvent = <ContentModelBeforePasteEvent>{
        domToModelOption: {},
    };

    describe('onPluginEvent', () => {
        let plugin = new ContentModelPastePlugin();

        beforeEach(() => {
            plugin = new ContentModelPastePlugin();

            event = <ContentModelBeforePasteEvent>{
                eventType: PluginEventType.BeforePaste,
                domToModelOption: {},
                sanitizingOption: {
                    unknownTagReplacement: {},
                },
            };
        });

        it('WordDesktop', () => {
            spyOn(getPasteSource, 'default').and.returnValue(KnownPasteSourceType.WordDesktop);
            spyOn(WordDesktopFile, 'handleWordDesktop').and.callThrough();

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(WordDesktopFile.handleWordDesktop).toHaveBeenCalledWith(event);
            expect(event.domToModelOption.processorOverride?.element).toBe(
                WordDesktopFile.wordDesktopElementProcessor
            );
            expect(event.domToModelOption.additionalFormatParsers?.segment).toContain(
                deprecatedColorParser
            );
            expect(event.domToModelOption.additionalFormatParsers?.segmentOnBlock).toContain(
                deprecatedColorParser
            );
        });

        it('Default', () => {
            spyOn(getPasteSource, 'default').and.returnValue(KnownPasteSourceType.Default);
            spyOn(WordDesktopFile, 'handleWordDesktop');
            spyOn(addParser, 'default').and.callThrough();

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(WordDesktopFile.handleWordDesktop).not.toHaveBeenCalled();
            expect(event.domToModelOption.processorOverride?.element).toBeUndefined();
            expect(event.domToModelOption.additionalFormatParsers?.segment).toContain(
                deprecatedColorParser
            );
            expect(event.domToModelOption.additionalFormatParsers?.segmentOnBlock).toContain(
                deprecatedColorParser
            );
        });
    });
});
