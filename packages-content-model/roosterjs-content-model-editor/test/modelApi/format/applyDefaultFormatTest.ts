import * as deleteSelection from '../../../lib/modelApi/edit/deleteSelection';
import * as normalizeContentModel from 'roosterjs-content-model-dom/lib/modelApi/common/normalizeContentModel';
import { applyDefaultFormat } from '../../../lib/modelApi/format/applyDefaultFormat';
import { ContentModelDocument, ContentModelSegmentFormat } from 'roosterjs-content-model-types';
import { DeleteResult } from '../../../lib/modelApi/edit/utils/DeleteSelectionStep';
import { InsertPoint } from '../../../lib/publicTypes/selection/InsertPoint';
import {
    createContentModelDocument,
    createDivider,
    createImage,
    createParagraph,
    createSelectionMarker,
    createText,
} from 'roosterjs-content-model-dom';
import {
    ContentModelFormatter,
    FormatWithContentModelContext,
    FormatWithContentModelOptions,
} from '../../../lib/publicTypes/parameter/FormatWithContentModelContext';
import type { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';

describe('applyDefaultFormat', () => {
    let editor: IContentModelEditor;
    let getDOMSelectionSpy: jasmine.Spy;
    let formatContentModelSpy: jasmine.Spy;
    let deleteSelectionSpy: jasmine.Spy;
    let normalizeContentModelSpy: jasmine.Spy;
    let addUndoSnapshotSpy: jasmine.Spy;
    let getPendingFormatSpy: jasmine.Spy;

    let context: FormatWithContentModelContext | undefined;
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
        addUndoSnapshotSpy = jasmine.createSpy('addUndoSnapshot');
        getPendingFormatSpy = jasmine.createSpy('getPendingFormat');

        formatContentModelSpy = jasmine
            .createSpy('formatContentModelSpy')
            .and.callFake(
                (formatter: ContentModelFormatter, options: FormatWithContentModelOptions) => {
                    context = {
                        deletedEntities: [],
                        newEntities: [],
                        newImages: [],
                    };

                    formatResult = formatter(model, context);
                }
            );

        editor = {
            contains: () => true,
            getDOMSelection: getDOMSelectionSpy,
            formatContentModel: formatContentModelSpy,
            addUndoSnapshot: addUndoSnapshotSpy,
            getPendingFormat: getPendingFormatSpy,
        } as any;
    });

    it('No selection', () => {
        getDOMSelectionSpy.and.returnValue(null);

        applyDefaultFormat(editor, defaultFormat);

        expect(formatContentModelSpy).not.toHaveBeenCalled();
    });

    it('Selection already has style', () => {
        const node = document.createElement('div');
        node.style.fontFamily = 'Tahoma';

        getDOMSelectionSpy.and.returnValue({
            type: 'range',
            range: {
                startContainer: node,
                startOffset: 0,
            },
        });

        applyDefaultFormat(editor, defaultFormat);

        expect(formatContentModelSpy).not.toHaveBeenCalled();
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
            deleteResult: DeleteResult.Range,
            insertPoint: null!,
        });

        applyDefaultFormat(editor, defaultFormat);

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(normalizeContentModelSpy).toHaveBeenCalledWith(model);
        expect(addUndoSnapshotSpy).toHaveBeenCalledTimes(1);
        expect(formatResult).toBeTrue();
        expect(context).toEqual({
            deletedEntities: [],
            newEntities: [],
            newImages: [],
        });
    });

    it('Good selection, NothingToDelete ', () => {
        const node = document.createElement('div');

        getDOMSelectionSpy.and.returnValue({
            type: 'range',
            range: {
                startContainer: node,
                startOffset: 0,
            },
        });

        deleteSelectionSpy.and.returnValue({
            deleteResult: DeleteResult.NothingToDelete,
            insertPoint: null!,
        });

        applyDefaultFormat(editor, defaultFormat);

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(normalizeContentModelSpy).not.toHaveBeenCalledWith();
        expect(addUndoSnapshotSpy).not.toHaveBeenCalled();
        expect(formatResult).toBeFalse();
        expect(context).toEqual({
            deletedEntities: [],
            newEntities: [],
            newImages: [],
        });
    });

    it('Good selection, SingleChar ', () => {
        const node = document.createElement('div');

        getDOMSelectionSpy.and.returnValue({
            type: 'range',
            range: {
                startContainer: node,
                startOffset: 0,
            },
        });

        deleteSelectionSpy.and.returnValue({
            deleteResult: DeleteResult.SingleChar,
            insertPoint: null!,
        });

        applyDefaultFormat(editor, defaultFormat);

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(normalizeContentModelSpy).not.toHaveBeenCalledWith();
        expect(addUndoSnapshotSpy).not.toHaveBeenCalled();
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
            deleteResult: DeleteResult.NotDeleted,
            insertPoint,
        });

        applyDefaultFormat(editor, defaultFormat);

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(normalizeContentModelSpy).not.toHaveBeenCalled();
        expect(addUndoSnapshotSpy).not.toHaveBeenCalled();
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
            deleteResult: DeleteResult.NotDeleted,
            insertPoint,
        });

        applyDefaultFormat(editor, defaultFormat);

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(normalizeContentModelSpy).not.toHaveBeenCalled();
        expect(addUndoSnapshotSpy).not.toHaveBeenCalled();
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
            deleteResult: DeleteResult.NotDeleted,
            insertPoint,
        });

        applyDefaultFormat(editor, defaultFormat);

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(normalizeContentModelSpy).not.toHaveBeenCalled();
        expect(addUndoSnapshotSpy).not.toHaveBeenCalled();
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
            deleteResult: DeleteResult.NotDeleted,
            insertPoint,
        });

        applyDefaultFormat(editor, defaultFormat);

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(normalizeContentModelSpy).not.toHaveBeenCalled();
        expect(addUndoSnapshotSpy).not.toHaveBeenCalled();
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
            deleteResult: DeleteResult.NotDeleted,
            insertPoint,
        });

        getPendingFormatSpy.and.returnValue({
            fontSize: '20pt',
            textColor: 'red',
        });

        applyDefaultFormat(editor, defaultFormat);

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(normalizeContentModelSpy).not.toHaveBeenCalled();
        expect(addUndoSnapshotSpy).not.toHaveBeenCalled();
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
