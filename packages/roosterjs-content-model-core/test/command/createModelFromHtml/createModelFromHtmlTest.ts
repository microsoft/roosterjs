import * as convertInlineCss from '../../../lib/utils/convertInlineCss';
import * as createDomToModelContextForSanitizing from '../../../lib/command/createModelFromHtml/createDomToModelContextForSanitizing';
import * as domToContentModel from 'roosterjs-content-model-dom/lib/domToModel/domToContentModel';
import * as parseFormat from 'roosterjs-content-model-dom/lib/domToModel/utils/parseFormat';
import { ContentModelSegmentFormat } from 'roosterjs-content-model-types';
import { createModelFromHtml } from '../../../lib/command/createModelFromHtml/createModelFromHtml';

describe('createModelFromHtml', () => {
    it('Empty html, no options', () => {
        const html = '';
        const model = createModelFromHtml(html);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                },
            ],
        });
    });

    it('Valid html, no options', () => {
        const html = '<div style="font-size:20px">test</div>';
        const model = createModelFromHtml(html);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: { fontSize: '20px' },
                        },
                    ],
                    segmentFormat: { fontSize: '20px' },
                    format: {},
                },
            ],
        });
    });

    it('Valid html with style on BODY and global CSS, no options', () => {
        const html =
            '<html><head><style>div {font-family: Arial}</style></head><body style="color:red"><div style="font-size:20px">test</div></body></html>';
        const model = createModelFromHtml(html);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: { fontSize: '20px', textColor: 'red', fontFamily: 'Arial' },
                        },
                    ],
                    segmentFormat: { fontSize: '20px', fontFamily: 'Arial', textColor: 'red' },
                    format: {},
                },
            ],
        });
    });

    it('Valid html, with options', () => {
        const html = '<div style="font-size:20px">test</div>';
        const mockedOptions = 'OPTIONS' as any;
        const mockedContext = {
            formatParsers: {
                segmentOnBlock: 'PARSERS',
            },
            segmentFormat: 'SEGMENT',
        } as any;
        const createContextSpy = spyOn(
            createDomToModelContextForSanitizing,
            'createDomToModelContextForSanitizing'
        ).and.returnValue(mockedContext);
        const parseFormatSpy = spyOn(parseFormat, 'parseFormat');
        const mockedDoc = {
            body: 'BODY',
        } as any;
        const mockedModel = 'MODEL' as any;
        const domToContentModelSpy = spyOn(domToContentModel, 'domToContentModel').and.returnValue(
            mockedModel
        );
        const domParserSpy = spyOn(DOMParser.prototype, 'parseFromString').and.returnValue(
            mockedDoc
        );
        const mockedRules = 'RULES' as any;
        const retrieveCssRulesSpy = spyOn(convertInlineCss, 'retrieveCssRules').and.returnValue(
            mockedRules
        );
        const convertInlineCssSpy = spyOn(convertInlineCss, 'convertInlineCss');
        const mockedTrustedHtmlHandler = jasmine
            .createSpy('trustHandler')
            .and.returnValue('TRUSTEDHTML');
        const mockedDefaultSegmentFormat = 'FORMAT' as any;

        const model = createModelFromHtml(
            html,
            mockedOptions,
            mockedTrustedHtmlHandler,
            mockedDefaultSegmentFormat
        );

        expect(model).toEqual(mockedModel);
        expect(mockedTrustedHtmlHandler).toHaveBeenCalledWith(html);
        expect(domParserSpy).toHaveBeenCalledWith('TRUSTEDHTML', 'text/html');
        expect(parseFormatSpy).toHaveBeenCalledTimes(1);
        expect(parseFormatSpy).toHaveBeenCalledWith(
            'BODY' as any,
            'PARSERS' as any,
            'SEGMENT' as any,
            mockedContext
        );
        expect(createContextSpy).toHaveBeenCalledTimes(1);
        expect(createContextSpy).toHaveBeenCalledWith(
            mockedDoc,
            mockedDefaultSegmentFormat,
            mockedOptions
        );
        expect(domToContentModelSpy).toHaveBeenCalledWith('BODY' as any, mockedContext);
        expect(retrieveCssRulesSpy).toHaveBeenCalledWith(mockedDoc);
        expect(convertInlineCssSpy).toHaveBeenCalledWith(mockedDoc, mockedRules);
    });

    it('Empty html, with options', () => {
        const mockedOptions = 'OPTIONS' as any;
        const mockedContext = {
            formatParsers: {
                segmentOnBlock: 'PARSERS',
            },
            segmentFormat: 'SEGMENT',
        } as any;
        const createContextSpy = spyOn(
            createDomToModelContextForSanitizing,
            'createDomToModelContextForSanitizing'
        ).and.returnValue(mockedContext);
        const parseFormatSpy = spyOn(parseFormat, 'parseFormat');
        const mockedDoc = {
            body: 'BODY',
        } as any;
        const mockedModel = 'MODEL' as any;
        const domToContentModelSpy = spyOn(domToContentModel, 'domToContentModel').and.returnValue(
            mockedModel
        );
        const domParserSpy = spyOn(DOMParser.prototype, 'parseFromString').and.returnValue(
            mockedDoc
        );
        const mockedRules = 'RULES' as any;
        const retrieveCssRulesSpy = spyOn(convertInlineCss, 'retrieveCssRules').and.returnValue(
            mockedRules
        );
        const convertInlineCssSpy = spyOn(convertInlineCss, 'convertInlineCss');
        const segmentFormat: ContentModelSegmentFormat = { fontSize: '10pt' };

        const model = createModelFromHtml('', mockedOptions, undefined, segmentFormat);

        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    segmentFormat: { fontSize: '10pt' },
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: { fontSize: '10pt' },
                        },
                        {
                            segmentType: 'Br',
                            format: { fontSize: '10pt' },
                        },
                    ],
                },
            ],
            format: { fontSize: '10pt' },
        });
        expect(domParserSpy).not.toHaveBeenCalled();
        expect(parseFormatSpy).not.toHaveBeenCalled();
        expect(createContextSpy).not.toHaveBeenCalled();
        expect(domToContentModelSpy).not.toHaveBeenCalled();
        expect(retrieveCssRulesSpy).not.toHaveBeenCalled();
        expect(convertInlineCssSpy).not.toHaveBeenCalled();
    });
});
