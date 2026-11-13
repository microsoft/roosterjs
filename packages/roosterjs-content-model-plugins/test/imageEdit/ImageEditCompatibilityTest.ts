import { Editor, exportContent } from 'roosterjs-content-model-core';
import { ImageEditPlugin } from '../../lib/imageEdit/ImageEditPlugin';

describe('ImageEditPlugin without :has() support', () => {
    const imageSource =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jC1sAAAAASUVORK5CYII=';
    const editors: Editor[] = [];
    const roots: HTMLElement[] = [];

    beforeEach(() => {
        const insertRule = CSSStyleSheet.prototype.insertRule;

        // Keep native stylesheet insertion, but reproduce the selector parser in older browsers.
        spyOn(CSSStyleSheet.prototype, 'insertRule').and.callFake(function (
            this: CSSStyleSheet,
            rule: string,
            index?: number
        ) {
            if (rule.indexOf(':has(') >= 0) {
                throw new DOMException('Unsupported selector', 'SyntaxError');
            }

            return insertRule.call(this, rule, index);
        });
    });

    afterEach(() => {
        editors.forEach(editor => {
            if (!editor.isDisposed()) {
                editor.dispose();
            }
        });
        roots.forEach(root => root.remove());
        editors.length = 0;
        roots.length = 0;
    });

    async function createEditor() {
        const root = document.createElement('div');
        const image = document.createElement('img');
        const paragraph = document.createElement('div');

        root.contentEditable = 'true';
        document.body.appendChild(root);
        roots.push(root);

        const plugin = new ImageEditPlugin();
        const editor = new Editor(root, { plugins: [plugin] });

        editors.push(editor);
        paragraph.appendChild(image);
        root.innerHTML = '';
        root.appendChild(paragraph);
        image.width = 160;
        image.height = 90;

        await new Promise<void>((resolve, reject) => {
            image.onload = () => resolve();
            image.onerror = () => reject(new Error('Failed to load image fixture'));
            image.src = imageSource;
        });

        editor.setDOMSelection({ type: 'image', image });

        return { root, editor, plugin };
    }

    async function startEditing(plugin: ImageEditPlugin) {
        plugin.onPluginEvent({
            eventType: 'mouseUp',
            rawEvent: new MouseEvent('mouseup'),
        });

        // Upstream initializes resize handles in the next animation frame.
        await new Promise<void>(resolve => {
            document.defaultView!.requestAnimationFrame(() => resolve());
        });
    }

    function getImageStyle(root: HTMLElement) {
        const style = Array.from(
            document.querySelectorAll<HTMLStyleElement>(
                'style[data-roosterjs-style-key="imageEdit"]'
            )
        ).filter(element => {
            const rule = element.sheet!.cssRules[0] as CSSStyleRule;

            return rule && root.querySelector(rule.selectorText);
        })[0];

        return { style, rule: style.sheet!.cssRules[0] as CSSStyleRule };
    }

    it('initializes native styles and draggable resize and rotate handles', async () => {
        const { root, plugin } = await createEditor();

        await startEditing(plugin);

        const host = root.querySelector('img')!.parentElement!;
        const { rule } = getImageStyle(root);

        expect(Array.from(document.querySelectorAll(rule.selectorText))).toEqual([host]);
        expect(host.id).toBe('');
        expect(rule.style.getPropertyValue('outline-style')).toBe('none');
        expect(rule.style.getPropertyPriority('outline-style')).toBe('important');
        expect(host.shadowRoot!.querySelectorAll('.r_resizeH').length).toBe(8);

        ['.r_resizeH', '.r_rotateH'].forEach(selector => {
            const mouseDown = new MouseEvent('mousedown', { bubbles: true, cancelable: true });

            host.shadowRoot!.querySelector(selector)!.dispatchEvent(mouseDown);
            expect(mouseDown.defaultPrevented).toBe(true);
            document.dispatchEvent(new MouseEvent('mouseup'));
        });
    });

    it('preserves resizing on exit, exports clean HTML and allows reselection', async () => {
        const { root, editor, plugin } = await createEditor();
        await startEditing(plugin);

        const host = root.querySelector('img')!.parentElement!;
        const { style } = getImageStyle(root);
        const handle = host.shadowRoot!.querySelector('.r_resizeH[data-x="e"][data-y="s"]')!;

        const activeHtml = exportContent(editor);

        expect(activeHtml).toContain(imageSource);
        expect(activeHtml).not.toContain('r_imageEditHost');
        expect(activeHtml).not.toContain('<span');
        expect(root.contains(host)).toBe(true);

        handle.dispatchEvent(new MouseEvent('mousedown', { clientX: 160, clientY: 90 }));
        document.dispatchEvent(new MouseEvent('mousemove', { clientX: 192, clientY: 108 }));
        document.dispatchEvent(new MouseEvent('mouseup'));
        root.dispatchEvent(new FocusEvent('blur'));

        const image = root.querySelector('img')!;

        expect(image.style.width).toBe('192px');
        expect(image.style.height).toBe('108px');
        expect(style.sheet!.cssRules.length).toBe(0);
        expect(root.querySelector('.r_imageEditHost')).toBeNull();
        expect(root.querySelector('span')).toBeNull();
        ['HTML', 'HTMLFast'].forEach((mode: 'HTML' | 'HTMLFast') => {
            const html = mode == 'HTML' ? exportContent(editor, 'HTML') : exportContent(editor);

            expect(html).toContain(imageSource);
            expect(html).not.toContain('ImageEditShadowRoot');
            expect(html).not.toContain('r_imageEditHost');
            expect(html).not.toContain('data-editing-info');
        });

        editor.setDOMSelection({ type: 'image', image });
        await startEditing(plugin);

        expect(style.sheet!.cssRules.length).toBe(1);
        expect(
            root.querySelector('.r_imageEditHost')!.shadowRoot!.querySelector('.r_resizeH')
        ).not.toBeNull();
    });

    it('scopes styles to each editor and removes them on disposal', async () => {
        const first = await createEditor();
        await startEditing(first.plugin);
        const firstStyle = getImageStyle(first.root);

        expect(Array.from(document.querySelectorAll(firstStyle.rule.selectorText))).toEqual([
            first.root.querySelector('img')!.parentElement!,
        ]);

        const second = await createEditor();
        await startEditing(second.plugin);
        const secondStyle = getImageStyle(second.root);

        // Focusing the second editor exits the first, whose selector must not match the new host.
        expect(document.querySelectorAll(firstStyle.rule.selectorText).length).toBe(0);
        expect(Array.from(document.querySelectorAll(secondStyle.rule.selectorText))).toEqual([
            second.root.querySelector('img')!.parentElement!,
        ]);

        first.editor.dispose();

        expect(firstStyle.style.isConnected).toBe(false);
        expect(secondStyle.style.sheet!.cssRules.length).toBe(1);
    });

    it('initializes crop handles through the shared editing path', async () => {
        const { root, plugin } = await createEditor();

        expect(() => plugin.cropImage()).not.toThrow();

        const host = root.querySelector('img')!.parentElement!;
        const handle = host.shadowRoot!.querySelector('.r_cropH')!;
        const mouseDown = new MouseEvent('mousedown', { cancelable: true });

        expect(handle).not.toBeNull();
        handle.dispatchEvent(mouseDown);
        expect(mouseDown.defaultPrevented).toBe(true);
        document.dispatchEvent(new MouseEvent('mouseup'));
    });

    ['rotate', 'flip'].forEach(operation => {
        it('applies ' + operation + ' through the shared editing path', async () => {
            const { root, editor, plugin } = await createEditor();
            const setStyleSpy = spyOn(editor, 'setEditorStyle').and.callThrough();

            expect(() => {
                if (operation == 'rotate') {
                    plugin.rotateImage(Math.PI / 2);
                } else {
                    plugin.flipImage('horizontal');
                }
            }).not.toThrow();

            const image = root.querySelector('img')!;
            const metadata = JSON.parse(image.dataset.editingInfo!);

            if (operation == 'rotate') {
                expect(metadata.angleRad).toBe(Math.PI / 2);
            } else {
                expect(metadata.flippedHorizontal).toBe(true);
            }
            expect(root.querySelector('.r_imageEditHost')).toBeNull();
            expect(setStyleSpy).toHaveBeenCalledWith('imageEdit', null);
        });
    });
});
