import {
    ContextMenuOptions,
    ContextMenuPluginBase,
} from '../../lib/contextMenuBase/ContextMenuPluginBase';
import { IEditor, PluginEvent } from 'roosterjs-content-model-types';

describe('ContextMenuPluginBase', () => {
    let renderSpy: jasmine.Spy;
    let dismissSpy: jasmine.Spy;
    let createElementSpy: jasmine.Spy;
    let appendChildSpy: jasmine.Spy;
    let removeChildSpy: jasmine.Spy;
    let setPropertySpy: jasmine.Spy;
    let preventDefaultSpy: jasmine.Spy;

    let editor: IEditor;
    let mockedContainer: HTMLElement;
    let mockedBody: HTMLElement;

    function createPlugin(options?: Partial<ContextMenuOptions<string>>) {
        return new ContextMenuPluginBase<string>({
            render: renderSpy,
            dismiss: dismissSpy,
            ...options,
        });
    }

    function createContextMenuEvent(
        items: (string | null)[],
        pageX: number = 100,
        pageY: number = 200
    ): PluginEvent {
        return <PluginEvent>(<any>{
            eventType: 'contextMenu',
            items,
            rawEvent: {
                pageX,
                pageY,
                preventDefault: preventDefaultSpy,
            },
        });
    }

    beforeEach(() => {
        renderSpy = jasmine.createSpy('render');
        dismissSpy = jasmine.createSpy('dismiss');
        appendChildSpy = jasmine.createSpy('appendChild');
        removeChildSpy = jasmine.createSpy('removeChild');
        setPropertySpy = jasmine.createSpy('setProperty');
        preventDefaultSpy = jasmine.createSpy('preventDefault');

        mockedBody = <HTMLElement>(<any>{
            appendChild: appendChildSpy,
        });

        mockedContainer = <HTMLElement>(<any>{
            style: {
                setProperty: setPropertySpy,
            },
            parentNode: null,
        });

        createElementSpy = jasmine.createSpy('createElement').and.returnValue(mockedContainer);

        editor = <IEditor>(<any>{
            getDocument: () => ({
                createElement: createElementSpy,
                body: mockedBody,
            }),
        });
    });

    it('getName', () => {
        const plugin = createPlugin();

        expect(plugin.getName()).toBe('ContextMenu');
    });

    it('initialize then dispose without showing a menu', () => {
        const plugin = createPlugin();

        plugin.initialize(editor);
        plugin.dispose();

        expect(dismissSpy).not.toHaveBeenCalled();
        expect(removeChildSpy).not.toHaveBeenCalled();
    });

    it('onPluginEvent ignores non-contextMenu events', () => {
        const plugin = createPlugin();
        plugin.initialize(editor);

        plugin.onPluginEvent(<PluginEvent>(<any>{ eventType: 'input', items: ['a'] }));

        expect(createElementSpy).not.toHaveBeenCalled();
        expect(renderSpy).not.toHaveBeenCalled();
    });

    it('onPluginEvent ignores contextMenu event with empty items', () => {
        const plugin = createPlugin();
        plugin.initialize(editor);

        plugin.onPluginEvent(createContextMenuEvent([]));

        expect(createElementSpy).not.toHaveBeenCalled();
        expect(renderSpy).not.toHaveBeenCalled();
        expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('onPluginEvent creates container, prevents default and renders menu', () => {
        const plugin = createPlugin();
        plugin.initialize(editor);

        const items = ['Item1', 'Item2'];
        plugin.onPluginEvent(createContextMenuEvent(items, 50, 75));

        expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
        expect(createElementSpy).toHaveBeenCalledWith('div');
        expect(appendChildSpy).toHaveBeenCalledWith(mockedContainer);
        expect(mockedContainer.style.position).toBe('fixed');
        expect(mockedContainer.style.width).toBe('0');
        expect(mockedContainer.style.height).toBe('0');
        expect(setPropertySpy).toHaveBeenCalledWith('left', '50px');
        expect(setPropertySpy).toHaveBeenCalledWith('top', '75px');
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect(renderSpy.calls.argsFor(0)[0]).toBe(mockedContainer);
        expect(renderSpy.calls.argsFor(0)[1]).toBe(items);
    });

    it('onPluginEvent does not prevent default when allowDefaultMenu is true', () => {
        const plugin = createPlugin({ allowDefaultMenu: true });
        plugin.initialize(editor);

        plugin.onPluginEvent(createContextMenuEvent(['Item1']));

        expect(preventDefaultSpy).not.toHaveBeenCalled();
        expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    it('onPluginEvent does nothing when editor is not initialized', () => {
        const plugin = createPlugin();

        // No initialize() call, so editor is null and container cannot be created
        plugin.onPluginEvent(createContextMenuEvent(['Item1']));

        expect(createElementSpy).not.toHaveBeenCalled();
        expect(renderSpy).not.toHaveBeenCalled();
        expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
    });

    it('onPluginEvent reuses existing container on a second event and dismisses the previous menu', () => {
        const plugin = createPlugin();
        plugin.initialize(editor);

        plugin.onPluginEvent(createContextMenuEvent(['Item1'], 10, 20));

        expect(createElementSpy).toHaveBeenCalledTimes(1);
        expect(dismissSpy).not.toHaveBeenCalled();

        plugin.onPluginEvent(createContextMenuEvent(['Item2'], 30, 40));

        // Container is reused, not recreated
        expect(createElementSpy).toHaveBeenCalledTimes(1);
        // Previous menu was dismissed before showing the new one
        expect(dismissSpy).toHaveBeenCalledTimes(1);
        expect(dismissSpy).toHaveBeenCalledWith(mockedContainer);
        expect(setPropertySpy).toHaveBeenCalledWith('left', '30px');
        expect(setPropertySpy).toHaveBeenCalledWith('top', '40px');
        expect(renderSpy).toHaveBeenCalledTimes(2);
    });

    it('onDismiss callback passed to render dismisses the showing menu only once', () => {
        const plugin = createPlugin();
        plugin.initialize(editor);

        plugin.onPluginEvent(createContextMenuEvent(['Item1']));

        const onDismiss = renderSpy.calls.argsFor(0)[2] as () => void;

        onDismiss();
        expect(dismissSpy).toHaveBeenCalledTimes(1);
        expect(dismissSpy).toHaveBeenCalledWith(mockedContainer);

        // Calling again does nothing since the menu is no longer showing
        onDismiss();
        expect(dismissSpy).toHaveBeenCalledTimes(1);
    });

    it('onPluginEvent works when dismiss option is not provided', () => {
        const plugin = createPlugin({ dismiss: undefined });
        plugin.initialize(editor);

        plugin.onPluginEvent(createContextMenuEvent(['Item1']));

        // Second event triggers onDismiss internally; should not throw without a dismiss callback
        expect(() => plugin.onPluginEvent(createContextMenuEvent(['Item2']))).not.toThrow();
        expect(renderSpy).toHaveBeenCalledTimes(2);
    });

    it('dispose dismisses showing menu and removes container from its parent', () => {
        const plugin = createPlugin();
        plugin.initialize(editor);

        plugin.onPluginEvent(createContextMenuEvent(['Item1']));

        (mockedContainer as any).parentNode = {
            removeChild: removeChildSpy,
        };

        plugin.dispose();

        expect(dismissSpy).toHaveBeenCalledTimes(1);
        expect(dismissSpy).toHaveBeenCalledWith(mockedContainer);
        expect(removeChildSpy).toHaveBeenCalledWith(mockedContainer);
    });

    it('dispose removes container even when no menu is showing', () => {
        const plugin = createPlugin();
        plugin.initialize(editor);

        plugin.onPluginEvent(createContextMenuEvent(['Item1']));

        // Dismiss the menu first so isMenuShowing is false
        const onDismiss = renderSpy.calls.argsFor(0)[2] as () => void;
        onDismiss();
        dismissSpy.calls.reset();

        (mockedContainer as any).parentNode = {
            removeChild: removeChildSpy,
        };

        plugin.dispose();

        expect(dismissSpy).not.toHaveBeenCalled();
        expect(removeChildSpy).toHaveBeenCalledWith(mockedContainer);
    });
});
