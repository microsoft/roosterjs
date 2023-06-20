import setImageBoxShadow from '../../../lib/publicApi/image/setImageBoxShadow';
import { addSegment } from '../../../lib/modelApi/common/addSegment';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createImage } from '../../../lib/modelApi/creators/createImage';
import { createText } from '../../../lib/modelApi/creators/createText';
import { segmentTestCommon } from '../segment/segmentTestCommon';

describe('setImageBoxShadow', () => {
    const style = '0px 0px 3px 3px #aaaaaa';
    const margin = '1px';
    function runTest(
        model: ContentModelDocument,
        result: ContentModelDocument,
        calledTimes: number,
        nullMargin: boolean = false
    ) {
        segmentTestCommon(
            'setImageBoxShadow',
            editor => setImageBoxShadow(editor, style, nullMargin ? null : margin),
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
            1
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
                        segments: [
                            {
                                segmentType: 'Image',
                                src: 'test',
                                isSelected: true,
                                dataset: {},
                                format: {
                                    boxShadow: '0px 0px 3px 3px #aaaaaa',
                                    marginBottom: margin,
                                    marginLeft: margin,
                                    marginRight: margin,
                                    marginTop: margin,
                                },
                            },
                        ],
                    },
                ],
            },
            1
        );
    });

    it('Doc with selection and image with margin, removing margin', () => {
        const doc = createContentModelDocument();
        const img = createImage('test', {
            marginBottom: margin,
            marginLeft: margin,
            marginRight: margin,
            marginTop: margin,
        });

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
                                },
                            },
                        ],
                    },
                ],
            },
            1,
            true /* nullMargin */
        );
    });
});
