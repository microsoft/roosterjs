import * as React from 'react';
import { ContentModelSelectionMarker } from 'roosterjs-content-model';
import { ContentModelView } from '../ContentModelView';
import { LinkFormatView } from '../format/LinkFormatView';
import { SegmentFormatView } from '../format/SegmentFormatView';

const styles = require('./ContentModelSelectionMarkerView.scss');

export function ContentModelSelectionMarkerView(props: { marker: ContentModelSelectionMarker }) {
    const { marker } = props;

    const getFormat = React.useCallback(() => {
        return (
            <>
                <SegmentFormatView format={marker.format} />
                {marker.link && <LinkFormatView format={marker.link} />}
            </>
        );
    }, [marker.format]);

    return (
        <ContentModelView
            title="SelectionMarker"
            className={styles.modelSelectionMarker}
            isSelected={true}
            jsonSource={marker}
            getFormat={getFormat}
        />
    );
}
