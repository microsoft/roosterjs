import getAnnounceDataForList from '../../lib/announceData/getAnnounceDataForList';
import { createElement } from 'roosterjs-editor-dom';
import { KnownAnnounceStrings } from 'roosterjs-editor-types';

describe('getAnnounceDataForList', () => {
    it('should return announce data for numbered list item | OL', () => {
        const el = createElement(
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

        el && document.body.appendChild(el);

        const announceData = getAnnounceDataForList(el, el?.firstChild);
        expect(announceData).toEqual({
            defaultStrings: KnownAnnounceStrings.AnnounceListItemNumbering,
            formatStrings: ['1'],
        });
    });

    it('should return announce data for numbered list item | OL Step + 1', () => {
        const el = createElement(
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

        el && document.body.appendChild(el);

        const announceData = getAnnounceDataForList(el, el?.firstChild, 1);
        expect(announceData).toEqual({
            defaultStrings: KnownAnnounceStrings.AnnounceListItemNumbering,
            formatStrings: ['2'],
        });
    });

    it('should return announce data for numbered list item | OL Step - 1', () => {
        const el = createElement(
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

        el && document.body.appendChild(el);

        const announceData = getAnnounceDataForList(el, el?.firstChild, -1);
        expect(announceData).toEqual({
            defaultStrings: KnownAnnounceStrings.AnnounceListItemNumbering,
            formatStrings: ['0'],
        });
    });

    it('should return announce data for numbered list item | UL', () => {
        const el = createElement(
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

        const announceData = getAnnounceDataForList(el, el?.firstChild);
        expect(announceData).toEqual({
            defaultStrings: KnownAnnounceStrings.AnnounceListItemBullet,
        });
    });

    it('should return announce data for bullet list item | undefined', () => {
        const announceData = getAnnounceDataForList(null, null);
        expect(announceData).toEqual(undefined);
    });
});
