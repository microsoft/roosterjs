import * as React from 'react';
import { ContentModelDocument } from 'roosterjs-content-model';
import { formatTable } from './buttons/formatTable';
import { getExportButton } from './buttons/export';
import { getRefreshButton } from './buttons/refresh';
import { insertTable } from './buttons/insertTable';
import { Ribbon, RibbonButton, RibbonPlugin } from 'roosterjs-react';
import { safeInstanceOf } from 'roosterjs-editor-dom';
import { SidePaneElementProps } from '../SidePaneElement';

const styles = require('./ContentModelPane.scss');

export interface ContentModelPaneState {
    model: ContentModelDocument;
}

export interface ContentModelPaneProps extends ContentModelPaneState, SidePaneElementProps {
    onUpdateModel: () => ContentModelDocument;
    onCreateDOM: (model: ContentModelDocument) => void;
    ribbonPlugin: RibbonPlugin;
}

export default class ContentModelPane extends React.Component<
    ContentModelPaneProps,
    ContentModelPaneState
> {
    private contentModelButtons: RibbonButton<any>[];

    constructor(props: ContentModelPaneProps) {
        super(props);

        this.contentModelButtons = [
            getRefreshButton(this.onRefresh),
            getExportButton(this.onCreateDOM),
            insertTable,
            formatTable,
        ];

        this.state = {
            model: null,
        };
    }

    setContentModel(model: ContentModelDocument) {
        this.setState({
            model: model,
        });
    }

    render() {
        return (
            <>
                <Ribbon buttons={this.contentModelButtons} plugin={this.props.ribbonPlugin} />
                {this.state.model ? (
                    <>
                        <div className={styles.contentModel}>
                            <pre>
                                {JSON.stringify(
                                    this.state.model,
                                    (key, value) => {
                                        return safeInstanceOf(value, 'Node')
                                            ? Object.prototype.toString.apply(value)
                                            : value;
                                    },
                                    2
                                )}
                            </pre>
                        </div>
                    </>
                ) : null}
            </>
        );
    }

    private onCreateDOM = () => {
        this.props.onCreateDOM(this.state.model);
    };

    private onRefresh = () => {
        const model = this.props.onUpdateModel();
        this.setContentModel(model);
    };
}
