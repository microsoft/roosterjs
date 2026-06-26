import { EditorAdapter } from '../../lib/editor/EditorAdapter';
import { EditorAdapterOptions } from '../../lib/publicTypes/EditorAdapterOptions';
import { EditorCore } from 'roosterjs-content-model-types';
import {
    ChangeSource,
    ColorTransformDirection,
    ContentPosition,
    GetContentMode,
    PluginEventType,
} from 'roosterjs-editor-types';

describe('EditorAdapter', () => {
    it('default format', () => {
        const div = document.createElement('div');
        const editor = new EditorAdapter(div, {
            defaultSegmentFormat: {
                fontWeight: 'bold',
                italic: true,
                underline: true,
                fontFamily: 'Arial',
                fontSize: '10pt',
                textColor: 'black',
                backgroundColor: 'white',
            },
        });

        const model = editor.getContentModelCopy('connected');

        expect(model.format).toEqual({
            fontWeight: 'bold',
            italic: true,
            underline: true,
            fontFamily: 'Arial',
            fontSize: '10pt',
            textColor: 'black',
            backgroundColor: 'white',
        });
    });

    it('getPendingFormat', () => {
        const div = document.createElement('div');
        const editor = new EditorAdapter(div);
        const core: EditorCore = (editor as any).core;
        const mockedFormat = 'FORMAT' as any;

        expect(editor.getPendingFormat()).toBeNull();

        core.format.pendingFormat = {
            format: mockedFormat,
        } as any;

        expect(editor.getPendingFormat()).toEqual(mockedFormat);
    });

    it('dispose', () => {
        const div = document.createElement('div');
        div.style.fontFamily = 'Arial';

        const editor = new EditorAdapter(div);

        expect(div.style.fontFamily).toBe('Arial');

        editor.dispose();

        expect(div.style.fontFamily).toBe('Arial');
    });
});

describe('EditorAdapter API coverage', () => {
    let div: HTMLDivElement;
    let editor: EditorAdapter;

    function createEditor(options?: EditorAdapterOptions, initialHtml?: string) {
        // Note: intentionally NOT attached to document.body. A live editor sets an initial
        // DOM selection which queues an async selectionchange that can fire after the editor
        // is disposed in afterEach, throwing "Editor is already disposed" and failing the run.
        div = document.createElement('div');
        if (initialHtml) {
            div.innerHTML = initialHtml;
        }
        editor = new EditorAdapter(div, options);
        return editor;
    }

    afterEach(() => {
        if (editor && !editor.isDisposed()) {
            editor.dispose();
        }
        div?.parentNode?.removeChild(div);
    });

    it('isDisposed', () => {
        createEditor();

        expect(editor.isDisposed()).toBe(false);

        editor.dispose();

        expect(editor.isDisposed()).toBe(true);
    });

    it('getContentModelEditorCore throws after dispose', () => {
        createEditor();
        editor.dispose();

        expect(() => editor.getSizeTransformer()).toThrowError('Editor is already disposed');
    });

    describe('addDomEventHandler', () => {
        it('converts a single function handler', () => {
            createEditor();
            const attachSpy = spyOn(editor, 'attachDomEvent').and.returnValue(() => {});
            const handler = () => {};

            editor.addDomEventHandler('click', handler);

            const map = attachSpy.calls.argsFor(0)[0] as any;
            expect(map.click.beforeDispatch).toBe(handler);
            expect(map.click.pluginEventType).toBeNull();
        });

        it('converts a numeric (plugin event type) handler', () => {
            createEditor();
            const attachSpy = spyOn(editor, 'attachDomEvent').and.returnValue(() => {});

            editor.addDomEventHandler({ keydown: PluginEventType.KeyDown });

            const map = attachSpy.calls.argsFor(0)[0] as any;
            expect(map.keydown.pluginEventType).toBeDefined();
            expect(map.keydown.beforeDispatch).toBeNull();
        });

        it('converts an object handler with beforeDispatch and numeric pluginEventType', () => {
            createEditor();
            const attachSpy = spyOn(editor, 'attachDomEvent').and.returnValue(() => {});
            const beforeDispatch = () => {};

            editor.addDomEventHandler({
                input: { beforeDispatch, pluginEventType: PluginEventType.Input },
            });

            const map = attachSpy.calls.argsFor(0)[0] as any;
            expect(map.input.beforeDispatch).toBe(beforeDispatch);
            expect(map.input.pluginEventType).toBeDefined();
        });

        it('converts an object handler with no numeric pluginEventType', () => {
            createEditor();
            const attachSpy = spyOn(editor, 'attachDomEvent').and.returnValue(() => {});
            const beforeDispatch = () => {};

            editor.addDomEventHandler({
                input: { beforeDispatch, pluginEventType: undefined } as any,
            });

            const map = attachSpy.calls.argsFor(0)[0] as any;
            expect(map.input.beforeDispatch).toBe(beforeDispatch);
            expect(map.input.pluginEventType).toBeUndefined();
        });
    });

    describe('getSelectionRange', () => {
        it('returns the range when selection is a range', () => {
            createEditor();
            const mockedRange = { id: 'range' } as any;
            spyOn(editor, 'getDOMSelection').and.returnValue({
                type: 'range',
                range: mockedRange,
            } as any);

            expect(editor.getSelectionRange()).toBe(mockedRange);
        });

        it('returns null when selection is not a range', () => {
            createEditor();
            spyOn(editor, 'getDOMSelection').and.returnValue({ type: 'image' } as any);

            expect(editor.getSelectionRange()).toBeNull();
        });
    });

    it('getSelectionRangeEx delegates to selection converter', () => {
        createEditor();
        spyOn(editor, 'getDOMSelection').and.returnValue(null as any);

        const result = editor.getSelectionRangeEx();

        expect(result).toBeTruthy();
        expect(Array.isArray(result.ranges)).toBe(true);
    });

    describe('getContent', () => {
        it('exports HTML by default', () => {
            createEditor(undefined, '<p>Hello</p>');

            const content = editor.getContent();

            expect(typeof content).toBe('string');
            expect(content).toContain('Hello');
        });

        it('exports plain text', () => {
            createEditor(undefined, '<p>Hello</p>');

            const content = editor.getContent(GetContentMode.PlainText);

            expect(typeof content).toBe('string');
            expect(content).toContain('Hello');
        });

        it('exports plain text fast', () => {
            createEditor(undefined, '<p>Hello</p>');

            const content = editor.getContent(GetContentMode.PlainTextFast);

            expect(typeof content).toBe('string');
            expect(content).toContain('Hello');
        });
    });

    it('undo does not throw on a fresh editor', () => {
        createEditor();

        expect(() => editor.undo()).not.toThrow();
    });

    it('redo does not throw on a fresh editor', () => {
        createEditor();

        expect(() => editor.redo()).not.toThrow();
    });

    describe('setZoomScale', () => {
        it('triggers a zoomChanged event for a valid scale', () => {
            createEditor();
            const triggerSpy = spyOn(editor, 'triggerEvent');

            editor.setZoomScale(2);

            expect(triggerSpy).toHaveBeenCalledWith('zoomChanged', { newZoomScale: 2 }, true);
        });

        it('ignores a non-positive scale', () => {
            createEditor();
            const triggerSpy = spyOn(editor, 'triggerEvent');

            editor.setZoomScale(0);

            expect(triggerSpy).not.toHaveBeenCalled();
        });

        it('ignores a scale greater than 10', () => {
            createEditor();
            const triggerSpy = spyOn(editor, 'triggerEvent');

            editor.setZoomScale(11);

            expect(triggerSpy).not.toHaveBeenCalled();
        });
    });

    it('getZoomScale delegates to the DOM helper', () => {
        createEditor();
        spyOn(editor, 'getDOMHelper').and.returnValue({
            calculateZoomScale: () => 2.5,
        } as any);

        expect(editor.getZoomScale()).toBe(2.5);
    });

    it('triggerContentChangedEvent triggers a ContentChanged plugin event', () => {
        createEditor();
        const triggerSpy = spyOn(editor, 'triggerPluginEvent');

        editor.triggerContentChangedEvent(ChangeSource.SetContent, { x: 1 });

        expect(triggerSpy).toHaveBeenCalledWith(PluginEventType.ContentChanged, {
            source: ChangeSource.SetContent,
            data: { x: 1 },
        });
    });

    describe('setEditorDomAttribute / getEditorDomAttribute', () => {
        it('delegates to the DOM helper', () => {
            createEditor();
            const setDomAttributeSpy = jasmine.createSpy('setDomAttribute');
            const getDomAttributeSpy = jasmine.createSpy('getDomAttribute').and.returnValue('val');
            spyOn(editor, 'getDOMHelper').and.returnValue({
                setDomAttribute: setDomAttributeSpy,
                getDomAttribute: getDomAttributeSpy,
            } as any);

            editor.setEditorDomAttribute('data-test', '1');
            const value = editor.getEditorDomAttribute('data-test');

            expect(setDomAttributeSpy).toHaveBeenCalledWith('data-test', '1');
            expect(getDomAttributeSpy).toHaveBeenCalledWith('data-test');
            expect(value).toBe('val');
        });
    });

    describe('node manipulation', () => {
        it('deleteNode returns false for a node outside the editor', () => {
            createEditor();
            const orphan = document.createElement('span');

            expect(editor.deleteNode(orphan)).toBe(false);
        });

        it('deleteNode removes a node within the editor', () => {
            createEditor();
            const child = document.createElement('span');
            div.appendChild(child);

            expect(editor.deleteNode(child)).toBe(true);
            expect(child.parentNode).toBeNull();
        });

        it('replaceNode returns false for a node outside the editor', () => {
            createEditor();
            const orphan = document.createElement('span');
            const replacement = document.createElement('div');

            expect(editor.replaceNode(orphan, replacement)).toBe(false);
        });

        it('replaceNode replaces a node within the editor', () => {
            createEditor();
            const child = document.createElement('span');
            div.appendChild(child);
            const replacement = document.createElement('div');

            expect(editor.replaceNode(child, replacement)).toBe(true);
            expect(child.parentNode).toBeNull();
            expect(replacement.parentNode).toBe(div);
        });

        it('insertNode returns false for a null node', () => {
            createEditor();

            expect(editor.insertNode(null as any)).toBe(false);
        });

        it('insertNode inserts a node outside the editor for ContentPosition.Outside', () => {
            createEditor();
            // Give the editor div a (detached) parent so the Outside branch has somewhere to insert
            const parent = document.createElement('div');
            parent.appendChild(div);
            const node = document.createElement('span');

            const result = editor.insertNode(node, {
                position: ContentPosition.Outside,
                updateCursor: false,
                replaceSelection: false,
                insertOnNewLine: false,
            });

            expect(result).toBe(true);
            expect(node.parentNode).toBe(parent);
        });
    });

    describe('contains', () => {
        it('returns false for null', () => {
            createEditor();

            expect(editor.contains(null)).toBe(false);
        });

        it('returns true for a contained node', () => {
            createEditor();
            const child = document.createElement('span');
            div.appendChild(child);

            expect(editor.contains(child)).toBe(true);
        });

        it('returns false for a node outside the editor', () => {
            createEditor();
            const orphan = document.createElement('span');

            expect(editor.contains(orphan)).toBe(false);
        });
    });

    it('getCustomData stores and reuses the value via the getter', () => {
        createEditor();
        const getter = jasmine.createSpy('getter').and.returnValue({ value: 1 });

        const first = editor.getCustomData('key', getter);
        const second = editor.getCustomData('key', getter);

        expect(first).toBe(second);
        expect(getter).toHaveBeenCalledTimes(1);
    });

    it('isFeatureEnabled reflects the configured experimental features', () => {
        createEditor({ experimentalFeatures: ['FeatureA' as any] });

        expect(editor.isFeatureEnabled('FeatureA' as any)).toBe(true);
        expect(editor.isFeatureEnabled('FeatureB' as any)).toBe(false);
    });

    it('getDefaultFormat reads from the core default format', () => {
        createEditor({
            defaultSegmentFormat: {
                fontWeight: 'bold',
                italic: true,
                underline: true,
                fontFamily: 'Arial',
                fontSize: '10pt',
                textColor: 'black',
                backgroundColor: 'white',
            },
        });

        const format = editor.getDefaultFormat();

        expect(format.bold).toBe(true);
        expect(format.italic).toBe(true);
        expect(format.underline).toBe(true);
        expect(format.fontFamily).toBe('Arial');
        expect(format.fontSize).toBe('10pt');
        expect(format.textColor).toBe('black');
        expect(format.backgroundColor).toBe('white');
    });

    it('isInIME reflects the dom event state', () => {
        createEditor();
        const core = (editor as any).getCore();

        expect(editor.isInIME()).toBe(false);

        core.domEvent.isInIME = true;
        expect(editor.isInIME()).toBe(true);
    });

    it('getSizeTransformer and getDarkColorHandler return core objects', () => {
        createEditor();

        expect(editor.getSizeTransformer()).toBeTruthy();
        expect(editor.getDarkColorHandler()).toBeTruthy();
    });

    it('getUndoState reports canUndo when there is new content', () => {
        createEditor();
        const core = (editor as any).getCore();
        core.undo.snapshotsManager.hasNewContent = true;

        expect(editor.getUndoState().canUndo).toBe(true);
    });

    describe('content edit features', () => {
        it('adds and removes a content edit feature', () => {
            createEditor();
            const core = (editor as any).getContentModelEditorCore();
            const feature = {
                keys: [PluginEventType.KeyDown],
                shouldHandleEvent: () => true,
            } as any;

            editor.addContentEditFeature(feature);
            expect(core.edit.features[PluginEventType.KeyDown]).toContain(feature);

            editor.removeContentEditFeature(feature);
            expect(core.edit.features[PluginEventType.KeyDown]).toBeUndefined();
        });
    });

    describe('runAsync', () => {
        it('runs the callback asynchronously and returns a canceler', () => {
            createEditor();
            const win = editor.getDocument().defaultView as Window;
            spyOn(win, 'requestAnimationFrame').and.callFake((cb: FrameRequestCallback) => {
                cb(0);
                return 42;
            });
            const cancelSpy = spyOn(win, 'cancelAnimationFrame');
            const callback = jasmine.createSpy('callback');

            const canceler = editor.runAsync(callback);

            expect(callback).toHaveBeenCalledWith(editor as any);

            canceler();
            expect(cancelSpy).toHaveBeenCalledWith(42 as any);
        });
    });

    it('transformToDarkColor does not modify nodes in light mode', () => {
        createEditor();
        const span = document.createElement('span');
        span.style.color = 'red';

        editor.transformToDarkColor(span, ColorTransformDirection.LightToDark);

        // In light mode the call is a no-op, so the inline color is untouched
        expect(span.style.color).toBe('red');
    });

    it('getRelativeDistanceToEditor returns null for an element outside the editor', () => {
        createEditor();
        const orphan = document.createElement('span');

        expect(editor.getRelativeDistanceToEditor(orphan)).toBeNull();
    });
});
