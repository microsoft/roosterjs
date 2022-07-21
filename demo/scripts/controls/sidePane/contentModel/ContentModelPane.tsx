import * as React from 'react';
import { ContentModelDocument } from 'roosterjs-content-model';
import { safeInstanceOf } from 'roosterjs-editor-dom';
import { SidePaneElementProps } from '../SidePaneElement';
import {
    CompatibleContentModelBlockGroupType,
    CompatibleContentModelBlockType,
    CompatibleContentModelSegmentType,
} from 'roosterjs-content-model/lib/compatibleTypes';

const styles = require('./ContentModelPane.scss');

export interface ContentModelPaneState {
    model: ContentModelDocument;
    serializer: 'raw' | 'friendly';
}

export interface ContentModelPaneProps extends ContentModelPaneState, SidePaneElementProps {
    onUpdateModel: () => ContentModelDocument;
    onCreateDOM: (model: ContentModelDocument) => void;
}

export default class ContentModelPane extends React.Component<
    ContentModelPaneProps,
    ContentModelPaneState
> {
    constructor(props: ContentModelPaneProps) {
        super(props);

        this.state = {
            model: null,
            serializer: props.serializer,
        };
    }

    setContentModel(model: ContentModelDocument) {
        this.setState({
            model: model,
        });
    }

    render() {
        return this.state.model ? (
            <>
                <div>
                    <button onClick={this.onRefresh}>Refresh Content Model</button>&nbsp;
                    <button onClick={this.onCreateDOM}>Create DOM tree</button>
                </div>
                <div>
                    <input
                        type="radio"
                        name="modelSerializer"
                        id="modelSerializerFriendly"
                        onClick={this.onSerializerFriendly}
                        checked={this.state.serializer == 'friendly'}
                    />
                    <label htmlFor="modelSerializerFriendly">Friendly JSON</label>
                    <input
                        type="radio"
                        name="modelSerializer"
                        id="modelSerializerRaw"
                        onClick={this.onSerializerRaw}
                        checked={this.state.serializer == 'raw'}
                    />
                    <label htmlFor="modelSerializerRaw">Raw JSON</label>
                </div>
                <div className={styles.contentModel}>{this.getModelLayout()}</div>
            </>
        ) : null;
    }

    private getModelLayout() {
        switch (this.state.serializer) {
            case 'raw':
                return <pre>{JSON.stringify(this.state.model, null, 2)}</pre>;

            case 'friendly':
                return (
                    <pre>
                        {JSON.stringify(
                            this.state.model,
                            (key, value) => {
                                if (safeInstanceOf(value, 'HTMLElement')) {
                                    return (
                                        Object.prototype.toString.apply(value) +
                                        ': ' +
                                        (value.cloneNode() as HTMLElement).outerHTML
                                    );
                                } else if (safeInstanceOf(value, 'Node')) {
                                    return Object.prototype.toString.apply(value);
                                } else if (key == 'blockType') {
                                    return CompatibleContentModelBlockType[value];
                                } else if (key == 'blockGroupType') {
                                    return CompatibleContentModelBlockGroupType[value];
                                } else if (key == 'segmentType') {
                                    return CompatibleContentModelSegmentType[value];
                                }

                                return value;
                            },
                            2
                        )}
                    </pre>
                );
            default:
                return null;
        }
    }

    private onCreateDOM = () => {
        this.props.onCreateDOM(this.state.model);
    };

    private onRefresh = () => {
        const model = this.props.onUpdateModel();
        this.setContentModel(model);
    };

    private onSerializerFriendly = () => {
        this.setState({
            serializer: 'friendly',
        });
    };

    private onSerializerRaw = () => {
        this.setState({
            serializer: 'raw',
        });
    };
}
