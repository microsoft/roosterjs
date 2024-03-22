import { announceNewListItemNumber } from '../../../lib/plugins/Announce/features/announceNewListItem';
import { createElement } from 'roosterjs-editor-dom';
import {
    IEditor,
    KnownAnnounceStrings,
    PluginEventType,
    PluginKeyboardEvent,
} from 'roosterjs-editor-types';

describe('announceNewListItem', () => {
    const LIST_ITEM_SELECTOR = 'LI';

    const mockEditor: IEditor = {
        getElementAtCursor: (selector: string) => {
            if (selector == LIST_ITEM_SELECTOR) {
                return el?.firstChild;
            } else {
                return el;
            }
        },
    } as any;
    let el: Element | null;
    const eventmock: PluginKeyboardEvent = {
        eventType: PluginEventType.KeyDown,
        rawEvent: {} as any,
        eventDataCache: {},
    };

    beforeEach(() => {
        eventmock.eventDataCache = {};

        el = createElement(
            {
                tag: 'UL',
                children: [
                    {
                        tag: 'LI',
                        children: ['asd'],
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

    it('announceNewListItem.shouldHandle | OL with start attribute', () => {
        el = createElement(
            {
                tag: 'OL',
                attributes: {
                    start: '5',
                },
                children: [
                    {
                        tag: 'LI',
                        children: ['asd'],
                    },
                ],
            },
            document
        ) as any;

        const result = announceNewListItemNumber.shouldHandle(mockEditor, null);

        expect(result).toEqual({
            defaultStrings: KnownAnnounceStrings.AnnounceListItemNumbering,
            formatStrings: ['5'],
        });
    });

    it('announceNewListItem.shouldHandle | UL', () => {
        const result = announceNewListItemNumber.shouldHandle(mockEditor, null);

        expect(result).toEqual({ defaultStrings: 2 });
    });

    it('announceNewListItem.shouldHandle | OL', () => {
        el = createElement(
            {
                tag: 'OL',
                children: [
                    {
                        tag: 'LI',
                        children: ['asd'],
                    },
                ],
            },
            document
        ) as any;

        const result = announceNewListItemNumber.shouldHandle(mockEditor, null);

        expect(result).toEqual({ defaultStrings: 1, formatStrings: ['1'] });
    });

    it('announceNewListItem.shouldHandle | Null', () => {
        el = null as any;

        const result = announceNewListItemNumber.shouldHandle(mockEditor, null);

        expect(result).toEqual(false);
    });
});
