import * as React from 'react';
import ApiPaneProps from '../ApiPaneProps';
import VListItem from 'roosterjs-editor-dom/lib/list/VListItem';
import { createVListFromRegion, VList } from 'roosterjs-editor-dom';
import { ExperimentalFeatures, IEditor, ListType, PositionType } from 'roosterjs-editor-types';

interface VListPaneState {
    vlist: VList;
}

const ListTypeToString = {
    [ListType.None]: 'None',
    [ListType.Ordered]: 'Ordered',
    [ListType.Unordered]: 'Unordered',
};

function VListItemPane(props: { editor: IEditor; item: VListItem; onChange: () => void }) {
    const { item, editor, onChange } = props;
    const type = item.getListType();

    const onMouseOver = React.useCallback(() => {
        const node = item.getNode();
        editor.select(node);
    }, [props.item, editor]);

    const onOrdered = React.useCallback(() => {
        item.changeListType(ListType.Ordered);
        onChange();
    }, [props.item, editor]);
    const onUnrdered = React.useCallback(() => {
        item.changeListType(ListType.Unordered);
        onChange();
    }, [props.item, editor]);
    const onIndent = React.useCallback(() => {
        item.indent();
        onChange();
    }, [props.item, editor]);
    const onOutdent = React.useCallback(() => {
        item.outdent();
        onChange();
    }, [props.item, editor]);

    return (
        <div>
            <button onClick={onOrdered}>1.</button>
            <button onClick={onUnrdered}>*</button>
            <button onClick={onOutdent}>&lt;-</button>
            <button onClick={onIndent}>-&gt;</button>
            <span
                style={{
                    marginLeft: item.getLevel() * 20 + 'px',
                    display: 'inline-block',
                    cursor: 'pointer',
                }}
                onMouseOver={onMouseOver}>
                {ListTypeToString[type]}
            </span>
        </div>
    );
}

export default class VListPane extends React.Component<ApiPaneProps, VListPaneState> {
    constructor(props: ApiPaneProps) {
        super(props);
        this.state = {
            vlist: null,
        };
    }

    render() {
        const editor = this.props.getEditor();
        return (
            <>
                <button onClick={this.createVList}>Create VList from cursor</button>
                {this.state.vlist && (
                    <>
                        {this.state.vlist.items.map(item => (
                            <VListItemPane item={item} editor={editor} onChange={this.onChange} />
                        ))}
                        <button onClick={this.onWriteback}>Write back</button>
                    </>
                )}
            </>
        );
    }

    private createVList = () => {
        const editor = this.props.getEditor();
        const node = editor.getElementAtCursor();
        const region = editor.getSelectedRegions()[0];
        const vlist = node
            ? createVListFromRegion(region, false /*includingSiblingList*/, node)
            : null;

        this.setState({
            vlist: vlist,
        });
    };

    private onWriteback = () => {
        const editor = this.props.getEditor();
        editor.addUndoSnapshot(() => {
            this.state.vlist?.writeBack(
                editor.isFeatureEnabled(ExperimentalFeatures.ReuseAllAncestorListElements)
            );
            editor.focus();
            editor.select(this.state.vlist.items[0]?.getNode(), PositionType.Begin);
        });
        this.createVList();
    };

    private onChange = () => {
        this.forceUpdate();
    };
}
