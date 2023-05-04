import * as React from 'react';
import { ContentModelCode, ContentModelCodeFormat } from 'roosterjs-content-model';
import { ContentModelView } from '../ContentModelView';
import { DisplayFormatRenderer } from '../format/formatPart/DisplayFormatRenderer';
import { FontFamilyFormatRenderer } from '../format/formatPart/FontFamilyFormatRenderer';
import { FormatRenderer } from '../format/utils/FormatRenderer';
import { FormatView } from '../format/FormatView';

const CodeRenderers: FormatRenderer<ContentModelCodeFormat>[] = [
    FontFamilyFormatRenderer,
    DisplayFormatRenderer,
];

const styles = require('./ContentModelCodeView.scss');

export function ContentModelCodeView(props: { code: ContentModelCode }) {
    const { code } = props;

    const getFormat = React.useCallback(() => {
        return <FormatView format={code.format} renderers={CodeRenderers} />;
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
