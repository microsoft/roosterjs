import * as getDocumentSourceModule from '../../lib/documentSourceValidations/getDocumentSource';
import { BeforePasteEvent, EditorEnvironment } from 'roosterjs-content-model-types';
import { getPasteSource } from '../../../roosterjs-content-model-plugins/lib/paste/getPasteSource';

const EXCEL_ATTRIBUTE_VALUE = 'urn:schemas-microsoft-com:office:excel';
const POWERPOINT_ATTRIBUTE_VALUE = 'PowerPoint.Slide';
const WORD_ATTRIBUTE_VALUE = 'urn:schemas-microsoft-com:office:word';

describe('getPasteSourceTest | ', () => {
    let getDocumentSourceSpy: jasmine.Spy;

    beforeEach(() => {
        getDocumentSourceSpy = spyOn(getDocumentSourceModule, 'getDocumentSource').and.returnValue(
            'default'
        );
    });

    it('calls getDocumentSource with correct parameters for Word', () => {
        const event = wordParam();
        const shouldConvertSingleImage = false;
        const environment: EditorEnvironment = <any>{};

        getPasteSource(event, shouldConvertSingleImage, environment);

        expect(getDocumentSourceSpy).toHaveBeenCalledWith({
            htmlAttributes: event.htmlAttributes,
            fragment: event.fragment,
            shouldConvertSingleImage,
            clipboardItemTypes: event.clipboardData.types,
            htmlFirstLevelChildTags: event.clipboardData.htmlFirstLevelChildTags,
            environment,
            rawHtml: event.clipboardData.rawHtml,
        });
    });

    it('calls getDocumentSource with correct parameters for Excel', () => {
        const event = excelParam();
        const shouldConvertSingleImage = false;
        const environment: EditorEnvironment = <any>{};

        getPasteSource(event, shouldConvertSingleImage, environment);

        expect(getDocumentSourceSpy).toHaveBeenCalledWith({
            htmlAttributes: event.htmlAttributes,
            fragment: event.fragment,
            shouldConvertSingleImage,
            clipboardItemTypes: event.clipboardData.types,
            htmlFirstLevelChildTags: event.clipboardData.htmlFirstLevelChildTags,
            environment,
            rawHtml: event.clipboardData.rawHtml,
        });
    });

    it('calls getDocumentSource with correct parameters for PowerPoint', () => {
        const event = powerPointParam();
        const shouldConvertSingleImage = false;
        const environment: EditorEnvironment = <any>{};

        getPasteSource(event, shouldConvertSingleImage, environment);

        expect(getDocumentSourceSpy).toHaveBeenCalledWith({
            htmlAttributes: event.htmlAttributes,
            fragment: event.fragment,
            shouldConvertSingleImage,
            clipboardItemTypes: event.clipboardData.types,
            htmlFirstLevelChildTags: event.clipboardData.htmlFirstLevelChildTags,
            environment,
            rawHtml: event.clipboardData.rawHtml,
        });
    });

    it('calls getDocumentSource with shouldConvertSingleImage true', () => {
        const event = converSingleImageParam();
        const shouldConvertSingleImage = true;
        const environment: EditorEnvironment = <any>{};

        getPasteSource(event, shouldConvertSingleImage, environment);

        expect(getDocumentSourceSpy).toHaveBeenCalledWith({
            htmlAttributes: event.htmlAttributes,
            fragment: event.fragment,
            shouldConvertSingleImage: true,
            clipboardItemTypes: event.clipboardData.types,
            htmlFirstLevelChildTags: event.clipboardData.htmlFirstLevelChildTags,
            environment,
            rawHtml: event.clipboardData.rawHtml,
        });
    });

    it('returns the value from getDocumentSource', () => {
        const expectedResult = 'wordDesktop';
        getDocumentSourceSpy.and.returnValue(expectedResult);

        const event = wordParam();
        const result = getPasteSource(event, false, <any>{});

        expect(result).toBe(expectedResult);
    });
});

function excelParam(): BeforePasteEvent {
    const fragment = document.createDocumentFragment();
    const htmlAttributes: Record<string, string> = {
        'xmlns:x': EXCEL_ATTRIBUTE_VALUE,
    };

    return <BeforePasteEvent>{ htmlAttributes, fragment, clipboardData: {} };
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
