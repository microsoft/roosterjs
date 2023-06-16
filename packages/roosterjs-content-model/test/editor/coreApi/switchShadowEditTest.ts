import { ContentModelEditorCore } from '../../../lib/publicTypes/ContentModelEditorCore';
import { switchShadowEdit } from '../../../lib/editor/coreApi/switchShadowEdit';

const mockedModel = 'MODEL' as any;
const mockedCachedModel = 'CACHEMODEL' as any;

describe('switchShadowEdit', () => {
    let core: ContentModelEditorCore;
    let createContentModel: jasmine.Spy;
    let setContentModel: jasmine.Spy;
    let getSelectionRange: jasmine.Spy;

    beforeEach(() => {
        createContentModel = jasmine.createSpy('createContentModel').and.returnValue(mockedModel);
        setContentModel = jasmine.createSpy('setContentModel');
        getSelectionRange = jasmine.createSpy('getSelectionRange');

        core = ({
            api: {
                createContentModel,
                setContentModel,
                getSelectionRange,
            },
            lifecycle: {},
            contentDiv: document.createElement('div'),
        } as any) as ContentModelEditorCore;
    });

    describe('was off', () => {
        it('no cache, isOn', () => {
            switchShadowEdit(core, true);

            expect(createContentModel).toHaveBeenCalledWith(core);
            expect(setContentModel).not.toHaveBeenCalled();
            expect(core.cachedModel).toBe(mockedModel);
        });

        it('with cache, isOn', () => {
            core.cachedModel = mockedCachedModel;

            switchShadowEdit(core, true);

            expect(createContentModel).not.toHaveBeenCalled();
            expect(setContentModel).not.toHaveBeenCalled();
            expect(core.cachedModel).toBe(mockedCachedModel);
        });

        it('no cache, isOff', () => {
            switchShadowEdit(core, false);

            expect(createContentModel).not.toHaveBeenCalled();
            expect(setContentModel).not.toHaveBeenCalled();
            expect(core.cachedModel).toBe(undefined);
        });

        it('with cache, isOff', () => {
            core.cachedModel = mockedCachedModel;

            switchShadowEdit(core, false);

            expect(createContentModel).not.toHaveBeenCalled();
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
            expect(setContentModel).not.toHaveBeenCalled();
            expect(core.cachedModel).toBe(undefined);
        });

        it('with cache, isOn', () => {
            core.cachedModel = mockedCachedModel;

            switchShadowEdit(core, true);

            expect(createContentModel).not.toHaveBeenCalled();
            expect(setContentModel).not.toHaveBeenCalled();
            expect(core.cachedModel).toBe(mockedCachedModel);
        });

        it('no cache, isOff', () => {
            switchShadowEdit(core, false);

            expect(createContentModel).not.toHaveBeenCalled();
            expect(setContentModel).not.toHaveBeenCalled();
            expect(core.cachedModel).toBe(undefined);
        });

        it('with cache, isOff', () => {
            core.cachedModel = mockedCachedModel;

            switchShadowEdit(core, false);

            expect(createContentModel).not.toHaveBeenCalled();
            expect(setContentModel).toHaveBeenCalledWith(core, mockedCachedModel);
            expect(core.cachedModel).toBe(mockedCachedModel);
        });
    });
});
