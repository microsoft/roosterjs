import * as React from 'react';
import { BlockFormatView } from '../format/BlockFormatView';
import { ContentModelHR } from 'roosterjs-content-model';
import { ContentModelView } from '../ContentModelView';

const styles = require('./ContentModelHRView.scss');

export function ContentModelHRView(props: { hr: ContentModelHR }) {
    const { hr } = props;

    const getFormat = React.useCallback(() => {
        return <BlockFormatView format={hr.format} />;
    }, [hr.format]);

    return (
        <ContentModelView
            title="HR"
            className={styles.modelHR}
            isSelected={hr.isSelected}
            jsonSource={hr}
            getFormat={getFormat}
        />
    );
}
