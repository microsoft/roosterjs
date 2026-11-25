import * as getNodePositionFromEventFile from 'roosterjs-content-model-dom/lib/domUtils/event/getNodePositionFromEvent';
import { handleDroppedExternalContent } from '../../../lib/dragAndDrop/utils/handleDroppedExternalContent';
import {
    contentModelToDom,
    createContentModelDocument,
    createModelToDomContext,
    createParagraph,
    createSelectionMarker,
} from 'roosterjs-content-model-dom';

const XssFlag = '__roosterDropXss';
const handler = `window.${XssFlag}=(window.${XssFlag}||0)+1`;

const payloads = [
    `<video><source src="x" onerror="${handler}"></video>`,
    `<svg><image href="x" onerror="${handler}"></image></svg>`,
    `<img src="x" onerror="${handler}">`,
    `<x-drop onmouseover="${handler}">hover</x-drop>`,
    `<svg onload="${handler}"></svg>`,
    `<div onclick="${handler}"><a href="javascript:alert(1)" onfocus="${handler}">a</a></div>`,
    '<p style="color:red">text<math><mi xlink:href="javascript:alert(1)">m</mi></math></p>',
    '<form action="javascript:alert(1)"><button formaction="javascript:alert(1)">b</button></form>',
    `<details open ontoggle="${handler}">d</details>`,
];

describe('handleDroppedExternalContent - sanitizing untrusted HTML', () => {
    afterEach(() => {
        delete (window as any)[XssFlag];
    });

    payloads.forEach(html => {
        it('should not keep script vectors from dropped HTML: ' + html, async () => {
            (window as any)[XssFlag] = 0;
            spyOn(getNodePositionFromEventFile, 'getNodePositionFromEvent').and.returnValue({
                node: document.createTextNode('a'),
                offset: 0,
            });
            let cb: any;
            const editor: any = {
                getDocument: () => document,
                getDOMHelper: () => ({}),
                getDOMCreator: () => ({
                    htmlToDOM: (h: string) => new DOMParser().parseFromString(h, 'text/html'),
                }),
                formatContentModel: (c: any) => (cb = c),
            };
            const event: any = {
                x: 0,
                y: 0,
                dataTransfer: {
                    items: [
                        {
                            kind: 'string',
                            type: 'text/html',
                            getAsString: (f: any) => f(html),
                        },
                    ],
                },
                preventDefault: () => {},
                stopPropagation: () => {},
            };

            await handleDroppedExternalContent(editor, event, []);

            const model = createContentModelDocument();
            const para = createParagraph();
            para.segments.push(createSelectionMarker());
            model.blocks.push(para);
            cb(model, { newImages: [], newEntities: [], deletedEntities: [] });

            const div = document.createElement('div');
            document.body.appendChild(div);
            contentModelToDom(document, div, model, createModelToDomContext());

            div.querySelectorAll('*').forEach(e => e.dispatchEvent(new Event('mouseover')));
            // Give failing resources (e.g. img/source with src="x") a chance to fire onerror
            await new Promise(r => setTimeout(r, 100));

            const out = div.innerHTML;
            div.remove();

            expect(out).not.toMatch(/\son\w+=/i);
            expect(out).not.toMatch(/javascript:/i);
            expect(out).not.toMatch(/<(video|source|svg|image|x-drop|math|form|script|iframe)/i);
            expect((window as any)[XssFlag]).toBe(0);
        });
    });
});
