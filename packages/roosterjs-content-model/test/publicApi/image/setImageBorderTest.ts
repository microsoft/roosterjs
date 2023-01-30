import setImageBorder from '../../../lib/publicApi/image/setImageBorder';
import { addSegment } from '../../../lib/modelApi/common/addSegment';
import { Border } from '../../../lib/domUtils/borderValues';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createImage } from '../../../lib/modelApi/creators/createImage';
import { createText } from '../../../lib/modelApi/creators/createText';
import { segmentTestCommon } from '../segment/segmentTestCommon';

describe('setImageBorder', () => {
    function runTest(
        model: ContentModelDocument,
        result: ContentModelDocument,
        calledTimes: number,
        border?: Border,
        isPt?: boolean
    ) {
        segmentTestCommon(
            'setImageBorder',
            editor => setImageBorder(editor, border, isPt),
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

    it('Doc with selection and image - set color', () => {
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
                                    borderBottom: '1px solid red',
                                    borderLeft: '1px solid red',
                                    borderRight: '1px solid red',
                                    borderTop: '1px solid red',
                                    borderRadius: '5px',
                                },
                            },
                        ],
                    },
                ],
            },
            1,
            { color: 'red' }
        );
    });

    it('Doc with selection and image - set style', () => {
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
                                    borderBottom: '1px groove',
                                    borderLeft: '1px groove',
                                    borderRight: '1px groove',
                                    borderTop: '1px groove',
                                    borderRadius: '5px',
                                },
                            },
                        ],
                    },
                ],
            },
            1,
            { style: 'groove' }
        );
    });

    it('Doc with selection and image - set width ', () => {
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
                                    borderBottom: '10px solid',
                                    borderLeft: '10px solid',
                                    borderRight: '10px solid',
                                    borderTop: '10px solid',
                                    borderRadius: '5px',
                                },
                            },
                        ],
                    },
                ],
            },
            1,
            { width: '10px' }
        );
    });

    it('Doc with selection and image - all formats', () => {
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
                                    borderBottom: ptToPx(10) + 'px solid',
                                    borderLeft: ptToPx(10) + 'px solid',
                                    borderRight: ptToPx(10) + 'px solid',
                                    borderTop: ptToPx(10) + 'px solid',
                                    borderRadius: '5px',
                                },
                            },
                        ],
                    },
                ],
            },
            1,
            { width: '10pt' },
            true
        );
    });

    it('Doc with selection and image - set width ', () => {
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
                                    borderBottom: `${ptToPx(10)}px groove red`,
                                    borderLeft: `${ptToPx(10)}px groove red`,
                                    borderRight: `${ptToPx(10)}px groove red`,
                                    borderTop: `${ptToPx(10)}px groove red`,
                                    borderRadius: '5px',
                                },
                            },
                        ],
                    },
                ],
            },
            1,
            { color: 'red', style: 'groove', width: '10pt' },
            true
        );
    });
});

function ptToPx(pt: number): number {
    return Math.round((pt * 4000) / 3) / 1000;
}
