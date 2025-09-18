import { areSameFormats } from '../../domToModel/utils/areSameFormats';
import type {
    ContentModelImageCommon,
    ContentModelTextCommon,
    ReadonlyContentModelCode,
    ReadonlyContentModelLink,
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

/**
 * Check if two segments have the same format and decorators
 * @param seg1 The first segment to compare
 * @param seg2 The second segment to compare
 * @returns True if they have the same format and decorators, false otherwise
 */
export function segmentsWithSameFormat(
    seg1: ReadonlyContentModelSegment,
    seg2: ReadonlyContentModelSegment
) {
    return (
        !!seg1.isSelected == !!seg2.isSelected &&
        areSameFormats(seg1.format, seg2.format) &&
        areSameLinks(seg1.link, seg2.link) &&
        areSameCodes(seg1.code, seg2.code)
    );
}

function areSameLinks(
    link1: ReadonlyContentModelLink | undefined,
    link2: ReadonlyContentModelLink | undefined
) {
    return (
        (!link1 && !link2) ||
        (link1 &&
            link2 &&
            areSameFormats(link1.format, link2.format) &&
            areSameFormats(link1.dataset, link2.dataset))
    );
}

function areSameCodes(
    code1: ReadonlyContentModelCode | undefined,
    code2: ReadonlyContentModelCode | undefined
) {
    return (!code1 && !code2) || (code1 && code2 && areSameFormats(code1.format, code2.format));
}
