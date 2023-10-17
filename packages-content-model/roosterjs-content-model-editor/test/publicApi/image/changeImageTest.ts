import * as pendingFormat from '../../../lib/modelApi/format/pendingFormat';
import * as readFile from '../../../lib/domUtils/readFile';
import changeImage from '../../../lib/publicApi/image/changeImage';
import { ContentModelDocument } from 'roosterjs-content-model-types';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';
import { PluginEventType } from 'roosterjs-editor-types';
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
    let triggerPluginEvent: jasmine.Spy;

    function runTest(
        model: ContentModelDocument,
        executionCallback: (editor: IContentModelEditor) => void,
        result: ContentModelDocument,
        calledTimes: number
    ) {
        const addUndoSnapshot = jasmine
            .createSpy('addUndoSnapshot')
            .and.callFake(
                (callback: () => void, source: string, canUndoByBackspace, param: any) => {
                    expect(source).toBe(undefined!);
                    expect(param.formatApiName).toBe('changeImage');
                    callback();
                }
            );
        const setContentModel = jasmine.createSpy().and.callFake((model: ContentModelDocument) => {
            expect(model).toEqual(result);
        });

        spyOn(pendingFormat, 'setPendingFormat');
        spyOn(pendingFormat, 'getPendingFormat').and.returnValue(null);

        const getDOMSelection = jasmine
            .createSpy()
            .and.returnValues({ type: 'image', image: imageNode });
        triggerPluginEvent = jasmine.createSpy('triggerPluginEvent').and.callThrough();
        const getVisibleViewport = jasmine.createSpy().and.callThrough();

        const editor = ({
            createContentModel: () => model,
            addUndoSnapshot,
            focus: jasmine.createSpy(),
            setContentModel,
            isDisposed: () => false,
            getDocument: () => document,
            getDOMSelection,
            triggerPluginEvent,
            getVisibleViewport,
            isDarkMode: () => false,
        } as any) as IContentModelEditor;

        executionCallback(editor);

        expect(addUndoSnapshot).toHaveBeenCalledTimes(calledTimes);
        expect(setContentModel).toHaveBeenCalledTimes(calledTimes);
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

        expect(triggerPluginEvent).toHaveBeenCalledTimes(0);
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

        expect(triggerPluginEvent).toHaveBeenCalledTimes(0);
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

        expect(triggerPluginEvent).toHaveBeenCalledTimes(1);
        expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.ContentChanged, {
            contentModel: doc,
            selection: undefined,
            source: 'Format',
            data: undefined,
            additionalData: { formatApiName: 'changeImage' },
        });
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

        expect(triggerPluginEvent).toHaveBeenCalledTimes(2);
        expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.EditImage, {
            image: imageNode,
            newSrc: testUrl,
            previousSrc: 'test',
            originalSrc: '',
        });
        expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.ContentChanged, {
            contentModel: doc,
            selection: undefined,
            source: 'Format',
            data: undefined,
            additionalData: { formatApiName: 'changeImage' },
        });
    });
});
