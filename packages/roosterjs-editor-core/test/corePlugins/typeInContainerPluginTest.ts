import * as dom from 'roosterjs-editor-dom';
import TypeInContainerPlugin from '../../lib/corePlugins/TypeInContainerPlugin';
import { ExperimentalFeatures, IEditor, PluginEventType } from 'roosterjs-editor-types';

describe('TypeInContainerPlugin', () => {
    let plugin: TypeInContainerPlugin;
    let editor: IEditor;
    let runAsync: jasmine.Spy;
    let select: jasmine.Spy;
    let ensureTypeInContainer: jasmine.Spy;
    let defaultFormat: any = {
        defaultFormat: true,
    };

    beforeEach(() => {
        runAsync = jasmine
            .createSpy('runAsync')
            .and.callFake((callback: (editor: IEditor) => any) => callback(editor));
        select = jasmine.createSpy('select');
        ensureTypeInContainer = jasmine.createSpy('ensureTypeInContainer');
        editor = <IEditor>(<any>{
            runAsync,
            select,
            ensureTypeInContainer,
            isDarkMode: () => false,
            getDefaultFormat: () => defaultFormat,
            isFeatureEnabled: (features: ExperimentalFeatures) => true,
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
        expect(ensureTypeInContainer).not.toHaveBeenCalled();
    });

    it('key press event for selection within editor [Experimental Feature Enabled]', () => {
        const div = document.createElement('div');
        div.setAttribute('style', 'color:red');
        div.innerHTML = 'test';
        editor.getSelectionRange = () =>
            <any>{
                startContainer: div.firstChild,
                collapsed: true,
            };

        editor.contains = <any>((node: Node) => node == div);

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyPress,
            rawEvent: null,
        });

        expect(select).not.toHaveBeenCalled();
        expect(runAsync).not.toHaveBeenCalled();
        expect(ensureTypeInContainer).not.toHaveBeenCalled();
    });

    it('key press event for selection within editor [No style] [Experimental Feature Enabled]', () => {
        const div = document.createElement('div');
        div.innerHTML = 'test';
        editor.getSelectionRange = () =>
            <any>{
                startContainer: div.firstChild,
                collapsed: true,
            };
        editor.contains = <any>((node: Node) => node == div);
        plugin.onPluginEvent({
            eventType: PluginEventType.KeyPress,
            rawEvent: null,
        });

        expect(select).not.toHaveBeenCalled();
        expect(runAsync).not.toHaveBeenCalled();
        expect(ensureTypeInContainer).toHaveBeenCalled();
    });

    it('key press event for selection within editor [Styled with inner div] [Experimental Feature Enabled]', () => {
        const div = document.createElement('div');
        div.setAttribute('style', 'color:red');
        div.innerHTML = 'test';
        const innerDiv = document.createElement('div');
        div.append(innerDiv);
        editor.getSelectionRange = () =>
            <any>{
                startContainer: div.firstChild,
                collapsed: true,
            };
        editor.contains = <any>((node: Node) => node == div);
        plugin.onPluginEvent({
            eventType: PluginEventType.KeyPress,
            rawEvent: null,
        });

        expect(select).not.toHaveBeenCalled();
        expect(runAsync).not.toHaveBeenCalled();
        expect(ensureTypeInContainer).not.toHaveBeenCalled();
    });

    it('key press event for selection directly under editor', () => {
        const div = document.createElement('div');
        div.innerHTML = 'test';
        editor.getSelectionRange = () =>
            <any>{
                startContainer: div.firstChild,
                collapsed: true,
            };

        editor.contains = <any>((node: Node) => false);

        plugin.onPluginEvent({
            eventType: PluginEventType.KeyPress,
            rawEvent: null,
        });

        expect(select).not.toHaveBeenCalled();
        expect(runAsync).not.toHaveBeenCalled();
        expect(ensureTypeInContainer).toHaveBeenCalled();
    });

    xit('key press event for selection out of editor', () => {
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

    xit('key press event for expanded selection out of editor', () => {
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

    xit('key press event and no block element', () => {
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

    xit('editor ready event and no block element', () => {
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
        });

        expect(insertNode).toHaveBeenCalled();
        expect(select).not.toHaveBeenCalledTimes(1);
        expect(runAsync).toHaveBeenCalled();
        expect(collapseToSingleElement).not.toHaveBeenCalled();
        expect(dom.applyFormat).toHaveBeenCalled();
    });
});
