import { BeforePasteEvent, ClipboardData } from 'roosterjs-content-model-types';
import { getDocumentSource } from '../../../lib/paste/pasteSourceValidations/getDocumentSource';
import { PastePropertyNames } from '../../../lib/paste/pasteSourceValidations/constants';

const EXCEL_ATTRIBUTE_VALUE = 'urn:schemas-microsoft-com:office:excel';
const POWERPOINT_ATTRIBUTE_VALUE = 'PowerPoint.Slide';
const WORD_ATTRIBUTE_VALUE = 'urn:schemas-microsoft-com:office:word';

const getWacElement = (): HTMLElement => {
    const element = document.createElement('span');
    element.classList.add('WACImageContainer');
    return element;
};

describe('getPasteSourceTest | ', () => {
    it('Is Word', () => {
        const mockEvent = wordParam();
        const result = getDocumentSource({
            htmlAttributes: mockEvent.htmlAttributes,
            fragment: mockEvent.fragment,
            shouldConvertSingleImage: false,
            clipboardItemTypes: mockEvent.clipboardData.types,
            htmlFirstLevelChildTags: mockEvent.clipboardData.htmlFirstLevelChildTags,
            environment: <any>{},
            rawHtml: mockEvent.clipboardData.rawHtml,
        });
        expect(result).toBe('wordDesktop');
    });
    it('Is Wac Doc', () => {
        const mockEvent = wacParam();
        const result = getDocumentSource({
            htmlAttributes: mockEvent.htmlAttributes,
            fragment: mockEvent.fragment,
            shouldConvertSingleImage: false,
            clipboardItemTypes: mockEvent.clipboardData?.types,
            htmlFirstLevelChildTags: mockEvent.clipboardData?.htmlFirstLevelChildTags,
            environment: <any>{},
            rawHtml: mockEvent.clipboardData?.rawHtml,
        });
        expect(result).toBe('wacComponents');
    });
    it('Is Excel Doc', () => {
        const mockEvent = excelParam();
        const result = getDocumentSource({
            htmlAttributes: mockEvent.htmlAttributes,
            fragment: mockEvent.fragment,
            shouldConvertSingleImage: false,
            clipboardItemTypes: mockEvent.clipboardData?.types,
            htmlFirstLevelChildTags: mockEvent.clipboardData?.htmlFirstLevelChildTags,
            environment: <any>{},
            rawHtml: mockEvent.clipboardData?.rawHtml,
        });
        expect(result).toBe('excelDesktop');
    });
    it('Is GoogleSheet Doc', () => {
        const mockEvent = googleSheetParam();
        const result = getDocumentSource({
            htmlAttributes: mockEvent.htmlAttributes,
            fragment: mockEvent.fragment,
            shouldConvertSingleImage: false,
            clipboardItemTypes: mockEvent.clipboardData?.types,
            htmlFirstLevelChildTags: mockEvent.clipboardData?.htmlFirstLevelChildTags,
            environment: <any>{},
            rawHtml: mockEvent.clipboardData?.rawHtml,
        });
        expect(result).toBe('googleSheets');
    });
    it('Is PowerPoint Doc', () => {
        const mockEvent = powerPointParam();
        const result = getDocumentSource({
            htmlAttributes: mockEvent.htmlAttributes,
            fragment: mockEvent.fragment,
            shouldConvertSingleImage: false,
            clipboardItemTypes: mockEvent.clipboardData?.types,
            htmlFirstLevelChildTags: mockEvent.clipboardData?.htmlFirstLevelChildTags,
            environment: <any>{},
            rawHtml: mockEvent.clipboardData?.rawHtml,
        });
        expect(result).toBe('powerPointDesktop');
    });
    it('Is SingleImage', () => {
        const mockEvent = converSingleImageParam();
        const result = getDocumentSource({
            htmlAttributes: mockEvent.htmlAttributes,
            fragment: mockEvent.fragment,
            shouldConvertSingleImage: true,
            clipboardItemTypes: mockEvent.clipboardData?.types,
            htmlFirstLevelChildTags: mockEvent.clipboardData?.htmlFirstLevelChildTags,
            environment: <any>{},
            rawHtml: mockEvent.clipboardData?.rawHtml,
        });
        expect(result).toBe('singleImage');
    });
    it('Is SingleImage, but should not convert single image', () => {
        const mockEvent = converSingleImageParam();
        const result = getDocumentSource({
            htmlAttributes: mockEvent.htmlAttributes,
            fragment: mockEvent.fragment,
            shouldConvertSingleImage: false,
            clipboardItemTypes: mockEvent.clipboardData?.types,
            htmlFirstLevelChildTags: mockEvent.clipboardData?.htmlFirstLevelChildTags,
            environment: <any>{},
            rawHtml: mockEvent.clipboardData?.rawHtml,
        });
        expect(result).toBe('default');
    });
    it('Is Default', () => {
        const mockEvent = defaultParam();
        const result = getDocumentSource({
            htmlAttributes: mockEvent.htmlAttributes,
            fragment: mockEvent.fragment,
            shouldConvertSingleImage: false,
            clipboardItemTypes: mockEvent.clipboardData?.types,
            htmlFirstLevelChildTags: mockEvent.clipboardData?.htmlFirstLevelChildTags,
            environment: <any>{},
            rawHtml: mockEvent.clipboardData?.rawHtml,
        });
        expect(result).toBe('default');
    });
    it('Is Excel Non-Native Event', () => {
        const mockEvent = excelNonNativeEventParam();
        const result = getDocumentSource({
            htmlAttributes: mockEvent.htmlAttributes,
            fragment: mockEvent.fragment,
            shouldConvertSingleImage: false,
            clipboardItemTypes: mockEvent.clipboardData?.types,
            htmlFirstLevelChildTags: mockEvent.clipboardData?.htmlFirstLevelChildTags,
            environment: <any>{},
            rawHtml: mockEvent.clipboardData?.rawHtml,
        });
        expect(result).toBe('excelNonNativeEvent');
    });
    it('should return "oneNoteDesktop" when isOneNoteDesktopDocument returns true', () => {
        const mockEvent: any = {
            htmlAttributes: {
                [PastePropertyNames.PROG_ID_NAME]: 'OneNote.File',
            },
            clipboardData: {
                types: [],
            } as any,
            fragment: document.createDocumentFragment(),
        };
        const shouldConvertSingleImage = false;

        const result = getDocumentSource({
            htmlAttributes: mockEvent.htmlAttributes,
            fragment: mockEvent.fragment,
            shouldConvertSingleImage: shouldConvertSingleImage,
            clipboardItemTypes: mockEvent.clipboardData?.types,
            htmlFirstLevelChildTags: mockEvent.clipboardData?.htmlFirstLevelChildTags,
            environment: <any>{},
            rawHtml: mockEvent.clipboardData?.rawHtml,
        });

        expect(result).toBe('oneNoteDesktop');
    });
});

function wacParam(): BeforePasteEvent {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(getWacElement());

    return <BeforePasteEvent>{ fragment, htmlAttributes: {}, clipboardData: {} };
}

function excelParam(): BeforePasteEvent {
    const fragment = document.createDocumentFragment();
    const htmlAttributes: Record<string, string> = {
        'xmlns:x': EXCEL_ATTRIBUTE_VALUE,
    };

    return <BeforePasteEvent>{ htmlAttributes, fragment, clipboardData: {} };
}

function googleSheetParam(): BeforePasteEvent {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(document.createElement(PastePropertyNames.GOOGLE_SHEET_NODE_NAME));

    return <BeforePasteEvent>{ fragment, htmlAttributes: {}, clipboardData: {} };
}

function converSingleImageParam(): BeforePasteEvent {
    const fragment = document.createDocumentFragment();
    const clipboardData = <any>{
        htmlFirstLevelChildTags: ['IMG'],
        types: [],
    };

    return <BeforePasteEvent>{
        fragment,
        clipboardData,
        htmlAttributes: {},
    };
}

function powerPointParam(): BeforePasteEvent {
    const fragment = document.createDocumentFragment();

    const htmlAttributes: Record<string, string> = {
        ProgId: POWERPOINT_ATTRIBUTE_VALUE,
    };

    return <BeforePasteEvent>{ htmlAttributes, fragment, clipboardData: {} };
}

function wordParam(): BeforePasteEvent {
    const fragment = document.createDocumentFragment();
    const htmlAttributes: Record<string, string> = {
        'xmlns:w': WORD_ATTRIBUTE_VALUE,
    };

    return <BeforePasteEvent>{ htmlAttributes, fragment, clipboardData: {} };
}

function defaultParam(): BeforePasteEvent {
    const fragment = document.createDocumentFragment();

    return <BeforePasteEvent>{ htmlAttributes: {}, fragment, clipboardData: <any>{ types: [] } };
}

function excelNonNativeEventParam(): BeforePasteEvent {
    const fragment = document.createDocumentFragment();

    const clipboardData: ClipboardData = {
        types: ['web data/shadow-workbook'],
        rawHtml: '',
        htmlFirstLevelChildTags: ['TABLE'],
    } as any;

    return <BeforePasteEvent>{ fragment, clipboardData, htmlAttributes: {} };
}
