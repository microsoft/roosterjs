import { createBr } from '../../../lib/modelApi/creators/createBr';
import { createEntity } from '../../../lib/modelApi/creators/createEntity';
import { createGeneralSegment } from '../../../lib/modelApi/creators/createGeneralSegment';
import { createImage } from '../../../lib/modelApi/creators/createImage';
import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { createSelectionMarker } from '../../../lib/modelApi/creators/createSelectionMarker';
import { createText } from '../../../lib/modelApi/creators/createText';
import { deleteSegment } from '../../../lib/modelApi/editing/deleteSegment';
import {
    FormatContentModelContext,
    ShallowMutableContentModelSegment,
} from 'roosterjs-content-model-types';

describe('nothing to delete', () => {
    it('empty paragraph', () => {
        const paragraph = createParagraph();
        const segment = createText('abc');

        deleteSegment(paragraph, segment);

        expect(paragraph.segments.length).toBe(0);
    });

    it('paragraph has segments, deleting segment is not in it', () => {
        const paragraph = createParagraph();
        const segment = createText('abc');
        const segment2 = createText('123');

        paragraph.segments.push(segment2);

        deleteSegment(paragraph, segment);

        expect(paragraph.segments).toEqual([segment2]);
    });

    it('paragraph has segments, deleting segment is in it, not selected', () => {
        const paragraph = createParagraph();
        const segment = createText('abc');
        const segment2 = createText('123');

        paragraph.segments.push(segment, segment2);

        deleteSegment(paragraph, segment);

        expect(paragraph.segments).toEqual([segment, segment2]);
    });
});

describe('delete text segment', () => {
    it('paragraph has segments, deleting segment is in it, selected', () => {
        const paragraph = createParagraph();
        const segment = createText('abc');
        const segment2 = createText('123');

        paragraph.segments.push(segment, segment2);

        segment.isSelected = true;

        deleteSegment(paragraph, segment);

        expect(paragraph.segments).toEqual([segment2]);
        expect(segment.isSelected).toBeTruthy();
    });

    it('unselected, no direction', () => {
        const paragraph = createParagraph();
        const segment = createText(
            'test',
            {},
            {
                dataset: {},
                format: {
                    name: 'name',
                    undeletable: true,
                },
            }
        );
        const segment2 = createText('123');

        paragraph.segments.push(segment, segment2);

        deleteSegment(paragraph, segment);

        expect(paragraph.segments).toEqual([segment, segment2]);
        expect(segment.text).toBe('test');
    });

    it('unselected, forward', () => {
        const paragraph = createParagraph();
        const segment = createText('abc');
        const segment2 = createText('123');

        paragraph.segments.push(segment, segment2);

        // delete 1
        deleteSegment(paragraph, segment, undefined, 'forward');

        expect(paragraph.segments).toEqual([segment, segment2]);
        expect(segment.text).toBe('bc');

        // delete 2
        deleteSegment(paragraph, segment, undefined, 'forward');

        expect(paragraph.segments).toEqual([segment, segment2]);
        expect(segment.text).toBe('c');

        // delete 3, segment becomes empty, remove it from the paragraph
        deleteSegment(paragraph, segment, undefined, 'forward');

        expect(paragraph.segments).toEqual([segment2]);
        expect(segment.text).toBe('');
    });

    it('unselected, backward', () => {
        const paragraph = createParagraph();
        const segment = createText('abc');
        const segment2 = createText('123');

        paragraph.segments.push(segment2, segment);

        // delete 1
        deleteSegment(paragraph, segment, undefined, 'backward');

        expect(paragraph.segments).toEqual([segment2, segment]);
        expect(segment.text).toBe('ab');

        // delete 2
        deleteSegment(paragraph, segment, undefined, 'backward');

        expect(paragraph.segments).toEqual([segment2, segment]);
        expect(segment.text).toBe('a');

        // delete 3, segment becomes empty, remove it from the paragraph
        deleteSegment(paragraph, segment, undefined, 'backward');

        expect(paragraph.segments).toEqual([segment2]);
        expect(segment.text).toBe('');
    });
});

describe('delete entity segment', () => {
    it('paragraph has segments, deleting entity, not selected', () => {
        const paragraph = createParagraph();
        const segment = createEntity(document.createElement('div'));
        const segment2 = createText('123');

        paragraph.segments.push(segment, segment2);

        deleteSegment(paragraph, segment);

        expect(paragraph.segments).toEqual([segment, segment2]);
    });

    it('paragraph has segments, deleting entity, selected', () => {
        const paragraph = createParagraph();
        const segment = createEntity(document.createElement('div'));
        const segment2 = createText('123');

        segment.isSelected = true;

        paragraph.segments.push(segment, segment2);

        deleteSegment(paragraph, segment);

        expect(paragraph.segments).toEqual([segment2]);
    });

    it('paragraph has segments, deleting entity, has context, forward, no selection', () => {
        const paragraph = createParagraph();
        const segment = createEntity(document.createElement('div'));
        const segment2 = createText('123');
        const context: FormatContentModelContext = {
            deletedEntities: [],
        } as any;

        paragraph.segments.push(segment, segment2);

        deleteSegment(paragraph, segment, context, 'forward');

        expect(paragraph.segments).toEqual([segment2]);
        expect(context.deletedEntities).toEqual([
            {
                entity: segment,
                operation: 'removeFromStart',
            },
        ]);
    });

    it('paragraph has segments, deleting entity, has context, backword, no selection', () => {
        const paragraph = createParagraph();
        const segment = createEntity(document.createElement('div'));
        const segment2 = createText('123');
        const context: FormatContentModelContext = {
            deletedEntities: [],
        } as any;

        paragraph.segments.push(segment, segment2);

        deleteSegment(paragraph, segment, context, 'backward');

        expect(paragraph.segments).toEqual([segment2]);
        expect(context.deletedEntities).toEqual([
            {
                entity: segment,
                operation: 'removeFromEnd',
            },
        ]);
    });

    it('paragraph has segments, deleting entity, has context, forward, has selection', () => {
        const paragraph = createParagraph();
        const segment = createEntity(document.createElement('div'));
        const segment2 = createText('123');
        const context: FormatContentModelContext = {
            deletedEntities: [],
        } as any;

        segment.isSelected = true;

        paragraph.segments.push(segment, segment2);

        deleteSegment(paragraph, segment, context, 'forward');

        expect(paragraph.segments).toEqual([segment2]);
        expect(context.deletedEntities).toEqual([
            {
                entity: segment,
                operation: 'overwrite',
            },
        ]);
    });

    it('paragraph has segments, deleting entity, has context, backward, has selection', () => {
        const paragraph = createParagraph();
        const segment = createEntity(document.createElement('div'));
        const segment2 = createText('123');
        const context: FormatContentModelContext = {
            deletedEntities: [],
        } as any;

        segment.isSelected = true;

        paragraph.segments.push(segment, segment2);

        deleteSegment(paragraph, segment, context, 'backward');

        expect(paragraph.segments).toEqual([segment2]);
        expect(context.deletedEntities).toEqual([
            {
                entity: segment,
                operation: 'overwrite',
            },
        ]);
    });
});

describe('delete other segment types', () => {
    it('paragraph has segments, deleting br', () => {
        const paragraph = createParagraph();
        const segment = createBr();
        const segment2 = createText('123');

        paragraph.segments.push(segment, segment2);

        segment.isSelected = true;

        deleteSegment(paragraph, segment);

        expect(paragraph.segments).toEqual([segment2]);
    });

    it('paragraph has segments, deleting image', () => {
        const paragraph = createParagraph();
        const segment = createImage('src');
        const segment2 = createText('123');

        paragraph.segments.push(segment, segment2);

        segment.isSelected = true;

        deleteSegment(paragraph, segment);

        expect(paragraph.segments).toEqual([segment2]);
    });

    it('paragraph has segments, deleting general segment, not selected', () => {
        const paragraph = createParagraph();
        const segment = createGeneralSegment(document.createElement('span'));
        const segment2 = createText('123');

        paragraph.segments.push(segment, segment2);

        deleteSegment(paragraph, segment);

        expect(paragraph.segments).toEqual([segment, segment2]);
    });

    it('paragraph has segments, deleting general segment, selected', () => {
        const paragraph = createParagraph();
        const segment = createGeneralSegment(document.createElement('span'));
        const segment2 = createText('123');

        segment.isSelected = true;

        paragraph.segments.push(segment, segment2);

        deleteSegment(paragraph, segment);

        expect(paragraph.segments).toEqual([segment2]);
    });
});

describe('delete undeletable segment', () => {
    it('undeletable segment, no direction, no undeletableSegments array passed in', () => {
        const paragraph = createParagraph();
        const segment = createText(
            'test',
            {},
            {
                dataset: {},
                format: {
                    name: 'name',
                    undeletable: true,
                },
            }
        );
        const segment2 = createText('123');

        segment.isSelected = true;

        paragraph.segments.push(segment, segment2);

        deleteSegment(paragraph, segment);

        expect(paragraph.segments).toEqual([segment, segment2]);
        expect(segment.text).toBe('');
    });

    it('undeletable segment, no direction, has undeletableSegments array passed in', () => {
        const paragraph = createParagraph();
        const segment = createText(
            'test',
            {},
            {
                dataset: {},
                format: {
                    name: 'name',
                    undeletable: true,
                },
            }
        );
        const segment2 = createText('123');

        segment.isSelected = true;

        paragraph.segments.push(segment, segment2);

        const undeletable: ShallowMutableContentModelSegment[] = [];

        deleteSegment(paragraph, segment, undefined, undefined, undeletable);

        expect(paragraph.segments).toEqual([segment2]);
        expect(segment.text).toBe('');
        expect(undeletable).toEqual([segment]); // The undeletable segment is added to the undeletable array
        expect(segment.isSelected).toBeFalsy();
    });

    // Forward direction tests

    it('undeletable segment, forward, no undeletableSegments array passed in, no selection marker', () => {
        const paragraph = createParagraph();
        const segment = createText(
            'abc',
            {},
            {
                dataset: {},
                format: {
                    name: 'name',
                    undeletable: true,
                },
            }
        );
        const segment2 = createText('123');

        paragraph.segments.push(segment, segment2);

        // delete 1
        deleteSegment(paragraph, segment, undefined, 'forward');

        expect(paragraph.segments).toEqual([segment, segment2]);
        expect(segment.text).toBe('bc');

        // delete 2
        deleteSegment(paragraph, segment, undefined, 'forward');

        expect(paragraph.segments).toEqual([segment, segment2]);
        expect(segment.text).toBe('c');

        // delete 3, segment becomes empty, move it before the cursor since it is undeletable
        deleteSegment(paragraph, segment, undefined, 'forward');

        expect(paragraph.segments).toEqual([segment, segment2]);
        expect(segment.text).toBe('');
        expect(segment.isSelected).toBeFalsy();
    });

    it('undeletable segment, forward, no undeletableSegments array passed in, has selection marker', () => {
        const paragraph = createParagraph();
        const marker = createSelectionMarker();
        const segment = createText(
            'abc',
            {},
            {
                dataset: {},
                format: {
                    name: 'name',
                    undeletable: true,
                },
            }
        );
        const segment2 = createText('123');

        paragraph.segments.push(marker, segment, segment2);

        // delete 1
        deleteSegment(paragraph, segment, undefined, 'forward');

        expect(paragraph.segments).toEqual([marker, segment, segment2]);
        expect(segment.text).toBe('bc');

        // delete 2
        deleteSegment(paragraph, segment, undefined, 'forward');

        expect(paragraph.segments).toEqual([marker, segment, segment2]);
        expect(segment.text).toBe('c');

        // delete 3, segment becomes empty, move it before the cursor since it is undeletable
        deleteSegment(paragraph, segment, undefined, 'forward');

        expect(paragraph.segments).toEqual([segment, marker, segment2]);
        expect(segment.text).toBe('');
        expect(segment.isSelected).toBeFalsy();
    });

    it('undeletable segment, forward, has undeletableSegments array passed in', () => {
        const paragraph = createParagraph();
        const marker = createSelectionMarker();
        const segment = createText(
            'abc',
            {},
            {
                dataset: {},
                format: {
                    name: 'name',
                    undeletable: true,
                },
            }
        );
        const segment2 = createText('123');

        paragraph.segments.push(marker, segment, segment2);

        const undeletable: ShallowMutableContentModelSegment[] = [];

        // delete 1
        deleteSegment(paragraph, segment, undefined, 'forward', undeletable);

        expect(paragraph.segments).toEqual([marker, segment, segment2]);
        expect(segment.text).toBe('bc');
        expect(undeletable).toEqual([]);

        // delete 2
        deleteSegment(paragraph, segment, undefined, 'forward', undeletable);

        expect(paragraph.segments).toEqual([marker, segment, segment2]);
        expect(segment.text).toBe('c');
        expect(undeletable).toEqual([]);

        // delete 3, segment becomes empty, move it before the cursor since it is undeletable
        deleteSegment(paragraph, segment, undefined, 'forward', undeletable);

        expect(paragraph.segments).toEqual([marker, segment2]);
        expect(segment.text).toBe('');
        expect(undeletable).toEqual([segment]); // The undeletable segment is added to the undeletable array
        expect(segment.isSelected).toBeFalsy();
    });

    // Backward direction tests

    it('undeletable segment, backward, no undeletableSegments array passed in, no selection marker', () => {
        const paragraph = createParagraph();
        const segment = createText(
            'abc',
            {},
            {
                dataset: {},
                format: {
                    name: 'name',
                    undeletable: true,
                },
            }
        );
        const segment2 = createText('123');

        paragraph.segments.push(segment2, segment);

        // delete 1
        deleteSegment(paragraph, segment, undefined, 'backward');

        expect(paragraph.segments).toEqual([segment2, segment]);
        expect(segment.text).toBe('ab');

        // delete 2
        deleteSegment(paragraph, segment, undefined, 'backward');

        expect(paragraph.segments).toEqual([segment2, segment]);
        expect(segment.text).toBe('a');

        // delete 3, segment becomes empty, move it before the cursor since it is undeletable
        deleteSegment(paragraph, segment, undefined, 'backward');

        expect(paragraph.segments).toEqual([segment2, segment]);
        expect(segment.text).toBe('');
        expect(segment.isSelected).toBeFalsy();
    });

    it('undeletable segment, backward, no undeletableSegments array passed in, has selection marker', () => {
        const paragraph = createParagraph();
        const marker = createSelectionMarker();
        const segment = createText(
            'abc',
            {},
            {
                dataset: {},
                format: {
                    name: 'name',
                    undeletable: true,
                },
            }
        );
        const segment2 = createText('123');

        paragraph.segments.push(segment2, segment, marker);

        // delete 1
        deleteSegment(paragraph, segment, undefined, 'backward');

        expect(paragraph.segments).toEqual([segment2, segment, marker]);
        expect(segment.text).toBe('ab');

        // delete 2
        deleteSegment(paragraph, segment, undefined, 'backward');

        expect(paragraph.segments).toEqual([segment2, segment, marker]);
        expect(segment.text).toBe('a');

        // delete 3, segment becomes empty, move it before the cursor since it is undeletable
        deleteSegment(paragraph, segment, undefined, 'backward');

        expect(paragraph.segments).toEqual([segment2, marker, segment]);
        expect(segment.text).toBe('');
        expect(segment.isSelected).toBeFalsy();
    });

    it('undeletable segment, backward, has undeletableSegments array passed in', () => {
        const paragraph = createParagraph();
        const marker = createSelectionMarker();
        const segment = createText(
            'abc',
            {},
            {
                dataset: {},
                format: {
                    name: 'name',
                    undeletable: true,
                },
            }
        );
        const segment2 = createText('123');

        paragraph.segments.push(segment2, segment, marker);

        const undeletable: ShallowMutableContentModelSegment[] = [];

        // delete 1
        deleteSegment(paragraph, segment, undefined, 'backward', undeletable);

        expect(paragraph.segments).toEqual([segment2, segment, marker]);
        expect(segment.text).toBe('ab');
        expect(undeletable).toEqual([]);

        // delete 2
        deleteSegment(paragraph, segment, undefined, 'backward', undeletable);

        expect(paragraph.segments).toEqual([segment2, segment, marker]);
        expect(segment.text).toBe('a');
        expect(undeletable).toEqual([]);

        // delete 3, segment becomes empty, move it before the cursor since it is undeletable
        deleteSegment(paragraph, segment, undefined, 'backward', undeletable);

        expect(paragraph.segments).toEqual([segment2, marker]);
        expect(segment.text).toBe('');
        expect(undeletable).toEqual([segment]); // The undeletable segment is added to the undeletable array
        expect(segment.isSelected).toBeFalsy();
    });
});
