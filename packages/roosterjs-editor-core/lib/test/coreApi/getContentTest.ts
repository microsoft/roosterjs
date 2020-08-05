import * as normalizeContentColor from '../../corePlugins/darkMode/normalizeContentColor';
import createEditorCore from '../../editor/createEditorCore';
import EditorCore from '../../interfaces/EditorCore';
import { getContent } from '../../coreAPI/getContent';
import { GetContentMode, PluginEvent, PluginEventType } from 'roosterjs-editor-types';

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
        const triggerEvent = jasmine.createSpy('triggerEvent');
        const core = createEditorCore(div, {
            coreApiOverride: {
                getSelectionRange: () => document.createRange(),
                triggerEvent,
            },
            inDarkMode: true,
        });

        spyOn(normalizeContentColor, 'default');
        div.innerHTML = '<div>test1</div>';
        const html = getContent(core, GetContentMode.RawHTMLOnly);
        expect(html).toBe('<div>test1</div>');
        expect(triggerEvent).not.toHaveBeenCalled();
        expect(normalizeContentColor.default).toHaveBeenCalled();
    });
});
