import createEditorCore from './createMockEditorCore';
import { PluginEventType } from 'roosterjs-editor-types';
import { switchShadowEdit } from '../../lib/coreApi/switchShadowEdit';

describe('switchShadowEdit', () => {
    let div: HTMLDivElement;
    let testNode: Text;
    beforeEach(() => {
        div = document.createElement('div');
        testNode = document.createTextNode('test');
        document.body.appendChild(div);
        div.appendChild(testNode);
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null;
    });

    it('Off => Off', () => {
        const core = createEditorCore(div, {});
        const range = document.createRange();
        range.selectNode(testNode);
        core.api.getSelectionRange = () => range;
        const triggerEvent = jasmine.createSpy('triggerEvent');
        core.api.triggerEvent = triggerEvent;

        switchShadowEdit(core, false);

        expect(core.lifecycle.shadowEditFragment).toBeNull();
        expect(core.lifecycle.shadowEditSelectionPath).toBeNull();
        expect(triggerEvent).not.toHaveBeenCalled();
        expect(testNode.parentNode).toBe(div);
    });

    it('Off => On', () => {
        const core = createEditorCore(div, {});
        const triggerEvent = jasmine.createSpy('triggerEvent');
        const range = document.createRange();
        range.selectNode(testNode);
        core.api.getSelectionRange = () => range;
        core.api.triggerEvent = triggerEvent;
        div.focus();

        switchShadowEdit(core, true);

        expect(core.lifecycle.shadowEditFragment).not.toBeNull();
        expect(core.lifecycle.shadowEditSelectionPath).not.toBeNull();
        expect(triggerEvent).toHaveBeenCalledWith(
            core,
            {
                eventType: PluginEventType.EnteredShadowEdit,
                fragment: core.lifecycle.shadowEditFragment,
                selectionPath: core.lifecycle.shadowEditSelectionPath,
            },
            false
        );
        expect(testNode.parentNode).not.toBe(div);
        expect(div.innerHTML).toBe('test');
    });

    it('On => On', () => {
        const core = createEditorCore(div, {});
        const triggerEvent = jasmine.createSpy('triggerEvent');
        core.api.triggerEvent = triggerEvent;
        core.lifecycle.shadowEditFragment = document.createDocumentFragment();
        core.lifecycle.shadowEditFragment.appendChild(testNode);
        core.lifecycle.shadowEditSelectionPath = [{ start: [0], end: [0] }];
        div.focus();

        switchShadowEdit(core, true);

        expect(core.lifecycle.shadowEditFragment).not.toBeNull();
        expect(core.lifecycle.shadowEditSelectionPath).not.toBeNull();
        expect(triggerEvent).not.toHaveBeenCalled();
        expect(testNode.parentNode).not.toBe(div);
        expect(div.innerHTML).toBe('test');
    });

    it('On => Off', () => {
        const core = createEditorCore(div, {});
        const range = document.createRange();
        range.selectNode(testNode);
        core.api.getSelectionRange = () => range;
        const triggerEvent = jasmine.createSpy('triggerEvent');
        core.api.triggerEvent = triggerEvent;
        core.lifecycle.shadowEditFragment = document.createDocumentFragment();
        core.lifecycle.shadowEditFragment.appendChild(testNode);
        core.lifecycle.shadowEditSelectionPath = [{ start: [0], end: [0] }];
        div.focus();

        switchShadowEdit(core, false);

        expect(core.lifecycle.shadowEditFragment).toBeNull();
        expect(core.lifecycle.shadowEditSelectionPath).toBeNull();
        expect(triggerEvent).toHaveBeenCalledWith(
            core,
            {
                eventType: PluginEventType.LeavingShadowEdit,
            },
            false
        );
        expect(testNode.parentNode).toBe(div);
        expect(div.innerHTML).toBe('test');
    });
});
