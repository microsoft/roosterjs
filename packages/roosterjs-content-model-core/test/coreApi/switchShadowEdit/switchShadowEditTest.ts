import * as iterateSelections from 'roosterjs-content-model-dom/lib/modelApi/selection/iterateSelections';
import * as toggleCaret from '../../../lib/coreApi/setDOMSelection/toggleCaret';
import * as toggleTableSelection from '../../../lib/coreApi/setDOMSelection/toggleTableSelection';
import { EditorCore } from 'roosterjs-content-model-types';
import { switchShadowEdit } from '../../../lib/coreApi/switchShadowEdit/switchShadowEdit';

const mockedModel = 'MODEL' as any;
const mockedCachedModel = 'CACHEMODEL' as any;

describe('switchShadowEdit', () => {
    let core: EditorCore;
    let createContentModel: jasmine.Spy;
    let setContentModel: jasmine.Spy;
    let getSelectionRange: jasmine.Spy;
    let triggerEvent: jasmine.Spy;
    let toggleCaretSpy: jasmine.Spy;
    let toggleTableSelectionSpy: jasmine.Spy;

    beforeEach(() => {
        createContentModel = jasmine.createSpy('createContentModel').and.returnValue(mockedModel);
        setContentModel = jasmine.createSpy('setContentModel');
        getSelectionRange = jasmine.createSpy('getSelectionRange');
        triggerEvent = jasmine.createSpy('triggerEvent');
        toggleCaretSpy = spyOn(toggleCaret, 'toggleCaret');
        toggleTableSelectionSpy = spyOn(toggleTableSelection, 'toggleTableSelection');

        const contentDiv = document.createElement('div');

        core = ({
            physicalRoot: contentDiv,
            logicalRoot: contentDiv,
            api: {
                createContentModel,
                setContentModel,
                getSelectionRange,
                triggerEvent,
            },
            lifecycle: {},
            cache: {},
            selection: {
                selection: null,
            },
        } as any) as EditorCore;
    });

    describe('was off', () => {
        it('no cache, isOn', () => {
            core.cache.cachedModel = undefined;
            switchShadowEdit(core, true);

            expect(createContentModel).toHaveBeenCalledWith(core);
            expect(setContentModel).not.toHaveBeenCalled();
            expect(core.cache.cachedModel).toBe(mockedModel);
            expect(triggerEvent).toHaveBeenCalledTimes(1);
            expect(triggerEvent).toHaveBeenCalledWith(
                core,
                {
                    eventType: 'enteredShadowEdit',
                },
                false
            );
            expect(toggleCaretSpy).toHaveBeenCalledWith(core, true);
            expect(toggleTableSelectionSpy).toHaveBeenCalledWith(core, true);
        });

        it('with cache, isOn', () => {
            core.cache.cachedModel = mockedCachedModel;

            switchShadowEdit(core, true);

            expect(createContentModel).not.toHaveBeenCalled();
            expect(setContentModel).not.toHaveBeenCalled();
            expect(core.cache.cachedModel).toBe(mockedCachedModel);

            expect(triggerEvent).toHaveBeenCalledTimes(1);
            expect(triggerEvent).toHaveBeenCalledWith(
                core,
                {
                    eventType: 'enteredShadowEdit',
                },
                false
            );
            expect(toggleCaretSpy).toHaveBeenCalledWith(core, true);
            expect(toggleTableSelectionSpy).toHaveBeenCalledWith(core, true);
        });

        it('no cache, isOff', () => {
            switchShadowEdit(core, false);

            expect(createContentModel).not.toHaveBeenCalled();
            expect(setContentModel).not.toHaveBeenCalled();
            expect(core.cache.cachedModel).toBe(undefined);

            expect(triggerEvent).not.toHaveBeenCalled();
            expect(toggleCaretSpy).not.toHaveBeenCalled();
            expect(toggleTableSelectionSpy).not.toHaveBeenCalled();
        });

        it('with cache, isOff', () => {
            core.cache.cachedModel = mockedCachedModel;

            switchShadowEdit(core, false);

            expect(createContentModel).not.toHaveBeenCalled();
            expect(setContentModel).not.toHaveBeenCalled();
            expect(core.cache.cachedModel).toBe(mockedCachedModel);

            expect(triggerEvent).not.toHaveBeenCalled();
            expect(toggleCaretSpy).not.toHaveBeenCalled();
            expect(toggleTableSelectionSpy).not.toHaveBeenCalled();
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
            expect(core.cache.cachedModel).toBe(undefined);

            expect(triggerEvent).not.toHaveBeenCalled();
            expect(toggleCaretSpy).not.toHaveBeenCalled();
            expect(toggleTableSelectionSpy).not.toHaveBeenCalled();
        });

        it('with cache, isOn', () => {
            core.cache.cachedModel = mockedCachedModel;

            switchShadowEdit(core, true);

            expect(createContentModel).not.toHaveBeenCalled();
            expect(setContentModel).not.toHaveBeenCalled();
            expect(core.cache.cachedModel).toBe(mockedCachedModel);

            expect(triggerEvent).not.toHaveBeenCalled();
            expect(toggleCaretSpy).not.toHaveBeenCalled();
            expect(toggleTableSelectionSpy).not.toHaveBeenCalled();
        });

        it('no cache, isOff', () => {
            switchShadowEdit(core, false);

            expect(createContentModel).not.toHaveBeenCalled();
            expect(setContentModel).not.toHaveBeenCalled();
            expect(core.cache.cachedModel).toBe(undefined);

            expect(triggerEvent).toHaveBeenCalledTimes(1);
            expect(triggerEvent).toHaveBeenCalledWith(
                core,
                {
                    eventType: 'leavingShadowEdit',
                },
                false
            );
            expect(toggleCaretSpy).toHaveBeenCalledWith(core, false);
            expect(toggleTableSelectionSpy).toHaveBeenCalledWith(core, false);
        });

        it('with cache, isOff', () => {
            core.cache.cachedModel = mockedCachedModel;

            spyOn(iterateSelections, 'iterateSelections');

            switchShadowEdit(core, false);

            expect(createContentModel).not.toHaveBeenCalled();
            expect(setContentModel).toHaveBeenCalledWith(core, mockedCachedModel, {
                ignoreSelection: true,
            });
            expect(core.cache.cachedModel).toBe(mockedCachedModel);

            expect(triggerEvent).toHaveBeenCalledTimes(1);
            expect(triggerEvent).toHaveBeenCalledWith(
                core,
                {
                    eventType: 'leavingShadowEdit',
                },
                false
            );
            expect(toggleCaretSpy).toHaveBeenCalledWith(core, false);
            expect(toggleTableSelectionSpy).toHaveBeenCalledWith(core, false);
        });
    });
});
