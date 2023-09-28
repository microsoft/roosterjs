import * as formatWithContentModel from '../../../lib/publicApi/utils/formatWithContentModel';
import * as insertEntityModel from '../../../lib/modelApi/entity/insertEntityModel';
import * as normalizeContentModel from 'roosterjs-content-model-dom/lib/modelApi/common/normalizeContentModel';
import insertEntity from '../../../lib/publicApi/entity/insertEntity';
import { ChangeSource } from 'roosterjs-editor-types';
import { FormatWithContentModelContext } from '../../../lib/publicTypes/parameter/FormatWithContentModelContext';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';

describe('insertEntity', () => {
    let editor: IContentModelEditor;
    let context: FormatWithContentModelContext;
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
    let transformToDarkColorSpy: jasmine.Spy;
    let normalizeContentModelSpy: jasmine.Spy;

    const type = 'Entity';
    const apiName = 'insertEntity';

    beforeEach(() => {
        context = {
            newEntities: [],
            deletedEntities: [],
        };

        setPropertySpy = jasmine.createSpy('setPropertySpy');
        appendChildSpy = jasmine.createSpy('appendChildSpy');
        insertEntityModelSpy = spyOn(insertEntityModel, 'insertEntityModel');
        isDarkModeSpy = jasmine.createSpy('isDarkMode');
        transformToDarkColorSpy = jasmine.createSpy('transformToDarkColor');

        wrapper = {
            style: {
                setProperty: setPropertySpy,
            },
            appendChild: appendChildSpy,
        } as any;

        formatWithContentModelSpy = spyOn(
            formatWithContentModel,
            'formatWithContentModel'
        ).and.callFake((editor, apiName, formatter, options) => {
            formatter(model, context);
            options?.getChangeData?.();
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
            transformToDarkColor: transformToDarkColorSpy,
        } as any;
    });

    it('insert inline entity to top', () => {
        const entity = insertEntity(editor, type, false, 'begin');

        expect(createElementSpy).toHaveBeenCalledWith('span');
        expect(setPropertySpy).toHaveBeenCalledWith('display', 'inline-block');
        expect(appendChildSpy).not.toHaveBeenCalled();
        expect(formatWithContentModelSpy.calls.argsFor(0)[0]).toBe(editor);
        expect(formatWithContentModelSpy.calls.argsFor(0)[1]).toBe(apiName);
        expect(formatWithContentModelSpy.calls.argsFor(0)[3].changeSource).toEqual(
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
        expect(transformToDarkColorSpy).not.toHaveBeenCalled();
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

        expect(createElementSpy).toHaveBeenCalledWith('div');
        expect(setPropertySpy).toHaveBeenCalledWith('display', null);
        expect(appendChildSpy).not.toHaveBeenCalled();
        expect(formatWithContentModelSpy.calls.argsFor(0)[0]).toBe(editor);
        expect(formatWithContentModelSpy.calls.argsFor(0)[1]).toBe(apiName);
        expect(formatWithContentModelSpy.calls.argsFor(0)[3].changeSource).toEqual(
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
        expect(transformToDarkColorSpy).not.toHaveBeenCalled();
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

        expect(createElementSpy).toHaveBeenCalledWith('div');
        expect(setPropertySpy).toHaveBeenCalledWith('display', 'none');
        expect(appendChildSpy).toHaveBeenCalledWith(contentNode);
        expect(formatWithContentModelSpy.calls.argsFor(0)[0]).toBe(editor);
        expect(formatWithContentModelSpy.calls.argsFor(0)[1]).toBe(apiName);
        expect(formatWithContentModelSpy.calls.argsFor(0)[3].changeSource).toEqual(
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
        expect(transformToDarkColorSpy).not.toHaveBeenCalled();
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

        expect(createElementSpy).toHaveBeenCalledWith('span');
        expect(setPropertySpy).toHaveBeenCalledWith('display', 'inline-block');
        expect(appendChildSpy).not.toHaveBeenCalled();
        expect(formatWithContentModelSpy.calls.argsFor(0)[0]).toBe(editor);
        expect(formatWithContentModelSpy.calls.argsFor(0)[1]).toBe(apiName);
        expect(formatWithContentModelSpy.calls.argsFor(0)[3].changeSource).toEqual(
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
