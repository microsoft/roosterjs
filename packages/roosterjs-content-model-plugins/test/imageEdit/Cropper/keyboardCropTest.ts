import * as generateDataURL from '../../../lib/imageEdit/utils/generateDataURL';
import { createImage, createParagraph } from 'roosterjs-content-model-dom';
import { exportContent, undo } from 'roosterjs-content-model-core';
import { EditPlugin } from '../../../lib/edit/EditPlugin';
import { ImageEditPlugin } from '../../../lib/imageEdit/ImageEditPlugin';
import { ImageEditElementClass } from '../../../lib/imageEdit/types/ImageEditElementClass';
import { initEditor, removeElement } from '../../TestHelper';
import type { IEditor } from 'roosterjs-content-model-types';

describe('ImageEditPlugin keyboard crop', () => {
    let editor: IEditor;
    let plugin: ImageEditPlugin;
    let contentDiv: HTMLElement;
    let root: ShadowRoot;

    function target(index: number) {
        return root.querySelectorAll<HTMLElement>(`.${ImageEditElementClass.CropKeyboardTarget}`)[
            index
        ];
    }

    function key(element: Element, value: string, init?: KeyboardEventInit) {
        const event = new KeyboardEvent('keydown', {
            key: value,
            bubbles: true,
            composed: true,
            cancelable: true,
            ...init,
        });
        element.dispatchEvent(event);
        return event;
    }

    beforeEach(() => {
        spyOn(generateDataURL, 'generateDataURL').and.returnValue('cropped.png');
        plugin = new ImageEditPlugin();
        const image = createImage('test.png', { width: '100px', height: '50px' });
        image.isSelected = true;
        image.isSelectedAsImageSelection = true;
        const paragraph = createParagraph();
        paragraph.segments.push(image);
        editor = initEditor('keyboardCrop', [new EditPlugin(), plugin], {
            blockGroupType: 'Document',
            blocks: [paragraph],
        });
        contentDiv = document.getElementById('keyboardCrop')!;
        editor.focus();
        editor.setDOMSelection({
            type: 'image',
            image: contentDiv.querySelector('img')!,
        });
        plugin.cropImage();
        root = contentDiv.querySelector('span')!.shadowRoot!;
    });

    afterEach(() => {
        editor.dispose();
        removeElement('keyboardCrop');
    });

    it('enters cropping with Tab without applying on editor blur', () => {
        const formatSpy = spyOn(editor, 'formatContentModel').and.callThrough();
        expect(key(contentDiv, 'Tab').defaultPrevented).toBe(true);
        expect(root.activeElement).toBe(target(0));
        expect(root.host.isConnected).toBe(true);
        expect(formatSpy).not.toHaveBeenCalled();
        key(target(0), 'ArrowRight');
        key(target(0), 'Tab');
        expect(root.activeElement).toBe(target(1));
        key(target(1), 'ArrowLeft');
        key(target(1), 'Tab');
        expect(root.activeElement).toBe(target(2));
        key(target(2), 'ArrowRight');
        expect(generateDataURL.generateDataURL).not.toHaveBeenCalled();
    });

    it('applies repeated cropping once with Enter and supports undo', () => {
        key(contentDiv, 'Tab');
        key(target(0), 'ArrowRight');
        key(target(0), 'ArrowRight', { repeat: true });
        key(target(0), 'Enter');
        expect(contentDiv.querySelector('img')!.style.width).toBe('98px');
        expect(contentDiv.querySelector('span')?.shadowRoot).toBeFalsy();
        expect(document.activeElement).toBe(contentDiv);
        expect(editor.getDOMSelection()?.type).toBe('image');
        expect(generateDataURL.generateDataURL).toHaveBeenCalledTimes(1);
        undo(editor);
        expect(contentDiv.querySelector('img')!.style.width).toBe('100px');
    });

    it('discards the preview with Escape without generating an image', () => {
        key(contentDiv, 'Tab');
        key(target(0), 'ArrowRight');
        key(target(0), 'Escape');
        expect(contentDiv.querySelector('img')!.style.width).toBe('100px');
        expect(contentDiv.querySelector('span')?.shadowRoot).toBeFalsy();
        expect(document.activeElement).toBe(contentDiv);
        expect(editor.getDOMSelection()?.type).toBe('image');
        expect(generateDataURL.generateDataURL).not.toHaveBeenCalled();
    });

    it('applies when focus leaves without stealing focus', () => {
        const button = document.createElement('button');
        document.body.appendChild(button);
        key(contentDiv, 'Tab');
        key(target(0), 'ArrowRight');
        button.focus();
        expect(contentDiv.querySelector('img')!.style.width).toBe('99px');
        expect(document.activeElement).toBe(button);
        button.remove();
    });

    it('crops in logical pixels regardless of zoom and RTL direction', () => {
        contentDiv.style.setProperty('zoom', '2');
        contentDiv.dir = 'rtl';
        key(contentDiv, 'Tab');
        key(target(0), 'ArrowRight');
        key(target(0), 'Enter');
        expect(contentDiv.querySelector('img')!.style.width).toBe('99px');
    });

    it('removes keyboard controls when the plugin is disposed', () => {
        const handle = target(0);
        plugin.dispose();
        const event = key(handle, 'ArrowLeft');
        expect(event.defaultPrevented).toBe(false);
        expect(root.querySelector('[aria-describedby]')).toBeNull();
        expect(root.querySelector(`.${ImageEditElementClass.CropKeyboardTarget}`)).toBeNull();
    });

    it('styles shadow-root focus targets with editor CSS and clears the rule on disposal', () => {
        [0, 1, 2].forEach(index => {
            target(index).focus();
            const style = window.getComputedStyle(target(index));
            expect(style.outlineStyle).toBe('solid');
            expect(style.outlineWidth).toBe('2px');
            expect(style.outlineOffset).toBe('-2px');
        });
        expect(target(2).classList.contains(ImageEditElementClass.ImageBorder)).toBe(true);
        expect(root.querySelector('style')).toBeNull();
        const styleElement = document.querySelector<HTMLStyleElement>(
            'style[data-roosterjs-style-key="imageEditCropKeyboard"]'
        )!;
        expect(styleElement.sheet!.cssRules.length).toBe(1);
        plugin.dispose();
        expect(styleElement.sheet!.cssRules.length).toBe(0);
    });

    it('keeps focus UI out of exported content', () => {
        key(contentDiv, 'Tab');
        [exportContent(editor, 'HTML'), exportContent(editor, 'HTMLFast')].forEach(html => {
            expect(html).not.toContain('imageCropInstructions');
            expect(html).not.toContain('aria-label');
            expect(html).not.toContain(ImageEditElementClass.CropKeyboardTarget);
        });
    });
});
