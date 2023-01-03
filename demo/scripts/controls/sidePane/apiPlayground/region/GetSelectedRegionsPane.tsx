import * as React from 'react';
import ApiPaneProps from '../ApiPaneProps';
import { ExperimentalFeatures, IEditor, PositionType, Region } from 'roosterjs-editor-types';
import {
    createRange,
    getSelectedBlockElementsInRegion,
    getTagOfNode,
    safeInstanceOf,
} from 'roosterjs-editor-dom';

const styles = require('./GetSelectedRegionsPane.scss');

interface GetSelectedRegionsPaneState {
    regions: Region[];
}

export default class GetSelectedRegionsPane extends React.Component<
    ApiPaneProps,
    GetSelectedRegionsPaneState
> {
    constructor(props: ApiPaneProps) {
        super(props);
        this.state = { regions: [] };
    }

    render() {
        const editor = this.props.getEditor();
        return (
            <>
                <div>
                    <button onClick={this.getSelectedRegions}>Get Selected Regions</button>&nbsp;
                    <button onClick={this.clearAll}>Clear</button>
                </div>
                <div>
                    {this.state.regions.map((region, i) => (
                        <Region key={i} region={region} editor={editor} index={i} />
                    ))}
                </div>
            </>
        );
    }

    private getSelectedRegions = () => {
        this.setState({
            regions: this.props.getEditor().getSelectedRegions(),
        });
    };

    private clearAll = () => {
        this.setState({
            regions: [],
        });
    };
}

function Region({ region, editor, index }: { region: Region; editor: IEditor; index: number }) {
    const selectRegion = React.useCallback(() => {
        const blocks = getSelectedBlockElementsInRegion(
            region,
            undefined /* createBlockIfEmpty */,
            editor.isFeatureEnabled(ExperimentalFeatures.DefaultFormatInSpan)
        );
        if (blocks.length > 0) {
            const range = createRange(
                blocks[0].getStartNode(),
                PositionType.Begin,
                blocks[blocks.length - 1].getEndNode(),
                PositionType.End
            );
            editor.focus();
            editor.select(range);
        }
    }, [region]);

    return (
        <div>
            <hr />
            <div>
                <b>Region {index}</b>
            </div>
            <div>
                Root node: <NodeName node={region.rootNode} />
            </div>
            <div>
                Node Before: <NodeName node={region.nodeBefore} />
            </div>
            <div>
                Node After: <NodeName node={region.nodeAfter} />
            </div>
            <div>
                Selected blocks: <button onClick={selectRegion}>Select</button>
            </div>
        </div>
    );
}

function NodeName({ node }: { node: Node }) {
    const mouseOver = React.useCallback(() => {
        if (safeInstanceOf(node, 'HTMLElement')) {
            node.className += ' ' + styles.hover;
        }
    }, [node]);

    const mouseOut = React.useCallback(() => {
        if (safeInstanceOf(node, 'HTMLElement')) {
            let classNames = node.className.split(' ');
            classNames = classNames.filter(name => name != styles.hover);
            node.className = classNames.join(' ').trim();
        }
    }, [node]);

    return node ? (
        safeInstanceOf(node, 'HTMLElement') ? (
            <span onMouseOver={mouseOver} onMouseOut={mouseOut} className={styles.regionNode}>
                {getTagOfNode(node)}#{node.id}
            </span>
        ) : (
            <span className={styles.regionNode}>{node.nodeValue.substr(0, 10)}</span>
        )
    ) : null;
}
