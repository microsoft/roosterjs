import { ContentPosition } from 'roosterjs-editor-types';
import { DOMSelection } from 'roosterjs-content-model-types';
import { insertNode } from '../../../lib/editor/utils/insertNode';
import { InsertOption } from 'roosterjs-editor-types';

describe('insertNode', () => {
    let contentDiv: HTMLDivElement;

    beforeEach(() => {
        contentDiv = document.createElement('div');
        document.body.appendChild(contentDiv);
    });

    afterEach(() => {
        contentDiv.parentNode?.removeChild(contentDiv);
    });

    function option(overrides: Record<string, any>): InsertOption {
        return {
            position: ContentPosition.SelectionStart,
            insertOnNewLine: false,
            updateCursor: true,
            replaceSelection: true,
            insertToRegionRoot: false,
            ...overrides,
        } as InsertOption;
    }

    function rangeSelection(range: Range): DOMSelection {
        return { type: 'range', range, isReverted: false };
    }

    describe('ContentPosition.Begin / End', () => {
        it('appends into an empty editor (no block)', () => {
            const node = document.createElement('span');
            node.textContent = 'X';

            insertNode(contentDiv, null, node, option({ position: ContentPosition.Begin }));

            expect(contentDiv.firstChild).toBe(node);
        });

        it('inserts before the first text node for Begin', () => {
            contentDiv.innerHTML = 'hello';
            const node = document.createElement('span');

            insertNode(contentDiv, null, node, option({ position: ContentPosition.Begin }));

            expect(contentDiv.firstChild).toBe(node);
        });

        it('inserts after the last text node for End', () => {
            contentDiv.innerHTML = 'hello';
            const node = document.createElement('span');

            insertNode(contentDiv, null, node, option({ position: ContentPosition.End }));

            expect(contentDiv.lastChild).toBe(node);
        });

        it('inserts the children of a DocumentFragment', () => {
            contentDiv.innerHTML = 'hello';
            const fragment = document.createDocumentFragment();
            const inner = document.createElement('b');
            fragment.appendChild(inner);

            insertNode(contentDiv, null, fragment, option({ position: ContentPosition.Begin }));

            expect(contentDiv.firstChild).toBe(inner);
        });

        it('wraps an inline node in a DIV when inserting on a new line', () => {
            contentDiv.innerHTML = 'hello';
            const node = document.createElement('span');

            insertNode(
                contentDiv,
                null,
                node,
                option({ position: ContentPosition.Begin, insertOnNewLine: true })
            );

            expect(node.parentElement?.tagName).toBe('DIV');
            expect(contentDiv.contains(node)).toBe(true);
        });
    });

    describe('ContentPosition.DomEnd', () => {
        it('appends the node at the end', () => {
            contentDiv.innerHTML = 'hello';
            const node = document.createElement('span');

            insertNode(contentDiv, null, node, option({ position: ContentPosition.DomEnd }));

            expect(contentDiv.lastChild).toBe(node);
        });

        it('wraps an inline node in a DIV when inserting on a new line', () => {
            contentDiv.innerHTML = 'hello';
            const node = document.createElement('span');

            insertNode(
                contentDiv,
                null,
                node,
                option({ position: ContentPosition.DomEnd, insertOnNewLine: true })
            );

            expect(node.parentElement?.tagName).toBe('DIV');
        });
    });

    describe('ContentPosition.SelectionStart / Range', () => {
        it('returns undefined and inserts nothing when there is no range', () => {
            const node = document.createElement('span');

            const result = insertNode(
                contentDiv,
                null,
                node,
                option({ position: ContentPosition.SelectionStart })
            );

            expect(result).toBeUndefined();
            expect(contentDiv.contains(node)).toBe(false);
        });

        it('inserts at a collapsed selection and returns a range selection', () => {
            contentDiv.innerHTML = 'hello world';
            const text = contentDiv.firstChild as Text;
            const range = document.createRange();
            range.setStart(text, 5);
            range.collapse(true);
            const node = document.createElement('span');
            node.textContent = 'X';

            const result = insertNode(
                contentDiv,
                rangeSelection(range),
                node,
                option({ position: ContentPosition.SelectionStart, updateCursor: true })
            );

            expect(result?.type).toBe('range');
            expect(contentDiv.contains(node)).toBe(true);
        });

        it('removes the selected content when replaceSelection is set', () => {
            contentDiv.innerHTML = 'hello world';
            const text = contentDiv.firstChild as Text;
            const range = document.createRange();
            range.setStart(text, 0);
            range.setEnd(text, 5); // selects 'hello'
            const node = document.createElement('span');
            node.textContent = 'X';

            insertNode(
                contentDiv,
                rangeSelection(range),
                node,
                option({
                    position: ContentPosition.SelectionStart,
                    replaceSelection: true,
                    updateCursor: false,
                })
            );

            expect(contentDiv.textContent).not.toContain('hello');
            expect(contentDiv.contains(node)).toBe(true);
        });

        it('inserts at an explicit range for ContentPosition.Range', () => {
            contentDiv.innerHTML = 'hello world';
            const text = contentDiv.firstChild as Text;
            const optionRange = document.createRange();
            optionRange.setStart(text, 2);
            optionRange.collapse(true);
            const node = document.createElement('span');
            node.textContent = 'X';

            const result = insertNode(
                contentDiv,
                null,
                node,
                option({
                    position: ContentPosition.Range,
                    range: optionRange,
                    replaceSelection: false,
                    updateCursor: false,
                })
            );

            // No range to restore (no original selection, updateCursor off)
            expect(result).toBeUndefined();
            expect(contentDiv.contains(node)).toBe(true);
        });

        it('adjusts the insert position to a new line within a block', () => {
            contentDiv.innerHTML = '<div>hello</div>';
            const text = contentDiv.querySelector('div')!.firstChild as Text;
            const range = document.createRange();
            range.setStart(text, 2);
            range.collapse(true);
            const node = document.createElement('span');
            node.textContent = 'X';

            expect(() =>
                insertNode(
                    contentDiv,
                    rangeSelection(range),
                    node,
                    option({
                        position: ContentPosition.SelectionStart,
                        insertOnNewLine: true,
                        insertToRegionRoot: false,
                    })
                )
            ).not.toThrow();
            expect(contentDiv.contains(node)).toBe(true);
        });

        it('adjusts the insert position to the region root inside a table', () => {
            contentDiv.innerHTML = '<table><tr><td>cell</td></tr></table>';
            const text = contentDiv.querySelector('td')!.firstChild as Text;
            const range = document.createRange();
            range.setStart(text, 2);
            range.collapse(true);
            const node = document.createElement('span');
            node.textContent = 'X';

            expect(() =>
                insertNode(
                    contentDiv,
                    rangeSelection(range),
                    node,
                    option({
                        position: ContentPosition.SelectionStart,
                        insertOnNewLine: true,
                        insertToRegionRoot: true,
                    })
                )
            ).not.toThrow();
            expect(contentDiv.contains(node)).toBe(true);
        });
    });
});
