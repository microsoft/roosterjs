import * as addParser from '../../../lib/editor/plugins/PastePlugin/utils/addParser';
import * as getPasteSource from 'roosterjs-editor-dom/lib/pasteSourceValidations/getPasteSource';
import * as WordDesktopFile from '../../../lib/editor/plugins/PastePlugin/WordDesktop/processPastedContentFromWordDesktop';
import ContentModelBeforePasteEvent from '../../../lib/publicTypes/event/ContentModelBeforePasteEvent';
import ContentModelPastePlugin from '../../../lib/editor/plugins/PastePlugin/ContentModelPastePlugin';
import deprecatedColorParser from '../../../lib/editor/plugins/PastePlugin/utils/deprecatedColorParser';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';
import { KnownPasteSourceType, PluginEventType } from 'roosterjs-editor-types';

describe('Paste', () => {
    let editor: IContentModelEditor;

    beforeEach(() => {
        editor = ({} as any) as IContentModelEditor;
    });

    let event: ContentModelBeforePasteEvent = <ContentModelBeforePasteEvent>(<any>{
        clipboardData: {},
        fragment: document.createDocumentFragment(),
        sanitizingOption: {
            elementCallbacks: {},
            attributeCallbacks: {},
            cssStyleCallbacks: {},
            additionalTagReplacements: {},
            additionalAllowedAttributes: [],
            additionalAllowedCssClasses: [],
            additionalDefaultStyleValues: {},
            additionalGlobalStyleNodes: [],
            additionalPredefinedCssForElement: {},
            preserveHtmlComments: false,
            unknownTagReplacement: null,
        },
        htmlBefore: '',
        htmlAfter: '',
        htmlAttributes: {},
        domToModelOption: {},
    });

    describe('onPluginEvent', () => {
        let plugin = new ContentModelPastePlugin();

        beforeEach(() => {
            plugin = new ContentModelPastePlugin();

            event = <ContentModelBeforePasteEvent>(<any>{
                eventType: PluginEventType.BeforePaste,
                domToModelOption: {},
                sanitizingOption: {
                    elementCallbacks: {},
                    attributeCallbacks: {},
                    cssStyleCallbacks: {},
                    additionalTagReplacements: {},
                    additionalAllowedAttributes: [],
                    additionalAllowedCssClasses: [],
                    additionalDefaultStyleValues: {},
                    additionalGlobalStyleNodes: [],
                    additionalPredefinedCssForElement: {},
                    preserveHtmlComments: false,
                    unknownTagReplacement: null,
                },
            });
        });

        it('WordDesktop', () => {
            spyOn(getPasteSource, 'default').and.returnValue(KnownPasteSourceType.WordDesktop);
            spyOn(WordDesktopFile, 'processPastedContentFromWordDesktop').and.callThrough();

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(WordDesktopFile.processPastedContentFromWordDesktop).toHaveBeenCalledWith(event);
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
            spyOn(WordDesktopFile, 'processPastedContentFromWordDesktop');
            spyOn(addParser, 'default').and.callThrough();

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(WordDesktopFile.processPastedContentFromWordDesktop).not.toHaveBeenCalled();
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
