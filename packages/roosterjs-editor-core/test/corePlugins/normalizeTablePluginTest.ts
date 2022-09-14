import NormalizeTablePlugin from '../../lib/corePlugins/NormalizeTablePlugin';
import { createElement } from 'roosterjs-editor-dom';
import {
    IEditor,
    PluginEventType,
    SelectionRangeTypes,
    CreateElementData,
} from 'roosterjs-editor-types';

describe('NormalizeTablePlugin', () => {
    let plugin: NormalizeTablePlugin;
    let editor: IEditor;
    let getSelectionRangeEx: jasmine.Spy;

    beforeEach(() => {
        getSelectionRangeEx = jasmine.createSpy('getSelectionRangeEx');
        editor = <IEditor>(<any>{
            getSelectionRangeEx,
        });

        plugin = new NormalizeTablePlugin();
        plugin.initialize(editor);
    });

    afterEach(() => {
        plugin.dispose();
        plugin = null;
        editor = null;
    });

    it('No table 1', () => {
        editor.queryElements = () => <any>[];

        plugin.onPluginEvent({
            eventType: PluginEventType.EditorReady,
        });
        plugin.onPluginEvent({
            eventType: PluginEventType.ContentChanged,
            source: '',
        });

        expect(getSelectionRangeEx).not.toHaveBeenCalled();
    });

    it('No table 2', () => {
        editor.getElementAtCursor = () => <any>null;

        plugin.onPluginEvent(<any>{
            eventType: PluginEventType.BeforePaste,
            fragment: document.createDocumentFragment(),
        });
        plugin.onPluginEvent(<any>{
            eventType: PluginEventType.MouseDown,
            rawEvent: {},
        });
        plugin.onPluginEvent(<any>{
            eventType: PluginEventType.KeyDown,
            rawEvent: {},
        });
        expect(getSelectionRangeEx).not.toHaveBeenCalled();
    });

    it('Only query for keyboard event when SHIFT is pressed', () => {
        const getElementAtCursor = jasmine.createSpy('getElementAtCursor');
        editor.getElementAtCursor = getElementAtCursor;

        plugin.onPluginEvent(<any>{
            eventType: PluginEventType.KeyDown,
            rawEvent: {
                shiftKey: false,
            },
        });

        expect(getElementAtCursor).not.toHaveBeenCalled();

        plugin.onPluginEvent(<any>{
            eventType: PluginEventType.KeyDown,
            rawEvent: {
                shiftKey: true,
            },
        });

        expect(getElementAtCursor).toHaveBeenCalled();
    });

    function runTest(input: CreateElementData, expected: string) {
        const table = createElement(input, document);

        editor.queryElements = () => [table];
        plugin.onPluginEvent({
            eventType: PluginEventType.EditorReady,
        });

        expect(table.outerHTML).toBe(expected);
    }

    function createTr(text: string): CreateElementData {
        return {
            tag: 'tr',
            children: [
                {
                    tag: 'td',
                    children: [text],
                },
            ],
        };
    }

    function createTableSection(tag: string, ...texts: string[]): CreateElementData {
        return {
            tag,
            children: texts.map(createTr),
        };
    }

    function createTable(...args: CreateElementData[]): CreateElementData {
        return {
            tag: 'table',
            children: args,
        };
    }

    it('Table already has THEAD/TBODY/TFOOT', () => {
        const html =
            '<table><thead><tr><td>test1</td></tr></thead><tbody><tr><td>test2</td></tr><tr><td>test3</td></tr></tbody><tfoot><tr><td>test4</td></tr></tfoot></table>';
        runTest(
            createTable(
                createTableSection('thead', 'test1'),
                createTableSection('tbody', 'test2', 'test3'),
                createTableSection('tfoot', 'test4')
            ),
            html
        );
    });

    it('Table only has TR', () => {
        runTest(
            createTable(createTr('test1'), createTr('test2')),
            '<table><tbody><tr><td>test1</td></tr><tr><td>test2</td></tr></tbody></table>'
        );
    });

    it('Table has TR and TBODY 1', () => {
        runTest(
            createTable(createTr('test1'), createTableSection('tbody', 'test2')),
            '<table><tbody><tr><td>test1</td></tr><tr><td>test2</td></tr></tbody></table>'
        );
    });

    it('Table has TR and TBODY 2', () => {
        runTest(
            createTable(createTableSection('tbody', 'test1'), createTr('test2')),
            '<table><tbody><tr><td>test1</td></tr><tr><td>test2</td></tr></tbody></table>'
        );
    });

    it('Table has TR and TBODY and TR', () => {
        runTest(
            createTable(createTr('test1'), createTableSection('tbody', 'test2'), createTr('test3')),
            '<table><tbody><tr><td>test1</td></tr><tr><td>test2</td></tr><tr><td>test3</td></tr></tbody></table>'
        );
    });

    it('Table has THEAD and TR and TFOOT', () => {
        runTest(
            createTable(
                createTableSection('thead', 'test1'),
                createTr('test2'),
                createTr('test3'),
                createTableSection('tfoot', 'test4')
            ),
            '<table><thead><tr><td>test1</td></tr></thead><tbody><tr><td>test2</td></tr><tr><td>test3</td></tr></tbody><tfoot><tr><td>test4</td></tr></tfoot></table>'
        );
    });

    it('Table has THEAD and TR and TBODY and TR and TFOOT', () => {
        runTest(
            createTable(
                createTableSection('thead', 'test1'),
                createTr('test2'),
                createTableSection('tbody', 'test3'),
                createTr('test4'),
                createTableSection('tfoot', 'test5')
            ),
            '<table>' +
                '<thead><tr><td>test1</td></tr></thead>' +
                '<tbody><tr><td>test2</td></tr><tr><td>test3</td></tr><tr><td>test4</td></tr></tbody>' +
                '<tfoot><tr><td>test5</td></tr></tfoot>' +
                '</table>'
        );
    });

    it('Table has THEAD and TBODY and TR and TBODY and TFOOT', () => {
        runTest(
            createTable(
                createTableSection('thead', 'test1'),
                createTableSection('tbody', 'test2'),
                createTr('test3'),
                createTableSection('tbody', 'test4'),
                createTableSection('tfoot', 'test5')
            ),
            '<table>' +
                '<thead><tr><td>test1</td></tr></thead>' +
                '<tbody><tr><td>test2</td></tr><tr><td>test3</td></tr><tr><td>test4</td></tr></tbody>' +
                '<tfoot><tr><td>test5</td></tr></tfoot>' +
                '</table>'
        );
    });

    it('Restore selection after normalization', () => {
        const table = createElement(createTable(createTr('test1')), document);
        const startContainer = {};
        const endContainer = {};
        const startOffset = 1;
        const endOffset = 2;
        const select = jasmine.createSpy('select');

        editor.queryElements = () => [table];
        editor.select = select;

        getSelectionRangeEx.and.returnValue(<any>{
            type: SelectionRangeTypes.Normal,
            ranges: [
                {
                    startContainer,
                    endContainer,
                    startOffset,
                    endOffset,
                },
            ],
        });
        plugin.onPluginEvent({
            eventType: PluginEventType.EditorReady,
        });

        expect(table.outerHTML).toBe('<table><tbody><tr><td>test1</td></tr></tbody></table>');
        expect(select).toHaveBeenCalledWith(startContainer, startOffset, endContainer, endOffset);
    });

    it('Restore table selection after normalization', () => {
        const table = createElement(createTable(createTr('test1')), document);
        const coordinates = {
            firstCell: { x: 1, y: 2 },
            lastCell: { x: 3, y: 4 },
        };
        const select = jasmine.createSpy('select');

        editor.queryElements = () => [table];
        editor.select = select;

        getSelectionRangeEx.and.returnValue(<any>{
            type: SelectionRangeTypes.TableSelection,
            table,
            coordinates,
        });
        plugin.onPluginEvent({
            eventType: PluginEventType.EditorReady,
        });

        expect(table.outerHTML).toBe('<table><tbody><tr><td>test1</td></tr></tbody></table>');
        expect(select).toHaveBeenCalledWith(table, coordinates);
    });

    it('Normalize table with THEAD With colgroup, Tbody, Tfoot', () => {
        runTest(
            createTable(
                getTheadWithColgroup(createTableSection),
                createTableSection('tbody', 'test2'),
                createTr('test3'),
                createTableSection('tbody', 'test4'),
                createTableSection('tfoot', 'test5')
            ),
            '<table>' +
                '<thead><tr><td>test1</td></tr><colgroup><col><col></colgroup></thead>' +
                '<tbody><tr><td>test2</td></tr><tr><td>test3</td></tr><tr><td>test4</td></tr></tbody>' +
                '<tfoot><tr><td>test5</td></tr></tfoot>' +
                '</table>'
        );
    });

    it('Table already has THEAD With colgroup/TBODY/TFOOT', () => {
        runTest(
            createTable(
                getTheadWithColgroup(createTableSection),
                createTableSection('tbody', 'test2', 'test3'),
                createTableSection('tfoot', 'test4')
            ),
            '<table>' +
                '<thead><tr><td>test1</td></tr><colgroup><col><col></colgroup></thead>' +
                '<tbody><tr><td>test2</td></tr><tr><td>test3</td></tr></tbody>' +
                '<tfoot><tr><td>test4</td></tr></tfoot></table>'
        );
    });

    it('Table has THEAD With colgroup and TR and TFOOT', () => {
        runTest(
            createTable(
                getTheadWithColgroup(createTableSection),
                createTr('test2'),
                createTr('test3'),
                createTableSection('tfoot', 'test4')
            ),
            '<table>' +
                '<thead><tr><td>test1</td></tr><colgroup><col><col></colgroup></thead>' +
                '<tbody><tr><td>test2</td></tr><tr><td>test3</td></tr></tbody>' +
                '<tfoot><tr><td>test4</td></tr></tfoot></table>'
        );
    });

    it('Table has THEAD With colgroup and TR and TBODY and TR and TFOOT', () => {
        runTest(
            createTable(
                getTheadWithColgroup(createTableSection),
                createTr('test2'),
                createTableSection('tbody', 'test3'),
                createTr('test4'),
                createTableSection('tfoot', 'test5')
            ),
            '<table>' +
                '<thead><tr><td>test1</td></tr><colgroup><col><col></colgroup></thead>' +
                '<tbody><tr><td>test2</td></tr><tr><td>test3</td></tr><tr><td>test4</td></tr></tbody>' +
                '<tfoot><tr><td>test5</td></tr></tfoot>' +
                '</table>'
        );
    });

    it('Table has THEAD With colgroup and TR and TBODY and TR and TFOOT 2', () => {
        runTest(
            createTable(
                createTableSection('thead', 'test1'),
                getColgroup(),
                createTr('test2'),
                createTableSection('tbody', 'test3'),
                createTr('test4'),
                createTableSection('tfoot', 'test5')
            ),
            '<table>' +
                '<thead><tr><td>test1</td></tr><colgroup><col><col></colgroup></thead>' +
                '<tbody><tr><td>test2</td></tr><tr><td>test3</td></tr><tr><td>test4</td></tr></tbody>' +
                '<tfoot><tr><td>test5</td></tr></tfoot>' +
                '</table>'
        );
    });

    it('Table has THEAD With colgroup and TBODY and TR and TBODY and TFOOT', () => {
        runTest(
            createTable(
                getTheadWithColgroup(createTableSection),
                createTableSection('tbody', 'test2'),
                createTr('test3'),
                createTableSection('tbody', 'test4'),
                createTableSection('tfoot', 'test5')
            ),
            '<table>' +
                '<thead><tr><td>test1</td></tr><colgroup><col><col></colgroup></thead>' +
                '<tbody><tr><td>test2</td></tr><tr><td>test3</td></tr><tr><td>test4</td></tr></tbody>' +
                '<tfoot><tr><td>test5</td></tr></tfoot>' +
                '</table>'
        );
    });

    it('Table has TR and TBODY and a orphaned colgroup 1', () => {
        runTest(
            createTable(
                getColgroup(),
                createTr('test1'),
                getColgroup(),
                createTableSection('tbody', 'test2'),
                getColgroup()
            ),
            '<table>' +
                '<colgroup><col><col></colgroup>' +
                '<tbody><tr><td>test1</td></tr></tbody><colgroup><col><col></colgroup><tbody>' +
                '<tr><td>test2</td></tr></tbody><colgroup><col><col></colgroup></table>'
        );
    });

    it('Table has TR and TBODY and a orphaned colgroup 2', () => {
        runTest(
            createTable(createTableSection('tbody', 'test1'), createTr('test2'), getColgroup()),
            '<table>' +
                '<tbody><tr><td>test1</td></tr><tr><td>test2</td></tr></tbody>' +
                '<colgroup><col><col></colgroup></table>'
        );
    });
});

function getTheadWithColgroup(
    createTableSection: (tag: string, ...texts: string[]) => CreateElementData
) {
    const thead = createTableSection('thead', 'test1');
    thead.children?.push(getColgroup());
    return thead;
}

function getColgroup(): CreateElementData {
    return {
        tag: 'colgroup',
        children: [
            {
                tag: 'col',
            },
            {
                tag: 'col',
            },
        ],
    };
}
