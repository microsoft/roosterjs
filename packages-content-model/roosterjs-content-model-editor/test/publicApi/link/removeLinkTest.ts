import removeLink from '../../../lib/publicApi/link/removeLink';
import { ContentModelDocument, ContentModelLink } from 'roosterjs-content-model-types';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';
import {
    ContentModelFormatter,
    FormatWithContentModelOptions,
} from '../../../lib/publicTypes/parameter/FormatWithContentModelContext';
import {
    addLink,
    addSegment,
    createContentModelDocument,
    createImage,
    createText,
} from 'roosterjs-content-model-dom';

describe('removeLink', () => {
    let editor: IContentModelEditor;

    beforeEach(() => {
        editor = ({
            focus: () => {},
        } as any) as IContentModelEditor;
    });

    function runTest(model: ContentModelDocument, expectedModel: ContentModelDocument | null) {
        let formatResult: boolean | undefined;

        const formatContentModel = jasmine
            .createSpy('formatContentModel')
            .and.callFake(
                (callback: ContentModelFormatter, options: FormatWithContentModelOptions) => {
                    formatResult = callback(model, {
                        newEntities: [],
                        deletedEntities: [],
                        newImages: [],
                        rawEvent: options.rawEvent,
                    });
                }
            );

        editor.formatContentModel = formatContentModel;

        removeLink(editor);

        expect(formatContentModel).toHaveBeenCalledTimes(1);
        expect(formatResult).toBe(!!expectedModel);

        if (expectedModel) {
            expect(model).toEqual(expectedModel);
        }
    }

    it('Empty doc', () => {
        runTest(createContentModelDocument(), null);
    });

    it('No link', () => {
        const doc = createContentModelDocument();
        const text = createText('test');

        text.isSelected = true;

        addSegment(doc, text);

        runTest(doc, null);
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

        runTest(doc, {
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
                            format: {},
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
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

        runTest(doc, {
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
                            format: {},
                            isSelected: true,
                        },
                        {
                            segmentType: 'Image',
                            src: 'test',
                            dataset: {},
                            format: {},
                            isSelected: true,
                            isSelectedAsImageSelection: false,
                        },
                    ],
                },
            ],
        });
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

        runTest(doc, {
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
                            format: {},
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            text: 'test3',
                            format: {},
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            text: 'test4',
                            format: {},
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
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

        runTest(doc, {
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
                            format: {},
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
        });
    });
});
