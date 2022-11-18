import * as React from 'react';
import { alignCenterButton } from './alignCenterButton';
import { alignLeftButton } from './alignLeftButton';
import { alignRightButton } from './alignRightButton';
import { bulletedListButton } from './bulletedListButton';
import { decreaseIndentButton } from './decreaseIndentButton';
import { fontButton } from './fontButton';
import { formatTableButton } from './formatTableButton';
import { increaseIndentButton } from './increaseIndentButton';
import { insertTableButton } from './insertTableButton';
import { listStartNumberButton } from './listStartNumberButton';
import { ltrButton } from './ltrButton';
import { numberedListButton } from './numberedListButton';
import { Ribbon, RibbonPlugin } from 'roosterjs-react';
import { rtlButton } from './rtlButton';
import { setBulletedListStyleButton } from './setBulletedListStyleButton';
import { setHeaderLevelButton } from './setHeaderLevelButton';
import { setNumberedListStyleButton } from './setNumberedListStyleButton';
import { setTableCellShadeButton } from './setTableCellShadeButton';
import { setTableHeaderButton } from './setTableHeaderButton';
import {
    tableAlignCellButton,
    tableAlignTableButton,
    tableDeleteButton,
    tableInsertButton,
    tableMergeButton,
    tableSplitButton,
} from './tableEditButtons';

const buttons = [
    fontButton,
    bulletedListButton,
    numberedListButton,
    decreaseIndentButton,
    increaseIndentButton,
    alignLeftButton,
    alignCenterButton,
    alignRightButton,
    ltrButton,
    rtlButton,
    setHeaderLevelButton,
    setBulletedListStyleButton,
    setNumberedListStyleButton,
    listStartNumberButton,
    insertTableButton,
    formatTableButton,
    setTableCellShadeButton,
    setTableHeaderButton,
    tableInsertButton,
    tableDeleteButton,
    tableMergeButton,
    tableSplitButton,
    tableAlignCellButton,
    tableAlignTableButton,
];

export default function ContentModelRibbon(props: { ribbonPlugin: RibbonPlugin; isRtl: boolean }) {
    const { ribbonPlugin, isRtl } = props;

    return <Ribbon buttons={buttons} plugin={ribbonPlugin} dir={isRtl ? 'rtl' : 'ltr'} />;
}
