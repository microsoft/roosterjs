import * as iterateSelections from '../../../lib/modelApi/selection/iterateSelections';
import getSelectedSegments from '../../../lib/publicApi/selection/getSelectedSegments';
import { TableSelectionContext } from '../../../lib/publicTypes/selection/TableSelectionContext';
import {
    createDivider,
    createEntity,
    createParagraph,
    createSelectionMarker,
    createText,
} from 'roosterjs-content-model-dom';
import {
    ContentModelBlock,
    ContentModelBlockGroup,
    ContentModelSegment,
} from 'roosterjs-content-model-types';

interface SelectionInfo {
    path: ContentModelBlockGroup[];
    segments?: ContentModelSegment[];
    block?: ContentModelBlock;
    tableContext?: TableSelectionContext;
}

describe('getSelectedSegments', () => {
    function runTest(
        selections: SelectionInfo[],
        includingFormatHolder: boolean,
        expectedResult: ContentModelSegment[]
    ) {
        spyOn(iterateSelections, 'iterateSelections').and.callFake((_, callback) => {
            selections.forEach(({ path, tableContext, block, segments }) => {
                callback(path, tableContext, block, segments);
            });

            return false;
        });

        const result = getSelectedSegments(null!, includingFormatHolder);

        expect(result).toEqual(expectedResult);
    }

    it('Empty result', () => {
        runTest([], false, []);
    });

    it('Add segments', () => {
        const s1 = createText('test1');
        const s2 = createText('test2');
        const s3 = createText('test3');
        const s4 = createText('test4');
        const p1 = createParagraph();
        const p2 = createParagraph();

        runTest(
            [
                {
                    path: [],
                    block: p1,
                    segments: [s1, s2],
                },
                {
                    path: [],
                    block: p2,
                    segments: [s3, s4],
                },
            ],
            false,
            [s1, s2, s3, s4]
        );
    });

    it('Block with incompatible types', () => {
        const s1 = createText('test1');
        const s2 = createText('test2');
        const s3 = createText('test3');
        const s4 = createText('test4');
        const b1 = createDivider('div');

        runTest(
            [
                {
                    path: [],
                    block: b1,
                    segments: [s1, s2],
                },
                {
                    path: [],
                    segments: [s3, s4],
                },
            ],
            false,
            []
        );
    });

    it('Block with incompatible types, include format holder', () => {
        const s1 = createText('test1');
        const s2 = createText('test2');
        const s3 = createText('test3');
        const s4 = createText('test4');
        const b1 = createDivider('div');

        runTest(
            [
                {
                    path: [],
                    block: b1,
                    segments: [s1, s2],
                },
                {
                    path: [],
                    segments: [s3, s4],
                },
            ],
            true,
            [s3, s4]
        );
    });

    it('Unmeaningful segments should be included', () => {
        const s1 = createText('test1');
        const s2 = createText('test2');
        const s3 = createText('test3');
        const s4 = createText('test4');
        const m1 = createSelectionMarker({ fontSize: '10px' });
        const m2 = createSelectionMarker({ fontSize: '20px' });
        const p1 = createParagraph();
        const p2 = createParagraph();
        const p3 = createParagraph();

        p1.segments.push(s1, m1);
        p2.segments.push(s2, s3);
        p3.segments.push(m2, s4);

        runTest(
            [
                {
                    path: [],
                    block: p1,
                    segments: [m1],
                },
                {
                    path: [],
                    block: p2,
                    segments: [s2, s3],
                },
                {
                    path: [],
                    block: p3,
                    segments: [m2],
                },
            ],
            true,
            [m1, s2, s3, m2]
        );
    });

    it('Include editable entity, but filter out readonly entity', () => {
        const e1 = createEntity(null!, true);
        const e2 = createEntity(null!, false);
        const p1 = createParagraph();

        p1.segments.push(e1, e2);

        runTest(
            [
                {
                    path: [],
                    block: p1,
                    segments: [e1, e2],
                },
            ],
            false,
            [e2]
        );
    });
});
