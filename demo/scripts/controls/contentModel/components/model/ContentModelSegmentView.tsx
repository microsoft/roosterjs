import * as React from 'react';
import { ContentModelBrView } from './ContentModelBrView';
import { ContentModelEntityView } from './ContentModelEntityView';
import { ContentModelGeneralView } from './ContentModelGeneralView';
import { ContentModelImageView } from './ContentModelImageView';
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

        case 'Entity':
            return <ContentModelEntityView entity={segment} />;

        case 'Image':
            return <ContentModelImageView image={segment} />;
    }
}
