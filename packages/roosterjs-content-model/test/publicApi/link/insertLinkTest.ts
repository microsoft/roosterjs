import ContentModelEditor from '../../../lib/editor/ContentModelEditor';
import insertLink from '../../../lib/publicApi/link/insertLink';
import { addSegment } from '../../../lib/modelApi/common/addSegment';
import { ChangeSource, PluginEventType } from 'roosterjs-editor-types';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { ContentModelLink } from '../../../lib/publicTypes/decorator/ContentModelLink';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createImage } from '../../../lib/modelApi/creators/createImage';
import { createSelectionMarker } from '../../../lib/modelApi/creators/createSelectionMarker';
import { createText } from '../../../lib/modelApi/creators/createText';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';

describe('insertLink', () => {
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
            getCustomData: () => ({}),
            getFocusedPosition: () => ({}),
        } as any) as IContentModelEditor;
    });

    function runTest(
        model: ContentModelDocument,
        url: string,
        expectedModel: ContentModelDocument | null,
        title?: string,
        displayText?: string,
        target?: string
    ) {
        createContentModel.and.returnValue(model);

        insertLink(editor, url, title, displayText, target);

        if (expectedModel) {
            expect(setContentModel).toHaveBeenCalledTimes(1);
            expect(setContentModel.calls.argsFor(0)[0]).toEqual(expectedModel);
            expect(typeof setContentModel.calls.argsFor(0)[1]!.onNodeCreated).toEqual('function');
        } else {
            expect(setContentModel).not.toHaveBeenCalled();
        }
    }

    it('Empty link string', () => {
        runTest(createContentModelDocument(), '', null);
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
                                link,
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
        const editor = new ContentModelEditor(div, { plugins: [mockedPlugin] });

        editor.focus();

        insertLink(editor, 'http://test.com', 'title');

        editor.dispose();

        const a = div.querySelector('a');

        expect(a!.outerHTML).toBe('<a href="http://test.com" title="title">http://test.com</a>');
        expect(onPluginEvent).toHaveBeenCalledTimes(4);
        expect(onPluginEvent).toHaveBeenCalledWith({
            eventType: PluginEventType.ContentChanged,
            source: ChangeSource.CreateLink,
            data: a,
            additionalData: {
                formatApiName: 'insertLink',
            },
        });

        document.body.removeChild(div);
    });
});
