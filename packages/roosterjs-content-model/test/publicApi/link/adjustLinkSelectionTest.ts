import adjustLinkSelection from '../../../lib/publicApi/link/adjustLinkSelection';
import { addLink } from '../../../lib/modelApi/common/addDecorators';
import { addSegment } from '../../../lib/modelApi/common/addSegment';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { ContentModelLink } from '../../../lib/publicTypes/decorator/ContentModelLink';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createImage } from '../../../lib/modelApi/creators/createImage';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createSelectionMarker } from '../../../lib/modelApi/creators/createSelectionMarker';
import { createText } from '../../../lib/modelApi/creators/createText';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';

describe('adjustLinkSelection', () => {
    let editor: IContentModelEditor;
    let setContentModel: jasmine.Spy<IContentModelEditor['setContentModel']>;
    let createContentModel: jasmine.Spy<IContentModelEditor['createContentModel']>;

    beforeEach(() => {
        setContentModel = jasmine.createSpy('setContentModel');
        createContentModel = jasmine.createSpy('createContentModel');

        editor = ({
            focus: () => {},
            addUndoSnapshot: (callback: Function) => callback(),
            setContentModel,
            createContentModel,
        } as any) as IContentModelEditor;
    });

    function runTest(
        model: ContentModelDocument,
        expectedModel: ContentModelDocument | null,
        expectedText: string,
        expectedUrl: string | null
    ) {
        createContentModel.and.returnValue(model);

        const [text, url] = adjustLinkSelection(editor);

        if (expectedModel) {
            expect(setContentModel).toHaveBeenCalledTimes(1);
            expect(setContentModel).toHaveBeenCalledWith(expectedModel, {
                onNodeCreated: undefined,
            });
        } else {
            expect(setContentModel).not.toHaveBeenCalled();
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
