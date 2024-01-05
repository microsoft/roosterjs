import * as addParser from '../../lib/paste/utils/addParser';
import * as ExcelFile from '../../lib/paste/Excel/processPastedContentFromExcel';
import * as getPasteSource from '../../lib/paste/pasteSourceValidations/getPasteSource';
import * as PowerPointFile from '../../lib/paste/PowerPoint/processPastedContentFromPowerPoint';
import * as setProcessor from '../../lib/paste/utils/setProcessor';
import * as WacFile from '../../lib/paste/WacComponents/processPastedContentWacComponents';
import { ContentModelBeforePasteEvent } from 'roosterjs-content-model-types';
import { ContentModelPastePlugin } from '../../lib/paste/ContentModelPastePlugin';
import { IContentModelEditor } from 'roosterjs-content-model-editor';
import { PastePropertyNames } from '../../lib/paste/pasteSourceValidations/constants';
import { PasteType, PluginEventType } from 'roosterjs-editor-types';

const trustedHTMLHandler = (val: string) => val;
const DEFAULT_TIMES_ADD_PARSER_CALLED = 5;

describe('Content Model Paste Plugin Test', () => {
    let editor: IContentModelEditor;

    beforeEach(() => {
        editor = ({
            getTrustedHTMLHandler: () => trustedHTMLHandler,
        } as any) as IContentModelEditor;
        spyOn(addParser, 'default').and.callThrough();
        spyOn(setProcessor, 'setProcessor').and.callThrough();
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
        domToModelOption: { additionalAllowedTags: [], additionalDisallowedTags: [] },
    });

    describe('onPluginEvent', () => {
        let plugin = new ContentModelPastePlugin();

        beforeEach(() => {
            plugin = new ContentModelPastePlugin();

            event = <ContentModelBeforePasteEvent>(<any>{
                eventType: PluginEventType.BeforePaste,
                domToModelOption: { additionalAllowedTags: [], additionalDisallowedTags: [] },
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

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(addParser.default).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 5);
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
                trustedHTMLHandler,
                undefined /*allowExcelNoBorderTable*/
            );
            expect(addParser.default).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 3);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(1);
        });

        it('Excel | image', () => {
            spyOn(getPasteSource, 'getPasteSource').and.returnValue('excelDesktop');
            spyOn(ExcelFile, 'processPastedContentFromExcel').and.callThrough();

            (<any>event).pasteType = PasteType.AsImage;
            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(ExcelFile.processPastedContentFromExcel).not.toHaveBeenCalledWith(
                event,
                trustedHTMLHandler,
                undefined /*allowExcelNoBorderTable*/
            );
            expect(addParser.default).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(0);
        });

        it('Excel', () => {
            spyOn(getPasteSource, 'getPasteSource').and.returnValue('excelDesktop');
            spyOn(ExcelFile, 'processPastedContentFromExcel').and.callThrough();

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(ExcelFile.processPastedContentFromExcel).toHaveBeenCalledWith(
                event,
                trustedHTMLHandler,
                undefined /*allowExcelNoBorderTable*/
            );
            expect(addParser.default).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 1);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(1);
        });

        it('Excel Online', () => {
            spyOn(getPasteSource, 'getPasteSource').and.returnValue('excelOnline');
            spyOn(ExcelFile, 'processPastedContentFromExcel').and.callThrough();

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(ExcelFile.processPastedContentFromExcel).toHaveBeenCalledWith(
                event,
                trustedHTMLHandler,
                undefined /*allowExcelNoBorderTable*/
            );
            expect(addParser.default).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 1);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(1);
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
        });

        it('Wac', () => {
            spyOn(getPasteSource, 'getPasteSource').and.returnValue('wacComponents');
            spyOn(WacFile, 'processPastedContentWacComponents').and.callThrough();

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(WacFile.processPastedContentWacComponents).toHaveBeenCalledWith(event);
            expect(addParser.default).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 6);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(4);
        });

        it('Default', () => {
            spyOn(getPasteSource, 'getPasteSource').and.returnValue('default');

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(addParser.default).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(0);
        });

        it('Google Sheets', () => {
            spyOn(getPasteSource, 'getPasteSource').and.returnValue('googleSheets');

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(addParser.default).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(0);
            expect(event.domToModelOption.additionalAllowedTags).toEqual([
                PastePropertyNames.GOOGLE_SHEET_NODE_NAME,
            ]);
        });
    });
});
