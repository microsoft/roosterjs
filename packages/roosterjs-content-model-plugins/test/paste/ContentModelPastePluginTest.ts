import * as addParser from '../../lib/paste/utils/addParser';
import * as ExcelFile from '../../lib/paste/Excel/processPastedContentFromExcel';
import * as getPasteSource from '../../lib/paste/pasteSourceValidations/getPasteSource';
import * as PowerPointFile from '../../lib/paste/PowerPoint/processPastedContentFromPowerPoint';
import * as setProcessor from '../../lib/paste/utils/setProcessor';
import * as WacFile from '../../lib/paste/WacComponents/processPastedContentWacComponents';
import { BeforePasteEvent, IEditor } from 'roosterjs-content-model-types';
import { PastePlugin } from '../../lib/paste/PastePlugin';
import { PastePropertyNames } from '../../lib/paste/pasteSourceValidations/constants';

const trustedHTMLHandler = (val: string) => val;
const DEFAULT_TIMES_ADD_PARSER_CALLED = 4;

describe('Content Model Paste Plugin Test', () => {
    let editor: IEditor;

    beforeEach(() => {
        editor = ({
            getTrustedHTMLHandler: () => trustedHTMLHandler,
        } as any) as IEditor;
        spyOn(addParser, 'addParser').and.callThrough();
        spyOn(setProcessor, 'setProcessor').and.callThrough();
    });

    let event: BeforePasteEvent;

    describe('onPluginEvent', () => {
        let plugin = new PastePlugin();

        beforeEach(() => {
            plugin = new PastePlugin();

            event = {
                eventType: 'beforePaste',
                clipboardData: <any>{
                    html: '',
                },
                fragment: document.createDocumentFragment(),
                htmlBefore: '',
                htmlAfter: '',
                htmlAttributes: {},
                pasteType: 'normal',
                domToModelOption: {
                    additionalAllowedTags: [],
                    additionalDisallowedTags: [],
                } as any,
            };
        });

        it('WordDesktop', () => {
            spyOn(getPasteSource, 'getPasteSource').and.returnValue('wordDesktop');

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(addParser.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 4);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(1);
        });

        it('Excel | merge format', () => {
            spyOn(getPasteSource, 'getPasteSource').and.returnValue('excelDesktop');
            spyOn(ExcelFile, 'processPastedContentFromExcel').and.callThrough();

            (<any>event).pasteType = 'mergeFormat';
            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(ExcelFile.processPastedContentFromExcel).toHaveBeenCalledWith(
                event,
                trustedHTMLHandler,
                undefined /*allowExcelNoBorderTable*/
            );
            expect(addParser.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 3);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(1);
        });

        it('Excel | image', () => {
            spyOn(getPasteSource, 'getPasteSource').and.returnValue('excelDesktop');
            spyOn(ExcelFile, 'processPastedContentFromExcel').and.callThrough();

            (<any>event).pasteType = 'asImage';
            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(ExcelFile.processPastedContentFromExcel).not.toHaveBeenCalledWith(
                event,
                trustedHTMLHandler,
                undefined /*allowExcelNoBorderTable*/
            );
            expect(addParser.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED);
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
            expect(addParser.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 1);
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
            expect(addParser.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 1);
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
            expect(addParser.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(0);
        });

        it('Wac', () => {
            spyOn(getPasteSource, 'getPasteSource').and.returnValue('wacComponents');
            spyOn(WacFile, 'processPastedContentWacComponents').and.callThrough();

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(WacFile.processPastedContentWacComponents).toHaveBeenCalledWith(event);
            expect(addParser.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 6);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(2);
        });

        it('Default', () => {
            spyOn(getPasteSource, 'getPasteSource').and.returnValue('default');

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(addParser.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(0);
        });

        it('Google Sheets', () => {
            spyOn(getPasteSource, 'getPasteSource').and.returnValue('googleSheets');

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(addParser.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(0);
            expect(event.domToModelOption.additionalAllowedTags).toEqual([
                PastePropertyNames.GOOGLE_SHEET_NODE_NAME as Lowercase<string>,
            ]);
        });
    });
});
