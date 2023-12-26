import * as readFile from 'roosterjs-content-model-core/lib/publicApi/domUtils/readFile';
import changeImage from '../../../lib/publicApi/image/changeImage';
import { IStandaloneEditor } from 'roosterjs-content-model-types';
import { PluginEventType } from 'roosterjs-editor-types';
import {
    ContentModelDocument,
    ContentModelFormatter,
    FormatWithContentModelOptions,
} from 'roosterjs-content-model-types';
import {
    addSegment,
    createContentModelDocument,
    createImage,
    createText,
} from 'roosterjs-content-model-dom';

describe('changeImage', () => {
    const testUrl = 'http://test.com/test';
    const blob = ({ a: 1 } as any) as File;
    let imageNode: HTMLImageElement;
    let triggerEvent: jasmine.Spy;

    function runTest(
        model: ContentModelDocument,
        executionCallback: (editor: IStandaloneEditor) => void,
        result: ContentModelDocument,
        calledTimes: number
    ) {
        const getDOMSelection = jasmine
            .createSpy()
            .and.returnValues({ type: 'image', image: imageNode });
        triggerEvent = jasmine.createSpy('triggerEvent').and.callThrough();

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

        const editor = ({
            focus: jasmine.createSpy(),
            isDisposed: () => false,
            getPendingFormat: () => null as any,
            getDOMSelection,
            triggerEvent,
            formatContentModel,
        } as any) as IStandaloneEditor;

        executionCallback(editor);

        expect(formatResult).toBe(calledTimes > 0);
        expect(formatContentModel).toHaveBeenCalledTimes(1);
        expect(model).toEqual(result);
    }

    beforeEach(() => {
        imageNode = document.createElement('img');

        spyOn(readFile, 'readFile').and.callFake((_, callback) => {
            callback(testUrl);
        });
    });

    it('Empty doc', () => {
        runTest(
            createContentModelDocument(),
            editor => {
                changeImage(editor, blob);
            },
            {
                blockGroupType: 'Document',
                blocks: [],
            },
            0
        );

        expect(triggerEvent).toHaveBeenCalledTimes(0);
    });

    it('Doc without selection', () => {
        const doc = createContentModelDocument();
        const img = createImage('test');
        addSegment(doc, img);

        runTest(
            doc,
            editor => {
                changeImage(editor, blob);
            },
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

        expect(triggerEvent).toHaveBeenCalledTimes(0);
    });

    it('Doc with selection, but no image', () => {
        const doc = createContentModelDocument();
        const text = createText('test');
        text.isSelected = true;
        addSegment(doc, text);

        runTest(
            doc,
            editor => {
                changeImage(editor, blob);
            },
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
        img.format.width = '10px';
        img.format.height = '10px';
        img.format.boxShadow = '0px 0px 3px 3px #aaaaaa';

        addSegment(doc, img);

        runTest(
            doc,
            editor => {
                changeImage(editor, blob);
            },
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
                                src: testUrl,
                                isSelected: true,
                                dataset: {},
                                alt: '',
                                format: {
                                    boxShadow: '0px 0px 3px 3px #aaaaaa',
                                    width: '',
                                    height: '',
                                },
                            },
                        ],
                    },
                ],
            },
            1
        );

        expect(triggerEvent).toHaveBeenCalledTimes(1);
        expect(triggerEvent).toHaveBeenCalledWith(PluginEventType.EditImage, {
            image: imageNode,
            newSrc: testUrl,
            previousSrc: 'test',
            originalSrc: '',
        });
    });
});
