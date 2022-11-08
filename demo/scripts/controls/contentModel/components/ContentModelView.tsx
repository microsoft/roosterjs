import * as React from 'react';
import { ButtonGroup } from './ButtonGroup';
import { ContentModelJson } from './model/ContentModelJson';
import { ContentModelWithDataset, DatasetFormat } from 'roosterjs-content-model';
import { css } from '@fluentui/react/lib/Utilities';
import { getObjectKeys } from 'roosterjs-editor-dom';
import { useProperty } from '../hooks/useProperty';

const styles = require('./ContentModelView.scss');
const MetadataKey = 'editingInfo';

export function ContentModelView(props: {
    className: string;
    title: string;
    subTitle?: string;
    hasSelection?: boolean;
    isSelected?: boolean;
    jsonSource: Object;
    getContent?: (() => JSX.Element) | null;
    getFormat?: (() => JSX.Element) | null;
    getMetadata?: (() => JSX.Element) | null;
    isExpanded?: boolean;
}) {
    const {
        title,
        subTitle,
        isExpanded,
        className,
        hasSelection,
        isSelected: isSelection,
        jsonSource,
        getContent,
        getFormat,
        getMetadata,
    } = props;
    const [bodyState, setBodyState] = useProperty<
        'collapsed' | 'children' | 'format' | 'json' | 'dataset'
    >(isExpanded ? 'children' : 'collapsed');

    const toggleVisual = React.useCallback(() => {
        setBodyState(bodyState == 'children' ? 'collapsed' : 'children');
    }, [bodyState]);

    const toggleFormat = React.useCallback(() => {
        setBodyState(bodyState == 'format' ? 'collapsed' : 'format');
    }, [bodyState]);

    const toggleJson = React.useCallback(() => {
        setBodyState(bodyState == 'json' ? 'collapsed' : 'json');
    }, [bodyState]);

    const toggleDataset = React.useCallback(() => {
        setBodyState(bodyState == 'dataset' ? 'collapsed' : 'dataset');
    }, [bodyState]);

    const dataset = (jsonSource as ContentModelWithDataset<any>).dataset;

    return (
        <div
            className={css(styles.modelWrapper, className, {
                [styles.childSelected]: hasSelection,
                [styles.selected]: isSelection,
            })}>
            <div className={styles.titleBar}>
                <div
                    className={css(styles.title, {
                        [styles.titleWithBorder]: bodyState != 'collapsed',
                    })}>
                    {title}
                </div>
                <div className={styles.buttonGroup}>
                    <ButtonGroup
                        hasContent={!!getContent}
                        hasFormat={!!getFormat}
                        hasDataset={!!dataset}
                        bodyState={bodyState}
                        toggleJson={toggleJson}
                        toggleFormat={toggleFormat}
                        toggleVisual={toggleVisual}
                        toggleMetadata={toggleDataset}
                    />
                </div>
                <div
                    className={css(styles.subTitle, {
                        [styles.titleWithBorder]: bodyState != 'collapsed',
                    })}
                    title={subTitle || ''}>
                    {subTitle || '\u00a0'}
                </div>
            </div>
            {bodyState == 'json' ? (
                <div className={styles.expandedBody}>
                    <ContentModelJson jsonSource={jsonSource} />
                </div>
            ) : bodyState == 'children' && !!getContent ? (
                <div className={styles.expandedBody}>{getContent()}</div>
            ) : bodyState == 'format' && !!getFormat ? (
                <div className={styles.expandedBody}>{getFormat()}</div>
            ) : bodyState == 'dataset' && !!dataset ? (
                <div className={styles.expandedBody}>
                    <DatasetView dataset={dataset} getMetadata={getMetadata} />
                </div>
            ) : null}
        </div>
    );
}

function DatasetView(props: { dataset: DatasetFormat; getMetadata?: (() => JSX.Element) | null }) {
    const { dataset, getMetadata } = props;

    return (
        <>
            {getObjectKeys(dataset).map(name =>
                !getMetadata || name != MetadataKey ? (
                    <DatasetItemView dataset={dataset} name={name} />
                ) : null
            )}
            {getMetadata ? (
                <>
                    <div>Metadata:</div>
                    {getMetadata()}
                </>
            ) : null}
        </>
    );
}

function DatasetItemView(props: { dataset: DatasetFormat; name: string }) {
    const { dataset, name } = props;
    const [value, setValue] = useProperty(dataset[name]);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const onChange = React.useCallback(() => {
        const newValue = inputRef.current.value;
        dataset[name] = newValue;
        setValue(newValue);
    }, [value, setValue]);

    return (
        <div>
            {name}
            <input type="text" ref={inputRef} value={value} onChange={onChange} />
        </div>
    );
}

function DatasetView(props: { dataset: DatasetFormat; getMetadata?: (() => JSX.Element) | null }) {
    const { dataset, getMetadata } = props;

    return (
        <>
            {getObjectKeys(dataset).map(name =>
                !getMetadata || name != MetadataKey ? (
                    <DatasetItemView dataset={dataset} name={name} />
                ) : null
            )}
            <div>Metadata:</div>
            {getMetadata?.()}
        </>
    );
}

function DatasetItemView(props: { dataset: DatasetFormat; name: string }) {
    const { dataset, name } = props;
    const [value, setValue] = useProperty(dataset[name]);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const onChange = React.useCallback(() => {
        const newValue = inputRef.current.value;
        dataset[name] = newValue;
        setValue(newValue);
    }, [value, setValue]);

    return (
        <div>
            {name}
            <input type="text" ref={inputRef} value={value} onChange={onChange} />
        </div>
    );
}
