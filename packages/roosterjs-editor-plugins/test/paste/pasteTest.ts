import * as convertPasteContentForSingleImage from '../../lib/plugins/Paste/imageConverter/convertPasteContentForSingleImage';
import * as convertPastedContentForLI from '../../lib/plugins/Paste/commonConverter/convertPastedContentForLI';
import * as convertPastedContentFromExcel from '../../lib/plugins/Paste/excelConverter/convertPastedContentFromExcel';
import * as convertPastedContentFromPowerPoint from '../../lib/plugins/Paste/pptConverter/convertPastedContentFromPowerPoint';
import * as convertPastedContentFromWord from '../../lib/plugins/Paste/wordConverter/convertPastedContentFromWord';
import * as getPasteSource from 'roosterjs-editor-dom/lib/pasteSourceValidations/getPasteSource';
import * as handleLineMerge from '../../lib/plugins/Paste/lineMerge/handleLineMerge';
import * as sanitizeHtmlColorsFromPastedContent from '../../lib/plugins/Paste/sanitizeHtmlColorsFromPastedContent/sanitizeHtmlColorsFromPastedContent';
import * as wordOnlineFile from '../../lib/plugins/Paste/officeOnlineConverter/convertPastedContentFromWordOnline';
import { Editor } from 'roosterjs-editor-core';
import { getPasteEvent, getWacElement } from './pasteTestUtils';
import { KnownPasteSourceType } from 'roosterjs-editor-types';
import { Paste } from '../../lib/Paste';
import {
    BeforePasteEvent,
    EditorOptions,
    IEditor,
    TrustedHTMLHandler,
} from 'roosterjs-editor-types';

const GOOGLE_SHEET_NODE_NAME = 'google-sheets-html-origin';

describe('Paste Plugin Test', () => {
    let editor: IEditor;
    let id = 'tableSelectionContainerId';
    let paste: Paste;
    let ev: BeforePasteEvent;

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
            spyOn(getPasteSource, 'default').and.returnValue(KnownPasteSourceType.WordDesktop);
            spyOn(convertPastedContentFromWord, 'default').and.callFake(() => {});

            paste.onPluginEvent(ev);

            expect(convertPastedContentFromWord.default).toHaveBeenCalled();
            expect(convertPastedContentFromWord.default).toHaveBeenCalledWith(<BeforePasteEvent>ev);
        });

        it('Excel Content', () => {
            const mockHandler = <TrustedHTMLHandler>{};

            spyOn(getPasteSource, 'default').and.returnValue(KnownPasteSourceType.ExcelDesktop);
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

            spyOn(getPasteSource, 'default').and.returnValue(
                KnownPasteSourceType.PowerPointDesktop
            );
            spyOn(editor, 'getTrustedHTMLHandler').and.returnValue(mockHandler);
            spyOn(convertPastedContentFromPowerPoint, 'default');

            paste.onPluginEvent(ev);

            expect(convertPastedContentFromPowerPoint.default).toHaveBeenCalled();
            expect(convertPastedContentFromPowerPoint.default).toHaveBeenCalledWith(
                <BeforePasteEvent>ev,
                mockHandler
            );
        });

        it('Document with WAC elements no list', () => {
            const tempEl = getWacElement();
            tempEl.style.display = 'inherit';
            tempEl.style.margin = '0px';
            ev.fragment.append(tempEl);

            spyOn(getPasteSource, 'default').and.returnValue(KnownPasteSourceType.WacComponents);
            spyOn(wordOnlineFile, 'isWordOnlineWithList').and.returnValue(false);

            paste.onPluginEvent(ev);

            expect(tempEl?.style.display).toBe('');
            expect(tempEl?.style.margin).toBe('');
        });

        it('Document with WAC elements with list', () => {
            spyOn(getPasteSource, 'default').and.returnValue(KnownPasteSourceType.WacComponents);
            spyOn(wordOnlineFile, 'isWordOnlineWithList').and.returnValue(true);
            spyOn(wordOnlineFile, 'default').and.callFake(() => {});

            paste.onPluginEvent(ev);

            expect(wordOnlineFile.default).toHaveBeenCalled();
            expect(wordOnlineFile.default).toHaveBeenCalledWith((<BeforePasteEvent>ev).fragment);
        });

        it('Document from google sheets', () => {
            spyOn(getPasteSource, 'default').and.returnValue(KnownPasteSourceType.GoogleSheets);

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
            spyOn(getPasteSource, 'default').and.returnValue(KnownPasteSourceType.SingleImage);
            spyOn(convertPasteContentForSingleImage, 'default');

            paste.onPluginEvent(ev);

            expect(convertPasteContentForSingleImage.default).toHaveBeenCalled();
            expect(convertPasteContentForSingleImage.default).toHaveBeenCalledWith(
                <BeforePasteEvent>ev,
                mockHandler
            );
        });

        it('Any doc', () => {
            spyOn(getPasteSource, 'default').and.returnValue(KnownPasteSourceType.Default);
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
