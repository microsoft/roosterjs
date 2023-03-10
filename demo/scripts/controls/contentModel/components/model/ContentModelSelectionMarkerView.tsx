import * as React from 'react';
import { ContentModelCodeView } from './ContentModelCodeView';
import { ContentModelLinkView } from './ContentModelLinkView';
import { ContentModelSelectionMarker } from 'roosterjs-content-model';
import { ContentModelView } from '../ContentModelView';
import { SegmentFormatView } from '../format/SegmentFormatView';

const styles = require('./ContentModelSelectionMarkerView.scss');

export function ContentModelSelectionMarkerView(props: { marker: ContentModelSelectionMarker }) {
    const { marker } = props;

    const getContent = React.useCallback(() => {
        return (
            <>
                {marker.link ? <ContentModelLinkView link={marker.link} /> : null}
                {marker.code ? <ContentModelCodeView code={marker.code} /> : null}
            </>
        );
    }, [marker.link]);

    const getFormat = React.useCallback(() => {
        return <SegmentFormatView format={marker.format} />;
    }, [marker.format]);

    return (
        <ContentModelView
            title="SelectionMarker"
            className={styles.modelSelectionMarker}
            isSelected={true}
            jsonSource={marker}
            getContent={getContent}
            getFormat={getFormat}
        />
    );
}
