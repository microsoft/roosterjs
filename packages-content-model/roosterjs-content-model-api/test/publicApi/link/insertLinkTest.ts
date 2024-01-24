import insertLink from '../../../lib/publicApi/link/insertLink';
import { ChangeSource, StandaloneEditor } from 'roosterjs-content-model-core';
import { IStandaloneEditor } from 'roosterjs-content-model-types';
import {
    ContentModelDocument,
    ContentModelLink,
    ContentModelFormatter,
    FormatWithContentModelOptions,
} from 'roosterjs-content-model-types';
import {
    addSegment,
    createContentModelDocument,
    createImage,
    createSelectionMarker,
    createText,
} from 'roosterjs-content-model-dom';

describe('insertLink', () => {
    let editor: IStandaloneEditor;

    beforeEach(() => {
        editor = ({
            focus: () => {},
            getPendingFormat: () => null as any,
        } as any) as IStandaloneEditor;
    });

    function runTest(
        model: ContentModelDocument,
        url: string,
        expectedModel: ContentModelDocument | null,
        title?: string,
        displayText?: string,
        target?: string
    ) {
        let formatResult: boolean | undefined;

        const formatContentModel = jasmine
            .createSpy('formatContentModel')
            .and.callFake(
                (callback: ContentModelFormatter, options: FormatWithContentModelOptions) => {
                    formatResult = callback(model, {
                        newEntities: [],
                        deletedEntities: [],
                        newImages: [],
                    });
                }
            );

        editor.formatContentModel = formatContentModel;

        insertLink(editor, url, title, displayText, target);

        expect(formatContentModel).toHaveBeenCalledTimes(1);
        expect(formatResult).toBe(!!expectedModel);

        if (expectedModel) {
            expect(model).toEqual(expectedModel);
        }
    }

    it('Empty link string', () => {
        const formatContentModel = jasmine.createSpy('formatContentModel');

        editor.formatContentModel = formatContentModel;

        insertLink(editor, '');

        expect(formatContentModel).not.toHaveBeenCalled();
    });

    it('Valid url', () => {
        const doc = createContentModelDocument();
        addSegment(doc, createSelectionMarker());
        runTest(doc, 'http://test.com', {
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
                            text: 'http://test.com',
                            link: {
                                dataset: {},
                                format: {
                                    href: 'http://test.com',
                                    anchorTitle: undefined,
                                    target: undefined,
                                    underline: true,
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
        });
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
                                format: {},
                                text: 'test',
                                link: {
                                    dataset: {},
                                    format: {
                                        href: 'http://test.com',
                                        anchorTitle: 'title',
                                        target: undefined,
                                        underline: true,
                                    },
                                },
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
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
                        isImplicit: false,
                        segments: [
                            {
                                segmentType: 'Text',
                                format: {},
                                text: 'linkText',
                                link: {
                                    dataset: {},
                                    format: {
                                        href: 'http://test.com',
                                        anchorTitle: 'title',
                                        target: 'target',
                                        underline: true,
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
                underline: true,
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
                                format: {},
                                text: 'test1',
                                link,
                                isSelected: true,
                            },
                            {
                                segmentType: 'Image',
                                format: {},
                                src: 'test',
                                dataset: {},
                                link: {
                                    dataset: link.dataset,
                                    format: { ...link.format, underline: false },
                                },
                                isSelected: true,
                            },
                            {
                                segmentType: 'Text',
                                format: {},
                                text: 'test2',
                                link,
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
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
                underline: true,
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
                        isImplicit: false,
                        segments: [
                            {
                                segmentType: 'Text',
                                format: {},
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
            'title',
            'new text'
        );
    });

    it('Valid url on existing text, trigger event with data', () => {
        const div = document.createElement('div');
        document.body.appendChild(div);

        const onPluginEvent = jasmine.createSpy('onPluginEvent');
        const mockedPlugin = {
            initialize: () => {},
            dispose: () => {},
            getName: () => 'mock',
            onPluginEvent: onPluginEvent,
        };
        const editor = new StandaloneEditor(div, {
            plugins: [mockedPlugin],
        });

        editor.focus();

        insertLink(editor, 'http://test.com', 'title');

        editor.dispose();

        const a = div.querySelector('a');

        expect(a!.outerHTML).toBe('<a href="http://test.com" title="title">http://test.com</a>');
        expect(onPluginEvent).toHaveBeenCalledWith({
            eventType: 'contentChanged',
            source: ChangeSource.CreateLink,
            data: a,
            formatApiName: 'insertLink',
            contentModel: jasmine.anything(),
            selection: jasmine.anything(),
            changedEntities: [],
        });

        document.body.removeChild(div);
    });

    it('Valid url with trailing space', () => {
        const doc = createContentModelDocument();
        const text = createText('test     ');
        text.isSelected = true;
        addSegment(doc, text);

        runTest(doc, 'http://test.com', {
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
                            link: {
                                dataset: {},
                                format: {
                                    href: 'http://test.com',
                                    anchorTitle: undefined,
                                    target: undefined,
                                    underline: true,
                                },
                            },
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            format: {},
                            text: '     ',
                            link: {
                                dataset: {},
                                format: {
                                    href: 'http://test.com',
                                    anchorTitle: undefined,
                                    target: undefined,
                                    underline: false,
                                },
                            },
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });

    it('Invalid url', () => {
        const doc = createContentModelDocument();
        addSegment(doc, createSelectionMarker());

        const url = 'javasc\nript:onC\nlick()';
        let formatResult: boolean | undefined;
        const formatContentModel = jasmine
            .createSpy('formatContentModel')
            .and.callFake(
                (callback: ContentModelFormatter, options: FormatWithContentModelOptions) => {
                    formatResult = callback(doc, {
                        newEntities: [],
                        deletedEntities: [],
                        newImages: [],
                    });
                }
            );

        editor.formatContentModel = formatContentModel;

        insertLink(editor, url);

        expect(formatContentModel).toHaveBeenCalledTimes(0);
        expect(formatResult).toBeFalsy();
        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    format: {},
                    isImplicit: true,
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                },
            ],
        });
    });
});
