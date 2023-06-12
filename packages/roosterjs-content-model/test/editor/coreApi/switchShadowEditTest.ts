import { ContentModelEditorCore } from '../../../lib/publicTypes/ContentModelEditorCore';
import { switchShadowEdit } from '../../../lib/editor/coreApi/switchShadowEdit';

const mockedModel = 'MODEL' as any;
const mockedCachedModel = 'CACHEMODEL' as any;

describe('switchShadowEdit', () => {
    let core: ContentModelEditorCore;
    let createContentModel: jasmine.Spy;
    let setContentModel: jasmine.Spy;
    let originalSwitchShadowEdit: jasmine.Spy;

    beforeEach(() => {
        createContentModel = jasmine.createSpy('createContentModel').and.returnValue(mockedModel);
        setContentModel = jasmine.createSpy('setContentModel');
        originalSwitchShadowEdit = jasmine.createSpy('originalSwitchShadowEdit');

        core = ({
            api: {
                createContentModel,
                setContentModel,
            },
            originalApi: {
                switchShadowEdit: originalSwitchShadowEdit,
            },
            lifecycle: {},
        } as any) as ContentModelEditorCore;
    });

    describe('was off', () => {
        it('no cache, isOn', () => {
            switchShadowEdit(core, true);

            expect(createContentModel).toHaveBeenCalledWith(core);
            expect(originalSwitchShadowEdit).toHaveBeenCalledWith(core, true);
            expect(setContentModel).not.toHaveBeenCalled();
            expect(core.cachedModel).toBe(mockedModel);
        });

        it('with cache, isOn', () => {
            core.cachedModel = mockedCachedModel;

            switchShadowEdit(core, true);

            expect(createContentModel).not.toHaveBeenCalled();
            expect(originalSwitchShadowEdit).toHaveBeenCalledWith(core, true);
            expect(setContentModel).not.toHaveBeenCalled();
            expect(core.cachedModel).toBe(mockedCachedModel);
        });

        it('no cache, isOff', () => {
            switchShadowEdit(core, false);

            expect(createContentModel).not.toHaveBeenCalled();
            expect(originalSwitchShadowEdit).not.toHaveBeenCalled();
            expect(setContentModel).not.toHaveBeenCalled();
            expect(core.cachedModel).toBe(undefined);
        });

        it('with cache, isOff', () => {
            core.cachedModel = mockedCachedModel;

            switchShadowEdit(core, false);

            expect(createContentModel).not.toHaveBeenCalled();
            expect(originalSwitchShadowEdit).not.toHaveBeenCalled();
            expect(setContentModel).not.toHaveBeenCalled();
            expect(core.cachedModel).toBe(mockedCachedModel);
        });
    });

    describe('was on', () => {
        beforeEach(() => {
            core.lifecycle.shadowEditFragment = {} as any;
        });

        it('no cache, isOn', () => {
            switchShadowEdit(core, true);

            expect(createContentModel).not.toHaveBeenCalled();
            expect(originalSwitchShadowEdit).not.toHaveBeenCalled();
            expect(setContentModel).not.toHaveBeenCalled();
            expect(core.cachedModel).toBe(undefined);
        });

        it('with cache, isOn', () => {
            core.cachedModel = mockedCachedModel;

            switchShadowEdit(core, true);

            expect(createContentModel).not.toHaveBeenCalled();
            expect(originalSwitchShadowEdit).not.toHaveBeenCalled();
            expect(setContentModel).not.toHaveBeenCalled();
            expect(core.cachedModel).toBe(mockedCachedModel);
        });

        it('no cache, isOff', () => {
            switchShadowEdit(core, false);

            expect(createContentModel).not.toHaveBeenCalled();
            expect(originalSwitchShadowEdit).toHaveBeenCalledWith(core, false);
            expect(setContentModel).not.toHaveBeenCalled();
            expect(core.cachedModel).toBe(undefined);
        });

        it('with cache, isOff', () => {
            core.cachedModel = mockedCachedModel;

            switchShadowEdit(core, false);

            expect(createContentModel).not.toHaveBeenCalled();
            expect(originalSwitchShadowEdit).toHaveBeenCalledWith(core, false);
            expect(setContentModel).toHaveBeenCalledWith(core, mockedCachedModel);
            expect(core.cachedModel).toBe(mockedCachedModel);
        });
    });
});
