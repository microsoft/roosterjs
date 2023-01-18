import * as React from 'react';
import RibbonButton from '../../type/RibbonButton';
import { FocusZone, FocusZoneDirection } from '@fluentui/react/lib/FocusZone';
import { IContextualMenuItem } from '@fluentui/react/lib/ContextualMenu';
import { insertTable as insertTableApi } from 'roosterjs-editor-api';
import { InsertTableButtonStringKey } from '../../type/RibbonButtonStringKeys';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { safeInstanceOf } from 'roosterjs-editor-dom';

const MaxRows = 10;
const MaxCols = 10;
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
        boxSizing: 'content-box',
    },
    tablePaneInner: {
        lineHeight: '12px',
    },
    title: {
        margin: '5px 0',
    },
});

/**
 * @internal
 * "Insert table" button on the format ribbon
 */
export const insertTable: RibbonButton<InsertTableButtonStringKey> = {
    key: 'buttonNameInsertTable',
    unlocalizedText: 'Insert table',
    iconName: 'Table',
    onClick: (editor, key) => {
        const { row, col } = parseKey(key);
        insertTableApi(editor, col, row);
    },
    dropDownMenu: {
        items: {
            insertTablePane: '{0} x {1} table',
        },
        itemRender: (item, onClick) => {
            return <InsertTablePane item={item} onClick={onClick} />;
        },
        commandBarSubMenuProperties: {
            className: classNames.tablePane,
        },
    },
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

    const updateSize = React.useCallback(
        (t?: HTMLElement | EventTarget) => {
            if (safeInstanceOf(t, 'HTMLElement')) {
                const col = parseInt(t.dataset.col ?? '-1');
                const row = parseInt(t.dataset.row ?? '-1');

                if (col > 0 && col <= MaxCols && row > 0 && row <= MaxRows) {
                    setCol(col);
                    setRow(row);
                }
            }
        },
        [setCol, setRow]
    );

    const onMouseEnter = React.useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            updateSize(e.target);
        },
        [updateSize]
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

    const ariaLabels = React.useMemo<string[][]>(() => {
        const result: string[][] = [];
        for (let i = 1; i <= MaxCols; i++) {
            let col: string[] = [];
            for (let j = 1; j <= MaxRows; j++) {
                col[j] = formatText(item.text ?? '', i, j);
            }
            result[i] = col;
        }
        return result;
    }, [item.text]);

    const items = React.useMemo(() => {
        const items: JSX.Element[] = [];

        for (let i = 1; i <= MaxRows; i++) {
            for (let j = 1; j <= MaxCols; j++) {
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
                        aria-label={ariaLabels[i][j]}
                    />
                );
            }
        }

        return items;
    }, [col, row]);

    const text = formatText(item.text ?? '', row, col);

    return (
        <div className={classNames.tablePaneInner}>
            <div className={classNames.title}>{text}</div>
            <FocusZone
                defaultActiveElement="cell_1_1"
                direction={FocusZoneDirection.bidirectional}
                onActiveElementChanged={updateSize}>
                {items}
            </FocusZone>
        </div>
    );
}

function formatText(text: string, row: number, col: number) {
    return text.replace('{0}', col.toString()).replace('{1}', row.toString());
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
