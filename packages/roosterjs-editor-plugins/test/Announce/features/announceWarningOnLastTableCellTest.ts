import { announceWarningOnLastCell } from '../../../lib/plugins/Announce/features/announceWarningOnLastTableCell';
import { createElement } from 'roosterjs-editor-dom';
import {
    IEditor,
    PluginEventType,
    PluginKeyboardEvent,
    SelectionRangeEx,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';

describe('announceWarningOnLastTableCell', () => {
    const TABLE_SELECTOR = 'table';
    const mockEditor: IEditor = {
        getElementAtCursor: (selector: string) => {
            if (selector == TABLE_SELECTOR) {
                return el;
            } else {
                return el?.querySelectorAll('td').item(getLastFocused ? 1 : 0);
            }
        },
        getSelectionRangeEx: () => selectionRangeExMock,
    } as any;
    let el: Element | null;
    let getLastFocused: boolean = true;
    let selectionRangeExMock: SelectionRangeEx;
    const eventmock: PluginKeyboardEvent = {
        eventType: PluginEventType.KeyDown,
        rawEvent: {} as any,
        eventDataCache: {},
    };

    beforeEach(() => {
        eventmock.eventDataCache = {};

        el = createElement(
            {
                tag: 'Table',
                children: [
                    {
                        tag: 'TR',
                        children: [
                            {
                                tag: 'TD',
                                children: ['test'],
                            },
                            {
                                tag: 'TD',
                                children: ['test'],
                            },
                        ],
                    },
                ],
            },
            document
        ) as any;

        el && document.body.appendChild(el);
    });

    afterEach(() => {
        el?.parentElement?.removeChild(el);
    });

    it('announceWarningOnLastTableCell.shouldHandle | True', () => {
        getLastFocused = true;
        selectionRangeExMock = {
            areAllCollapsed: true,
            ranges: ['asd'] as any,
            type: SelectionRangeTypes.Normal,
        };

        const result = announceWarningOnLastCell.shouldHandle(mockEditor, null);

        expect(result).toEqual({ defaultStrings: 3 });
    });

    it('announceWarningOnLastTableCell.shouldHandle | Not last cell', () => {
        getLastFocused = false;
        selectionRangeExMock = {
            areAllCollapsed: true,
            ranges: ['asd'] as any,
            type: SelectionRangeTypes.Normal,
        };

        const result = announceWarningOnLastCell.shouldHandle(mockEditor, null);

        expect(result).toEqual(false);
    });

    it('announceWarningOnLastTableCell.shouldHandle | Not Selection range of type normal', () => {
        getLastFocused = true;
        selectionRangeExMock = {
            areAllCollapsed: true,
            ranges: ['asd'] as any,
            type: SelectionRangeTypes.TableSelection,
        } as any;

        const result = announceWarningOnLastCell.shouldHandle(mockEditor, null);

        expect(result).toEqual(false);
    });

    it('announceWarningOnLastTableCell.shouldHandle | More than one range in ranges', () => {
        getLastFocused = true;
        selectionRangeExMock = {
            areAllCollapsed: true,
            ranges: ['asd', '2'] as any,
            type: SelectionRangeTypes.Normal,
        } as any;

        const result = announceWarningOnLastCell.shouldHandle(mockEditor, null);

        expect(result).toEqual(false);
    });

    it('announceWarningOnLastTableCell.shouldHandle | Not all collapsed', () => {
        getLastFocused = true;
        selectionRangeExMock = {
            areAllCollapsed: false,
            ranges: ['asd'] as any,
            type: SelectionRangeTypes.Normal,
        } as any;

        const result = announceWarningOnLastCell.shouldHandle(mockEditor, null);

        expect(result).toEqual(false);
    });
});
