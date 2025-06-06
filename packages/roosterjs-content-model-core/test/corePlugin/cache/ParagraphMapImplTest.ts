import { createParagraph } from 'roosterjs-content-model-dom';
import {
    ContentModelParagraph,
    ParagraphIndexer,
    ParagraphMap,
} from 'roosterjs-content-model-types';
import {
    createParagraphMap,
    ParagraphMapReset,
} from '../../../lib/corePlugin/cache/ParagraphMapImpl';

describe('ParagraphMapImpl', () => {
    let map: ParagraphMap & ParagraphIndexer & ParagraphMapReset;

    beforeEach(() => {
        map = createParagraphMap() as ParagraphMap & ParagraphIndexer & ParagraphMapReset;

        map._reset();
    });

    describe('assignMarkerToModel', () => {
        it('no marker', () => {
            const element = document.createElement('div');
            const paragraph: ContentModelParagraph = {
                blockType: 'Paragraph',
                segments: [],
                format: {},
            };

            map.assignMarkerToModel(element, paragraph);

            expect((element as any).__roosterjsHiddenProperty).toEqual({
                paragraphMarker: 'paragraph_0_0',
            });
            expect((paragraph as any)._marker).toBe('paragraph_0_0');
            expect(map._getMap()).toEqual({
                paragraph_0_0: paragraph,
            });
        });

        it('element has marker', () => {
            const element = document.createElement('div');
            const paragraph: ContentModelParagraph = {
                blockType: 'Paragraph',
                segments: [],
                format: {},
            };
            (element as any).__roosterjsHiddenProperty = {
                paragraphMarker: 'testMarker',
            };

            map.assignMarkerToModel(element, paragraph);

            expect((element as any).__roosterjsHiddenProperty).toEqual({
                paragraphMarker: 'testMarker',
            });
            expect((paragraph as any)._marker).toBe('testMarker');
            expect(map._getMap()).toEqual({
                testMarker: paragraph,
            });
        });

        it('multiple elements marker', () => {
            const element1 = document.createElement('div');
            const element2 = document.createElement('div');
            const element3 = document.createElement('div');
            const element4 = document.createElement('div');
            const paragraph1 = createParagraph();
            const paragraph2 = createParagraph();
            const paragraph3 = createParagraph();
            const paragraph4 = createParagraph();

            (element2 as any).__roosterjsHiddenProperty = {
                paragraphMarker: 'testMarker',
            };
            (paragraph4 as any)._marker = 'testMarker2';

            map.assignMarkerToModel(element1, paragraph1);
            map.assignMarkerToModel(element2, paragraph2);
            map.assignMarkerToModel(element3, paragraph3);

            const map2 = createParagraphMap();

            map2.assignMarkerToModel(element4, paragraph4);

            expect((element1 as any).__roosterjsHiddenProperty).toEqual({
                paragraphMarker: 'paragraph_0_0',
            });
            expect((paragraph1 as any)._marker).toBe('paragraph_0_0');
            expect((element2 as any).__roosterjsHiddenProperty).toEqual({
                paragraphMarker: 'testMarker',
            });
            expect((paragraph2 as any)._marker).toBe('testMarker');
            expect((element3 as any).__roosterjsHiddenProperty).toEqual({
                paragraphMarker: 'paragraph_0_1',
            });
            expect((paragraph3 as any)._marker).toBe('paragraph_0_1');
            expect((element4 as any).__roosterjsHiddenProperty).toEqual({
                paragraphMarker: 'paragraph_1_0',
            });
            expect((paragraph4 as any)._marker).toBe('paragraph_1_0');
            expect(map._getMap()).toEqual({
                paragraph_0_0: paragraph1,
                testMarker: paragraph2,
                paragraph_0_1: paragraph3,
            });
            expect((map2 as ParagraphMap & ParagraphIndexer & ParagraphMapReset)._getMap()).toEqual(
                {
                    paragraph_1_0: paragraph4,
                }
            );
        });
    });

    describe('applyMarkerToDom', () => {
        it('no marker', () => {
            const element = document.createElement('div');
            const paragraph: ContentModelParagraph = {
                blockType: 'Paragraph',
                segments: [],
                format: {},
            };

            map.applyMarkerToDom(element, paragraph);

            expect((element as any).__roosterjsHiddenProperty).toEqual({
                paragraphMarker: 'paragraph_0_0',
            });
            expect((paragraph as any)._marker).toBe('paragraph_0_0');
            expect(map._getMap()).toEqual({
                paragraph_0_0: paragraph,
            });
        });

        it('element has marker', () => {
            const element = document.createElement('div');
            const paragraph: ContentModelParagraph = {
                blockType: 'Paragraph',
                segments: [],
                format: {},
            };
            (paragraph as any)._marker = 'testMarker';

            map.applyMarkerToDom(element, paragraph);

            expect((element as any).__roosterjsHiddenProperty).toEqual({
                paragraphMarker: 'testMarker',
            });
            expect((paragraph as any)._marker).toBe('testMarker');
            expect(map._getMap()).toEqual({
                testMarker: paragraph,
            });
        });

        it('multiple elements marker', () => {
            const element1 = document.createElement('div');
            const element2 = document.createElement('div');
            const element3 = document.createElement('div');
            const element4 = document.createElement('div');
            const paragraph1 = createParagraph();
            const paragraph2 = createParagraph();
            const paragraph3 = createParagraph();
            const paragraph4 = createParagraph();

            (paragraph2 as any)._marker = 'testMarker';
            (element4 as any).__roosterjsHiddenProperty = {
                paragraphMarker: 'testMarker',
            };

            map.applyMarkerToDom(element1, paragraph1);
            map.applyMarkerToDom(element2, paragraph2);
            map.applyMarkerToDom(element3, paragraph3);

            const map2 = createParagraphMap();

            map2.applyMarkerToDom(element4, paragraph4);

            expect((element1 as any).__roosterjsHiddenProperty).toEqual({
                paragraphMarker: 'paragraph_0_0',
            });
            expect((paragraph1 as any)._marker).toBe('paragraph_0_0');
            expect((element2 as any).__roosterjsHiddenProperty).toEqual({
                paragraphMarker: 'testMarker',
            });
            expect((paragraph2 as any)._marker).toBe('testMarker');
            expect((element3 as any).__roosterjsHiddenProperty).toEqual({
                paragraphMarker: 'paragraph_0_1',
            });
            expect((paragraph3 as any)._marker).toBe('paragraph_0_1');
            expect((element4 as any).__roosterjsHiddenProperty).toEqual({
                paragraphMarker: 'paragraph_1_0',
            });
            expect((paragraph4 as any)._marker).toBe('paragraph_1_0');
            expect(map._getMap()).toEqual({
                paragraph_0_0: paragraph1,
                testMarker: paragraph2,
                paragraph_0_1: paragraph3,
            });
            expect((map2 as ParagraphMap & ParagraphIndexer & ParagraphMapReset)._getMap()).toEqual(
                {
                    paragraph_1_0: paragraph4,
                }
            );
        });
    });

    describe('getParagraphFromMarker', () => {
        it('has the result', () => {
            const mockedParagraph = 'MockedParagraph' as any;
            map._getMap()['testMarker'] = mockedParagraph;

            const paragraph = map.getParagraphFromMarker({
                blockType: 'Paragraph',
                segments: [],
                format: {},
                _marker: 'testMarker',
            } as ContentModelParagraph);

            expect(paragraph).toBe(mockedParagraph);
        });

        it('no result', () => {
            const paragraph = map.getParagraphFromMarker({
                blockType: 'Paragraph',
                segments: [],
                format: {},
                _marker: 'testMarker',
            } as ContentModelParagraph);

            expect(paragraph).toBe(null);
        });
    });

    describe('clear', () => {
        it('should clear the map', () => {
            const element = document.createElement('div');
            const paragraph: ContentModelParagraph = {
                blockType: 'Paragraph',
                segments: [],
                format: {},
            };

            map.assignMarkerToModel(element, paragraph);
            expect(map._getMap()).toEqual({
                paragraph_0_0: paragraph,
            });

            map.clear();
            expect(map._getMap()).toEqual({});
        });
    });
});
