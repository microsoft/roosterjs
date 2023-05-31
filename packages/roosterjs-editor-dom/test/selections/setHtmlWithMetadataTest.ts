import { SelectionRangeTypes } from 'roosterjs-editor-types';
import {
    extractContentMetadata,
    setHtmlWithMetadata,
} from '../../lib/selection/setHtmlWithSelectionPath';

describe('setHtmlWithMetadata', () => {
    let div: HTMLDivElement;

    beforeEach(() => {
        div = document.createElement('div');
    });

    it('pure HTML', () => {
        const html = '<div>test</div>';
        const metadata = setHtmlWithMetadata(div, html);

        expect(div.innerHTML).toBe(html);
        expect(metadata).toBeUndefined();
    });

    it('HTML with empty comment', () => {
        const html = '<div>test</div><!---->';
        const metadata = setHtmlWithMetadata(div, html);

        expect(div.innerHTML).toBe(html);
        expect(metadata).toBeUndefined();
    });

    it('HTML with comment', () => {
        const html = '<div>test</div><!--test-->';
        const metadata = setHtmlWithMetadata(div, html);

        expect(div.innerHTML).toBe(html);
        expect(metadata).toBeUndefined();
    });

    it('HTML with comment and invalid JSON', () => {
        const html = '<div>test</div><!--{"a":b, "c":}-->';
        const metadata = setHtmlWithMetadata(div, html);

        expect(div.innerHTML).toBe(html);
        expect(metadata).toBeUndefined();
    });

    it('HTML with half selection path', () => {
        const html = '<div>test</div><!--{"start":[]}-->';
        const metadata = setHtmlWithMetadata(div, html);

        expect(div.innerHTML).toBe(html);
        expect(metadata).toBeUndefined();
    });

    it('HTML with full selection path', () => {
        const pureHtml = '<div>test</div>';
        const comment = { start: <any[]>[], end: <any[]>[] };
        const html = metadataToString(pureHtml, comment);
        const metadata = setHtmlWithMetadata(div, html);

        expect(div.innerHTML).toBe(pureHtml);
        expect(metadata).toEqual({
            start: [],
            end: [],
            type: SelectionRangeTypes.Normal,
            isDarkMode: false,
        });
    });

    it('HTML with full normal content metadata', () => {
        const pureHtml = '<div>test</div>';
        const comment = <any>{
            start: [1],
            end: [2],
            isDarkMode: true,
            type: SelectionRangeTypes.Normal,
        };
        const html = metadataToString(pureHtml, comment);
        const metadata = setHtmlWithMetadata(div, html);

        expect(div.innerHTML).toBe(pureHtml);
        expect(metadata).toEqual(comment);
    });

    it('HTML with full normal content metadata but wrong type', () => {
        const pureHtml = '<div>test</div>';
        const comment = <any>{
            start: [1],
            end: [2],
            isDarkMode: true,
            type: SelectionRangeTypes.TableSelection,
        };
        const html = metadataToString(pureHtml, comment);
        const metadata = setHtmlWithMetadata(div, html);

        expect(div.innerHTML).toBe(html);
        expect(metadata).toBeUndefined();
    });

    it('HTML with full table selection metadata', () => {
        const pureHtml = '<div>test</div>';
        const comment = <any>{
            type: SelectionRangeTypes.TableSelection,
            isDarkMode: true,
            tableId: 'table',
            firstCell: {
                x: 1,
                y: 2,
            },
            lastCell: {
                x: 3,
                y: 4,
            },
        };
        const html = metadataToString(pureHtml, comment);
        const metadata = setHtmlWithMetadata(div, html);

        expect(div.innerHTML).toBe(pureHtml);
        expect(metadata).toEqual(comment);
    });

    it('HTML with full table selection metadata but wrong type', () => {
        const pureHtml = '<div>test</div>';
        const comment = <any>{
            type: SelectionRangeTypes.Normal,
            isDarkMode: true,
            tableId: 'table',
            firstCell: {
                x: 1,
                y: 2,
            },
            lastCell: {
                x: 3,
                y: 4,
            },
        };
        const html = metadataToString(pureHtml, comment);
        const metadata = setHtmlWithMetadata(div, html);

        expect(div.innerHTML).toBe(html);
        expect(metadata).toBeUndefined();
    });

    it('HTML with incomplete table selection metadata 1', () => {
        const pureHtml = '<div>test</div>';
        const comment = <any>{
            type: SelectionRangeTypes.TableSelection,
            tableId: 'table',
            firstCell: {
                x: 1,
                y: 2,
            },
            lastCell: {
                x: 3,
                y: 4,
            },
        };
        const html = metadataToString(pureHtml, comment);
        const metadata = setHtmlWithMetadata(div, html);

        expect(div.innerHTML).toBe(pureHtml);
        expect(metadata).toEqual({
            type: SelectionRangeTypes.TableSelection,
            tableId: 'table',
            firstCell: {
                x: 1,
                y: 2,
            },
            lastCell: {
                x: 3,
                y: 4,
            },
            isDarkMode: false,
        });
    });

    it('HTML with incomplete table selection metadata 2', () => {
        const pureHtml = '<div>test</div>';
        const comment = <any>{
            type: SelectionRangeTypes.TableSelection,
            firstCell: {
                x: 1,
                y: 2,
            },
            lastCell: {
                x: 3,
                y: 4,
            },
        };
        const html = metadataToString(pureHtml, comment);
        const metadata = setHtmlWithMetadata(div, html);

        expect(div.innerHTML).toBe(html);
        expect(metadata).toBeUndefined();
    });

    it('HTML with incomplete table selection metadata 3', () => {
        const pureHtml = '<div>test</div>';
        const comment = <any>{
            type: SelectionRangeTypes.TableSelection,
            tableId: 'table',
            firstCell: {
                y: 2,
            },
            lastCell: {
                x: 3,
                y: 4,
            },
        };
        const html = metadataToString(pureHtml, comment);
        const metadata = setHtmlWithMetadata(div, html);

        expect(div.innerHTML).toBe(html);
        expect(metadata).toBeUndefined();
    });

    it('HTML with incomplete table selection metadata 4', () => {
        const pureHtml = '<div>test</div>';
        const comment = <any>{
            type: SelectionRangeTypes.TableSelection,
            tableId: 'table',
            firstCell: {
                x: 1,
                y: 2,
            },
        };
        const html = metadataToString(pureHtml, comment);
        const metadata = setHtmlWithMetadata(div, html);

        expect(div.innerHTML).toBe(html);
        expect(metadata).toBeUndefined();
    });

    it('HTML with incomplete table selection metadata 5', () => {
        const pureHtml = '<div>test</div>';
        const comment = <any>{
            type: SelectionRangeTypes.TableSelection,
            tableId: 'table',
            firstCell: {
                x: 'test',
                y: 2,
            },
            lastCell: {
                x: 3,
                y: 4,
            },
        };
        const html = metadataToString(pureHtml, comment);
        const metadata = setHtmlWithMetadata(div, html);

        expect(div.innerHTML).toBe(html);
        expect(metadata).toBeUndefined();
    });
});

describe('extractContentMetadata', () => {
    let div: HTMLDivElement;

    beforeEach(() => {
        div = document.createElement('div');
    });

    it('pure HTML', () => {
        div.innerHTML = '<div>test</div>';
        const metadata = extractContentMetadata(div);

        expect(metadata).toBeUndefined();
    });

    it('HTML with empty comment', () => {
        div.innerHTML = '<div>test</div><!---->';
        const metadata = extractContentMetadata(div);

        expect(metadata).toBeUndefined();
    });

    it('HTML with comment', () => {
        div.innerHTML = '<div>test</div><!--test-->';
        const metadata = extractContentMetadata(div);

        expect(metadata).toBeUndefined();
    });

    it('HTML with comment and invalid JSON', () => {
        div.innerHTML = '<div>test</div><!--{"a":b, "c":}-->';
        const metadata = extractContentMetadata(div);

        expect(metadata).toBeUndefined();
    });

    it('HTML with half selection path', () => {
        div.innerHTML = '<div>test</div><!--{"start":[]}-->';
        const metadata = extractContentMetadata(div);

        expect(metadata).toBeUndefined();
    });

    it('HTML with full selection path', () => {
        const pureHtml = '<div>test</div>';
        const comment = { start: <any[]>[], end: <any[]>[] };
        const html = metadataToString(pureHtml, comment);

        div.innerHTML = html;

        const metadata = extractContentMetadata(div);

        expect(div.innerHTML).toBe(pureHtml);
        expect(metadata).toEqual({
            start: [],
            end: [],
            type: SelectionRangeTypes.Normal,
            isDarkMode: false,
        });
    });

    it('HTML with full normal content metadata', () => {
        const pureHtml = '<div>test</div>';
        const comment = <any>{
            start: [1],
            end: [2],
            isDarkMode: true,
            type: SelectionRangeTypes.Normal,
        };
        const html = metadataToString(pureHtml, comment);
        div.innerHTML = html;

        const metadata = extractContentMetadata(div);

        expect(div.innerHTML).toBe(pureHtml);
        expect(metadata).toEqual(comment);
    });

    it('HTML with full normal content metadata but wrong type', () => {
        const pureHtml = '<div>test</div>';
        const comment = <any>{
            start: [1],
            end: [2],
            isDarkMode: true,
            type: SelectionRangeTypes.TableSelection,
        };
        const html = metadataToString(pureHtml, comment);
        div.innerHTML = html;
        const metadata = extractContentMetadata(div);

        expect(div.innerHTML).toBe(html);
        expect(metadata).toBeUndefined();
    });

    it('HTML with full table selection metadata', () => {
        const pureHtml = '<div>test</div>';
        const comment = <any>{
            type: SelectionRangeTypes.TableSelection,
            isDarkMode: true,
            tableId: 'table',
            firstCell: {
                x: 1,
                y: 2,
            },
            lastCell: {
                x: 3,
                y: 4,
            },
        };
        const html = metadataToString(pureHtml, comment);
        div.innerHTML = html;

        const metadata = extractContentMetadata(div);

        expect(div.innerHTML).toBe(pureHtml);
        expect(metadata).toEqual(comment);
    });

    it('HTML with full table selection metadata but wrong type', () => {
        const pureHtml = '<div>test</div>';
        const comment = <any>{
            type: SelectionRangeTypes.Normal,
            isDarkMode: true,
            tableId: 'table',
            firstCell: {
                x: 1,
                y: 2,
            },
            lastCell: {
                x: 3,
                y: 4,
            },
        };
        const html = metadataToString(pureHtml, comment);
        div.innerHTML = html;

        const metadata = extractContentMetadata(div);

        expect(div.innerHTML).toBe(html);
        expect(metadata).toBeUndefined();
    });

    it('HTML with incomplete table selection metadata 1', () => {
        const pureHtml = '<div>test</div>';
        const comment = <any>{
            type: SelectionRangeTypes.TableSelection,
            tableId: 'table',
            firstCell: {
                x: 1,
                y: 2,
            },
            lastCell: {
                x: 3,
                y: 4,
            },
        };
        const html = metadataToString(pureHtml, comment);
        div.innerHTML = html;

        const metadata = extractContentMetadata(div);

        expect(div.innerHTML).toBe(pureHtml);
        expect(metadata).toEqual({
            type: SelectionRangeTypes.TableSelection,
            tableId: 'table',
            firstCell: {
                x: 1,
                y: 2,
            },
            lastCell: {
                x: 3,
                y: 4,
            },
            isDarkMode: false,
        });
    });

    it('HTML with incomplete table selection metadata 2', () => {
        const pureHtml = '<div>test</div>';
        const comment = <any>{
            type: SelectionRangeTypes.TableSelection,
            firstCell: {
                x: 1,
                y: 2,
            },
            lastCell: {
                x: 3,
                y: 4,
            },
        };
        const html = metadataToString(pureHtml, comment);
        div.innerHTML = html;

        const metadata = extractContentMetadata(div);

        expect(div.innerHTML).toBe(html);
        expect(metadata).toBeUndefined();
    });

    it('HTML with incomplete table selection metadata 3', () => {
        const pureHtml = '<div>test</div>';
        const comment = <any>{
            type: SelectionRangeTypes.TableSelection,
            tableId: 'table',
            firstCell: {
                y: 2,
            },
            lastCell: {
                x: 3,
                y: 4,
            },
        };
        const html = metadataToString(pureHtml, comment);
        div.innerHTML = html;

        const metadata = extractContentMetadata(div);

        expect(div.innerHTML).toBe(html);
        expect(metadata).toBeUndefined();
    });

    it('HTML with incomplete table selection metadata 4', () => {
        const pureHtml = '<div>test</div>';
        const comment = <any>{
            type: SelectionRangeTypes.TableSelection,
            tableId: 'table',
            firstCell: {
                x: 1,
                y: 2,
            },
        };
        const html = metadataToString(pureHtml, comment);
        div.innerHTML = html;

        const metadata = extractContentMetadata(div);

        expect(div.innerHTML).toBe(html);
        expect(metadata).toBeUndefined();
    });

    it('HTML with incomplete table selection metadata 5', () => {
        const pureHtml = '<div>test</div>';
        const comment = <any>{
            type: SelectionRangeTypes.TableSelection,
            tableId: 'table',
            firstCell: {
                x: 'test',
                y: 2,
            },
            lastCell: {
                x: 3,
                y: 4,
            },
        };
        const html = metadataToString(pureHtml, comment);
        div.innerHTML = html;

        const metadata = extractContentMetadata(div);

        expect(div.innerHTML).toBe(html);
        expect(metadata).toBeUndefined();
    });
});

function metadataToString(html: string, metadata: object): string {
    return html + (metadata ? `<!--${JSON.stringify(metadata)}-->` : '');
}
