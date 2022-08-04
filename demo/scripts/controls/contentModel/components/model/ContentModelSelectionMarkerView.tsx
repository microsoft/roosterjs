import * as React from 'react';
import { ContentModelSelectionMarker } from 'roosterjs-content-model';
import { ContentModelView } from '../ContentModelView';

const styles = require('./ContentModelSelectionMarkerView.scss');

export function ContentModelSelectionMarkerView(props: { marker: ContentModelSelectionMarker }) {
    const { marker } = props;

    return (
        <ContentModelView
            title="SelectionMarker"
            className={styles.modelSelectionMarker}
            isSelected={true}
            jsonSource={marker}
        />
    );
}
