import getPasteSource from '../../../lib/plugins/Paste/sourceValidations/getPasteSource';
import { BeforePasteEvent, ClipboardData } from 'roosterjs-editor-types';
import { GOOGLE_SHEET_NODE_NAME } from '../../../lib/plugins/Paste/sourceValidations/constants';
import { KnownSourceType } from '../../../lib/plugins/Paste/sourceValidations/KnownSourceType';
import {
    EXCEL_ATTRIBUTE_VALUE,
    getWacElement,
    POWERPOINT_ATTRIBUTE_VALUE,
    WORD_ATTRIBUTE_VALUE,
} from '../pasteTestUtils';

describe('getPasteSourceTest | ', () => {
    it('Is Word', () => {
        const result = getPasteSource(wordParam(), false /* shouldConvertSingleImage */);
        expect(result).toBe(KnownSourceType.WordDesktop);
    });
    it('Is Wac Doc', () => {
        const result = getPasteSource(wacParam(), false /* shouldConvertSingleImage */);
        expect(result).toBe(KnownSourceType.WacComponents);
    });
    it('Is Excel Doc', () => {
        const result = getPasteSource(excelParam(), false /* shouldConvertSingleImage */);
        expect(result).toBe(KnownSourceType.ExcelDesktop);
    });
    it('Is GoogleSheet Doc', () => {
        const result = getPasteSource(googleSheetParam(), false /* shouldConvertSingleImage */);
        expect(result).toBe(KnownSourceType.GoogleSheets);
    });
    it('Is PowerPoint Doc', () => {
        const result = getPasteSource(powerPointParam(), false /* shouldConvertSingleImage */);
        expect(result).toBe(KnownSourceType.PowerPointDesktop);
    });
    it('Is SingleImage', () => {
        const result = getPasteSource(
            converSingleImageParam(),
            true /* shouldConvertSingleImage */
        );
        expect(result).toBe(KnownSourceType.SingleImage);
    });
    it('Is SingleImage, but should not convert single image', () => {
        const result = getPasteSource(
            converSingleImageParam(),
            false /* shouldConvertSingleImage */
        );
        expect(result).toBe(KnownSourceType.Default);
    });
    it('Is Default', () => {
        const result = getPasteSource(defaultParam(), false /* shouldConvertSingleImage */);
        expect(result).toBe(KnownSourceType.Default);
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
    fragment.appendChild(document.createElement(GOOGLE_SHEET_NODE_NAME));

    return <BeforePasteEvent>{ fragment, htmlAttributes: {}, clipboardData: {} };
}

function converSingleImageParam(): BeforePasteEvent {
    const fragment = document.createDocumentFragment();
    const clipboardData = <ClipboardData>{
        htmlFirstLevelChildTags: ['IMG'],
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

    return <BeforePasteEvent>{ htmlAttributes: {}, fragment, clipboardData: {} };
}
