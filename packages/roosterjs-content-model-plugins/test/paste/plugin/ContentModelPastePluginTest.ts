import * as addParser from '../../../lib/paste/utils/addParser';
import * as ExcelFile from '../../../lib/paste/Excel/processPastedContentFromExcel';
import * as getDocumentSource from '../../../lib/paste/pasteSourceValidations/getDocumentSource';
import * as oneNoteFile from '../../../lib/paste/oneNote/processPastedContentFromOneNote';
import * as PowerPointFile from '../../../lib/paste/PowerPoint/processPastedContentFromPowerPoint';
import * as setProcessor from '../../../lib/paste/utils/setProcessor';
import * as WacFile from '../../../lib/paste/WacComponents/processPastedContentWacComponents';
import { BeforePasteEvent, DOMCreator, IEditor } from 'roosterjs-content-model-types';
import { createDefaultDomToModelContext } from '../../TestHelper';
import { PastePlugin } from '../../../lib/paste/PastePlugin';
import { PastePropertyNames } from '../../../lib/paste/pasteSourceValidations/constants';

const trustedHTMLHandler = (val: string) => val;
const domCreator: DOMCreator = {
    htmlToDOM: (html: string) => new DOMParser().parseFromString(html, 'text/html'),
};
const DEFAULT_TIMES_ADD_PARSER_CALLED = 5;

describe('Content Model Paste Plugin Test', () => {
    let editor: IEditor;

    beforeEach(() => {
        editor = ({
            getTrustedHTMLHandler: () => trustedHTMLHandler,
            getDOMCreator: () => domCreator,
            getEnvironment: () => ({}),
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
                    types: [],
                },
                fragment: document.createDocumentFragment(),
                htmlBefore: '',
                htmlAfter: '',
                htmlAttributes: {},
                pasteType: 'normal',
                domToModelOption: createDefaultDomToModelContext(),
            };
        });

        it('WordDesktop', () => {
            spyOn(getDocumentSource, 'getDocumentSource').and.returnValue('wordDesktop');

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(addParser.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 7);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(2);
        });

        it('Excel | merge format', () => {
            spyOn(getDocumentSource, 'getDocumentSource').and.returnValue('excelDesktop');
            spyOn(ExcelFile, 'processPastedContentFromExcel').and.callThrough();

            (<any>event).pasteType = 'mergeFormat';
            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(ExcelFile.processPastedContentFromExcel).toHaveBeenCalledWith(
                event,
                domCreator,
                false /*allowExcelNoBorderTable*/,
                true
            );
            expect(addParser.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 3);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(2);
        });

        it('Excel | image', () => {
            spyOn(getDocumentSource, 'getDocumentSource').and.returnValue('excelDesktop');
            spyOn(ExcelFile, 'processPastedContentFromExcel').and.callThrough();

            (<any>event).pasteType = 'asImage';
            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(ExcelFile.processPastedContentFromExcel).not.toHaveBeenCalledWith(
                event,
                domCreator,
                false /* allowExcelNoBorderTable */,
                true /* isNativeEvent */
            );
            expect(addParser.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(1);
        });

        it('Excel', () => {
            spyOn(getDocumentSource, 'getDocumentSource').and.returnValue('excelDesktop');
            spyOn(ExcelFile, 'processPastedContentFromExcel').and.callThrough();

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(ExcelFile.processPastedContentFromExcel).toHaveBeenCalledWith(
                event,
                domCreator,
                false /* allowExcelNoBorderTable */,
                true /* isNativeEvent */
            );
            expect(addParser.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 1);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(2);
        });

        it('Excel Online', () => {
            spyOn(getDocumentSource, 'getDocumentSource').and.returnValue('excelOnline');
            spyOn(ExcelFile, 'processPastedContentFromExcel').and.callThrough();

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(ExcelFile.processPastedContentFromExcel).toHaveBeenCalledWith(
                event,
                domCreator,
                false /* allowExcelNoBorderTable */,
                true /* isNativeEvent */
            );
            expect(addParser.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 1);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(2);
        });

        it('Power Point', () => {
            spyOn(getDocumentSource, 'getDocumentSource').and.returnValue('powerPointDesktop');
            spyOn(PowerPointFile, 'processPastedContentFromPowerPoint').and.callThrough();

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(PowerPointFile.processPastedContentFromPowerPoint).toHaveBeenCalledWith(
                event,
                domCreator
            );
            expect(addParser.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 1);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(2);
        });

        it('Wac', () => {
            spyOn(getDocumentSource, 'getDocumentSource').and.returnValue('wacComponents');
            spyOn(WacFile, 'processPastedContentWacComponents').and.callThrough();

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(WacFile.processPastedContentWacComponents).toHaveBeenCalledWith(event);
            expect(addParser.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 7);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(3);
        });

        it('Default', () => {
            spyOn(getDocumentSource, 'getDocumentSource').and.returnValue('default');

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(addParser.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(1);
            expect(event.domToModelOption.additionalDisallowedTags.length).toEqual(0);
            expect(event.domToModelOption.additionalAllowedTags.length).toEqual(0);
            expect(Object.keys(event.domToModelOption.attributeSanitizers).length).toEqual(0);
            expect(Object.keys(event.domToModelOption.styleSanitizers).length).toEqual(4);
        });

        it('excelNonNativeEvent', () => {
            spyOn(getDocumentSource, 'getDocumentSource').and.returnValue('excelNonNativeEvent');
            spyOn(ExcelFile, 'processPastedContentFromExcel').and.callThrough();

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(ExcelFile.processPastedContentFromExcel).toHaveBeenCalledWith(
                event,
                domCreator,
                false /* allowExcelNoBorderTable */,
                false /* isNativeEvent */
            );
            expect(addParser.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 1);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(2);
        });

        it('Default with customized Sanitizing option', () => {
            spyOn(getDocumentSource, 'getDocumentSource').and.returnValue('default');

            plugin = new PastePlugin(undefined, {
                additionalAllowedTags: ['', '', ''],
                additionalDisallowedTags: ['', '', ''],
                attributeSanitizers: {
                    '1': true,
                    '2': true,
                },
                styleSanitizers: {
                    '1': true,
                    '2': true,
                },
            });

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(addParser.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(1);
            expect(event.domToModelOption.additionalDisallowedTags.length).toEqual(3);
            expect(event.domToModelOption.additionalAllowedTags.length).toEqual(3);
            expect(Object.keys(event.domToModelOption.attributeSanitizers).length).toEqual(2);
            expect(Object.keys(event.domToModelOption.styleSanitizers).length).toEqual(2);
        });

        it('Value set to undefined.', () => {
            spyOn(getDocumentSource, 'getDocumentSource').and.returnValue('default');

            plugin = new PastePlugin(undefined, undefined);

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(addParser.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(1);
            expect(event.domToModelOption.additionalDisallowedTags.length).toEqual(0);
            expect(event.domToModelOption.additionalAllowedTags.length).toEqual(0);
            expect(Object.keys(event.domToModelOption.attributeSanitizers).length).toEqual(0);
            expect(Object.keys(event.domToModelOption.styleSanitizers).length).toEqual(4);
        });

        it('Google Sheets', () => {
            spyOn(getDocumentSource, 'getDocumentSource').and.returnValue('googleSheets');

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(addParser.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(1);
            expect(event.domToModelOption.additionalAllowedTags).toEqual([
                PastePropertyNames.GOOGLE_SHEET_NODE_NAME as Lowercase<string>,
            ]);
        });

        it('One Note Desktop', () => {
            spyOn(getDocumentSource, 'getDocumentSource').and.returnValue('oneNoteDesktop');
            spyOn(oneNoteFile, 'processPastedContentFromOneNote').and.callThrough();

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(addParser.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(4);
            expect(oneNoteFile.processPastedContentFromOneNote).toHaveBeenCalledWith(event);
        });
    });
});
