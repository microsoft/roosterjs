import * as addParser from '../../../lib/editor/plugins/PastePlugin/utils/addParser';
import * as chainSanitizerCallbackFile from 'roosterjs-editor-dom/lib/htmlSanitizer/chainSanitizerCallback';
import * as ExcelFile from '../../../lib/editor/plugins/PastePlugin/Excel/processPastedContentFromExcel';
import * as getPasteSource from '../../../lib/editor/plugins/PastePlugin/pasteSourceValidations/getPasteSource';
import * as PowerPointFile from '../../../lib/editor/plugins/PastePlugin/PowerPoint/processPastedContentFromPowerPoint';
import * as setProcessor from '../../../lib/editor/plugins/PastePlugin/utils/setProcessor';
import * as WacFile from '../../../lib/editor/plugins/PastePlugin/WacComponents/processPastedContentWacComponents';
import * as WordDesktopFile from '../../../lib/editor/plugins/PastePlugin/WordDesktop/processPastedContentFromWordDesktop';
import BeforePasteEvent from '../../../lib/publicTypes/event/BeforePasteEvent';
import ContentModelPastePlugin from '../../../lib/editor/plugins/PastePlugin/ContentModelPastePlugin';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';
import { PastePropertyNames } from '../../../lib/editor/plugins/PastePlugin/pasteSourceValidations/constants';
import { PasteType, PluginEventType } from 'roosterjs-editor-types';

const trustedHTMLHandler = <any>'mock';
const DEFAULT_TIMES_ADD_PARSER_CALLED = 4;

describe('Content Model Paste Plugin Test', () => {
    let editor: IContentModelEditor;

    beforeEach(() => {
        editor = ({
            getTrustedHTMLHandler: () => trustedHTMLHandler,
        } as any) as IContentModelEditor;
        spyOn(addParser, 'default').and.callThrough();
        spyOn(chainSanitizerCallbackFile, 'default').and.callThrough();
        spyOn(setProcessor, 'setProcessor').and.callThrough();
    });

    let event: BeforePasteEvent = <BeforePasteEvent>(<any>{
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

            event = <BeforePasteEvent>(<any>{
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
                pasteType: PasteType.Normal,
                clipboardData: <any>{
                    html: '',
                },
                fragment: document.createDocumentFragment(),
            });
        });

        it('WordDesktop', () => {
            spyOn(getPasteSource, 'getPasteSource').and.returnValue('wordDesktop');
            spyOn(WordDesktopFile, 'processPastedContentFromWordDesktop').and.callThrough();

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(WordDesktopFile.processPastedContentFromWordDesktop).toHaveBeenCalledWith(event);
            expect(event.domToModelOption.processorOverride?.element).toBe(
                WordDesktopFile.wordDesktopElementProcessor
            );
            expect(addParser.default).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 3);
            expect(chainSanitizerCallbackFile.default).toHaveBeenCalledTimes(3);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(1);
        });

        it('Excel | merge format', () => {
            spyOn(getPasteSource, 'getPasteSource').and.returnValue('excelDesktop');
            spyOn(ExcelFile, 'processPastedContentFromExcel').and.callThrough();

            (<any>event).pasteType = PasteType.MergeFormat;
            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(ExcelFile.processPastedContentFromExcel).toHaveBeenCalledWith(
                event,
                trustedHTMLHandler
            );
            expect(addParser.default).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 3);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(1);
            expect(chainSanitizerCallbackFile.default).toHaveBeenCalledTimes(1);
        });

        it('Excel | image', () => {
            spyOn(getPasteSource, 'getPasteSource').and.returnValue('excelDesktop');
            spyOn(ExcelFile, 'processPastedContentFromExcel').and.callThrough();

            (<any>event).pasteType = PasteType.AsImage;
            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(ExcelFile.processPastedContentFromExcel).not.toHaveBeenCalledWith(
                event,
                trustedHTMLHandler
            );
            expect(addParser.default).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED);
            expect(chainSanitizerCallbackFile.default).toHaveBeenCalledTimes(1);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(0);
        });

        it('Excel', () => {
            spyOn(getPasteSource, 'getPasteSource').and.returnValue('excelDesktop');
            spyOn(ExcelFile, 'processPastedContentFromExcel').and.callThrough();

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(ExcelFile.processPastedContentFromExcel).toHaveBeenCalledWith(
                event,
                trustedHTMLHandler
            );
            expect(addParser.default).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 1);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(1);
            expect(chainSanitizerCallbackFile.default).toHaveBeenCalledTimes(1);
        });

        it('Excel Online', () => {
            spyOn(getPasteSource, 'getPasteSource').and.returnValue('excelOnline');
            spyOn(ExcelFile, 'processPastedContentFromExcel').and.callThrough();

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(ExcelFile.processPastedContentFromExcel).toHaveBeenCalledWith(
                event,
                trustedHTMLHandler
            );
            expect(addParser.default).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 1);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(1);
            expect(chainSanitizerCallbackFile.default).toHaveBeenCalledTimes(1);
        });

        it('Power Point', () => {
            spyOn(getPasteSource, 'getPasteSource').and.returnValue('powerPointDesktop');
            spyOn(PowerPointFile, 'processPastedContentFromPowerPoint').and.callThrough();

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(PowerPointFile.processPastedContentFromPowerPoint).toHaveBeenCalledWith(
                event,
                trustedHTMLHandler
            );
            expect(addParser.default).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(0);
            expect(chainSanitizerCallbackFile.default).toHaveBeenCalledTimes(1);
        });

        it('Wac', () => {
            spyOn(getPasteSource, 'getPasteSource').and.returnValue('wacComponents');
            spyOn(WacFile, 'processPastedContentWacComponents').and.callThrough();

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(WacFile.processPastedContentWacComponents).toHaveBeenCalledWith(event);
            expect(addParser.default).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 4);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(4);
            expect(chainSanitizerCallbackFile.default).toHaveBeenCalledTimes(1);
        });

        it('Default', () => {
            spyOn(getPasteSource, 'getPasteSource').and.returnValue('default');

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(addParser.default).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(0);
            expect(chainSanitizerCallbackFile.default).toHaveBeenCalledTimes(1);
        });

        it('Google Sheets', () => {
            spyOn(getPasteSource, 'getPasteSource').and.returnValue('googleSheets');

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(addParser.default).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(0);
            expect(chainSanitizerCallbackFile.default).toHaveBeenCalledTimes(1);
            expect(
                event.sanitizingOption.additionalTagReplacements[
                    PastePropertyNames.GOOGLE_SHEET_NODE_NAME
                ]
            ).toEqual('*');
        });
    });
});
