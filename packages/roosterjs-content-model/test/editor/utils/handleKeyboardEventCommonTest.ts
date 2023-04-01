import * as normalizeContentModel from '../../../lib/modelApi/common/normalizeContentModel';
import { ChangeSource, EntityOperation, PluginEventType } from 'roosterjs-editor-types';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';
import {
    getOnDeleteEntityCallback,
    handleKeyboardEventResult,
} from '../../../lib/editor/utils/handleKeyboardEventCommon';

describe('getOnDeleteEntityCallback', () => {
    let mockedEditor: IContentModelEditor;
    let mockedEvent: KeyboardEvent;
    let triggerPluginEvent: jasmine.Spy;

    beforeEach(() => {
        triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');
        mockedEditor = ({
            triggerPluginEvent,
        } as any) as IContentModelEditor;
        mockedEvent = ({
            defaultPrevented: false,
        } as any) as KeyboardEvent;
    });

    it('Entity without id', () => {
        const func = getOnDeleteEntityCallback(mockedEditor, mockedEvent);

        const result = func(
            {
                blockType: 'Entity',
                segmentType: 'Entity',
                format: {},
                isReadonly: true,
                wrapper: {} as any,
            },
            EntityOperation.RemoveFromStart
        );

        expect(result).toBeFalse();
        expect(triggerPluginEvent).not.toHaveBeenCalled();
    });

    it('Entity with id and type', () => {
        const func = getOnDeleteEntityCallback(mockedEditor, mockedEvent);

        const result = func(
            {
                blockType: 'Entity',
                segmentType: 'Entity',
                format: {},
                isReadonly: true,
                wrapper: {} as any,
                id: '1',
                type: '2',
            },
            EntityOperation.RemoveFromStart
        );

        expect(result).toBeFalse();
        expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.EntityOperation, {
            entity: {
                id: '1',
                type: '2',
                isReadonly: true,
                wrapper: {} as any,
            },
            operation: EntityOperation.RemoveFromStart,
            rawEvent: mockedEvent,
        });
    });

    it('Entity with id and type and change defaultPrevented', () => {
        triggerPluginEvent.and.callFake((_1: any, param: any) => {
            param.rawEvent.defaultPrevented = true;
        });

        const func = getOnDeleteEntityCallback(mockedEditor, mockedEvent);

        const result = func(
            {
                blockType: 'Entity',
                segmentType: 'Entity',
                format: {},
                isReadonly: true,
                wrapper: {} as any,
                id: '1',
                type: '2',
            },
            EntityOperation.RemoveFromStart
        );

        expect(result).toBeTrue();
        expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.EntityOperation, {
            entity: {
                id: '1',
                type: '2',
                isReadonly: true,
                wrapper: {} as any,
            },
            operation: EntityOperation.RemoveFromStart,
            rawEvent: mockedEvent,
        });
    });
});

describe('handleKeyboardEventResult', () => {
    let mockedEditor: IContentModelEditor;
    let mockedEvent: KeyboardEvent;
    let cacheContentModel: jasmine.Spy;
    let preventDefault: jasmine.Spy;
    let triggerContentChangedEvent: jasmine.Spy;

    beforeEach(() => {
        cacheContentModel = jasmine.createSpy('cacheContentModel');
        preventDefault = jasmine.createSpy('preventDefault');
        triggerContentChangedEvent = jasmine.createSpy('triggerContentChangedEvent');

        mockedEditor = ({
            cacheContentModel,
            triggerContentChangedEvent,
        } as any) as IContentModelEditor;
        mockedEvent = ({
            preventDefault,
        } as any) as KeyboardEvent;

        spyOn(normalizeContentModel, 'normalizeContentModel');
    });

    it('isChanged = true', () => {
        const mockedModel = 'MODEL' as any;
        const which = 'WHICH' as any;
        (<any>mockedEvent).which = which;

        handleKeyboardEventResult(mockedEditor, mockedModel, mockedEvent, true);

        expect(preventDefault).toHaveBeenCalled();
        expect(normalizeContentModel.normalizeContentModel).toHaveBeenCalledWith(mockedModel);
        expect(triggerContentChangedEvent).toHaveBeenCalledWith(ChangeSource.Keyboard, which);
        expect(cacheContentModel).not.toHaveBeenCalled();
    });

    it('isChanged = false', () => {
        const mockedModel = 'MODEL' as any;
        handleKeyboardEventResult(mockedEditor, mockedModel, mockedEvent, false);

        expect(preventDefault).not.toHaveBeenCalled();
        expect(triggerContentChangedEvent).not.toHaveBeenCalled();
        expect(normalizeContentModel.normalizeContentModel).not.toHaveBeenCalled();
        expect(cacheContentModel).toHaveBeenCalledWith(null);
    });
});
