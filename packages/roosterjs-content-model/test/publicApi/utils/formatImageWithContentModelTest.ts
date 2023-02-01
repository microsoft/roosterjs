import formatImageWithContentModel from '../../../lib/publicApi/utils/formatImageWithContentModel';
import { addSegment } from '../../../lib/modelApi/common/addSegment';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { ContentModelImage } from '../../../lib/publicTypes/segment/ContentModelImage';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createImage } from '../../../lib/modelApi/creators/createImage';
import { createText } from '../../../lib/modelApi/creators/createText';
import { segmentTestCommon } from '../segment/segmentTestCommon';

describe('formatImageWithContentModel', () => {
    function runTest(
        model: ContentModelDocument,
        result: ContentModelDocument,
        calledTimes: number,
        callback: (image: ContentModelImage) => void
    ) {
        segmentTestCommon(
            'apiTest',
            editor => formatImageWithContentModel(editor, 'apiTest', callback),
            model,
            result,
            calledTimes
        );
    }

    it('Empty doc', () => {
        runTest(
            createContentModelDocument(),
            {
                blockGroupType: 'Document',
                blocks: [],
            },
            0,
            (image: ContentModelImage) => {
                return;
            }
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
            0,
            (image: ContentModelImage) => {
                return;
            }
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
            1,
            (image: ContentModelImage) => {
                return;
            }
        );
    });

    it('Doc with selection and image - add border top ', () => {
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
                        segments: [
                            {
                                segmentType: 'Image',
                                src: 'test',
                                isSelected: true,
                                dataset: {},
                                format: {
                                    boxShadow: '0px 0px 3px 3px #aaaaaa',
                                    borderTop: '1px solid green',
                                },
                            },
                        ],
                    },
                ],
            },
            1,
            (image: ContentModelImage) => {
                image.format.borderTop = '1px solid green';
                image.format.boxShadow = '0px 0px 3px 3px #aaaaaa';
            }
        );
    });
});
