import * as React from 'react';
import { ContentModelBr } from 'roosterjs-content-model';
import { ContentModelView } from '../ContentModelView';
import { SegmentFormatView } from '../format/SegmentFormatView';

const styles = require('./ContentModelBrView.scss');

export function ContentModelBrView(props: { br: ContentModelBr }) {
    const { br } = props;
    const getFormat = React.useCallback(() => {
        return <SegmentFormatView format={br.format} />;
    }, [br.format]);

    return (
        <ContentModelView
            title="BR"
            className={styles.modelBr}
            isSelected={br.isSelected}
            jsonSource={br}
            getFormat={getFormat}
        />
    );
}
