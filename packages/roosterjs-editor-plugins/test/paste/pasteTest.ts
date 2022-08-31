import * as convertPasteContentForSingleImage from '../../lib/plugins/Paste/imageConverter/convertPasteContentForSingleImage';
import * as convertPastedContentForLI from '../../lib/plugins/Paste/commonConverter/convertPastedContentForLI';
import * as convertPastedContentFromExcel from '../../lib/plugins/Paste/excelConverter/convertPastedContentFromExcel';
import * as convertPastedContentFromPowerPoint from '../../lib/plugins/Paste/pptConverter/convertPastedContentFromPowerPoint';
import * as convertPastedContentFromWord from '../../lib/plugins/Paste/wordConverter/convertPastedContentFromWord';
import * as documentContainWacElements from '../../lib/plugins/Paste/sourceValidations/documentContainWacElements';
import * as handleLineMerge from '../../lib/plugins/Paste/lineMerge/handleLineMerge';
import * as isExcelDesktopDocument from '../../lib/plugins/Paste/sourceValidations/isExcelDesktopDocument';
import * as isGoogleSheetDocument from '../../lib/plugins/Paste/sourceValidations/isGoogleSheetDocument';
import * as isPowerPointDesktopDocument from '../../lib/plugins/Paste/sourceValidations/isPowerPointDesktopDocument';
import * as isWordDesktopDocument from '../../lib/plugins/Paste/sourceValidations/isWordDesktopDocument';
import * as sanitizeHtmlColorsFromPastedContent from '../../lib/plugins/Paste/sanitizeHtmlColorsFromPastedContent/sanitizeHtmlColorsFromPastedContent';
import * as shouldConvertToSingleImage from '../../lib/plugins/Paste/sourceValidations/shouldConvertToSingleImage';
import * as wordOnlineFile from '../../lib/plugins/Paste/officeOnlineConverter/convertPastedContentFromWordOnline';
import {
    BeforePasteEvent,
    ClipboardData,
    EditorOptions,
    IEditor,
    PluginEvent,
    PluginEventType,
    TrustedHTMLHandler,
} from 'roosterjs-editor-types';
import { createDefaultHtmlSanitizerOptions } from 'roosterjs-editor-dom';
import { Editor } from 'roosterjs-editor-core';
import { GOOGLE_SHEET_NODE_NAME } from '../../lib/plugins/Paste/sourceValidations/constants';
import { Paste } from '../../lib/Paste';

describe('Paste Plugin Test', () => {
    let editor: IEditor;
    let id = 'tableSelectionContainerId';
    let paste: Paste;
    let ev: PluginEvent;

    beforeEach(() => {
        ev = getPasteEvent();
        let node = document.createElement('div');
        node.id = id;
        document.body.insertBefore(node, document.body.childNodes[0]);
        paste = new Paste('Test');

        let options: EditorOptions = {
            plugins: [paste],
            defaultFormat: {
                fontFamily: 'Calibri,Arial,Helvetica,sans-serif',
                fontSize: '11pt',
                textColor: '#000000',
            },
            corePluginOverride: {},
        };

        editor = new Editor(node as HTMLDivElement, options);
        spyOn(sanitizeHtmlColorsFromPastedContent, 'default');
    });

    it('getName', () => {
        expect(paste.getName()).toEqual('Paste');
    });

    describe('OnPluginEvent |', () => {
        afterEach(() => {
            const evt = <BeforePasteEvent>ev;
            expect(sanitizeHtmlColorsFromPastedContent.default).toHaveBeenCalledWith(
                evt.sanitizingOption
            );
            expect(evt.sanitizingOption.unknownTagReplacement).toBe('Test');

            editor.dispose();
            const div = document.getElementById(id);
            if (div) {
                div.parentNode?.removeChild(div);
            }
        });

        it('Word Content', () => {
            setUpSpies(true /* WordSpy */);
            spyOn(convertPastedContentFromWord, 'default').and.callFake(() => {});

            paste.onPluginEvent(ev);

            expect(convertPastedContentFromWord.default).toHaveBeenCalled();
            expect(convertPastedContentFromWord.default).toHaveBeenCalledWith(<BeforePasteEvent>ev);
        });

        it('Excel Content', () => {
            const mockHandler = <TrustedHTMLHandler>{};

            setUpSpies(false /* Word */, true /* Excel */);
            spyOn(convertPastedContentFromExcel, 'default').and.callFake(() => {});
            spyOn(editor, 'getTrustedHTMLHandler').and.returnValue(mockHandler);

            paste.onPluginEvent(ev);

            expect(convertPastedContentFromExcel.default).toHaveBeenCalled();
            expect(convertPastedContentFromExcel.default).toHaveBeenCalledWith(
                <BeforePasteEvent>ev,
                mockHandler
            );
        });

        it('PowerPoint Content', () => {
            const mockHandler = <TrustedHTMLHandler>{};

            setUpSpies(false /* Word */, false /* Excel */, true /* Power Point */);

            spyOn(convertPastedContentFromPowerPoint, 'default').and.callFake(() => {});
            spyOn(editor, 'getTrustedHTMLHandler').and.returnValue(mockHandler);

            paste.onPluginEvent(ev);

            expect(convertPastedContentFromPowerPoint.default).toHaveBeenCalled();
            expect(convertPastedContentFromPowerPoint.default).toHaveBeenCalledWith(
                <BeforePasteEvent>ev,
                mockHandler
            );
        });

        it('Document with WAC elements no list', () => {
            const elements: HTMLElement[] = [];

            spyOn(isWordDesktopDocument, 'isWordDesktopDocument').and.returnValue(false);
            spyOn(isExcelDesktopDocument, 'isExcelDesktopDocument').and.returnValue(false);
            spyOn(isPowerPointDesktopDocument, 'isPowerPointDesktopDocument').and.returnValue(
                false
            );
            spyOn(wordOnlineFile, 'isWordOnlineWithList').and.returnValue(false);
            spyOn(documentContainWacElements, 'documentContainWacElements').and.callFake(
                fakeElements => {
                    const tempEl = document.createElement('div');

                    tempEl.style.display = 'inherit';
                    tempEl.style.margin = '0px';

                    elements.push(tempEl);
                    fakeElements.push(tempEl);

                    return true;
                }
            );

            paste.onPluginEvent(ev);

            expect(elements[0].style.display).toBe('');
            expect(elements[0].style.margin).toBe('');
        });

        it('Document with WAC elements with list', () => {
            setUpSpies(
                false /* Word */,
                false /* Excel */,
                false /* Power Point */,
                true /* wacElements */
            );
            spyOn(wordOnlineFile, 'isWordOnlineWithList').and.returnValue(true);
            spyOn(wordOnlineFile, 'default').and.callFake(() => {});

            paste.onPluginEvent(ev);

            expect(wordOnlineFile.default).toHaveBeenCalled();
            expect(wordOnlineFile.default).toHaveBeenCalledWith((<BeforePasteEvent>ev).fragment);
        });

        it('Document from google sheets', () => {
            setUpSpies(
                false /* Word */,
                false /* Excel */,
                false /* Power Point */,
                false /* wacElements */,
                true /* google sheet */
            );

            paste.onPluginEvent(ev);

            expect(
                (<BeforePasteEvent>ev).sanitizingOption.additionalTagReplacements[
                    GOOGLE_SHEET_NODE_NAME
                ]
            ).toBe('*');
        });

        it('Convert SIngle Image', () => {
            const mockHandler = <TrustedHTMLHandler>{};
            spyOn(editor, 'getTrustedHTMLHandler').and.returnValue(mockHandler);
            setUpSpies(
                false /* Word */,
                false /* Excel */,
                false /* Power Point */,
                false /* wacElements */,
                false /* google sheet */,
                true /* convert image */
            );
            spyOn(convertPasteContentForSingleImage, 'default');

            paste.onPluginEvent(ev);

            expect(convertPasteContentForSingleImage.default).toHaveBeenCalled();
            expect(convertPasteContentForSingleImage.default).toHaveBeenCalledWith(
                <BeforePasteEvent>ev,
                mockHandler
            );
        });

        it('Any doc', () => {
            setUpSpies(
                false /* Word */,
                false /* Excel */,
                false /* Power Point */,
                false /* wacElements */,
                false /* google sheet */,
                false /* convert image */
            );
            spyOn(convertPastedContentForLI, 'default');
            spyOn(handleLineMerge, 'default');

            paste.onPluginEvent(ev);

            expect(convertPastedContentForLI.default).toHaveBeenCalledWith(
                (<BeforePasteEvent>ev).fragment
            );
            expect(handleLineMerge.default).toHaveBeenCalledWith((<BeforePasteEvent>ev).fragment);
        });
    });
});

const getPasteEvent = (): PluginEvent => {
    return {
        eventType: PluginEventType.BeforePaste,
        clipboardData: <ClipboardData>{},
        fragment: document.createDocumentFragment(),
        sanitizingOption: createDefaultHtmlSanitizerOptions(),
        htmlBefore: '',
        htmlAfter: '',
        htmlAttributes: {},
    };
};

function setUpSpies(
    word: boolean = false,
    excel: boolean = false,
    powerPoint: boolean = false,
    wacElements: boolean = false,
    googleSheet: boolean = false,
    convertImage: boolean = false
) {
    spyOn(isWordDesktopDocument, 'isWordDesktopDocument').and.returnValue(word);
    spyOn(isExcelDesktopDocument, 'isExcelDesktopDocument').and.returnValue(excel);
    spyOn(isPowerPointDesktopDocument, 'isPowerPointDesktopDocument').and.returnValue(powerPoint);
    spyOn(documentContainWacElements, 'documentContainWacElements').and.returnValue(wacElements);
    spyOn(isGoogleSheetDocument, 'isGoogleSheetDocument').and.returnValue(googleSheet);
    spyOn(shouldConvertToSingleImage, 'shouldConvertToSingleImage').and.returnValue(convertImage);
}
