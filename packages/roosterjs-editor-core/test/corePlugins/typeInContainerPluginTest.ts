import * as dom from 'roosterjs-editor-dom';
import TypeInContainerPlugin from '../../lib/corePlugins/typeInContainer/TypeInContainerPlugin';
import { IEditor, PluginEventType } from 'roosterjs-editor-types';

describe('TypeInContainerPlugin', () => {
    let plugin: TypeInContainerPlugin;
    let editor: IEditor;
    let runAsync: jasmine.Spy;
    let select: jasmine.Spy;
    let defaultFormat: any = {
        defaultFormat: true,
    };

    beforeEach(() => {
        runAsync = jasmine.createSpy('runAsync').and.callFake((callback: () => any) => callback());
        select = jasmine.createSpy('select');
        editor = <IEditor>(<any>{
            runAsync,
            select,
            isDarkMode: () => false,
            getDefaultFormat: () => defaultFormat,
        });

        plugin = new TypeInContainerPlugin();
        plugin.initialize(editor);
    });

    afterEach(() => {
        plugin = null;
        editor = null;
    });

    it('key press event for no selection', () => {
        editor.getSelectionRange = () => null;

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyPress,
            rawEvent: null,
        });

        expect(select).not.toHaveBeenCalled();
        expect(runAsync).not.toHaveBeenCalled();
    });

    it('key press event for selection within editor', () => {
        const div = document.createElement('div');
        div.innerHTML = 'test';
        editor.getSelectionRange = () =>
            <any>{
                startContainer: div.firstChild,
            };

        editor.contains = <any>((node: Node) => node == div);

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyPress,
            rawEvent: null,
        });

        expect(select).not.toHaveBeenCalled();
        expect(runAsync).not.toHaveBeenCalled();
    });

    it('key press event for selection out of editor', () => {
        const div = document.createElement('div');
        div.innerHTML = 'test';

        const targetDiv = document.createElement('div');
        const collapseToSingleElement = jasmine
            .createSpy('collapseToSingleElement')
            .and.returnValue(targetDiv);

        editor.getSelectionRange = () =>
            <any>{
                startContainer: div.firstChild,
                startOffset: 0,
                collapsed: true,
            };
        editor.getBlockElementAtNode = () =>
            <any>{
                collapseToSingleElement,
            };
        editor.contains = <any>(() => false);

        spyOn(dom, 'applyFormat');

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyPress,
            rawEvent: null,
        });

        expect(select).toHaveBeenCalledTimes(1);
        expect(select.calls.argsFor(0)[0].node).toBe(div.firstChild);
        expect(select.calls.argsFor(0)[0].offset).toBe(0);
        expect(runAsync).not.toHaveBeenCalled();
        expect(collapseToSingleElement).toHaveBeenCalled();
        expect(dom.applyFormat).toHaveBeenCalledWith(targetDiv, defaultFormat, false);
    });

    it('key press event for expanded selection out of editor', () => {
        const div = document.createElement('div');
        div.innerHTML = 'test';

        const targetDiv = document.createElement('div');
        const collapseToSingleElement = jasmine
            .createSpy('collapseToSingleElement')
            .and.returnValue(targetDiv);

        editor.getSelectionRange = () =>
            <any>{
                startContainer: div.firstChild,
                startOffset: 0,
                collapsed: false,
            };
        editor.getBlockElementAtNode = () =>
            <any>{
                collapseToSingleElement,
            };
        editor.contains = <any>(() => false);

        spyOn(dom, 'applyFormat');

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyPress,
            rawEvent: null,
        });

        expect(select).toHaveBeenCalledTimes(1);
        expect(select.calls.argsFor(0)[0].node).toBe(div.firstChild);
        expect(select.calls.argsFor(0)[0].offset).toBe(0);
        expect(runAsync).toHaveBeenCalled();
        expect(collapseToSingleElement).toHaveBeenCalled();
        expect(dom.applyFormat).toHaveBeenCalledWith(targetDiv, defaultFormat, false);
    });

    it('key press event fand no block element', () => {
        const div = document.createElement('div');
        div.innerHTML = 'test';

        const targetDiv = document.createElement('div');
        const collapseToSingleElement = jasmine
            .createSpy('collapseToSingleElement')
            .and.returnValue(targetDiv);
        const insertNode = jasmine.createSpy();

        editor.getSelectionRange = () =>
            <any>{
                startContainer: div.firstChild,
                startOffset: 0,
                collapsed: false,
            };
        editor.getBlockElementAtNode = () => null;
        editor.contains = <any>(() => false);
        editor.getDocument = () => document;
        editor.insertNode = insertNode;

        spyOn(dom, 'applyFormat');

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyPress,
            rawEvent: null,
        });

        expect(insertNode).toHaveBeenCalled();
        expect(select).toHaveBeenCalledTimes(1);
        expect(runAsync).toHaveBeenCalled();
        expect(collapseToSingleElement).not.toHaveBeenCalled();
        expect(dom.applyFormat).toHaveBeenCalled();
    });

    it('editor ready event fand no block element', () => {
        const div = document.createElement('div');
        div.innerHTML = 'test';

        const targetDiv = document.createElement('div');
        const collapseToSingleElement = jasmine
            .createSpy('collapseToSingleElement')
            .and.returnValue(targetDiv);
        const insertNode = jasmine.createSpy();

        editor.getSelectionRange = () =>
            <any>{
                startContainer: div.firstChild,
                startOffset: 0,
                collapsed: false,
            };
        editor.getBlockElementAtNode = () => null;
        editor.contains = <any>(() => false);
        editor.getDocument = () => document;
        editor.insertNode = insertNode;

        spyOn(dom, 'applyFormat');

        const position: any = {
            node: div.firstChild,
            offset: 0,
            element: div,
            normalize: () => position,
        };

        plugin.onPluginEvent({
            eventType: PluginEventType.EditorReady,
            startPosition: position,
        });

        expect(insertNode).toHaveBeenCalled();
        expect(select).not.toHaveBeenCalledTimes(1);
        expect(runAsync).toHaveBeenCalled();
        expect(collapseToSingleElement).not.toHaveBeenCalled();
        expect(dom.applyFormat).toHaveBeenCalled();
    });
});
