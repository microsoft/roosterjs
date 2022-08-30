import { ContentModelContext } from '../../../lib/publicTypes/ContentModelContext';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { SelectionRangeTypes } from 'roosterjs-editor-types';

describe('createDomToModelContext', () => {
    const defaultContentModelContext: ContentModelContext = {
        isDarkMode: false,
        zoomScale: 1,
        isRightToLeft: false,
        getDarkColor: undefined,
    };

    it('no param', () => {
        const context = createDomToModelContext();

        expect(context).toEqual({
            contentModelContext: defaultContentModelContext,
            segmentFormat: {},
            isInSelection: false,
        });
    });

    it('with content model context', () => {
        const contentModelContext: ContentModelContext = {
            isDarkMode: true,
            zoomScale: 2,
            isRightToLeft: true,
            getDarkColor: () => '',
        };

        const context = createDomToModelContext(contentModelContext);

        expect(context).toEqual({
            contentModelContext: contentModelContext,
            segmentFormat: {},
            isInSelection: false,
        });
    });

    it('with normal selection', () => {
        const mockedRange = ({
            startContainer: 'DIV 1',
            startOffset: 0,
            endContainer: 'DIV 2',
            endOffset: 1,
            collapsed: false,
        } as any) as Range;
        const context = createDomToModelContext(undefined, {
            type: SelectionRangeTypes.Normal,
            ranges: [mockedRange],
            areAllCollapsed: false,
        });

        expect(context).toEqual({
            contentModelContext: defaultContentModelContext,
            segmentFormat: {},
            isInSelection: false,
            regularSelection: {
                startContainer: 'DIV 1' as any,
                startOffset: 0,
                endContainer: 'DIV 2' as any,
                endOffset: 1,
                isSelectionCollapsed: false,
            },
        });
    });

    it('with table selection', () => {
        const context = createDomToModelContext(undefined, {
            type: SelectionRangeTypes.TableSelection,
            ranges: [],
            areAllCollapsed: false,
            table: 'TABLE' as any,
            coordinates: {
                firstCell: { x: 1, y: 2 },
                lastCell: { x: 3, y: 4 },
            },
        });

        expect(context).toEqual({
            contentModelContext: defaultContentModelContext,
            segmentFormat: {},
            isInSelection: false,
            tableSelection: {
                table: 'TABLE' as any,
                firstCell: { x: 1, y: 2 },
                lastCell: { x: 3, y: 4 },
            },
        });
    });
});
