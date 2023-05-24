import * as moveChildNodes from 'roosterjs-editor-dom/lib/utils/moveChildNodes';
import { convertPastedContentFromPowerPoint } from '../../../../lib/editor/plugins/PastePlugin/PowerPoint/convertPastedContentFromPowerPoint';
import { createDefaultHtmlSanitizerOptions } from 'roosterjs-editor-dom';
import {
    BeforePasteEvent,
    ClipboardData,
    PasteType,
    PluginEventType,
    TrustedHTMLHandler,
} from 'roosterjs-editor-types';

const getPasteEvent = (): BeforePasteEvent => {
    return {
        eventType: PluginEventType.BeforePaste,
        clipboardData: <ClipboardData>{},
        fragment: document.createDocumentFragment(),
        sanitizingOption: createDefaultHtmlSanitizerOptions(),
        htmlBefore: '',
        htmlAfter: '',
        htmlAttributes: {},
        pasteType: PasteType.Normal,
    };
};

describe('convertPastedContentFromPowerPoint |', () => {
    let ev: BeforePasteEvent;
    let trustedHTMLHandlerMock: TrustedHTMLHandler = (html: string) => html;
    let image: HTMLImageElement;
    let doc: Document;

    beforeEach(() => {
        ev = getPasteEvent();
        image = document.createElement('img');
        spyOn(moveChildNodes, 'default');
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

        convertPastedContentFromPowerPoint(ev, trustedHTMLHandlerMock);

        expect(window.DOMParser).toHaveBeenCalled();
        expect(moveChildNodes.default).toHaveBeenCalledWith(ev.fragment, doc.body);
    });

    it('Dont Execute, Html✅, Text✅, Image✅', () => {
        ev.clipboardData.html = 'img';
        ev.clipboardData.text = 'text';
        ev.clipboardData.image = <File>{};

        convertPastedContentFromPowerPoint(ev, trustedHTMLHandlerMock);

        expect(window.DOMParser).not.toHaveBeenCalled();
        expect(moveChildNodes.default).not.toHaveBeenCalled();
    });

    it('Dont Execute, Html❎, Text❎, Image✅', () => {
        ev.clipboardData.html = undefined;
        ev.clipboardData.text = '';
        ev.clipboardData.image = <File>{};

        convertPastedContentFromPowerPoint(ev, trustedHTMLHandlerMock);

        expect(window.DOMParser).not.toHaveBeenCalled();
        expect(moveChildNodes.default).not.toHaveBeenCalled();
    });

    it('Dont Execute, Html❎, Text✅, Image✅', () => {
        ev.clipboardData.html = undefined;
        ev.clipboardData.text = 'Test';
        ev.clipboardData.image = <File>{};

        convertPastedContentFromPowerPoint(ev, trustedHTMLHandlerMock);

        expect(window.DOMParser).not.toHaveBeenCalled();
        expect(moveChildNodes.default).not.toHaveBeenCalled();
    });

    it('Dont Execute, Html✅, Text❎, Image❎', () => {
        ev.clipboardData.html = 'Test';
        ev.clipboardData.text = '';
        ev.clipboardData.image = <File>(<any>null);

        convertPastedContentFromPowerPoint(ev, trustedHTMLHandlerMock);

        expect(window.DOMParser).not.toHaveBeenCalled();
        expect(moveChildNodes.default).not.toHaveBeenCalled();
    });

    it('Dont Execute, Html❎, Text❎, Image❎', () => {
        ev.clipboardData.html = undefined;
        ev.clipboardData.text = '';
        ev.clipboardData.image = <File>(<any>null);

        convertPastedContentFromPowerPoint(ev, trustedHTMLHandlerMock);

        expect(window.DOMParser).not.toHaveBeenCalled();
        expect(moveChildNodes.default).not.toHaveBeenCalled();
    });

    it('Dont Execute, Html❎, Text✅, Image❎', () => {
        ev.clipboardData.html = undefined;
        ev.clipboardData.text = 'text';
        ev.clipboardData.image = <File>(<any>null);

        convertPastedContentFromPowerPoint(ev, trustedHTMLHandlerMock);

        expect(window.DOMParser).not.toHaveBeenCalled();
        expect(moveChildNodes.default).not.toHaveBeenCalled();
    });
});
