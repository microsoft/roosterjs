import * as React from 'react';
import { ContentModelCode } from 'roosterjs-content-model';
import { ContentModelView } from '../ContentModelView';
import { FontFamilyFormatRenderer } from '../format/formatPart/FontFamilyFormatRenderer';
import { FormatView } from '../format/FormatView';

const styles = require('./ContentModelCodeView.scss');

export function ContentModelCodeView(props: { code: ContentModelCode }) {
    const { code } = props;

    const getFormat = React.useCallback(() => {
        return <FormatView format={code.format} renderers={[FontFamilyFormatRenderer]} />;
    }, [code.format]);

    return (
        <ContentModelView
            title="Code"
            className={styles.modelCode}
            jsonSource={code}
            getFormat={getFormat}
        />
    );
}
