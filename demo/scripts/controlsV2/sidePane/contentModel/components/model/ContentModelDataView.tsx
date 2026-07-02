import * as React from 'react';
import { ContentModelData, ContentModelDataFormat } from 'roosterjs-content-model-types';
import { ContentModelView } from '../ContentModelView';
import { DataValueFormatRenderer } from '../format/formatPart/DataValueFormatRenderer';
import { FormatRenderer } from '../format/utils/FormatRenderer';
import { FormatView } from '../format/FormatView';

const DataRenderers: FormatRenderer<ContentModelDataFormat>[] = [DataValueFormatRenderer];

const styles = require('./ContentModelDataView.scss');

export function ContentModelDataView(props: { data: ContentModelData }) {
    const { data } = props;

    const getFormat = React.useCallback(() => {
        return <FormatView format={data.format} renderers={DataRenderers} />;
    }, [data.format]);

    return (
        <ContentModelView
            title="Data"
            subTitle={data.format.dataValue}
            className={styles.modelData}
            jsonSource={data}
            getFormat={getFormat}
        />
    );
}
