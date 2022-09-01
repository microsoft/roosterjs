import * as moveChildNodes from 'roosterjs-editor-dom/lib/utils/moveChildNodes';
import convertPasteContentForSingleImage from '../../lib/plugins/Paste/imageConverter/convertPasteContentForSingleImage';
import { BeforePasteEvent, TrustedHTMLHandler } from 'roosterjs-editor-types';
import { getPasteEvent } from './pasteTestUtils';

describe('convertPasteContentForSingleImage |', () => {
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

    it('Execute, HTML✅, File✅', () => {
        ev.clipboardData.html = '<img><img>';
        ev.clipboardData.image = <File>{};

        convertPasteContentForSingleImage(ev, trustedHTMLHandlerMock);

        expect(window.DOMParser).toHaveBeenCalled();
        expect(moveChildNodes.default).toHaveBeenCalledWith(ev.fragment, doc.body);
    });

    it('Dont execute, HTML❎, File✅', () => {
        ev.clipboardData.html = undefined;
        ev.clipboardData.image = <File>{};

        convertPasteContentForSingleImage(ev, trustedHTMLHandlerMock);

        expect(window.DOMParser).not.toHaveBeenCalled();
        expect(moveChildNodes.default).not.toHaveBeenCalled();
    });

    it('Dont execute, HTML❎, File❎', () => {
        ev.clipboardData.html = undefined;
        ev.clipboardData.image = <File>(<any>null);

        convertPasteContentForSingleImage(ev, trustedHTMLHandlerMock);

        expect(window.DOMParser).not.toHaveBeenCalled();
        expect(moveChildNodes.default).not.toHaveBeenCalled();
    });

    it('Dont execute, HTML✅, Image❎', () => {
        ev.clipboardData.html = '<img><img>';
        ev.clipboardData.image = <File>(<any>null);

        convertPasteContentForSingleImage(ev, trustedHTMLHandlerMock);

        expect(window.DOMParser).not.toHaveBeenCalled();
        expect(moveChildNodes.default).not.toHaveBeenCalled();
    });
});
