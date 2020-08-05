import createEditorCore from './createMockEditorCore';
import { ChangeSource, PluginEventType } from 'roosterjs-editor-types';
import { setContent } from '../../coreAPI/setContent';

describe('setContent', () => {
    let div: HTMLDivElement;
    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null;
    });

    it('null content', () => {
        const core = createEditorCore(div, {});
        setContent(core, null, false);
        expect(div.innerHTML).toBe('');
    });

    it('null content to overwrite existing content', () => {
        const core = createEditorCore(div, {});
        div.innerHTML = 'test';
        setContent(core, null, false);
        expect(div.innerHTML).toBe('');
    });

    it('same content, no event is triggered', () => {
        const triggerEvent = jasmine.createSpy();
        const core = createEditorCore(div, {
            coreApiOverride: {
                triggerEvent,
            },
        });
        div.innerHTML = 'test';
        setContent(core, 'test', true);
        expect(div.innerHTML).toBe('test');
        expect(triggerEvent).not.toHaveBeenCalled();
    });

    it('different content, event is triggered', () => {
        const triggerEvent = jasmine.createSpy();
        const core = createEditorCore(div, {
            coreApiOverride: {
                triggerEvent,
            },
        });
        div.innerHTML = 'test1';
        setContent(core, 'test2', true);
        expect(div.innerHTML).toBe('test2');
        expect(triggerEvent).toHaveBeenCalledWith(
            core,
            {
                eventType: PluginEventType.ContentChanged,
                source: ChangeSource.SetContent,
            },
            false
        );
    });

    it('content with selection path', () => {
        const core = createEditorCore(div, {});
        div.innerHTML = 'test';
        setContent(core, '<div>test</div><!--{"start":[0,0,1],"end":[0,0,3]}-->', false);
        expect(div.innerHTML).toBe('<div>test</div>');

        const range = core.domEvent.value.selectionRange;
        const textNode = div.firstChild.firstChild;
        expect(range.startContainer).toBe(textNode);
        expect(range.endContainer).toBe(textNode);
        expect(range.startOffset).toBe(1);
        expect(range.endOffset).toBe(3);
    });

    it('dark mode', () => {
        const triggerEvent = jasmine.createSpy();
        const onExternalContentTransform = jasmine.createSpy();
        const core = createEditorCore(div, {
            coreApiOverride: { triggerEvent },
            inDarkMode: true,
            onExternalContentTransform,
        });
        div.innerHTML = 'test';
        setContent(core, '<div>test</div>', true);
        expect(div.innerHTML).toBe('<div>test</div>');
        expect(onExternalContentTransform).toHaveBeenCalledTimes(1);
        expect(onExternalContentTransform).toHaveBeenCalledWith(div.firstChild);
        expect(triggerEvent).toHaveBeenCalledWith(
            core,
            {
                eventType: PluginEventType.ContentChanged,
                source: ChangeSource.SetContent,
            },
            false
        );
    });
});
