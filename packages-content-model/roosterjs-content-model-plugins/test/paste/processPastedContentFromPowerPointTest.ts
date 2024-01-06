import * as moveChildNodes from 'roosterjs-content-model-dom/lib/domUtils/moveChildNodes';
import { processPastedContentFromPowerPoint } from '../../lib/paste/PowerPoint/processPastedContentFromPowerPoint';
import { TrustedHTMLHandler } from 'roosterjs-editor-types';
import type { BeforePasteEvent, ClipboardData } from 'roosterjs-content-model-types';

const getPasteEvent = (): BeforePasteEvent => {
    return {
        eventType: 'beforePaste',
        clipboardData: <ClipboardData>{},
        fragment: document.createDocumentFragment(),
        htmlBefore: '',
        htmlAfter: '',
        htmlAttributes: {},
        pasteType: 'normal',
        domToModelOption: {
            additionalAllowedTags: [],
            additionalDisallowedTags: [],
            additionalFormatParsers: {},
            formatParserOverride: {},
            processorOverride: {},
            styleSanitizers: {},
            attributeSanitizers: {},
        },
    };
};

describe('processPastedContentFromPowerPointTest |', () => {
    let ev: BeforePasteEvent;
    let trustedHTMLHandlerMock: TrustedHTMLHandler = (html: string) => html;
    let image: HTMLImageElement;
    let doc: Document;

    beforeEach(() => {
        ev = getPasteEvent();
        image = document.createElement('img');
        spyOn(moveChildNodes, 'moveChildNodes');
        spyOn(window, 'DOMParser').and.returnValue(<DOMParser>{
            parseFromString(string: string, type: DOMParserSupportedType) {
                doc = <Document>(<any>document.createDocumentFragment());
                doc.append(image);
                return doc;
            },
        });
    });

    afterEach(() => {
        if (image) {
            image.parentElement?.removeChild(image);
        }
    });

    it('Execute, Html✅, Text❎, Image✅', () => {
        ev.clipboardData.html = '<img><img>';
        ev.clipboardData.text = '';
        ev.clipboardData.image = <File>{};

        processPastedContentFromPowerPoint(ev, trustedHTMLHandlerMock);

        expect(window.DOMParser).toHaveBeenCalled();
        expect(moveChildNodes.moveChildNodes).toHaveBeenCalledWith(ev.fragment, doc.body);
    });

    it('Dont Execute, Html✅, Text✅, Image✅', () => {
        ev.clipboardData.html = 'img';
        ev.clipboardData.text = 'text';
        ev.clipboardData.image = <File>{};

        processPastedContentFromPowerPoint(ev, trustedHTMLHandlerMock);

        expect(window.DOMParser).not.toHaveBeenCalled();
        expect(moveChildNodes.moveChildNodes).not.toHaveBeenCalled();
    });

    it('Dont Execute, Html❎, Text❎, Image✅', () => {
        ev.clipboardData.html = undefined;
        ev.clipboardData.text = '';
        ev.clipboardData.image = <File>{};

        processPastedContentFromPowerPoint(ev, trustedHTMLHandlerMock);

        expect(window.DOMParser).not.toHaveBeenCalled();
        expect(moveChildNodes.moveChildNodes).not.toHaveBeenCalled();
    });

    it('Dont Execute, Html❎, Text✅, Image✅', () => {
        ev.clipboardData.html = undefined;
        ev.clipboardData.text = 'Test';
        ev.clipboardData.image = <File>{};

        processPastedContentFromPowerPoint(ev, trustedHTMLHandlerMock);

        expect(window.DOMParser).not.toHaveBeenCalled();
        expect(moveChildNodes.moveChildNodes).not.toHaveBeenCalled();
    });

    it('Dont Execute, Html✅, Text❎, Image❎', () => {
        ev.clipboardData.html = 'Test';
        ev.clipboardData.text = '';
        ev.clipboardData.image = <File>(<any>null);

        processPastedContentFromPowerPoint(ev, trustedHTMLHandlerMock);

        expect(window.DOMParser).not.toHaveBeenCalled();
        expect(moveChildNodes.moveChildNodes).not.toHaveBeenCalled();
    });

    it('Dont Execute, Html❎, Text❎, Image❎', () => {
        ev.clipboardData.html = undefined;
        ev.clipboardData.text = '';
        ev.clipboardData.image = <File>(<any>null);

        processPastedContentFromPowerPoint(ev, trustedHTMLHandlerMock);

        expect(window.DOMParser).not.toHaveBeenCalled();
        expect(moveChildNodes.moveChildNodes).not.toHaveBeenCalled();
    });

    it('Dont Execute, Html❎, Text✅, Image❎', () => {
        ev.clipboardData.html = undefined;
        ev.clipboardData.text = 'text';
        ev.clipboardData.image = <File>(<any>null);

        processPastedContentFromPowerPoint(ev, trustedHTMLHandlerMock);

        expect(window.DOMParser).not.toHaveBeenCalled();
        expect(moveChildNodes.moveChildNodes).not.toHaveBeenCalled();
    });
});
