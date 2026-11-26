import { initEditor } from './testUtils';
import { paste } from 'roosterjs-content-model-core';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word supplied picture bullets', () => {
    const id = 'word-picture-bullet';
    const image =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGPQCOoGAAGrAQaqpcy9AAAAAElFTkSuQmCC';
    let editor: IEditor;
    let source: HTMLDivElement;

    beforeEach(() => {
        editor = initEditor(id);
        source = document.createElement('div');
        document.body.appendChild(source);
    });

    afterEach(() => {
        editor.dispose();
        document.getElementById(id)?.remove();
        source.remove();
    });

    const pasteList = (fragment: string) => {
        source.innerHTML = fragment;
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head><meta name="ProgId" content="Word.Document">
                <style>@list l0:level1 { mso-level-number-format:image; list-style-image:url("${image}"); }
                @list l1:level1 { mso-level-number-format:bullet; }
                @list l2:level1 { mso-level-start-at:3; }</style></head>
                <body><!--StartFragment-->${fragment}<!--EndFragment--></body></html>`,
        });
        return document.getElementById(id)!;
    };

    it('keeps the supplied picture and dimensions without adding a numeric marker', () => {
        const root = pasteList(
            `<p style="mso-list:l0 level1 lfo1"><span style="mso-list:Ignore"><img width="12" height="8" src="${image}" alt="*">&nbsp;</span>Picture item</p>`
        );
        const picture = root.querySelector('img');

        expect(picture).not.toBeNull();
        if (picture) {
            expect(picture.getAttribute('src')).toBe(image);
            expect(picture.getBoundingClientRect().width).toBe(12);
            expect(picture.getBoundingClientRect().height).toBe(8);
            expect(picture.alt).toBe('*');
        }
        expect(root.querySelector('ul')).not.toBeNull();
        expect(getComputedStyle(root.querySelector('li')!).listStyleType).toBe('none');
        expect(root.textContent!.trim()).toBe('Picture item');
    });

    it('keeps a nested presentation wrapper and the picture hanging indent', () => {
        const root = pasteList(
            `<p style="mso-list:l0 level1 lfo1;margin-left:36pt;text-indent:-18pt"><span style="font-size:7pt"><span style="mso-list:Ignore"><img width="12" height="8" src="${image}" alt="*">&nbsp;</span></span>Hanging picture item</p>`
        );
        const picture = root.querySelector('img');
        const sourcePicture = source.querySelector('img')!;

        expect(picture).not.toBeNull();
        if (picture) {
            expect(picture.getBoundingClientRect().left - root.getBoundingClientRect().left).toBe(
                sourcePicture.getBoundingClientRect().left - source.getBoundingClientRect().left
            );
        }
        expect(getComputedStyle(root.querySelector('li')!).listStyleType).toBe('none');
    });

    it('does not leak picture-marker handling into later ordinary lists or body images', () => {
        const root = pasteList(
            `<p style="mso-list:l0 level1 lfo1"><span style="mso-list:Ignore"><img width="12" height="8" src="${image}" alt="*">&nbsp;</span>Picture item</p>` +
                '<p style="mso-list:l2 level1 lfo2"><span style="mso-list:Ignore">3.</span>Numbered control</p>' +
                '<p style="mso-list:l1 level1 lfo3"><span style="mso-list:Ignore">x</span>Bullet control</p>' +
                `<p><img width="20" height="10" src="${image}" alt="Body image">Body</p>`
        );
        const items = root.querySelectorAll('li');

        expect(root.querySelectorAll('img').length).toBe(2);
        expect(getComputedStyle(items[1]).listStyleType).toBe('decimal');
        expect(getComputedStyle(items[2]).listStyleType).toBe('disc');
        expect(root.querySelector('ol')!.start).toBe(3);
        expect(root.textContent).not.toContain('3.');
        expect(root.textContent).not.toContain('x');
        expect(root.querySelector('img[alt="Body image"]')!.getBoundingClientRect().width).toBe(20);
    });
});
