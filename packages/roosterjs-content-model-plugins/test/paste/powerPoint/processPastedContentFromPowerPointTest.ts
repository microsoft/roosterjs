import * as moveChildNodes from 'roosterjs-content-model-dom/lib/domUtils/moveChildNodes';
import { createDefaultDomToModelContext } from '../../TestHelper';
import { createDomToModelContext, domToContentModel } from 'roosterjs-content-model-dom';
import { processPastedContentFromPowerPoint } from '../../../lib/paste/PowerPoint/processPastedContentFromPowerPoint';
import type {
    BeforePasteEvent,
    ClipboardData,
    ContentModelListItem,
    DOMCreator,
} from 'roosterjs-content-model-types';

const getPasteEvent = (): BeforePasteEvent => {
    return {
        eventType: 'beforePaste',
        clipboardData: <ClipboardData>{},
        fragment: document.createDocumentFragment(),
        htmlBefore: '',
        htmlAfter: '',
        htmlAttributes: {},
        pasteType: 'normal',
        domToModelOption: createDefaultDomToModelContext(),
    };
};

describe('processPastedContentFromPowerPointTest |', () => {
    let ev: BeforePasteEvent;
    let trustedHTMLHandlerMock: DOMCreator = {
        htmlToDOM: (html: string) => new DOMParser().parseFromString(html, 'text/html'),
    };
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

describe('processPastedContentFromPowerPoint list handling |', () => {
    const domCreator: DOMCreator = {
        htmlToDOM: (html: string) => new DOMParser().parseFromString(html, 'text/html'),
    };

    const bulletHtml =
        "<span style='font-size:7.0pt'>" +
        "<span style='mso-special-format:bullet;font-family:Arial'>\u2022</span>" +
        '</span>';

    function convert(html: string) {
        const ev = getPasteEvent();
        ev.clipboardData.html = html;
        ev.clipboardData.text = 'text';

        processPastedContentFromPowerPoint(ev, domCreator);

        const container = document.createElement('div');
        container.innerHTML = html;

        const context = createDomToModelContext(undefined, ev.domToModelOption);

        return domToContentModel(container, context);
    }

    it('Converts a PowerPoint bullet div into a list item', () => {
        const model = convert(
            "<div style='margin-top:10.0pt;direction:ltr;text-align:left'>" +
                bulletHtml +
                "<span style='font-size:7.0pt;color:black'>Item</span>" +
                '</div>'
        );

        expect(model.blocks.length).toBe(1);
        expect(model.blocks[0].blockType).toBe('BlockGroup');
        expect((model.blocks[0] as ContentModelListItem).blockGroupType).toBe('ListItem');
    });

    it('Keeps the list marker font size when the list is not inside a table', () => {
        const model = convert(
            "<div style='margin-top:10.0pt;direction:ltr;text-align:left;font-size:7.0pt'>" +
                bulletHtml +
                "<span style='font-size:7.0pt;color:black'>Item</span>" +
                '</div>'
        );

        const listItem = model.blocks[0] as ContentModelListItem;

        expect(listItem.blockGroupType).toBe('ListItem');
        expect(listItem.formatHolder.format.fontSize).toBe('7pt');
    });

    it('Removes the list marker font size when the list is inside a table', () => {
        const model = convert(
            '<table><tbody><tr><td>' +
                "<div style='margin-top:10.0pt;direction:ltr;text-align:left;font-size:7.0pt'>" +
                bulletHtml +
                "<span style='font-size:7.0pt;color:black'>Item</span>" +
                '</div>' +
                '</td></tr></tbody></table>'
        );

        const table = model.blocks[0] as any;
        const listItem = table.rows[0].cells[0].blocks[0] as ContentModelListItem;

        expect(model.blocks[0].blockType).toBe('Table');
        expect(listItem.blockGroupType).toBe('ListItem');
        expect(listItem.formatHolder.format.fontSize).toBeUndefined();
    });

    it('Does not convert a table element into a list when it contains a bullet', () => {
        const model = convert(
            '<table><tbody><tr><td>' +
                "<div style='margin-top:10.0pt;direction:ltr;text-align:left'>" +
                bulletHtml +
                "<span style='font-size:7.0pt;color:black'>Item</span>" +
                '</div>' +
                '</td></tr></tbody></table>'
        );

        expect(model.blocks.length).toBe(1);
        expect(model.blocks[0].blockType).toBe('Table');
    });
});
