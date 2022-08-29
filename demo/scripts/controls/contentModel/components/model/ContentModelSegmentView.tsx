import * as React from 'react';
import { ContentModelBrView } from './ContentModelBrView';
import { ContentModelGeneralView } from './ContentModelGeneralView';
import { ContentModelSegment } from 'roosterjs-content-model';
import { ContentModelSelectionMarkerView } from './ContentModelSelectionMarkerView';
import { ContentModelTextView } from './ContentModelTextView';

export function ContentModelSegmentView(props: { segment: ContentModelSegment }) {
    const { segment } = props;

    switch (segment.segmentType) {
        case 'Br':
            return <ContentModelBrView br={segment} />;

        case 'General':
            return <ContentModelGeneralView model={segment} />;

        case 'SelectionMarker':
            return <ContentModelSelectionMarkerView marker={segment} />;

        case 'Text':
            return <ContentModelTextView text={segment} />;
    }
}
