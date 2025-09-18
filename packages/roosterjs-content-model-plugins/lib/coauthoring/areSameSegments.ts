import { segmentsWithSameFormat } from 'roosterjs-content-model-dom';
import type {
    ContentModelImageCommon,
    ContentModelTextCommon,
    ReadonlyContentModelSegment,
    SelectionMarkerCommon,
} from 'roosterjs-content-model-types';

const keyOfContentModelImageCommon: (keyof Required<ContentModelImageCommon>)[] = [
    'src',
    'alt',
    'title',
    'isSelectedAsImageSelection',
];

const keyOfContentModelSelectionMarkerCommon: (keyof Required<SelectionMarkerCommon>)[] = ['owner'];

const keyOfContentModelTextCommon: (keyof ContentModelTextCommon)[] = ['text'];

/**
 * @internal
 */
export function areSameSegments(
    seg1: ReadonlyContentModelSegment,
    seg2: ReadonlyContentModelSegment
) {
    if (seg1 == seg2) {
        return true;
    } else if (segmentsWithSameFormat(seg1, seg2) && !!seg1.isSelected == !!seg2.isSelected) {
        switch (seg1.segmentType) {
            case 'Br':
                return seg2.segmentType == 'Br';
            case 'Image':
                return (
                    seg2.segmentType == 'Image' &&
                    keyOfContentModelImageCommon.every(key => seg1[key] == seg2[key])
                );
            case 'SelectionMarker':
                return (
                    seg2.segmentType == 'SelectionMarker' &&
                    keyOfContentModelSelectionMarkerCommon.every(key => seg1[key] == seg2[key])
                );
            case 'Text':
                return (
                    seg2.segmentType == 'Text' &&
                    keyOfContentModelTextCommon.every(key => seg1[key] == seg2[key])
                );

            case 'General':
            case 'Entity':
                // TODO: handle entity and general segment
                return false;
        }
    } else {
        return false;
    }
}
