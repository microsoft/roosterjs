import adjustImageSelection from '../../../lib/publicApi/image/adjustImageSelection';
import { addSegment } from '../../../lib/modelApi/common/addSegment';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { ContentModelImage } from '../../../lib/publicTypes/segment/ContentModelImage';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createImage } from '../../../lib/modelApi/creators/createImage';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createText } from '../../../lib/modelApi/creators/createText';
import { segmentTestCommon } from '../segment/segmentTestCommon';

describe('adjustImageSelection', () => {
    function runTest(
        model: ContentModelDocument,
        expectedModel: ContentModelDocument,
        expectedImage: ContentModelImage | null,
        calledTimes: number
    ) {
        let image: any;

        segmentTestCommon(
            'adjustImageSelection',
            editor => {
                image = adjustImageSelection(editor);
            },
            model,
            expectedModel,
            calledTimes
        );

        expect(image).toBe(expectedImage);
    }

    it('Empty doc', () => {
        runTest(
            createContentModelDocument(),
            {
                blockGroupType: 'Document',
                blocks: [],
            },
            null,
            0
        );
    });

    it('Doc without selection', () => {
        const doc = createContentModelDocument();
        const img = createImage('test');

        addSegment(doc, img);

        runTest(
            doc,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        isImplicit: true,
                        segments: [
                            {
                                segmentType: 'Image',
                                src: 'test',
                                dataset: {},
                                format: {},
                            },
                        ],
                    },
                ],
            },
            null,
            0
        );
    });

    it('Doc with selection, but no image', () => {
        const doc = createContentModelDocument();
        const text = createText('test');

        text.isSelected = true;

        addSegment(doc, text);

        runTest(
            doc,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        isImplicit: true,
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            null,
            0
        );
    });

    it('Doc with selection and image', () => {
        const doc = createContentModelDocument();
        const img = createImage('test');

        img.isSelected = true;

        addSegment(doc, img);

        runTest(
            doc,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        isImplicit: true,
                        segments: [img],
                    },
                ],
            },
            img,
            0
        );
    });

    it('Doc with image, shrink selection', () => {
        const doc = createContentModelDocument();
        const para = createParagraph();
        const text0 = createText('test0');
        const text1 = createText('test1');
        const img1 = createImage('img1');
        const text2 = createText('test2');
        const img2 = createImage('img2');
        const text3 = createText('test3');

        text1.isSelected = true;
        img1.isSelected = true;
        text2.isSelected = true;
        img2.isSelected = true;
        text3.isSelected = true;

        para.segments.push(text0, text1, img1, text2, img2, text3);
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
                            },
                            {
                                segmentType: 'Image',
                                format: {},
                                src: 'img1',
                                dataset: {},
                                isSelected: true,
                                isSelectedAsImageSelection: true,
                            },
                            {
                                segmentType: 'Text',
                                format: {},
                                text: 'test2',
                            },
                            {
                                segmentType: 'Image',
                                format: {},
                                src: 'img2',
                                dataset: {},
                                isSelectedAsImageSelection: false,
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
            img1,
            1
        );
    });
});
