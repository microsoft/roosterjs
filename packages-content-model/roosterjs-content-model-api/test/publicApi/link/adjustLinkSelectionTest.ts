import adjustLinkSelection from '../../../lib/publicApi/link/adjustLinkSelection';
import { IStandaloneEditor } from 'roosterjs-content-model-types';
import {
    ContentModelDocument,
    ContentModelLink,
    ContentModelFormatter,
    FormatWithContentModelOptions,
} from 'roosterjs-content-model-types';
import {
    addLink,
    addSegment,
    createContentModelDocument,
    createImage,
    createParagraph,
    createSelectionMarker,
    createText,
} from 'roosterjs-content-model-dom';

describe('adjustLinkSelection', () => {
    let editor: IStandaloneEditor;
    let createContentModel: jasmine.Spy<IStandaloneEditor['createContentModel']>;
    let formatContentModel: jasmine.Spy;
    let formatResult: boolean | undefined;
    let model: ContentModelDocument | undefined;

    beforeEach(() => {
        createContentModel = jasmine.createSpy('createContentModel');

        model = undefined;
        formatResult = undefined;

        formatContentModel = jasmine
            .createSpy('formatContentModel')
            .and.callFake(
                (callback: ContentModelFormatter, options: FormatWithContentModelOptions) => {
                    model = createContentModel();

                    formatResult = callback(model, {
                        newEntities: [],
                        deletedEntities: [],
                        newImages: [],
                    });
                }
            );

        editor = ({
            formatContentModel,
        } as any) as IStandaloneEditor;
    });

    function runTest(
        model: ContentModelDocument,
        expectedModel: ContentModelDocument | null,
        expectedText: string,
        expectedUrl: string | null
    ) {
        createContentModel.and.returnValue(model);

        const [text, url] = adjustLinkSelection(editor);

        expect(formatContentModel).toHaveBeenCalledTimes(1);
        expect(formatResult).toBe(!!expectedModel);

        if (expectedModel) {
            expect(model).toEqual(expectedModel);
        }

        expect(text).toBe(expectedText);
        expect(url).toBe(expectedUrl);
    }

    it('Empty doc', () => {
        runTest(createContentModelDocument(), null, '', null);
    });

    it('Doc without selection', () => {
        const doc = createContentModelDocument();
        const text = createText('test');

        addSegment(doc, text);

        runTest(doc, null, '', null);
    });

    it('Doc with selection, but no link', () => {
        const doc = createContentModelDocument();
        const text = createText('test');

        text.isSelected = true;

        addSegment(doc, text);

        runTest(doc, null, 'test', null);
    });

    it('Doc with selection and link', () => {
        const doc = createContentModelDocument();
        const text = createText('test');

        text.isSelected = true;

        addLink(text, {
            dataset: {},
            format: {
                href: 'http://test.com',
            },
        });
        addSegment(doc, text);

        runTest(doc, null, 'test', 'http://test.com');
    });

    it('Doc with link, expand to left', () => {
        const doc = createContentModelDocument();
        const para = createParagraph();
        const text0 = createText('test0');
        const text1 = createText('test1');
        const img = createImage('test');
        const text2 = createText('test2');
        const text3 = createText('test3');
        const link: ContentModelLink = {
            dataset: {},
            format: {
                href: 'http://test.com',
            },
        };

        text2.isSelected = true;
        addLink(text1, link);
        addLink(text2, link);
        addLink(img, link);

        para.segments.push(text0, text1, img, text2, text3);
        doc.blocks.push(para);

        runTest(
            doc,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                format: {},
                                text: 'test0',
                            },
                            {
                                segmentType: 'Text',
                                format: {},
                                text: 'test1',
                                link: link,
                                isSelected: true,
                            },
                            {
                                segmentType: 'Image',
                                format: {},
                                src: 'test',
                                link: link,
                                dataset: {},
                                isSelected: true,
                                isSelectedAsImageSelection: false,
                            },
                            {
                                segmentType: 'Text',
                                format: {},
                                text: 'test2',
                                isSelected: true,
                                link,
                            },
                            {
                                segmentType: 'Text',
                                format: {},
                                text: 'test3',
                            },
                        ],
                    },
                ],
            },
            'test1test2',
            'http://test.com'
        );
    });

    it('Doc with link, expand to right', () => {
        const doc = createContentModelDocument();
        const para = createParagraph();
        const text0 = createText('test0');
        const text1 = createText('test1');
        const img = createImage('test');
        const text2 = createText('test2');
        const text3 = createText('test3');
        const link: ContentModelLink = {
            dataset: {},
            format: {
                href: 'http://test.com',
            },
        };

        text1.isSelected = true;
        addLink(text1, link);
        addLink(text2, link);
        addLink(img, link);

        para.segments.push(text0, text1, img, text2, text3);
        doc.blocks.push(para);

        runTest(
            doc,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                format: {},
                                text: 'test0',
                            },
                            {
                                segmentType: 'Text',
                                format: {},
                                text: 'test1',
                                link: link,
                                isSelected: true,
                            },
                            {
                                segmentType: 'Image',
                                format: {},
                                src: 'test',
                                link: link,
                                dataset: {},
                                isSelected: true,
                                isSelectedAsImageSelection: false,
                            },
                            {
                                segmentType: 'Text',
                                format: {},
                                text: 'test2',
                                isSelected: true,
                                link,
                            },
                            {
                                segmentType: 'Text',
                                format: {},
                                text: 'test3',
                            },
                        ],
                    },
                ],
            },
            'test1test2',
            'http://test.com'
        );
    });

    it('Doc with link, expand both sides from a selection marker', () => {
        const doc = createContentModelDocument();
        const para = createParagraph();
        const text0 = createText('test0');
        const text1 = createText('test1');
        const marker = createSelectionMarker();
        const text2 = createText('test2');
        const text3 = createText('test3');
        const link: ContentModelLink = {
            dataset: {},
            format: {
                href: 'http://test.com',
            },
        };

        addLink(text1, link);
        addLink(text2, link);
        addLink(marker, link);

        para.segments.push(text0, text1, marker, text2, text3);
        doc.blocks.push(para);

        runTest(
            doc,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                format: {},
                                text: 'test0',
                            },
                            {
                                segmentType: 'Text',
                                format: {},
                                text: 'test1',
                                link: link,
                                isSelected: true,
                            },
                            {
                                segmentType: 'Text',
                                format: {},
                                text: 'test2',
                                isSelected: true,
                                link,
                            },
                            {
                                segmentType: 'Text',
                                format: {},
                                text: 'test3',
                            },
                        ],
                    },
                ],
            },
            'test1test2',
            'http://test.com'
        );
    });

    it('Doc without link, expand for word', () => {
        const doc = createContentModelDocument();
        const para = createParagraph();
        const text0 = createText('test0 te');
        const marker = createSelectionMarker();
        const text1 = createText('st1 test2');

        para.segments.push(text0, marker, text1);
        doc.blocks.push(para);

        runTest(
            doc,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                format: {},
                                text: 'test0 ',
                            },
                            {
                                segmentType: 'Text',
                                format: {},
                                text: 'te',
                                isSelected: true,
                            },
                            {
                                segmentType: 'Text',
                                format: {},
                                text: 'st1',
                                isSelected: true,
                            },
                            {
                                segmentType: 'Text',
                                format: {},
                                text: ' test2',
                            },
                        ],
                    },
                ],
            },
            'test1',
            null
        );
    });
});
