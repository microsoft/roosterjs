import { ContextMenu } from '../../lib/ContextMenu';
import { IEditor, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import * as TestHelper from '../TestHelper';

describe('ContextMenu plugin', () => {
    let plugin: ContextMenu<any>;
    let editor: IEditor;
    let renderer: jasmine.Spy;
    let dismisser: jasmine.Spy;

    beforeEach(() => {
        plugin = new ContextMenu({
            render: renderer = jasmine.createSpy('renderer'),
            dismiss: dismisser = jasmine.createSpy('dismisser'),
        });
        editor = TestHelper.initEditor('ContextMenuEditor', [plugin]);
    });

    afterEach(() => {
        editor.dispose();
        plugin.dispose();
    });

    function triggerWithItems(items: any[]) {
        let event: PluginEvent = {
            eventType: PluginEventType.ContextMenu,
            rawEvent: new MouseEvent('mousedown'),
            items,
        };

        editor.triggerPluginEvent(PluginEventType.ContextMenu, event);
    }

    it('correctly invokes the renderer', () => {
        const items = [{}];
        triggerWithItems(items);

        expect(renderer).toHaveBeenCalledWith(
            (<any>plugin).container,
            items,
            (<any>plugin).onDismiss
        );
    });

    it('doesnt invoke the renderer if no items were provided', () => {
        triggerWithItems([]);

        expect(renderer).not.toHaveBeenCalled();
    });

    it('calls dismissal function when dismissed', () => {
        let onDismiss: Function | undefined = undefined;
        renderer = renderer.and.callFake((_, _1, onDismissFn) => void (onDismiss = onDismissFn));
        triggerWithItems([{}]);

        expect(onDismiss).toBeDefined();

        onDismiss!?.();

        expect(dismisser).toHaveBeenCalledWith((<any>plugin).container);
    });
});
