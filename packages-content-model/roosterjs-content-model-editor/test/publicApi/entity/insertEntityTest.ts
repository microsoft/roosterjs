import * as commitEntity from 'roosterjs-editor-dom/lib/entity/commitEntity';
import * as formatWithContentModel from '../../../lib/publicApi/utils/formatWithContentModel';
import * as getEntityFromElement from 'roosterjs-editor-dom/lib/entity/getEntityFromElement';
import * as insertEntityModel from '../../../lib/modelApi/entity/insertEntityModel';
import insertEntity from '../../../lib/publicApi/entity/insertEntity';
import { ChangeSource } from 'roosterjs-editor-types';
import { FormatWithContentModelContext } from '../../../lib/publicTypes/parameter/FormatWithContentModelContext';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';

describe('insertEntity', () => {
    let editor: IContentModelEditor;
    let context: FormatWithContentModelContext;
    let wrapper: HTMLElement;
    const model = 'MockedModel' as any;
    const newEntity = 'MockedEntity' as any;

    let formatWithContentModelSpy: jasmine.Spy;
    let getEntityFromElementSpy: jasmine.Spy;
    let triggerContentChangedEventSpy: jasmine.Spy;
    let getDocumentSpy: jasmine.Spy;
    let createElementSpy: jasmine.Spy;
    let commitEntitySpy: jasmine.Spy;
    let setPropertySpy: jasmine.Spy;
    let appendChildSpy: jasmine.Spy;
    let insertEntityModelSpy: jasmine.Spy;
    let isDarkModeSpy: jasmine.Spy;
    let transformToDarkColorSpy: jasmine.Spy;

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
        });
        getEntityFromElementSpy = spyOn(getEntityFromElement, 'default').and.returnValue(newEntity);
        commitEntitySpy = spyOn(commitEntity, 'default');
        triggerContentChangedEventSpy = jasmine.createSpy('triggerContentChangedEventSpy');
        createElementSpy = jasmine.createSpy('createElementSpy').and.returnValue(wrapper);
        getDocumentSpy = jasmine.createSpy('getDocumentSpy').and.returnValue({
            createElement: createElementSpy,
        });

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
        expect(commitEntitySpy).toHaveBeenCalledWith(wrapper, type, true);
        expect(formatWithContentModelSpy.calls.argsFor(0)[0]).toBe(editor);
        expect(formatWithContentModelSpy.calls.argsFor(0)[1]).toBe(apiName);
        expect(formatWithContentModelSpy.calls.argsFor(0)[3]).toEqual({
            selectionOverride: undefined,
        });
        expect(insertEntityModelSpy).toHaveBeenCalledWith(
            model,
            {
                segmentType: 'Entity',
                blockType: 'Entity',
                format: {},
                id: undefined,
                type: type,
                isReadonly: true,
                wrapper: wrapper,
            },
            'begin',
            false,
            undefined,
            context
        );
        expect(getEntityFromElementSpy).toHaveBeenCalledWith(wrapper);
        expect(triggerContentChangedEventSpy).toHaveBeenCalledWith(
            ChangeSource.InsertEntity,
            newEntity
        );
        expect(transformToDarkColorSpy).not.toHaveBeenCalled();

        expect(entity).toBe(newEntity);
    });

    it('block inline entity to root', () => {
        const entity = insertEntity(editor, type, true, 'root');

        expect(createElementSpy).toHaveBeenCalledWith('div');
        expect(setPropertySpy).toHaveBeenCalledWith('display', null);
        expect(appendChildSpy).not.toHaveBeenCalled();
        expect(commitEntitySpy).toHaveBeenCalledWith(wrapper, type, true);
        expect(formatWithContentModelSpy.calls.argsFor(0)[0]).toBe(editor);
        expect(formatWithContentModelSpy.calls.argsFor(0)[1]).toBe(apiName);
        expect(formatWithContentModelSpy.calls.argsFor(0)[3]).toEqual({
            selectionOverride: undefined,
        });
        expect(insertEntityModelSpy).toHaveBeenCalledWith(
            model,
            {
                segmentType: 'Entity',
                blockType: 'Entity',
                format: {},
                id: undefined,
                type: type,
                isReadonly: true,
                wrapper: wrapper,
            },
            'root',
            true,
            undefined,
            context
        );
        expect(getEntityFromElementSpy).toHaveBeenCalledWith(wrapper);
        expect(triggerContentChangedEventSpy).toHaveBeenCalledWith(
            ChangeSource.InsertEntity,
            newEntity
        );
        expect(transformToDarkColorSpy).not.toHaveBeenCalled();

        expect(entity).toBe(newEntity);
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
        expect(commitEntitySpy).toHaveBeenCalledWith(wrapper, type, true);
        expect(formatWithContentModelSpy.calls.argsFor(0)[0]).toBe(editor);
        expect(formatWithContentModelSpy.calls.argsFor(0)[1]).toBe(apiName);
        expect(formatWithContentModelSpy.calls.argsFor(0)[3]).toEqual({
            selectionOverride: range,
        });
        expect(insertEntityModelSpy).toHaveBeenCalledWith(
            model,
            {
                segmentType: 'Entity',
                blockType: 'Entity',
                format: {},
                id: undefined,
                type: type,
                isReadonly: true,
                wrapper: wrapper,
            },
            'focus',
            true,
            true,
            context
        );
        expect(getEntityFromElementSpy).toHaveBeenCalledWith(wrapper);
        expect(triggerContentChangedEventSpy).toHaveBeenCalledWith(
            ChangeSource.InsertEntity,
            newEntity
        );
        expect(transformToDarkColorSpy).not.toHaveBeenCalled();

        expect(entity).toBe(newEntity);
    });

    it('In dark mode', () => {
        isDarkModeSpy.and.returnValue(true);

        const entity = insertEntity(editor, type, false, 'begin');

        expect(createElementSpy).toHaveBeenCalledWith('span');
        expect(setPropertySpy).toHaveBeenCalledWith('display', 'inline-block');
        expect(appendChildSpy).not.toHaveBeenCalled();
        expect(commitEntitySpy).toHaveBeenCalledWith(wrapper, type, true);
        expect(formatWithContentModelSpy.calls.argsFor(0)[0]).toBe(editor);
        expect(formatWithContentModelSpy.calls.argsFor(0)[1]).toBe(apiName);
        expect(formatWithContentModelSpy.calls.argsFor(0)[3]).toEqual({
            selectionOverride: undefined,
        });
        expect(insertEntityModelSpy).toHaveBeenCalledWith(
            model,
            {
                segmentType: 'Entity',
                blockType: 'Entity',
                format: {},
                id: undefined,
                type: type,
                isReadonly: true,
                wrapper: wrapper,
            },
            'begin',
            false,
            undefined,
            context
        );
        expect(getEntityFromElementSpy).toHaveBeenCalledWith(wrapper);
        expect(triggerContentChangedEventSpy).toHaveBeenCalledWith(
            ChangeSource.InsertEntity,
            newEntity
        );
        expect(context.newEntities).toEqual([
            {
                segmentType: 'Entity',
                blockType: 'Entity',
                format: {},
                id: undefined,
                type: 'Entity',
                isReadonly: true,
                wrapper,
            },
        ]);

        expect(entity).toBe(newEntity);
    });
});
