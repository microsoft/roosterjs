import * as addParser from '../../../lib/paste/utils/addParser';
import * as ExcelFile from '../../../lib/paste/Excel/processPastedContentFromExcel';
import * as getPasteSource from '../../../lib/paste/pasteSourceValidations/getPasteSource';
import * as oneNoteFile from '../../../lib/paste/oneNote/processPastedContentFromOneNote';
import * as PowerPointFile from '../../../lib/paste/PowerPoint/processPastedContentFromPowerPoint';
import * as removeImageTransparency from '../../../lib/paste/utils/removeImageTransparency';
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
const DEFAULT_TIMES_ADD_PARSER_CALLED = 4;

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
            spyOn(getPasteSource, 'getPasteSource').and.returnValue('wordDesktop');

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(addParser.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 5);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(2);
        });

        it('Excel | merge format', () => {
            spyOn(getPasteSource, 'getPasteSource').and.returnValue('excelDesktop');
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
            spyOn(getPasteSource, 'getPasteSource').and.returnValue('excelDesktop');
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
            spyOn(getPasteSource, 'getPasteSource').and.returnValue('excelDesktop');
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
            spyOn(getPasteSource, 'getPasteSource').and.returnValue('excelOnline');
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
            spyOn(getPasteSource, 'getPasteSource').and.returnValue('powerPointDesktop');
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
            spyOn(getPasteSource, 'getPasteSource').and.returnValue('wacComponents');
            spyOn(WacFile, 'processPastedContentWacComponents').and.callThrough();

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(WacFile.processPastedContentWacComponents).toHaveBeenCalledWith(event);
            expect(addParser.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED + 7);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(3);
        });

        it('Default', () => {
            spyOn(getPasteSource, 'getPasteSource').and.returnValue('default');

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
            spyOn(getPasteSource, 'getPasteSource').and.returnValue('excelNonNativeEvent');
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
            spyOn(getPasteSource, 'getPasteSource').and.returnValue('default');

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
            spyOn(getPasteSource, 'getPasteSource').and.returnValue('default');

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
            spyOn(getPasteSource, 'getPasteSource').and.returnValue('googleSheets');

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(addParser.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(1);
            expect(event.domToModelOption.additionalAllowedTags).toEqual([
                PastePropertyNames.GOOGLE_SHEET_NODE_NAME as Lowercase<string>,
            ]);
        });

        it('One Note Desktop', () => {
            spyOn(getPasteSource, 'getPasteSource').and.returnValue('oneNoteDesktop');
            spyOn(oneNoteFile, 'processPastedContentFromOneNote').and.callThrough();

            plugin.initialize(editor);
            plugin.onPluginEvent(event);

            expect(addParser.addParser).toHaveBeenCalledTimes(DEFAULT_TIMES_ADD_PARSER_CALLED);
            expect(setProcessor.setProcessor).toHaveBeenCalledTimes(4);
            expect(oneNoteFile.processPastedContentFromOneNote).toHaveBeenCalledWith(event);
        });
    });

    describe('Image transparency removal integration', () => {
        function createTestEvent(
            chainOnNodeCreatedCallback?: (callback: any) => void
        ): BeforePasteEvent {
            return {
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
                chainOnNodeCreatedCallback: chainOnNodeCreatedCallback,
            };
        }

        it('should call setupImageTransparencyRemoval when plugin has removeTransparencyFromImages option enabled', () => {
            // Arrange
            const plugin = new PastePlugin(
                false,
                {
                    styleSanitizers: {},
                    additionalAllowedTags: [],
                    additionalDisallowedTags: [],
                    attributeSanitizers: {},
                },
                { removeTransparencyFromImages: true }
            );

            const chainOnNodeCreatedCallbackSpy = jasmine.createSpy('chainOnNodeCreatedCallback');
            const testEvent = createTestEvent(chainOnNodeCreatedCallbackSpy);

            // Spy on setupImageTransparencyRemoval to see if it's called
            spyOn(removeImageTransparency, 'setupImageTransparencyRemoval').and.callThrough();

            // Act
            plugin.initialize(editor);
            plugin.onPluginEvent(testEvent as any); // Cast to PluginEvent

            // Assert
            expect(removeImageTransparency.setupImageTransparencyRemoval).toHaveBeenCalledWith(
                { removeTransparencyFromImages: true },
                testEvent,
                editor
            );
            expect(chainOnNodeCreatedCallbackSpy).toHaveBeenCalledWith(jasmine.any(Function));
        });

        it('should not call setupImageTransparencyRemoval when plugin has removeTransparencyFromImages option disabled', () => {
            // Arrange
            const plugin = new PastePlugin(
                false,
                {
                    styleSanitizers: {},
                    additionalAllowedTags: [],
                    additionalDisallowedTags: [],
                    attributeSanitizers: {},
                },
                { removeTransparencyFromImages: false }
            );

            const chainOnNodeCreatedCallbackSpy = jasmine.createSpy('chainOnNodeCreatedCallback');
            const testEvent = createTestEvent(chainOnNodeCreatedCallbackSpy);

            spyOn(getPasteSource, 'getPasteSource').and.returnValue('default');

            // Act
            plugin.initialize(editor);
            plugin.onPluginEvent(testEvent as any);

            // Assert
            expect(chainOnNodeCreatedCallbackSpy).not.toHaveBeenCalled();
        });

        it('should apply image transparency removal for Word Desktop content', () => {
            // Arrange
            const plugin = new PastePlugin(
                false,
                {
                    styleSanitizers: {},
                    additionalAllowedTags: [],
                    additionalDisallowedTags: [],
                    attributeSanitizers: {},
                },
                { removeTransparencyFromImages: true }
            );

            const chainOnNodeCreatedCallbackSpy = jasmine.createSpy('chainOnNodeCreatedCallback');
            const testEvent = createTestEvent(chainOnNodeCreatedCallbackSpy);

            spyOn(getPasteSource, 'getPasteSource').and.returnValue('wordDesktop');

            // Act
            plugin.initialize(editor);
            plugin.onPluginEvent(testEvent as any);

            // Assert
            expect(chainOnNodeCreatedCallbackSpy).toHaveBeenCalledWith(jasmine.any(Function));
        });

        it('should apply image transparency removal for Excel content', () => {
            // Arrange
            const plugin = new PastePlugin(
                false,
                {
                    styleSanitizers: {},
                    additionalAllowedTags: [],
                    additionalDisallowedTags: [],
                    attributeSanitizers: {},
                },
                { removeTransparencyFromImages: true }
            );

            const chainOnNodeCreatedCallbackSpy = jasmine.createSpy('chainOnNodeCreatedCallback');
            const testEvent = createTestEvent(chainOnNodeCreatedCallbackSpy);

            spyOn(getPasteSource, 'getPasteSource').and.returnValue('excelDesktop');
            spyOn(ExcelFile, 'processPastedContentFromExcel').and.callThrough();

            // Act
            plugin.initialize(editor);
            plugin.onPluginEvent(testEvent as any);

            // Assert
            expect(chainOnNodeCreatedCallbackSpy).toHaveBeenCalledWith(jasmine.any(Function));
        });

        it('should apply image transparency removal for any paste source', () => {
            // Arrange
            const plugin = new PastePlugin(
                false,
                {
                    styleSanitizers: {},
                    additionalAllowedTags: [],
                    additionalDisallowedTags: [],
                    attributeSanitizers: {},
                },
                { removeTransparencyFromImages: true }
            );

            const chainOnNodeCreatedCallbackSpy = jasmine.createSpy('chainOnNodeCreatedCallback');
            const testEvent = createTestEvent(chainOnNodeCreatedCallbackSpy);

            spyOn(getPasteSource, 'getPasteSource').and.returnValue('powerPointDesktop');
            spyOn(PowerPointFile, 'processPastedContentFromPowerPoint').and.callThrough();

            // Act
            plugin.initialize(editor);
            plugin.onPluginEvent(testEvent as any);

            // Assert
            expect(chainOnNodeCreatedCallbackSpy).toHaveBeenCalledWith(jasmine.any(Function));
        });

        it('should use default options when not specified', () => {
            // Arrange
            const plugin = new PastePlugin(); // No options specified, defaults to removeTransparencyFromImages: false
            const chainOnNodeCreatedCallbackSpy = jasmine.createSpy('chainOnNodeCreatedCallback');
            const testEvent = createTestEvent(chainOnNodeCreatedCallbackSpy);

            spyOn(getPasteSource, 'getPasteSource').and.returnValue('default');

            // Act
            plugin.initialize(editor);
            plugin.onPluginEvent(testEvent as any);

            // Assert - Default is false, so should not be called
            expect(chainOnNodeCreatedCallbackSpy).not.toHaveBeenCalled();
        });
    });
});
