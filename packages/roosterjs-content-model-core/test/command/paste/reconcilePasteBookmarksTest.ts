import { Editor } from '../../../lib/editor/Editor';
import { reconcilePasteBookmarks } from '../../../lib/command/paste/reconcilePasteBookmarks';

describe('reconcilePasteBookmarks', () => {
    let editor: Editor;
    let root: HTMLDivElement;
    let outside: HTMLDivElement;

    beforeEach(() => {
        root = document.createElement('div');
        outside = document.createElement('div');
        document.body.appendChild(outside);
        document.body.appendChild(root);
        editor = new Editor(root);
    });

    afterEach(() => {
        editor.dispose();
        root.remove();
        outside.remove();
    });

    function reconcile(html: string) {
        const fragment = document.createRange().createContextualFragment(html);

        reconcilePasteBookmarks(editor, fragment);
        return fragment;
    }

    it('reserves the document namespace and incoming original names, preserving aliases', () => {
        outside.innerHTML = '<a id="Destination" name="Destination"></a>';
        const fragment = reconcile(
            '<a id="Destination" name="Destination"></a><a name="Destination_0"></a>' +
                '<a href="#Destination">Jump</a><a href="#Absent">Outside</a>' +
                '<a href="https://example.invalid/#Destination">External</a>'
        );
        const target = fragment.querySelector('a')!;
        const links = fragment.querySelectorAll('a[href]');

        expect(target.id).toBe('Destination_1');
        expect(target.name).toBe(target.id);
        expect(fragment.querySelectorAll('a[name]')[1].name).toBe('Destination_0');
        expect(links[0].getAttribute('href')).toBe('#Destination_1');
        expect(links[1].getAttribute('href')).toBe('#Absent');
        expect(links[2].getAttribute('href')).toBe('https://example.invalid/#Destination');
        expect(outside.querySelector('a')!.id).toBe('Destination');
    });

    it('preserves first target semantics for duplicate incoming names and ID priority', () => {
        const fragment = reconcile(
            '<a name="Dup">First name</a><a name="Dup">Second name</a><a href="#Dup">Name jump</a>' +
                '<a name="Alias">Name target</a><a id="Alias">ID target</a><a href="#Alias">ID jump</a>'
        );
        const links = fragment.querySelectorAll('a[href]');
        const anchors = fragment.querySelectorAll('a[name]');
        const idTarget = fragment.querySelector('[id]')!;

        expect(anchors[0].name).toBe('Dup');
        expect(anchors[1].name).toBe('Dup_0');
        expect(links[0].getAttribute('href')).toBe('#Dup');
        expect(links[1].getAttribute('href')).toBe('#' + idTarget.id);
    });

    it('decodes encoded fragments and preserves noncolliding and malformed references', () => {
        root.innerHTML = '<a name="A B"></a>';
        const fragment = reconcile(
            '<a name="A B"></a><a name="Unchanged"></a><a href="#A%20B">Encoded</a>' +
                '<a href="#Unchanged">Unchanged</a><a href="#%FF">Malformed</a>'
        );
        const links = fragment.querySelectorAll('a[href]');

        expect(links[0].getAttribute('href')).toBe('#A%20B_0');
        expect(links[1].getAttribute('href')).toBe('#Unchanged');
        expect(links[2].getAttribute('href')).toBe('#%FF');
    });

    it('reuses fully replaced destinations but reserves partially selected and outside targets', () => {
        root.innerHTML = '<p><a name="Replaced">Old</a></p>';
        const range = document.createRange();

        range.selectNodeContents(root);
        editor.setDOMSelection({ type: 'range', range });
        expect(reconcile('<a name="Replaced">New</a>').querySelector('a')!.name).toBe('Replaced');

        const oldText = root.querySelector('a')!.firstChild!;

        range.setStart(oldText, 0);
        range.setEnd(oldText, 1);
        editor.setDOMSelection({ type: 'range', range });
        expect(reconcile('<a name="Replaced">New</a>').querySelector('a')!.name).toBe('Replaced_0');

        outside.innerHTML = '<a name="Replaced"></a>';
        range.selectNodeContents(root);
        editor.setDOMSelection({ type: 'range', range });
        expect(reconcile('<a name="Replaced">New</a>').querySelector('a')!.name).toBe('Replaced_0');
    });

    it('does not rename references when the incoming destination is absent', () => {
        root.innerHTML = '<a name="Existing"></a>';
        expect(
            reconcile('<a href="#Existing">Jump</a>').querySelector('a')!.getAttribute('href')
        ).toBe('#Existing');
    });
});
