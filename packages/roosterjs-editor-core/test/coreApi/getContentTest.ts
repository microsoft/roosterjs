import createEditorCore from './createMockEditorCore';
import { EditorCore, GetContentMode, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import { getContent } from '../../lib/coreApi/getContent';

describe('getContent', () => {
    let div: HTMLDivElement;
    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null;
    });

    it('getContent with CleanHTML', () => {
        const core = createEditorCore(div, {
            coreApiOverride: {
                getSelectionRange: () => {
                    const range = document.createRange();
                    range.selectNode(div.firstChild);
                    return range;
                },
                triggerEvent: (core: EditorCore, event: PluginEvent) => {
                    if (event.eventType == PluginEventType.ExtractContentWithDom) {
                        (<HTMLElement>event.clonedRoot.firstChild).innerHTML = 'test2';
                    }
                },
            },
        });

        div.innerHTML = '<div>test1</div>';
        const html = getContent(core, GetContentMode.CleanHTML);
        expect(html).toBe('<div>test2</div>');
        expect(div.innerHTML).toBe('<div>test1</div>');
    });

    it('getContent with RawHTMLOnly', () => {
        const core = createEditorCore(div, {
            coreApiOverride: {
                getSelectionRange: () => {
                    const range = document.createRange();
                    range.selectNode(div.firstChild);
                    return range;
                },
                triggerEvent: (core: EditorCore, event: PluginEvent) => {
                    if (event.eventType == PluginEventType.ExtractContentWithDom) {
                        (<HTMLElement>event.clonedRoot.firstChild).innerHTML = 'test2';
                    }
                },
            },
        });

        div.innerHTML = '<div>test1</div>';
        const html = getContent(core, GetContentMode.RawHTMLOnly);
        expect(html).toBe('<div>test1</div>');
        expect(div.innerHTML).toBe('<div>test1</div>');
    });

    it('getContent with RawHTMLWithSelection', () => {
        const core = createEditorCore(div, {
            coreApiOverride: {
                getSelectionRange: () => {
                    const range = document.createRange();
                    range.selectNode(div.firstChild);
                    return range;
                },
                triggerEvent: (core: EditorCore, event: PluginEvent) => {
                    if (event.eventType == PluginEventType.ExtractContentWithDom) {
                        (<HTMLElement>event.clonedRoot.firstChild).innerHTML = 'test2';
                    }
                },
            },
        });
        div.innerHTML = '<div>test1</div>';
        const html = getContent(core, GetContentMode.RawHTMLWithSelection);
        expect(html).toBe('<div>test1</div><!--{"start":[0],"end":[1]}-->');
        expect(div.innerHTML).toBe('<div>test1</div>');
    });

    it('getContent from dark mode', () => {
        const core = createEditorCore(div, {
            coreApiOverride: {
                getSelectionRange: () => document.createRange(),
            },
            inDarkMode: true,
        });

        div.innerHTML = '<div>test1</div>';
        const html = getContent(core, GetContentMode.RawHTMLOnly);
        expect(html).toBe('<div>test1</div>');
    });

    it('getContent with shadow edit', () => {
        const core = createEditorCore(div, {
            coreApiOverride: {
                getSelectionRange: () => document.createRange(),
            },
        });
        core.lifecycle.shadowEditFragment = document.createDocumentFragment();
        core.lifecycle.shadowEditFragment.appendChild(document.createTextNode('test0'));
        core.lifecycle.shadowEditSelectionPath = {
            start: [0],
            end: [0],
        };

        div.innerHTML = '<div>test1</div>';
        const html1 = getContent(core, GetContentMode.RawHTMLOnly);
        expect(html1).toBe('test0');

        const html2 = getContent(core, GetContentMode.RawHTMLWithSelection);
        expect(html2).toBe('test0<!--{"start":[0],"end":[0]}-->');
    });

    it('getContent with empty text node', () => {
        const firstDiv = document.createElement('div');
        firstDiv.appendChild(document.createTextNode(''));
        const a = document.createElement('a');
        a.href = '#';
        const text1 = document.createTextNode('text1');
        a.appendChild(text1);
        firstDiv.appendChild(a);
        const text2 = document.createTextNode('text2');
        firstDiv.appendChild(text2);
        const text3 = document.createTextNode('text3');
        firstDiv.appendChild(text3);
        div.appendChild(firstDiv);

        const range = document.createRange();
        range.setStart(text1, 0);
        range.setEnd(text3, 5);
        const core = createEditorCore(div, {
            coreApiOverride: {
                getSelectionRange: () => range,
            },
        });

        const content = core.api.getContent(core, GetContentMode.RawHTMLWithSelection);
        expect(content).toBe(
            '<div><a href="#">text1</a>text2text3</div><!--{"start":[0,0,0,0],"end":[0,1,10]}-->'
        );
    });

    it('getContent with GetContentMode.PlainTextFast', () => {
        const core = createEditorCore(div, {});

        div.innerHTML = 'test1<div>test2</div>test3';
        const content = core.api.getContent(core, GetContentMode.PlainTextFast);

        expect(content).toBe('test1test2test3');
    });
});
