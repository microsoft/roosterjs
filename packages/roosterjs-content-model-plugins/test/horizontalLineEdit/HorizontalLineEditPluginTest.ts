import { HorizontalLineEditPlugin } from '../../lib/horizontalLineEdit/HorizontalLineEditPlugin';
import { initEditor, removeElement } from '../TestHelper';
import {
    cloneModel,
    createDomToModelContext,
    domToContentModel,
} from 'roosterjs-content-model-dom';
import { redo, undo } from 'roosterjs-content-model-core';
import type { HorizontalLineEditOptions } from '../../lib/horizontalLineEdit/HorizontalLineEditOptions';
import type { IEditor } from 'roosterjs-content-model-types';

describe('HorizontalLineEditPlugin', () => {
    let editor: IEditor;
    let plugin: HorizontalLineEditPlugin;
    let root: HTMLElement;

    function initialize(options?: HorizontalLineEditOptions) {
        plugin = new HorizontalLineEditPlugin(options);
        editor = initEditor('horizontalLineEditTest', [plugin]);
        root = document.getElementById('horizontalLineEditTest')!;
        root.innerHTML =
            '<hr style="width:200px;height:4px;border:1px solid black">' +
            '<div>Text</div><hr style="width:100px;height:2px;border:0">';
    }

    function selectLine(index: number = 0) {
        const line = root.querySelectorAll('hr')[index];
        line.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 0 }));
        line.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, button: 0 }));
        return line;
    }

    function getHost() {
        return root.querySelector<HTMLSpanElement>('[data-horizontal-line-edit]')!;
    }

    function getHandle(direction: string = 'se') {
        return getHost().shadowRoot!.querySelector<HTMLElement>(
            '[data-resize-handle="' + direction + '"]'
        )!;
    }

    function drag(deltaX: number, deltaY: number, direction: string = 'se') {
        getHandle(direction).dispatchEvent(
            new MouseEvent('mousedown', { bubbles: true, clientX: 100, clientY: 100 })
        );
        document.dispatchEvent(
            new MouseEvent('mousemove', { clientX: 100 + deltaX, clientY: 100 + deltaY })
        );
        document.dispatchEvent(
            new MouseEvent('mouseup', { clientX: 100 + deltaX, clientY: 100 + deltaY })
        );
    }

    function key(key: string, shiftKey: boolean = false, direction: string = 'se') {
        getHandle(direction).dispatchEvent(
            new KeyboardEvent('keydown', {
                key,
                shiftKey,
                bubbles: true,
                cancelable: true,
                composed: true,
            })
        );
    }

    function expectThickness(line: HTMLHRElement, thickness: number) {
        expect(line.style.display).toBe('table');
        expect(line.style.height).toBe(
            thickness - (getComputedStyle(line).boxSizing == 'border-box' ? 0 : 2) + 'px'
        );
        expect(line.style.borderTop).toBe('1px solid gray');
        expect(line.style.borderBottom).toBe('1px solid gray');
        expect(line.style.borderLeft).toBe('1px solid gray');
        expect(line.style.borderRight).toBe('1px solid gray');
        expect(getComputedStyle(line).backgroundColor).toBe('rgba(0, 0, 0, 0)');
        expect(line.style.paddingTop).toBe('0px');
        expect(line.style.paddingBottom).toBe('0px');
        expect(line.getBoundingClientRect().height).toBe(thickness);
    }

    afterEach(() => {
        editor.dispose();
        removeElement('horizontalLineEditTest');
    });

    it('exposes its plugin name', () => {
        initialize();
        expect(plugin.getName()).toBe('HorizontalLineEdit');
    });

    it('wraps only the clicked line and keeps editing UI outside the content model', () => {
        initialize();
        const original = editor.getContentModelCopy('clean');
        const line = selectLine();
        expect(getHost().firstChild).toBe(line);
        expect(getHost().shadowRoot!.querySelectorAll('[role=button]').length).toBe(8);
        expect(getHost().shadowRoot!.querySelector('hr')!.style.display).toBe('table');
        expect(line.style.display).toBe('');
        const model = editor.getContentModelCopy('clean');
        expect(model.blocks.filter(block => block.blockType == 'Divider').length).toBe(2);
        expect(model).toEqual(original);
        expect(root.querySelectorAll('hr').length).toBe(2);
        expect(cloneModel(domToContentModel(root, createDomToModelContext())).blocks).toEqual(
            original.blocks
        );
    });

    it('leaves default HR styling to the browser instead of inlining computed styles', () => {
        initialize();
        selectLine();
        const preview = getHost().shadowRoot!.querySelector('hr')!;
        expect(preview.style.fontFamily).toBe('');
        expect(preview.style.fontSize).toBe('');
        expect(preview.style.color).toBe('');
        expect(preview.style.backgroundColor).toBe('');
        expect(preview.style.opacity).toBe('');
        expect(preview.style.paddingTop).toBe('');
        expect(preview.style.paddingBottom).toBe('');
    });

    it('preserves custom inline appearance in the preview', () => {
        initialize();
        const line = root.querySelector('hr')!;
        line.style.backgroundColor = 'rgb(12, 34, 56)';
        line.style.borderRadius = '3px';
        line.style.opacity = '0.5';
        line.style.borderTop = '2px dashed rgb(56, 34, 12)';
        line.style.paddingTop = '4px';
        selectLine();
        const preview = getHost().shadowRoot!.querySelector('hr')!;
        expect(preview.style.backgroundColor).toBe(line.style.backgroundColor);
        expect(preview.style.borderRadius).toBe(line.style.borderRadius);
        expect(preview.style.opacity).toBe(line.style.opacity);
        expect(preview.style.borderTop).toBe(line.style.borderTop);
        expect(preview.style.paddingTop).toBe(line.style.paddingTop);
    });

    it('previews and commits a gray outline with a transparent center', () => {
        initialize();
        root.querySelector('hr')!.style.backgroundColor = 'red';
        const before = root.querySelector('hr')!.getBoundingClientRect();
        const line = selectLine();
        const handle = getHandle();
        handle.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }));
        document.dispatchEvent(new MouseEvent('mousemove', { clientX: 150, clientY: 110 }));
        expect(line.style.width).toBe('200px');
        expect(line.style.height).toBe('4px');
        expect(getHost().shadowRoot!.firstElementChild!.getBoundingClientRect().width).toBe(
            before.width + 50
        );
        const preview = getHost().shadowRoot!.querySelector('hr')!;
        expectThickness(preview, before.height + 10);
        expect(line.style.borderTopWidth).toBe('1px');
        expect(line.style.borderBottomWidth).toBe('1px');
        document.dispatchEvent(new MouseEvent('mouseup'));
        const result = root.querySelector('hr')!;
        expect(result.style.width).toBe('250px');
        expectThickness(result, before.height + 10);
        expect(result.style.borderTopStyle).toBe('solid');
        expect(result.style.borderTopColor).toBe('gray');
        expect(result.getBoundingClientRect().width).toBe(before.width + 50);
        expect(getHost()).toBeNull();
        const divider = editor
            .getContentModelCopy('clean')
            .blocks.find(block => block.blockType == 'Divider')!;
        expect(divider.format).toEqual(
            jasmine.objectContaining({
                borderTop: '1px solid gray',
                borderBottom: '1px solid gray',
                borderLeft: '1px solid gray',
                borderRight: '1px solid gray',
                display: 'table',
                height: '14px',
            })
        );
    });

    it('supports resizing width alone with a corner and thickness alone with the south handle', () => {
        initialize();
        selectLine();
        drag(30, 0, 'se');
        expect(root.querySelector('hr')!.style.width).toBe('230px');
        expect(root.querySelector('hr')!.style.display).toBe('table');
        expect(root.querySelector('hr')!.style.height).toBe('4px');
        expect(root.querySelector('hr')!.style.borderTopWidth).toBe('1px');
        expect(root.querySelector('hr')!.style.borderBottomWidth).toBe('1px');
        selectLine();
        drag(30, 20, 's');
        expect(root.querySelector('hr')!.style.width).toBe('230px');
        expectThickness(root.querySelector('hr')!, 26);
    });

    it('preserves custom colors when resizing only the width', () => {
        initialize();
        root.querySelector('hr')!.style.backgroundColor = 'red';
        selectLine();
        key('ArrowRight', true, 'e');
        const preview = getHost().shadowRoot!.querySelector('hr')!;
        expect(preview.style.backgroundColor).toBe('red');
        expect(preview.style.borderTopColor).toBe('black');
        key('Enter', false, 'e');
        const line = root.querySelector('hr')!;
        expect(line.style.backgroundColor).toBe('red');
        expect(line.style.borderTopColor).toBe('black');
    });

    it('preserves border-box sizing when committing dimensions', () => {
        initialize();
        root.querySelector('hr')!.style.boxSizing = 'border-box';
        selectLine();
        drag(50, 10);
        const line = root.querySelector('hr')!;
        expect(line.style.boxSizing).toBe('border-box');
        expect(line.getBoundingClientRect().width).toBe(250);
        expectThickness(line, 14);
    });

    it('resizes only the selected line inside a table', () => {
        initialize();
        root.innerHTML =
            '<table><tr><td><hr style="width:200px;height:4px;border:0"></td>' +
            '<td><hr style="width:100px;height:2px;border:0"></td></tr></table>';
        selectLine();
        drag(50, 10);
        const lines = root.querySelectorAll('hr');
        expect(lines[0].style.width).toBe('248px');
        expect(lines[0].getBoundingClientRect().width).toBe(250);
        expectThickness(lines[0], 14);
        expect(lines[0].style.borderTopStyle).toBe('solid');
        expect(lines[1].style.width).toBe('100px');
        expect(lines[1].style.height).toBe('2px');
    });

    it('commits pending edits and starts editing another line after the DOM is rewritten', () => {
        initialize();
        selectLine();
        key('ArrowRight', true);
        selectLine(1);
        expect(root.querySelectorAll('hr')[0].style.width).toBe('210px');
        expect(getHost().firstChild).toBe(root.querySelectorAll('hr')[1]);
        const before = getHost().shadowRoot!.firstElementChild!.getBoundingClientRect();
        drag(20, 10);
        expect(root.querySelectorAll('hr')[1].getBoundingClientRect().width).toBe(
            before.width + 20
        );
    });

    it('enforces minimum outer dimensions', () => {
        initialize({ minWidth: 40, minHeight: 8 });
        selectLine();
        drag(-1000, -1000);
        const rect = root.querySelector('hr')!.getBoundingClientRect();
        expect(rect.width).toBe(40);
        expect(rect.height).toBe(8);
        expectThickness(root.querySelector('hr')!, 8);
    });

    it('accounts for editor zoom', () => {
        initialize();
        spyOn(editor.getDOMHelper(), 'calculateZoomScale').and.returnValue(2);
        const line = root.querySelector('hr')!;
        spyOn(line, 'getBoundingClientRect').and.returnValue({
            width: 404,
            height: 12,
        } as DOMRect);
        selectLine();
        drag(40, 20);
        expect(root.querySelector('hr')!.style.width).toBe('220px');
        expectThickness(root.querySelector('hr')!, 16);
    });

    it('supports keyboard resizing and commits on Enter', () => {
        initialize({ resizeHandleLabel: 'Resize horizontal line' });
        selectLine();
        expect(getHandle().getAttribute('aria-label')).toBe('Resize horizontal line');
        key('ArrowRight');
        key('ArrowDown', true);
        key('Enter');
        expect(root.querySelector('hr')!.style.width).toBe('201px');
        expectThickness(root.querySelector('hr')!, 16);
        expect(getHost()).toBeNull();
    });

    it('shares accumulated dimensions across keyboard handles and a subsequent drag', () => {
        initialize();
        selectLine();
        key('ArrowRight', true, 'e');
        key('ArrowLeft', true, 'w');
        key('ArrowDown', true, 's');
        drag(5, 2);
        const line = root.querySelector('hr')!;
        expect(line.style.width).toBe('225px');
        expectThickness(line, 18);
        expect(getHost()).toBeNull();
    });

    it('handles resize keys through plugin events without finishing the preview', () => {
        initialize();
        selectLine();
        const onPluginEvent = spyOn(plugin, 'onPluginEvent').and.callThrough();
        const event = new KeyboardEvent('keydown', {
            key: 'ArrowRight',
            bubbles: true,
            cancelable: true,
            composed: true,
        });
        const stopPropagation = spyOn(event, 'stopPropagation').and.callThrough();
        getHandle().dispatchEvent(event);

        expect(onPluginEvent).toHaveBeenCalledWith(
            jasmine.objectContaining({ eventType: 'keyDown', rawEvent: event })
        );
        expect(event.defaultPrevented).toBe(true);
        expect(stopPropagation).toHaveBeenCalled();
        expect(getHost()).not.toBeNull();
        expect(root.querySelector('hr')!.style.width).toBe('200px');
        expect(getHost().shadowRoot!.firstElementChild!.getBoundingClientRect().width).toBe(203);
    });

    it('keeps editing on Tab and commits on other unhandled handle keys', () => {
        initialize();
        selectLine();
        key('ArrowRight', true);
        key('Tab');
        expect(getHost()).not.toBeNull();
        key('a');
        expect(getHost()).toBeNull();
        expect(root.querySelector('hr')!.style.width).toBe('210px');
    });

    it('cancels pending handle edits on Escape from the editor', () => {
        initialize();
        selectLine();
        key('ArrowRight', true);
        const event = new KeyboardEvent('keydown', {
            key: 'Escape',
            bubbles: true,
            cancelable: true,
        });
        root.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
        expect(getHost()).toBeNull();
        expect(root.querySelector('hr')!.style.width).toBe('200px');
    });

    it('creates independent resize state when switching between differently styled lines', () => {
        initialize();
        const lines = root.querySelectorAll('hr');
        lines[0].style.boxSizing = 'border-box';
        lines[0].style.borderTop = '2px dashed red';
        lines[1].style.borderTop = '3px dotted blue';
        selectLine();
        key('ArrowDown', true);
        selectLine(1);
        expect(root.querySelectorAll('hr')[0].style.borderTopStyle).toBe('solid');
        expect(root.querySelectorAll('hr')[0].style.borderTopColor).toBe('gray');
        const height = getHost().shadowRoot!.firstElementChild!.getBoundingClientRect().height;
        const before = getHost().shadowRoot!.firstElementChild!.getBoundingClientRect();
        drag(20, 10);
        const line = root.querySelectorAll('hr')[1];
        expect(getComputedStyle(line).boxSizing).toBe('content-box');
        expect(line.getBoundingClientRect().width).toBe(before.width + 20);
        expectThickness(line, height + 10);
        expect(line.style.borderTopStyle).toBe('solid');
        expect(line.style.borderTopColor).toBe('gray');
    });

    it('cancels keyboard resizing with Escape', () => {
        initialize();
        selectLine();
        key('ArrowRight', true);
        key('Escape');
        expect(root.querySelector('hr')!.style.width).toBe('200px');
        expect(getHost()).toBeNull();
    });

    it('commits pending keyboard edits on focusout only when leaving the handles', () => {
        initialize();
        selectLine();
        const handle = getHandle();
        key('ArrowRight', true);
        handle.dispatchEvent(
            new FocusEvent('focusout', {
                bubbles: true,
                composed: true,
                relatedTarget: getHandle('e'),
            })
        );
        expect(getHost()).not.toBeNull();
        expect(root.querySelector('hr')!.style.width).toBe('200px');
        const outside = document.createElement('button');
        document.body.appendChild(outside);
        handle.dispatchEvent(
            new FocusEvent('focusout', { bubbles: true, composed: true, relatedTarget: outside })
        );
        outside.remove();
        expect(root.querySelector('hr')!.style.width).toBe('210px');
        expect(getHost()).toBeNull();
    });

    it('commits pending keyboard edits when clicking elsewhere in the editor', () => {
        initialize();
        selectLine();
        key('ArrowRight', true);
        root.lastElementChild!.previousElementSibling!.dispatchEvent(
            new MouseEvent('mousedown', { bubbles: true })
        );
        expect(root.querySelector('hr')!.style.width).toBe('210px');
        expect(getHost()).toBeNull();
    });

    it('reattaches resize events when the logical root changes', () => {
        initialize();
        root.innerHTML = '<div><hr style="width:200px;height:4px;border:0"></div>';
        const logicalRoot = root.firstElementChild as HTMLDivElement;
        editor.setLogicalRoot(logicalRoot);
        selectLine();
        key('ArrowRight', true);
        key('Enter');
        expect(logicalRoot.querySelector('hr')!.style.width).toBe('210px');
        expect(getHost()).toBeNull();

        editor.setLogicalRoot(null);
        logicalRoot.removeAttribute('contenteditable');
        selectLine();
        key('ArrowRight', true);
        key('Enter');
        expect(root.querySelector('hr')!.style.width).toBe('220px');
        expect(getHost()).toBeNull();
    });

    it('does not format or take snapshots for an unchanged line', () => {
        initialize();
        const format = spyOn(editor, 'formatContentModel').and.callThrough();
        selectLine();
        drag(0, 0);
        expect(format).not.toHaveBeenCalled();
        expect(getHost()).toBeNull();
    });

    it('supports undo and redo without restoring editing wrappers', () => {
        initialize();
        selectLine();
        drag(50, 10);
        undo(editor);
        expect(root.querySelector('hr')!.style.width).toBe('200px');
        expect(root.querySelector('hr')!.style.height).toBe('4px');
        expect(root.querySelector('hr')!.style.borderTopWidth).toBe('1px');
        expect(root.querySelector('hr')!.style.borderBottomWidth).toBe('1px');
        expect(getHost()).toBeNull();
        redo(editor);
        expect(root.querySelector('hr')!.style.width).toBe('250px');
        expectThickness(root.querySelector('hr')!, 16);
        expect(getHost()).toBeNull();
    });

    it('removes editing wrappers from exported DOM', () => {
        initialize();
        selectLine();
        const clonedRoot = root.cloneNode(true) as HTMLElement;
        plugin.onPluginEvent({ eventType: 'extractContentWithDom', clonedRoot });
        expect(clonedRoot.querySelector('[data-horizontal-line-edit]')).toBeNull();
        expect(clonedRoot.querySelectorAll('hr').length).toBe(2);
        expect(getHost()).not.toBeNull();
    });

    it('does not save editing UI in unrelated undo snapshots', () => {
        initialize();
        selectLine();
        const snapshot = editor.takeSnapshot()!;
        expect(snapshot.html.indexOf('data-horizontal-line-edit')).toBe(-1);
        expect(getHost()).toBeNull();
    });

    it('cleans up when editor content is replaced', () => {
        initialize();
        selectLine();
        plugin.onPluginEvent({ eventType: 'beforeSetContent', newContent: '' });
        expect(getHost()).toBeNull();
        expect(root.querySelector('hr')!.style.width).toBe('200px');
    });

    it('does not edit read-only horizontal lines', () => {
        initialize();
        root.innerHTML = '<div contenteditable="false"><hr></div>';
        selectLine();
        expect(getHost()).toBeNull();
    });

    it('cleans up active drag listeners on disposal', () => {
        initialize();
        selectLine();
        getHandle().dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }));
        const format = spyOn(editor, 'formatContentModel');
        plugin.dispose();
        document.dispatchEvent(new MouseEvent('mousemove', { clientX: 200, clientY: 200 }));
        document.dispatchEvent(new MouseEvent('mouseup'));
        expect(getHost()).toBeNull();
        expect(format).not.toHaveBeenCalled();
    });

    it('commits pending edits when the editor loses focus', () => {
        initialize();
        selectLine();
        key('ArrowRight', true);
        root.dispatchEvent(new FocusEvent('blur', { relatedTarget: document.body }));
        expect(root.querySelector('hr')!.style.width).toBe('210px');
        expect(getHost()).toBeNull();
    });

    it('does not attach document-wide click or touch listeners when editing', () => {
        initialize();
        const addListener = spyOn(document, 'addEventListener').and.callThrough();
        selectLine();
        expect(
            addListener.calls
                .allArgs()
                .filter(([name]) => name == 'mousedown' || name == 'touchstart').length
        ).toBe(0);
    });

    it('stops handling keyboard and focus events after disposal', () => {
        initialize();
        selectLine();
        const handle = getHandle();
        const format = spyOn(editor, 'formatContentModel');
        plugin.dispose();
        handle.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true })
        );
        root.dispatchEvent(new FocusEvent('blur', { relatedTarget: document.body }));
        expect(format).not.toHaveBeenCalled();
        expect(getHost()).toBeNull();
    });

    it('supports touch resizing', () => {
        initialize();
        spyOn(editor, 'getEnvironment').and.returnValue({
            ...editor.getEnvironment(),
            isMobileOrTablet: true,
        });
        const line = root.querySelector('hr')!;
        line.dispatchEvent(
            new PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch' })
        );
        line.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerType: 'touch' }));
        const handle = getHandle();
        const start = new Touch({ identifier: 1, target: handle, pageX: 100, pageY: 100 });
        const end = new Touch({ identifier: 1, target: handle, pageX: 130, pageY: 110 });
        handle.dispatchEvent(
            new TouchEvent('touchstart', { targetTouches: [start], cancelable: true })
        );
        document.dispatchEvent(
            new TouchEvent('touchmove', { targetTouches: [end], cancelable: true })
        );
        document.dispatchEvent(
            new TouchEvent('touchend', { changedTouches: [end], cancelable: true })
        );
        expect(root.querySelector('hr')!.style.width).toBe('230px');
        expectThickness(root.querySelector('hr')!, 16);
        expect(getHost()).toBeNull();
    });

    it('keeps enough height for both borders when shrinking', () => {
        initialize();
        selectLine();
        drag(0, -100);
        expectThickness(root.querySelector('hr')!, 2);
    });

    it('removes vertical padding when resizing the outlined line', () => {
        initialize();
        root.querySelector('hr')!.style.padding = '3px 5px';
        selectLine();
        drag(20, 10);
        const line = root.querySelector('hr')!;
        expect(line.getBoundingClientRect().width).toBe(232);
        expectThickness(line, 22);
        expect(line.style.paddingLeft).toBe('5px');
        expect(line.style.paddingRight).toBe('5px');
    });

    it('restores the original preview when dragging back to the original height', () => {
        initialize();
        const original = root.querySelector('hr')!;
        original.style.backgroundColor = 'red';
        original.style.borderLeft = '3px dashed blue';
        original.style.borderRight = '4px dotted green';
        const line = selectLine();
        const format = spyOn(editor, 'formatContentModel').and.callThrough();
        getHandle().dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }));
        document.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 110 }));
        expectThickness(getHost().shadowRoot!.querySelector('hr')!, 16);
        document.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
        const preview = getHost().shadowRoot!.querySelector('hr')!;
        expect(preview.style.height).toBe('100%');
        expect(preview.style.borderTopWidth).toBe('1px');
        expect(preview.style.borderBottomWidth).toBe('1px');
        expect(preview.style.borderLeft).toBe('3px dashed blue');
        expect(preview.style.borderRight).toBe('4px dotted green');
        expect(preview.style.backgroundColor).toBe('red');
        expect(preview.getBoundingClientRect().height).toBe(6);
        document.dispatchEvent(new MouseEvent('mouseup'));
        expect(line.style.height).toBe('4px');
        expect(line.style.borderTopWidth).toBe('1px');
        expect(format).not.toHaveBeenCalled();
    });

    it('cancels thickness changes without changing the original borders', () => {
        initialize();
        selectLine();
        key('ArrowDown', true);
        expectThickness(getHost().shadowRoot!.querySelector('hr')!, 16);
        key('Escape');
        const line = root.querySelector('hr')!;
        expect(line.style.height).toBe('4px');
        expect(line.style.borderTopWidth).toBe('1px');
        expect(line.style.borderBottomWidth).toBe('1px');
        expect(getHost()).toBeNull();
    });

    [
        { thickness: 1, width: 10 },
        { thickness: 6, width: 10 },
        { thickness: 1, width: 200 },
        { thickness: 6, width: 200 },
    ].forEach(({ thickness, width }) => {
        it(
            'shows eight small, spaced handles around a ' + width + 'x' + thickness + 'px line',
            () => {
                initialize();
                root.innerHTML =
                    '<hr style="display:table;width:' +
                    width +
                    'px;height:0;border:0;' +
                    'border-top:' +
                    thickness +
                    'px solid black">';
                selectLine();
                const wrapper = getHost().shadowRoot!.firstElementChild!;
                const bounds = wrapper.getBoundingClientRect();
                const preview = wrapper.querySelector('hr')!;
                const previewBounds = preview.getBoundingClientRect();
                expect(getComputedStyle(wrapper).outlineOffset).toBe('4px');
                expect(bounds.width).toBe(width);
                expect(bounds.height).toBe(thickness);
                expect(previewBounds.width).toBe(width);
                expect(previewBounds.height).toBe(thickness);
                const directions = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
                const handles = wrapper.querySelectorAll<HTMLElement>('[role=button]');
                expect(
                    Array.from(handles).map(handle => handle.getAttribute('data-resize-handle'))
                ).toEqual(directions);
                const rectangles = directions.map((direction, index) => {
                    const handle = getHandle(direction);
                    const rect = handle.getBoundingClientRect();
                    const horizontal = [0, 0.5, 1, 1, 1, 0.5, 0, 0][index];
                    expect(rect.width).toBe(6);
                    expect(rect.height).toBe(6);
                    expect(rect.left + rect.width / 2).toBeCloseTo(
                        bounds.left - 4 + horizontal * (bounds.width + 8),
                        4
                    );
                    if (direction.charAt(0) == 'n') {
                        expect(previewBounds.top - rect.bottom).toBeCloseTo(4, 4);
                    } else if (direction.charAt(0) == 's') {
                        expect(rect.top - previewBounds.bottom).toBeCloseTo(4, 4);
                    } else {
                        expect(rect.top + rect.height / 2).toBeCloseTo(
                            previewBounds.top + previewBounds.height / 2,
                            4
                        );
                    }
                    expect(handle.style.cursor).toBe(direction + '-resize');
                    return rect;
                });
                rectangles.forEach((rect, index) => {
                    rectangles.slice(index + 1).forEach(other => {
                        const overlaps =
                            rect.left < other.right &&
                            rect.right > other.left &&
                            rect.top < other.bottom &&
                            rect.bottom > other.top;
                        expect(overlaps).toBe(false);
                    });
                });
            }
        );
    });

    [
        { direction: 'nw', deltaX: -20, deltaY: -10, width: '220px' },
        { direction: 'n', deltaX: 20, deltaY: -10, width: '200px' },
        { direction: 'ne', deltaX: 20, deltaY: -10, width: '220px' },
        { direction: 'se', deltaX: 20, deltaY: 10, width: '220px' },
        { direction: 's', deltaX: 20, deltaY: 10, width: '200px' },
        { direction: 'sw', deltaX: -20, deltaY: 10, width: '220px' },
    ].forEach(({ direction, deltaX, deltaY, width }) => {
        it('grows and shrinks from the ' + direction + ' handle', () => {
            initialize();
            selectLine();
            drag(deltaX, deltaY, direction);
            expect(root.querySelector('hr')!.style.width).toBe(width);
            expectThickness(root.querySelector('hr')!, 16);
            selectLine();
            drag(-deltaX, -deltaY, direction);
            expect(root.querySelector('hr')!.style.width).toBe('200px');
            expectThickness(root.querySelector('hr')!, 6);
        });
    });

    [
        { direction: 'w', deltaX: -30, keyName: 'ArrowLeft' },
        { direction: 'e', deltaX: 30, keyName: 'ArrowRight' },
    ].forEach(({ direction, deltaX, keyName }) => {
        it('resizes only width when dragging the ' + direction + ' handle', () => {
            initialize({ minHeight: 20 });
            selectLine();
            drag(deltaX, 100, direction);
            let line = root.querySelector('hr')!;
            expect(line.style.width).toBe('230px');
            expect(line.style.height).toBe('4px');
            expect(line.style.borderTopWidth).toBe('1px');
            expect(line.style.borderBottomWidth).toBe('1px');
            expect(line.getBoundingClientRect().height).toBe(6);
            selectLine();
            drag(-deltaX, -100, direction);
            line = root.querySelector('hr')!;
            expect(line.style.width).toBe('200px');
            expect(line.style.height).toBe('4px');
            expect(line.getBoundingClientRect().height).toBe(6);
        });

        it('supports width-only keyboard resizing from the ' + direction + ' handle', () => {
            initialize({ minHeight: 20 });
            selectLine();
            key('ArrowDown', true, direction);
            key(keyName, true, direction);
            key('Enter', false, direction);
            const line = root.querySelector('hr')!;
            expect(line.style.width).toBe('210px');
            expect(line.style.height).toBe('4px');
            expect(line.style.borderTopWidth).toBe('1px');
            expect(line.style.borderBottomWidth).toBe('1px');
            expect(getHost()).toBeNull();
        });
    });

    it('supports keyboard resizing from the northwest handle', () => {
        initialize();
        selectLine();
        key('ArrowLeft', true, 'nw');
        key('ArrowUp', true, 'nw');
        key('Enter', false, 'nw');
        expect(root.querySelector('hr')!.style.width).toBe('210px');
        expectThickness(root.querySelector('hr')!, 16);
    });
});
