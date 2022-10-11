import { IEditor, PluginEventType } from 'roosterjs-editor-types';
import { HyperLink } from '../../lib/HyperLink';
import { initEditor } from '../TestHelper';

const HREF = 'https://microsoft.github.io/roosterjs';
const editorId = 'editorId';

describe('HyperLink plugin', () => {
    let editor: IEditor;
    let plugin: HyperLink;
    let anchor: HTMLAnchorElement;
    let div: HTMLDivElement;

    beforeEach(() => {
        anchor = document.createElement('a');
        anchor.href = HREF;
        plugin = new HyperLink();
        editor = initEditor(editorId, [plugin]);
        const editorDiv = (<any>editor).core.contentDiv;
        if (!editorDiv) {
            throw 'Unable to find editor div';
        }
        div = editorDiv;
    });

    afterEach(() => {
        editor.dispose();
        div.remove();
    });

    it('Removes title attribute if nothing is being hovered', () => {
        div.dispatchEvent(new MouseEvent('mouseover'));

        expect(div.getAttribute('title')).toEqual(null);
    });

    it('Displays the link as default for links', () => {
        div.appendChild(anchor);
        anchor.dispatchEvent(
            new MouseEvent('mouseover', {
                bubbles: true,
            })
        );
        expect(div.getAttribute('title')).toEqual(HREF);
    });

    it('Opens the link whenever Ctrl+Click', () => {
        const openSpy = spyOn(window, 'open');
        div.appendChild(anchor);
        plugin.onPluginEvent({
            eventType: PluginEventType.MouseUp,
            rawEvent: ({
                target: anchor,
                srcElement: anchor,
                ctrlKey: true,
                button: 0,
            } as unknown) as MouseEvent,
        });
        expect(openSpy).toHaveBeenCalledWith(HREF, '_blank');
    });

    it('Does not open the link if its only clicked', () => {
        const openSpy = spyOn(window, 'open');
        div.appendChild(anchor);
        plugin.onPluginEvent({
            eventType: PluginEventType.MouseUp,
            rawEvent: ({
                target: anchor,
                srcElement: anchor,
                ctrlKey: false,
                button: 0,
            } as unknown) as MouseEvent,
        });
        expect(openSpy).not.toHaveBeenCalled();
    });
});
