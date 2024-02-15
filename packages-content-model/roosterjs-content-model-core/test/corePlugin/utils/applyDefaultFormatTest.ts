import * as deleteSelection from '../../../lib/publicApi/selection/deleteSelection';
import * as normalizeContentModel from 'roosterjs-content-model-dom/lib/modelApi/common/normalizeContentModel';
import { applyDefaultFormat } from '../../../lib/corePlugin/utils/applyDefaultFormat';
import {
    ContentModelDocument,
    ContentModelFormatter,
    ContentModelSegmentFormat,
    FormatContentModelContext,
    FormatContentModelOptions,
    IStandaloneEditor,
    InsertPoint,
} from 'roosterjs-content-model-types';
import {
    createContentModelDocument,
    createDivider,
    createImage,
    createParagraph,
    createSelectionMarker,
    createText,
} from 'roosterjs-content-model-dom';

describe('applyDefaultFormat', () => {
    let editor: IStandaloneEditor;
    let getDOMSelectionSpy: jasmine.Spy;
    let formatContentModelSpy: jasmine.Spy;
    let deleteSelectionSpy: jasmine.Spy;
    let normalizeContentModelSpy: jasmine.Spy;
    let takeSnapshotSpy: jasmine.Spy;
    let getPendingFormatSpy: jasmine.Spy;
    let isNodeInEditorSpy: jasmine.Spy;

    let context: FormatContentModelContext | undefined;
    let model: ContentModelDocument;

    let formatResult: boolean | undefined;

    const defaultFormat: ContentModelSegmentFormat = {
        fontFamily: 'Arial',
        fontSize: '10pt',
    };

    beforeEach(() => {
        context = undefined;
        formatResult = undefined;
        model = createContentModelDocument();

        getDOMSelectionSpy = jasmine.createSpy('getDOMSelectionSpy');
        deleteSelectionSpy = spyOn(deleteSelection, 'deleteSelection');
        normalizeContentModelSpy = spyOn(normalizeContentModel, 'normalizeContentModel');
        takeSnapshotSpy = jasmine.createSpy('takeSnapshot');
        getPendingFormatSpy = jasmine.createSpy('getPendingFormat');
        isNodeInEditorSpy = jasmine.createSpy('isNodeInEditor');

        formatContentModelSpy = jasmine
            .createSpy('formatContentModelSpy')
            .and.callFake(
                (formatter: ContentModelFormatter, options: FormatContentModelOptions) => {
                    context = {
                        deletedEntities: [],
                        newEntities: [],
                        newImages: [],
                    };

                    formatResult = formatter(model, context);
                }
            );

        editor = {
            getDOMHelper: () => ({
                isNodeInEditor: isNodeInEditorSpy,
            }),
            getDOMSelection: getDOMSelectionSpy,
            formatContentModel: formatContentModelSpy,
            takeSnapshot: takeSnapshotSpy,
            getPendingFormat: getPendingFormatSpy,
        } as any;
    });

    it('No selection', () => {
        getDOMSelectionSpy.and.returnValue(null);
        deleteSelectionSpy.and.returnValue({});

        applyDefaultFormat(editor, defaultFormat);

        expect(formatContentModelSpy).toHaveBeenCalled();
    });

    it('Selection already has style', () => {
        const contentDiv = document.createElement('div');
        const node = document.createElement('div');
        node.style.fontFamily = 'Tahoma';

        contentDiv.appendChild(node);

        isNodeInEditorSpy.and.callFake(node => contentDiv.contains(node));

        getDOMSelectionSpy.and.returnValue({
            type: 'range',
            range: {
                startContainer: node,
                startOffset: 0,
            },
        });
        deleteSelectionSpy.and.returnValue({
            deleteResult: '',
        });

        applyDefaultFormat(editor, defaultFormat);

        expect(formatContentModelSpy).toHaveBeenCalled();
    });

    it('text under content div directly', () => {
        const contentDiv = document.createElement('div');
        const text = document.createTextNode('test');

        contentDiv.style.fontFamily = 'Tahoma';
        contentDiv.appendChild(text);

        isNodeInEditorSpy.and.callFake(node => contentDiv.contains(node));

        getDOMSelectionSpy.and.returnValue({
            type: 'range',
            range: {
                startContainer: text,
                startOffset: 0,
            },
        });
        deleteSelectionSpy.and.returnValue({
            deleteResult: '',
        });

        applyDefaultFormat(editor, defaultFormat);

        expect(formatContentModelSpy).toHaveBeenCalled();
    });

    it('Good selection, delete range ', () => {
        const node = document.createElement('div');

        getDOMSelectionSpy.and.returnValue({
            type: 'range',
            range: {
                startContainer: node,
                startOffset: 0,
            },
        });

        deleteSelectionSpy.and.returnValue({
            deleteResult: 'range',
            insertPoint: null!,
        });

        applyDefaultFormat(editor, defaultFormat);

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(normalizeContentModelSpy).toHaveBeenCalledWith(model);
        expect(takeSnapshotSpy).toHaveBeenCalledTimes(1);
        expect(formatResult).toBeTrue();
        expect(context).toEqual({
            deletedEntities: [],
            newEntities: [],
            newImages: [],
        });
    });

    it('Good selection, NothingToDelete ', () => {
        const node = document.createElement('div');

        isNodeInEditorSpy.and.returnValue(true);

        getDOMSelectionSpy.and.returnValue({
            type: 'range',
            range: {
                startContainer: node,
                startOffset: 0,
            },
        });

        deleteSelectionSpy.and.returnValue({
            deleteResult: 'nothingToDelete',
            insertPoint: null!,
        });

        applyDefaultFormat(editor, defaultFormat);

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(normalizeContentModelSpy).not.toHaveBeenCalledWith();
        expect(takeSnapshotSpy).not.toHaveBeenCalled();
        expect(formatResult).toBeFalse();
        expect(context).toEqual({
            deletedEntities: [],
            newEntities: [],
            newImages: [],
        });
    });

    it('Good selection, SingleChar ', () => {
        const node = document.createElement('div');
        isNodeInEditorSpy.and.returnValue(true);

        getDOMSelectionSpy.and.returnValue({
            type: 'range',
            range: {
                startContainer: node,
                startOffset: 0,
            },
        });

        deleteSelectionSpy.and.returnValue({
            deleteResult: 'singleChar',
            insertPoint: null!,
        });

        applyDefaultFormat(editor, defaultFormat);

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(normalizeContentModelSpy).not.toHaveBeenCalledWith();
        expect(takeSnapshotSpy).not.toHaveBeenCalled();
        expect(formatResult).toBeFalse();
        expect(context).toEqual({
            deletedEntities: [],
            newEntities: [],
            newImages: [],
        });
    });

    it('Good selection, NotDeleted, has text segment ', () => {
        const node = document.createElement('div');
        const marker = createSelectionMarker();
        const text = createText('test');
        const para = createParagraph();

        isNodeInEditorSpy.and.returnValue(true);
        para.segments.push(text, marker);
        model.blocks.push(para);

        const insertPoint: InsertPoint = {
            marker,
            path: [model],
            paragraph: para,
        };

        getDOMSelectionSpy.and.returnValue({
            type: 'range',
            range: {
                startContainer: node,
                startOffset: 0,
            },
        });

        deleteSelectionSpy.and.returnValue({
            deleteResult: 'notDeleted',
            insertPoint,
        });

        applyDefaultFormat(editor, defaultFormat);

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(normalizeContentModelSpy).not.toHaveBeenCalled();
        expect(takeSnapshotSpy).not.toHaveBeenCalled();
        expect(formatResult).toBeFalse();
        expect(context).toEqual({
            deletedEntities: [],
            newEntities: [],
            newImages: [],
        });
    });

    it('Good selection, NotDeleted, no text segment ', () => {
        const node = document.createElement('div');
        const marker = createSelectionMarker();
        const img = createImage('test');
        const para = createParagraph();

        isNodeInEditorSpy.and.returnValue(true);
        para.segments.push(img, marker);
        model.blocks.push(para);

        const insertPoint: InsertPoint = {
            marker,
            path: [model],
            paragraph: para,
        };

        getDOMSelectionSpy.and.returnValue({
            type: 'range',
            range: {
                startContainer: node,
                startOffset: 0,
            },
        });

        deleteSelectionSpy.and.returnValue({
            deleteResult: 'notDeleted',
            insertPoint,
        });

        applyDefaultFormat(editor, defaultFormat);

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(normalizeContentModelSpy).not.toHaveBeenCalled();
        expect(takeSnapshotSpy).not.toHaveBeenCalled();
        expect(formatResult).toBeFalse();
        expect(context).toEqual({
            deletedEntities: [],
            newEntities: [],
            newImages: [],
            newPendingFormat: { fontFamily: 'Arial', fontSize: '10pt' },
        });
    });

    it('Good selection, NotDeleted, implicit and marker is the first segment, previous block is paragraph', () => {
        const node = document.createElement('div');
        const marker = createSelectionMarker();
        const paraPrev = createParagraph();
        const para = createParagraph(true /*isImplicit*/);

        isNodeInEditorSpy.and.returnValue(true);
        para.segments.push(marker);
        model.blocks.push(paraPrev, para);

        const insertPoint: InsertPoint = {
            marker,
            path: [model],
            paragraph: para,
        };

        getDOMSelectionSpy.and.returnValue({
            type: 'range',
            range: {
                startContainer: node,
                startOffset: 0,
            },
        });

        deleteSelectionSpy.and.returnValue({
            deleteResult: 'notDeleted',
            insertPoint,
        });

        applyDefaultFormat(editor, defaultFormat);

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(normalizeContentModelSpy).not.toHaveBeenCalled();
        expect(takeSnapshotSpy).not.toHaveBeenCalled();
        expect(formatResult).toBeFalse();
        expect(context).toEqual({
            deletedEntities: [],
            newEntities: [],
            newImages: [],
        });
    });

    it('Good selection, NotDeleted, implicit and marker is the first segment, previous block is not paragraph', () => {
        const node = document.createElement('div');
        const marker = createSelectionMarker();
        const divider = createDivider('hr');
        const para = createParagraph(true /*isImplicit*/);

        isNodeInEditorSpy.and.returnValue(true);
        para.segments.push(marker);
        model.blocks.push(divider, para);

        const insertPoint: InsertPoint = {
            marker,
            path: [model],
            paragraph: para,
        };

        getDOMSelectionSpy.and.returnValue({
            type: 'range',
            range: {
                startContainer: node,
                startOffset: 0,
            },
        });

        deleteSelectionSpy.and.returnValue({
            deleteResult: 'notDeleted',
            insertPoint,
        });

        applyDefaultFormat(editor, defaultFormat);

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(normalizeContentModelSpy).not.toHaveBeenCalled();
        expect(takeSnapshotSpy).not.toHaveBeenCalled();
        expect(formatResult).toBeFalse();
        expect(context).toEqual({
            deletedEntities: [],
            newEntities: [],
            newImages: [],
            newPendingFormat: { fontFamily: 'Arial', fontSize: '10pt' },
        });
    });

    it('Good selection, NotDeleted, no text segment, has pending format and marker format', () => {
        const node = document.createElement('div');
        const marker = createSelectionMarker({
            textColor: 'green',
            backgroundColor: 'yellow',
        });
        const img = createImage('test');
        const para = createParagraph();

        isNodeInEditorSpy.and.returnValue(true);
        para.segments.push(img, marker);
        model.blocks.push(para);

        const insertPoint: InsertPoint = {
            marker,
            path: [model],
            paragraph: para,
        };

        getDOMSelectionSpy.and.returnValue({
            type: 'range',
            range: {
                startContainer: node,
                startOffset: 0,
            },
        });

        deleteSelectionSpy.and.returnValue({
            deleteResult: 'notDeleted',
            insertPoint,
        });

        getPendingFormatSpy.and.returnValue({
            fontSize: '20pt',
            textColor: 'red',
        });

        applyDefaultFormat(editor, defaultFormat);

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(normalizeContentModelSpy).not.toHaveBeenCalled();
        expect(takeSnapshotSpy).not.toHaveBeenCalled();
        expect(formatResult).toBeFalse();
        expect(context).toEqual({
            deletedEntities: [],
            newEntities: [],
            newImages: [],
            newPendingFormat: {
                fontFamily: 'Arial',
                fontSize: '20pt',
                textColor: 'green',
                backgroundColor: 'yellow',
            },
        });
    });
});
