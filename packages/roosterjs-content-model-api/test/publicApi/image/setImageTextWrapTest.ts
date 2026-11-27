import {
    ContentModelDocument,
    ContentModelImageFormat,
    ImageTextWrap,
} from 'roosterjs-content-model-types';
import { segmentTestCommon } from '../segment/segmentTestCommon';
import { setImageTextWrap } from '../../../lib/publicApi/image/setImageTextWrap';
import {
    addSegment,
    createContentModelDocument,
    createImage,
    createText,
} from 'roosterjs-content-model-dom';

describe('setImageTextWrap', () => {
    function runTest(
        model: ContentModelDocument,
        textWrap: ImageTextWrap,
        result: ContentModelDocument,
        calledTimes: number
    ) {
        segmentTestCommon(
            'setImageTextWrap',
            editor => setImageTextWrap(editor, textWrap),
            model,
            result,
            calledTimes
        );
    }

    function createDocWithSelectedImage(format?: ContentModelImageFormat) {
        const doc = createContentModelDocument();
        const img = createImage('test', format);

        img.isSelected = true;
        addSegment(doc, img);

        return doc;
    }

    function createExpectedDoc(format: ContentModelImageFormat): ContentModelDocument {
        return {
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
                            isSelected: true,
                            dataset: {},
                            format,
                        },
                    ],
                },
            ],
        };
    }

    it('Empty doc', () => {
        runTest(
            createContentModelDocument(),
            'square',
            {
                blockGroupType: 'Document',
                blocks: [],
            },
            0
        );
    });

    it('Doc without selection', () => {
        const doc = createContentModelDocument();
        const img = createImage('test');

        addSegment(doc, img);

        runTest(
            doc,
            'square',
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
            'square',
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
            1
        );
    });

    it('Inline', () => {
        runTest(
            createDocWithSelectedImage({ display: 'block', float: 'left' }),
            'inline',
            createExpectedDoc({ display: 'inline' }),
            1
        );
    });

    it('Square', () => {
        runTest(
            createDocWithSelectedImage(),
            'square',
            createExpectedDoc({ display: 'inline', float: 'left' }),
            1
        );
    });

    it('Square from top and bottom', () => {
        runTest(
            createDocWithSelectedImage({ display: 'block' }),
            'square',
            createExpectedDoc({ display: 'inline', float: 'left' }),
            1
        );
    });

    it('Top and bottom', () => {
        runTest(
            createDocWithSelectedImage({ display: 'inline', float: 'left' }),
            'topAndBottom',
            createExpectedDoc({ display: 'block' }),
            1
        );
    });
});
