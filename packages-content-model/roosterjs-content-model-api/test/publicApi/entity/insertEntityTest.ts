import * as entityUtils from 'roosterjs-content-model-dom/lib/domUtils/entityUtils';
import * as insertEntityModel from '../../../lib/modelApi/entity/insertEntityModel';
import * as normalizeContentModel from 'roosterjs-content-model-dom/lib/modelApi/common/normalizeContentModel';
import insertEntity from '../../../lib/publicApi/entity/insertEntity';
import { ChangeSource } from 'roosterjs-content-model-core';
import { IEditor } from 'roosterjs-content-model-types';
import {
    FormatContentModelContext,
    FormatContentModelOptions,
} from 'roosterjs-content-model-types';

describe('insertEntity', () => {
    let editor: IEditor;
    let context: FormatContentModelContext;
    let wrapper: HTMLElement;
    const model = 'MockedModel' as any;

    let formatWithContentModelSpy: jasmine.Spy;
    let triggerContentChangedEventSpy: jasmine.Spy;
    let getDocumentSpy: jasmine.Spy;
    let createElementSpy: jasmine.Spy;
    let setPropertySpy: jasmine.Spy;
    let appendChildSpy: jasmine.Spy;
    let insertEntityModelSpy: jasmine.Spy;
    let isDarkModeSpy: jasmine.Spy;
    let normalizeContentModelSpy: jasmine.Spy;
    let takeSnapshotSpy: jasmine.Spy;

    const type = 'Entity';
    const apiName = 'insertEntity';

    beforeEach(() => {
        context = {
            newEntities: [],
            deletedEntities: [],
            newImages: [],
        };

        setPropertySpy = jasmine.createSpy('setPropertySpy');
        appendChildSpy = jasmine.createSpy('appendChildSpy');
        insertEntityModelSpy = spyOn(insertEntityModel, 'insertEntityModel');
        isDarkModeSpy = jasmine.createSpy('isDarkMode');
        takeSnapshotSpy = jasmine.createSpy('takeSnapshot');

        wrapper = {
            style: {
                setProperty: setPropertySpy,
            },
            appendChild: appendChildSpy,
            classList: {
                add: () => {},
            },
        } as any;

        formatWithContentModelSpy = jasmine
            .createSpy('formatContentModel')
            .and.callFake((formatter: Function, options: FormatContentModelOptions) => {
                formatter(model, context);
            });

        triggerContentChangedEventSpy = jasmine.createSpy('triggerContentChangedEventSpy');
        createElementSpy = jasmine.createSpy('createElementSpy').and.returnValue(wrapper);
        getDocumentSpy = jasmine.createSpy('getDocumentSpy').and.returnValue({
            createElement: createElementSpy,
        });
        normalizeContentModelSpy = spyOn(normalizeContentModel, 'normalizeContentModel');

        editor = {
            triggerContentChangedEvent: triggerContentChangedEventSpy,
            getDocument: getDocumentSpy,
            isDarkMode: isDarkModeSpy,
            formatContentModel: formatWithContentModelSpy,
            takeSnapshot: takeSnapshotSpy,
        } as any;

        spyOn(entityUtils, 'addDelimiters').and.returnValue([]);
    });

    it('insert inline entity to top', () => {
        const entity = insertEntity(editor, type, false, 'begin');

        expect(takeSnapshotSpy).toHaveBeenCalledTimes(2);
        expect(takeSnapshotSpy).toHaveBeenCalledWith();
        expect(takeSnapshotSpy).toHaveBeenCalledWith(undefined);
        expect(createElementSpy).toHaveBeenCalledWith('span');
        expect(setPropertySpy).toHaveBeenCalledWith('display', 'inline-block');
        expect(appendChildSpy).not.toHaveBeenCalled();
        expect(formatWithContentModelSpy.calls.argsFor(0)[1].apiName).toBe(apiName);
        expect(formatWithContentModelSpy.calls.argsFor(0)[1].changeSource).toEqual(
            ChangeSource.InsertEntity
        );
        expect(insertEntityModelSpy).toHaveBeenCalledWith(
            model,
            {
                segmentType: 'Entity',
                blockType: 'Entity',
                format: {},
                entityFormat: {
                    id: undefined,
                    entityType: type,
                    isReadonly: true,
                },
                wrapper: wrapper,
            },
            'begin',
            false,
            undefined,
            context
        );
        expect(triggerContentChangedEventSpy).not.toHaveBeenCalled();
        expect(normalizeContentModelSpy).toHaveBeenCalled();

        expect(entity).toEqual({
            segmentType: 'Entity',
            blockType: 'Entity',
            format: {},
            entityFormat: {
                id: undefined,
                entityType: type,
                isReadonly: true,
            },
            wrapper: wrapper,
        });
    });

    it('block inline entity to root', () => {
        const entity = insertEntity(editor, type, true, 'root');

        expect(takeSnapshotSpy).toHaveBeenCalledTimes(2);
        expect(takeSnapshotSpy).toHaveBeenCalledWith();
        expect(takeSnapshotSpy).toHaveBeenCalledWith(undefined);
        expect(createElementSpy).toHaveBeenCalledWith('div');
        expect(setPropertySpy).toHaveBeenCalledWith('display', 'inline-block');
        expect(setPropertySpy).toHaveBeenCalledWith('width', '100%');
        expect(appendChildSpy).toHaveBeenCalledTimes(0);
        expect(formatWithContentModelSpy.calls.argsFor(0)[1].apiName).toBe(apiName);
        expect(formatWithContentModelSpy.calls.argsFor(0)[1].changeSource).toEqual(
            ChangeSource.InsertEntity
        );
        expect(insertEntityModelSpy).toHaveBeenCalledWith(
            model,
            {
                segmentType: 'Entity',
                blockType: 'Entity',
                format: {},
                entityFormat: {
                    id: undefined,
                    entityType: type,
                    isReadonly: true,
                },
                wrapper: wrapper,
            },
            'root',
            true,
            undefined,
            context
        );
        expect(triggerContentChangedEventSpy).not.toHaveBeenCalled();
        expect(normalizeContentModelSpy).toHaveBeenCalled();

        expect(entity).toEqual({
            segmentType: 'Entity',
            blockType: 'Entity',
            format: {},
            entityFormat: {
                id: undefined,
                entityType: type,
                isReadonly: true,
            },
            wrapper: wrapper,
        });
    });

    it('block inline entity with more options', () => {
        const range = { range: 'RangeEx' } as any;
        const contentNode = 'ContentNode' as any;
        const entity = insertEntity(editor, type, true, range, {
            contentNode: contentNode,
            focusAfterEntity: true,
            skipUndoSnapshot: true,
            wrapperDisplay: 'none',
        });

        expect(takeSnapshotSpy).toHaveBeenCalledTimes(0);
        expect(createElementSpy).toHaveBeenCalledWith('div');
        expect(setPropertySpy).toHaveBeenCalledWith('display', 'none');
        expect(setPropertySpy).not.toHaveBeenCalledWith('display', 'inline-block');
        expect(setPropertySpy).not.toHaveBeenCalledWith('width', '100%');
        expect(appendChildSpy).toHaveBeenCalledWith(contentNode);
        expect(formatWithContentModelSpy.calls.argsFor(0)[1].apiName).toBe(apiName);
        expect(formatWithContentModelSpy.calls.argsFor(0)[1].changeSource).toEqual(
            ChangeSource.InsertEntity
        );

        expect(insertEntityModelSpy).toHaveBeenCalledWith(
            model,
            {
                segmentType: 'Entity',
                blockType: 'Entity',
                format: {},
                entityFormat: {
                    id: undefined,
                    entityType: type,
                    isReadonly: true,
                },
                wrapper: wrapper,
            },
            'focus',
            true,
            true,
            context
        );
        expect(triggerContentChangedEventSpy).not.toHaveBeenCalled();
        expect(normalizeContentModelSpy).toHaveBeenCalled();

        expect(entity).toEqual({
            segmentType: 'Entity',
            blockType: 'Entity',
            format: {},
            entityFormat: {
                id: undefined,
                entityType: type,
                isReadonly: true,
            },
            wrapper: wrapper,
        });
    });

    it('In dark mode', () => {
        isDarkModeSpy.and.returnValue(true);

        const entity = insertEntity(editor, type, false, 'begin');

        expect(takeSnapshotSpy).toHaveBeenCalledTimes(2);
        expect(takeSnapshotSpy).toHaveBeenCalledWith();
        expect(takeSnapshotSpy).toHaveBeenCalledWith(undefined);
        expect(createElementSpy).toHaveBeenCalledWith('span');
        expect(setPropertySpy).toHaveBeenCalledWith('display', 'inline-block');
        expect(appendChildSpy).not.toHaveBeenCalled();
        expect(formatWithContentModelSpy.calls.argsFor(0)[1].apiName).toBe(apiName);
        expect(formatWithContentModelSpy.calls.argsFor(0)[1].changeSource).toBe(
            ChangeSource.InsertEntity
        );
        expect(insertEntityModelSpy).toHaveBeenCalledWith(
            model,
            {
                segmentType: 'Entity',
                blockType: 'Entity',
                format: {},
                entityFormat: {
                    id: undefined,
                    entityType: type,
                    isReadonly: true,
                },
                wrapper: wrapper,
            },
            'begin',
            false,
            undefined,
            context
        );
        expect(triggerContentChangedEventSpy).not.toHaveBeenCalled();
        expect(normalizeContentModelSpy).toHaveBeenCalled();

        expect(context.newEntities).toEqual([
            {
                segmentType: 'Entity',
                blockType: 'Entity',
                format: {},
                entityFormat: {
                    id: undefined,
                    entityType: 'Entity',
                    isReadonly: true,
                },
                wrapper,
            },
        ]);

        expect(entity).toEqual({
            segmentType: 'Entity',
            blockType: 'Entity',
            format: {},
            entityFormat: {
                id: undefined,
                entityType: type,
                isReadonly: true,
            },
            wrapper: wrapper,
        });
    });

    it('Insert with initial state', () => {
        spyOn(entityUtils, 'parseEntityFormat').and.returnValue({
            id: 'A',
            entityType: 'B',
        });

        const entity = insertEntity(editor, type, false, 'begin', {
            initialEntityState: 'test',
        });

        expect(takeSnapshotSpy).toHaveBeenCalledTimes(2);
        expect(takeSnapshotSpy).toHaveBeenCalledWith();
        expect(takeSnapshotSpy).toHaveBeenCalledWith({
            id: 'A',
            type: 'B',
            state: 'test',
        });
        expect(createElementSpy).toHaveBeenCalledWith('span');
        expect(setPropertySpy).toHaveBeenCalledWith('display', 'inline-block');
        expect(appendChildSpy).not.toHaveBeenCalled();
        expect(formatWithContentModelSpy.calls.argsFor(0)[1].apiName).toBe(apiName);
        expect(formatWithContentModelSpy.calls.argsFor(0)[1].changeSource).toBe(
            ChangeSource.InsertEntity
        );
        expect(insertEntityModelSpy).toHaveBeenCalledWith(
            model,
            {
                segmentType: 'Entity',
                blockType: 'Entity',
                format: {},
                entityFormat: {
                    id: undefined,
                    entityType: type,
                    isReadonly: true,
                },
                wrapper: wrapper,
            },
            'begin',
            false,
            undefined,
            context
        );
        expect(triggerContentChangedEventSpy).not.toHaveBeenCalled();
        expect(normalizeContentModelSpy).toHaveBeenCalled();

        expect(context.newEntities).toEqual([
            {
                segmentType: 'Entity',
                blockType: 'Entity',
                format: {},
                entityFormat: {
                    id: undefined,
                    entityType: 'Entity',
                    isReadonly: true,
                },
                wrapper,
            },
        ]);

        expect(entity).toEqual({
            segmentType: 'Entity',
            blockType: 'Entity',
            format: {},
            entityFormat: {
                id: undefined,
                entityType: type,
                isReadonly: true,
            },
            wrapper: wrapper,
        });
    });
});
