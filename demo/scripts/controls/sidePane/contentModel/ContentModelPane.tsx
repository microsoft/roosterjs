import * as React from 'react';
import { ContentModelDocument } from 'roosterjs-content-model';
import { exportButton } from './buttons/exportButton';
import { formatTableButton } from './buttons/formatTableButton';
import { insertTableButton } from './buttons/insertTableButton';
import { refreshButton } from './buttons/refreshButton';
import { Ribbon, RibbonButton, RibbonPlugin } from 'roosterjs-react';
import { safeInstanceOf } from 'roosterjs-editor-dom';
import { SidePaneElementProps } from '../SidePaneElement';

const styles = require('./ContentModelPane.scss');

export interface ContentModelPaneState {
    model: ContentModelDocument;
}

export interface ContentModelPaneProps extends ContentModelPaneState, SidePaneElementProps {
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
            refreshButton,
            exportButton,
            insertTableButton,
            formatTableButton,
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
}
