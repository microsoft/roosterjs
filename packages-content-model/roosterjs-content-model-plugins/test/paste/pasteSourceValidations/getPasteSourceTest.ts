import { BeforePasteEvent } from 'roosterjs-editor-types';
import { ClipboardData } from 'roosterjs-content-model-types';
import { getPasteSource } from '../../../lib/paste/pasteSourceValidations/getPasteSource';
import { PastePropertyNames } from '../../../lib/paste/pasteSourceValidations/constants';
import {
    EXCEL_ATTRIBUTE_VALUE,
    getWacElement,
    POWERPOINT_ATTRIBUTE_VALUE,
    WORD_ATTRIBUTE_VALUE,
} from 'roosterjs-editor-plugins/test/paste/pasteTestUtils';

describe('getPasteSourceTest | ', () => {
    it('Is Word', () => {
        const result = getPasteSource(wordParam(), false /* shouldConvertSingleImage */);
        expect(result).toBe('wordDesktop');
    });
    it('Is Wac Doc', () => {
        const result = getPasteSource(wacParam(), false /* shouldConvertSingleImage */);
        expect(result).toBe('wacComponents');
    });
    it('Is Excel Doc', () => {
        const result = getPasteSource(excelParam(), false /* shouldConvertSingleImage */);
        expect(result).toBe('excelDesktop');
    });
    it('Is GoogleSheet Doc', () => {
        const result = getPasteSource(googleSheetParam(), false /* shouldConvertSingleImage */);
        expect(result).toBe('googleSheets');
    });
    it('Is PowerPoint Doc', () => {
        const result = getPasteSource(powerPointParam(), false /* shouldConvertSingleImage */);
        expect(result).toBe('powerPointDesktop');
    });
    it('Is SingleImage', () => {
        const result = getPasteSource(
            converSingleImageParam(),
            true /* shouldConvertSingleImage */
        );
        expect(result).toBe('singleImage');
    });
    it('Is SingleImage, but should not convert single image', () => {
        const result = getPasteSource(
            converSingleImageParam(),
            false /* shouldConvertSingleImage */
        );
        expect(result).toBe('default');
    });
    it('Is Default', () => {
        const result = getPasteSource(defaultParam(), false /* shouldConvertSingleImage */);
        expect(result).toBe('default');
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
