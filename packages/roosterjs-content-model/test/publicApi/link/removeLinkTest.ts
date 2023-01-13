import removeLink from '../../../lib/publicApi/link/removeLink';
import { addLink } from '../../../lib/modelApi/common/addLink';
import { addSegment } from '../../../lib/modelApi/common/addSegment';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { ContentModelLink } from '../../../lib/publicTypes/decorator/ContentModelLink';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createImage } from '../../../lib/modelApi/creators/createImage';
import { createText } from '../../../lib/modelApi/creators/createText';
import { segmentTestCommon } from '../segment/segmentTestCommon';

describe('removeLink', () => {
    function runTest(
        model: ContentModelDocument,
        expectedModel: ContentModelDocument,
        calledTimes: number
    ) {
        segmentTestCommon('removeLink', removeLink, model, expectedModel, calledTimes);
    }

    it('Empty doc', () => {
        runTest(createContentModelDocument(), { blockGroupType: 'Document', blocks: [] }, 0);
    });

    it('No link', () => {
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
                                format: {},
                                text: 'test',
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            0
        );
    });

    it('One link is selected', () => {
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

        runTest(
            doc,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        isImplicit: true,
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: { underline: false },
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            1
        );
    });

    it('Multiple links are selected', () => {
        const doc = createContentModelDocument();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const image = createImage('test');

        text1.isSelected = true;
        text2.isSelected = true;
        image.isSelected = true;

        addLink(text1, {
            dataset: {},
            format: {
                href: 'http://test.com/1',
            },
        });
        addLink(image, {
            dataset: {},
            format: {
                href: 'http://test.com/2',
            },
        });
        addSegment(doc, text1);
        addSegment(doc, text2);
        addSegment(doc, image);

        runTest(
            doc,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        isImplicit: true,
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test1',
                                format: { underline: false },
                                isSelected: true,
                            },
                            {
                                segmentType: 'Text',
                                text: 'test2',
                                format: {},
                                isSelected: true,
                            },
                            {
                                segmentType: 'Image',
                                src: 'test',
                                dataset: {},
                                format: { underline: false },
                                isSelected: true,
                                isSelectedAsImageSelection: false,
                            },
                        ],
                    },
                ],
            },
            1
        );
    });

    it('Expand selection with multiple links', () => {
        const doc = createContentModelDocument();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');
        const text4 = createText('test4');

        text2.isSelected = true;
        text3.isSelected = true;

        const link1: ContentModelLink = {
            dataset: {},
            format: {
                href: 'http://test.com/1',
            },
        };
        const link2: ContentModelLink = {
            dataset: {},
            format: {
                href: 'http://test.com/1',
            },
        };

        addLink(text1, link1);
        addLink(text2, link1);
        addLink(text3, link2);
        addLink(text4, link2);

        addSegment(doc, text1);
        addSegment(doc, text2);
        addSegment(doc, text3);
        addSegment(doc, text4);

        runTest(
            doc,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        isImplicit: true,
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test1',
                                format: { underline: false },
                                isSelected: true,
                            },
                            {
                                segmentType: 'Text',
                                text: 'test2',
                                format: { underline: false },
                                isSelected: true,
                            },
                            {
                                segmentType: 'Text',
                                text: 'test3',
                                format: { underline: false },
                                isSelected: true,
                            },
                            {
                                segmentType: 'Text',
                                text: 'test4',
                                format: { underline: false },
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            1
        );
    });

    it('Do not shrink selection', () => {
        const doc = createContentModelDocument();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');

        text1.isSelected = true;
        text2.isSelected = true;
        text3.isSelected = true;

        const link1: ContentModelLink = {
            dataset: {},
            format: {
                href: 'http://test.com/1',
            },
        };

        addLink(text2, link1);

        addSegment(doc, text1);
        addSegment(doc, text2);
        addSegment(doc, text3);

        runTest(
            doc,
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        isImplicit: true,
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test1',
                                format: {},
                                isSelected: true,
                            },
                            {
                                segmentType: 'Text',
                                text: 'test2',
                                format: { underline: false },
                                isSelected: true,
                            },
                            {
                                segmentType: 'Text',
                                text: 'test3',
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
});
