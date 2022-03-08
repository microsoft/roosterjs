import * as React from 'react';
import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { FocusZone, FocusZoneDirection } from '@fluentui/react/lib/FocusZone';
import { IContextualMenuItem } from '@fluentui/react/lib/ContextualMenu';
import { insertTable as insertTableApi } from 'roosterjs-editor-api';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';

const classNames = mergeStyleSets({
    tableButton: {
        width: '15px',
        height: '15px',
        margin: '1px 1px 0 0',
        border: 'solid 1px #a19f9d',
        display: 'inline-block',
        cursor: 'pointer',
        backgroundColor: 'transparent',
    },
    hovered: {
        border: 'solid 1px #DB626C',
    },
    tablePane: {
        width: '160px',
        minWidth: 'auto',
        padding: '4px',
    },
    tablePaneInner: {
        lineHeight: '12px',
    },
    title: {
        margin: '5px 0',
    },
});

/**
 * Key of localized strings of Insert table button
 */
export type InsertTableButtonStringKey = 'buttonNameInsertTable' | 'insertTablePane';

/**
 * "Insert table" button on the format ribbon
 */
export const insertTable: RibbonButton<InsertTableButtonStringKey> = {
    key: 'buttonNameInsertTable',
    unlocalizedText: 'Insert table',
    iconName: 'Table',
    dropDownItems: {
        insertTablePane: '{0} x {1} table',
    },
    onClick: (editor, key) => {
        const { row, col } = parseKey(key);
        insertTableApi(editor, col, row);
    },
    dropDownItemRender: (item, onClick) => {
        return <InsertTablePane item={item} onClick={onClick} />;
    },
    dropDownClassName: classNames.tablePane,
};

function InsertTablePane(props: {
    item: IContextualMenuItem;
    onClick: (
        e: React.MouseEvent<Element> | React.KeyboardEvent<Element>,
        item: IContextualMenuItem
    ) => void;
}) {
    const { item, onClick } = props;
    const [col, setCol] = React.useState(1);
    const [row, setRow] = React.useState(1);

    const onMouseEnter = React.useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            const element = e.currentTarget as HTMLElement;
            setCol(parseInt(element.dataset.col));
            setRow(parseInt(element.dataset.row));
        },
        [setCol, setRow]
    );

    const onClickButton = React.useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            onClick(e, {
                ...item,
                key: createKey(row, col),
            });
        },
        [row, col, onClick]
    );

    const updateDimensionsToCell = React.useCallback(
        (target: EventTarget) => {
            const element = target as HTMLElement;
            setCol(parseInt(element.dataset.col));
            setRow(parseInt(element.dataset.row));
        },
        [setCol, setRow]
    );

    const items = React.useMemo(() => {
        const items: JSX.Element[] = [];

        for (let i = 1; i <= 10; i++) {
            for (let j = 1; j <= 10; j++) {
                const key = `cell_${i}_${j}`;
                const isSelected = j <= col && i <= row;
                items.push(
                    <button
                        className={
                            classNames.tableButton + ' ' + (isSelected ? classNames.hovered : '')
                        }
                        onClick={onClickButton}
                        key={key}
                        id={key}
                        data-col={j}
                        data-row={i}
                        data-is-focusable={true}
                        onMouseEnter={onMouseEnter}
                    />
                );
            }
        }

        return items;
    }, [col, row]);

    const text = item.text.replace('{0}', col.toString()).replace('{1}', row.toString());

    return (
        <div className={classNames.tablePaneInner}>
            <div className={classNames.title}>{text}</div>
            <FocusZone
                defaultActiveElement="cell_1_1"
                direction={FocusZoneDirection.bidirectional}
                onActiveElementChanged={updateDimensionsToCell}>
                {items}
            </FocusZone>
        </div>
    );
}

function createKey(row: number, col: number) {
    return `${row},${col}`;
}

function parseKey(key: string): { row: number; col: number } {
    const [row, col] = key.split(',');
    return {
        row: parseInt(row),
        col: parseInt(col),
    };
}
