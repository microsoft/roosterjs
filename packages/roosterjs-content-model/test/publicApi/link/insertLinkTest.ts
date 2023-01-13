import insertLink from '../../../lib/publicApi/link/insertLink';
import { addSegment } from '../../../lib/modelApi/common/addSegment';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { ContentModelLink } from '../../../lib/publicTypes/decorator/ContentModelLink';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createImage } from '../../../lib/modelApi/creators/createImage';
import { createSelectionMarker } from '../../../lib/modelApi/creators/createSelectionMarker';
import { createText } from '../../../lib/modelApi/creators/createText';
import { HyperLinkColorPlaceholder } from '../../../lib/formatHandlers/utils/defaultStyles';
import { segmentTestCommon } from '../segment/segmentTestCommon';

describe('insertLink', () => {
    function runTest(
        model: ContentModelDocument,
        url: string,
        expectedModel: ContentModelDocument,
        calledTimes: number,
        title?: string,
        displayText?: string,
        target?: string
    ) {
        segmentTestCommon(
            'insertLink',
            editor => insertLink(editor, url, title, displayText, target),
            model,
            expectedModel,
            calledTimes
        );
    }

    it('Empty link string', () => {
        runTest(
            createContentModelDocument(),
            '',
            {
                blockGroupType: 'Document',
                blocks: [],
            },
            0
        );
    });

    it('Valid url', () => {
        const doc = createContentModelDocument();
        addSegment(doc, createSelectionMarker());
        runTest(
            doc,
            'http://test.com',
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
                                format: {
                                    underline: true,
                                    textColor: HyperLinkColorPlaceholder,
                                },
                                text: 'http://test.com',
                                link: {
                                    dataset: {},
                                    format: {
                                        href: 'http://test.com',
                                        anchorTitle: undefined,
                                        target: undefined,
                                    },
                                },
                            },
                            {
                                segmentType: 'SelectionMarker',
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

    it('Valid url on existing text, no display text', () => {
        const doc = createContentModelDocument();
        const text = createText('test');

        text.isSelected = true;
        addSegment(doc, text);

        runTest(
            doc,
            'http://test.com',
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
                                format: {
                                    underline: true,
                                    textColor: HyperLinkColorPlaceholder,
                                },
                                text: 'test',
                                link: {
                                    dataset: {},
                                    format: {
                                        href: 'http://test.com',
                                        anchorTitle: 'title',
                                        target: undefined,
                                    },
                                },
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            1,
            'title'
        );
    });

    it('Valid url on existing text, with display text and target', () => {
        const doc = createContentModelDocument();
        const text = createText('test');

        text.isSelected = true;
        addSegment(doc, text);

        runTest(
            doc,
            'http://test.com',
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
                                format: {
                                    underline: true,
                                    textColor: HyperLinkColorPlaceholder,
                                },
                                text: 'linkText',
                                link: {
                                    dataset: {},
                                    format: {
                                        href: 'http://test.com',
                                        anchorTitle: 'title',
                                        target: 'target',
                                    },
                                },
                            },
                            {
                                segmentType: 'SelectionMarker',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            1,
            'title',
            'linkText',
            'target'
        );
    });

    it('Valid url on existing multiple text and image, insert link with same display text', () => {
        const doc = createContentModelDocument();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const image = createImage('test');

        text1.isSelected = true;
        text2.isSelected = true;
        image.isSelected = true;

        addSegment(doc, text1);
        addSegment(doc, image);
        addSegment(doc, text2);

        const link: ContentModelLink = {
            dataset: {},
            format: {
                href: 'http://test.com',
                anchorTitle: 'title',
                target: undefined,
            },
        };

        runTest(
            doc,
            'http://test.com',
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
                                format: {
                                    underline: true,
                                    textColor: HyperLinkColorPlaceholder,
                                },
                                text: 'test1',
                                link,
                                isSelected: true,
                            },
                            {
                                segmentType: 'Image',
                                format: {
                                    underline: true,
                                    textColor: HyperLinkColorPlaceholder,
                                },
                                src: 'test',
                                dataset: {},
                                link,
                                isSelected: true,
                            },
                            {
                                segmentType: 'Text',
                                format: {
                                    underline: true,
                                    textColor: HyperLinkColorPlaceholder,
                                },
                                text: 'test2',
                                link,
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            1,
            'title',
            'test1test2'
        );
    });

    it('Valid url on existing multiple text and image, insert link with different display text', () => {
        const doc = createContentModelDocument();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const image = createImage('test');

        text1.isSelected = true;
        text2.isSelected = true;
        image.isSelected = true;

        addSegment(doc, text1);
        addSegment(doc, image);
        addSegment(doc, text2);

        const link: ContentModelLink = {
            dataset: {},
            format: {
                href: 'http://test.com',
                anchorTitle: 'title',
                target: undefined,
            },
        };

        runTest(
            doc,
            'http://test.com',
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
                                format: {
                                    underline: true,
                                    textColor: HyperLinkColorPlaceholder,
                                },
                                text: 'new text',
                                link,
                            },
                            {
                                segmentType: 'SelectionMarker',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            1,
            'title',
            'new text'
        );
    });
});
