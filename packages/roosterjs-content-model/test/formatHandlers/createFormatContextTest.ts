import { createDomToModelContext } from '../../lib/domToModel/context/createDomToModelContext';
import { SelectionRangeTypes } from 'roosterjs-editor-types';

describe('createFormatContextTest', () => {
    it('empty parameter', () => {
        const context = createDomToModelContext();

        expect(context).toEqual({
            contentModelContext: {
                isDarkMode: false,
                zoomScale: 1,
                isRightToLeft: false,
                getDarkColor: undefined,
            },
            isInSelection: false,
        });
    });

    it('with base parameters', () => {
        const getDarkColor = () => '';

        const context = createDomToModelContext({
            isDarkMode: true,
            zoomScale: 2,
            isRightToLeft: true,
            getDarkColor,
        });

        expect(context).toEqual({
            contentModelContext: {
                isDarkMode: true,
                zoomScale: 2,
                isRightToLeft: true,
                getDarkColor: getDarkColor,
            },
            isInSelection: false,
        });
    });

    it('with base parameters and regular selection', () => {
        const getDarkColor = () => '';

        const text = document.createTextNode('test');
        const range = document.createRange();
        range.setStart(text, 1);
        range.setEnd(text, 2);

        const context = createDomToModelContext(
            {
                isDarkMode: true,
                zoomScale: 2,
                isRightToLeft: true,
                getDarkColor,
            },
            {
                type: SelectionRangeTypes.Normal,
                ranges: [range],
                areAllCollapsed: false,
            }
        );

        expect(context).toEqual({
            contentModelContext: {
                isDarkMode: true,
                zoomScale: 2,
                isRightToLeft: true,
                getDarkColor: getDarkColor,
            },
            isInSelection: false,
            regularSelection: {
                startContainer: text,
                startOffset: 1,
                endContainer: text,
                endOffset: 2,
                isSelectionCollapsed: false,
            },
        });
    });

    it('with base parameters and table selection', () => {
        const getDarkColor = () => '';

        const table = document.createElement('table');

        const context = createDomToModelContext(
            {
                isDarkMode: true,
                zoomScale: 2,
                isRightToLeft: true,
                getDarkColor,
            },
            {
                type: SelectionRangeTypes.TableSelection,
                ranges: [],
                areAllCollapsed: false,
                table: table,
                coordinates: {
                    firstCell: {
                        x: 1,
                        y: 2,
                    },
                    lastCell: {
                        x: 3,
                        y: 4,
                    },
                },
            }
        );

        expect(context).toEqual({
            contentModelContext: {
                isDarkMode: true,
                zoomScale: 2,
                isRightToLeft: true,
                getDarkColor: getDarkColor,
            },
            isInSelection: false,
            tableSelection: {
                table: table,
                firstCell: {
                    x: 1,
                    y: 2,
                },
                lastCell: {
                    x: 3,
                    y: 4,
                },
            },
        });
    });

    it('with base parameters and wrong selection 1', () => {
        const getDarkColor = () => '';

        const context = createDomToModelContext(
            {
                isDarkMode: true,
                zoomScale: 2,
                isRightToLeft: true,
                getDarkColor,
            },
            {
                type: SelectionRangeTypes.Normal,
                ranges: [],
                areAllCollapsed: true,
            }
        );

        expect(context).toEqual({
            contentModelContext: {
                isDarkMode: true,
                zoomScale: 2,
                isRightToLeft: true,
                getDarkColor: getDarkColor,
            },
            isInSelection: false,
        });
    });

    it('with base parameters and wrong selection 2', () => {
        const getDarkColor = () => '';

        const context = createDomToModelContext(
            {
                isDarkMode: true,
                zoomScale: 2,
                isRightToLeft: true,
                getDarkColor,
            },
            {
                type: SelectionRangeTypes.TableSelection,
                ranges: [],
                areAllCollapsed: false,
                table: null!,
                coordinates: null!,
            }
        );

        expect(context).toEqual({
            contentModelContext: {
                isDarkMode: true,
                zoomScale: 2,
                isRightToLeft: true,
                getDarkColor: getDarkColor,
            },
            isInSelection: false,
        });
    });
});
