import { formatHorizontalLine } from '../../../lib/publicApi/block/formatHorizontalLine';
import {
    contentModelToDom,
    createContentModelDocument,
    createDivider,
    createFormatContainer,
    createModelToDomContext,
    createParagraph,
    createSelectionMarker,
    createTable,
    createTableCell,
    createText,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelDocument,
    ContentModelFormatter,
    FormatContentModelContext,
    IEditor,
} from 'roosterjs-content-model-types';

describe('formatHorizontalLine', () => {
    let model: ContentModelDocument;
    let editor: IEditor;
    let focus: jasmine.Spy;
    let formatContentModel: jasmine.Spy;
    let formatResult: boolean | undefined;

    beforeEach(() => {
        model = createContentModelDocument();
        formatResult = undefined;
        focus = jasmine.createSpy('focus');
        const context: FormatContentModelContext = {
            newEntities: [],
            deletedEntities: [],
            newImages: [],
        };
        formatContentModel = jasmine
            .createSpy('formatContentModel')
            .and.callFake((callback: ContentModelFormatter) => {
                formatResult = callback(model, context);
            });
        editor = ({
            focus,
            formatContentModel,
        } as Partial<IEditor>) as IEditor;
    });

    it('does not format an unselected line or selected text', () => {
        const line = createDivider('hr', { width: '98%' });
        const paragraph = createParagraph();
        const text = createText('selected');
        text.isSelected = true;
        paragraph.segments.push(createSelectionMarker(), text, createSelectionMarker());
        model.blocks.push(line, paragraph);

        formatHorizontalLine(editor, { width: '50%' });

        expect(focus).toHaveBeenCalledTimes(1);
        expect(formatContentModel).toHaveBeenCalledTimes(1);
        expect(formatContentModel.calls.argsFor(0)[1]).toEqual({
            apiName: 'formatHorizontalLine',
        });
        expect(formatResult).toBe(false);
        expect(line.format).toEqual({ width: '98%' });
        expect(paragraph.segments[1]).toBe(text);
        expect(text.format).toEqual({});
    });

    it('preserves unspecified properties, selection and the supplied format', () => {
        const line = createDivider('hr', {
            borderTop: '1px solid black',
            width: '98%',
            height: '1px',
            marginTop: '8px',
            display: 'table',
        });
        line.isSelected = true;
        line.size = '2';
        line.cachedElement = document.createElement('hr');
        model.blocks.push(line);
        const format = { width: '50%', height: '4px' };

        formatHorizontalLine(editor, format);

        expect(formatResult).toBe(true);
        expect(line.format).toEqual({
            borderTop: '1px solid black',
            width: '50%',
            height: '4px',
            marginTop: '8px',
            display: 'table',
        });
        expect(line.isSelected).toBe(true);
        expect(line.size).toBe('2');
        expect(line.cachedElement).toBeUndefined();
        expect(format).toEqual({ width: '50%', height: '4px' });
        expect(line.format).not.toBe(format);
    });

    it('formats all selected HRs, including nested lines, but not DIV dividers', () => {
        const line = createDivider('hr');
        line.isSelected = true;
        const container = createFormatContainer('blockquote');
        const nestedLine = createDivider('hr');
        nestedLine.isSelected = true;
        container.blocks.push(nestedLine);
        const table = createTable(1);
        const cell = createTableCell();
        const cellLine = createDivider('hr');
        cell.isSelected = true;
        cell.blocks.push(cellLine);
        table.rows[0].cells.push(cell);
        const div = createDivider('div');
        div.isSelected = true;
        const unselectedLine = createDivider('hr');
        model.blocks.push(line, container, table, div, unselectedLine);

        formatHorizontalLine(editor, { height: '10px' });

        expect(formatResult).toBe(true);
        [line, nestedLine, cellLine].forEach(divider => {
            expect(divider.format).toEqual({ height: '10px' });
        });
        expect(div.format).toEqual({});
        expect(unselectedLine.format).toEqual({});
    });

    it('does not format selected DIV dividers', () => {
        const divider = createDivider('div', { width: '100%' });
        divider.isSelected = true;
        model.blocks.push(divider);

        formatHorizontalLine(editor, { width: '50%' });

        expect(formatResult).toBe(false);
        expect(divider.format).toEqual({ width: '100%' });
    });

    ['left', 'center', 'right'].forEach(alignment => {
        it('renders color, dimensions and ' + alignment + ' alignment', () => {
            const line = createDivider('hr', { display: 'table' });
            line.isSelected = true;
            model.blocks.push(line);
            const marginLeft = alignment == 'left' ? '0' : 'auto';
            const marginRight = alignment == 'right' ? '0' : 'auto';

            formatHorizontalLine(editor, {
                width: '50%',
                height: '4px',
                backgroundColor: 'red',
                borderTop: '1px solid red',
                borderRight: '1px solid red',
                borderBottom: '1px solid red',
                borderLeft: '1px solid red',
                marginLeft,
                marginRight,
            });

            const parent = document.createElement('div');
            contentModelToDom(document, parent, model, createModelToDomContext());
            const hr = parent.querySelector('hr')!;

            expect(formatResult).toBe(true);
            expect(hr.style.width).toBe('50%');
            expect(hr.style.height).toBe('4px');
            expect(hr.style.display).toBe('table');
            expect(hr.style.backgroundColor).toBe('red');
            expect(hr.style.borderTopColor).toBe('red');
            expect(hr.style.borderRightColor).toBe('red');
            expect(hr.style.borderBottomColor).toBe('red');
            expect(hr.style.borderLeftColor).toBe('red');
            expect(hr.style.marginLeft).toBe(marginLeft == '0' ? '0px' : 'auto');
            expect(hr.style.marginRight).toBe(marginRight == '0' ? '0px' : 'auto');
        });
    });

    it('can clear an existing format property', () => {
        const line = createDivider('hr', { backgroundColor: 'red', width: '50%' });
        line.isSelected = true;
        model.blocks.push(line);

        formatHorizontalLine(editor, { backgroundColor: '' });

        expect(formatResult).toBe(true);
        expect(line.format).toEqual({ backgroundColor: '', width: '50%' });
    });
});
