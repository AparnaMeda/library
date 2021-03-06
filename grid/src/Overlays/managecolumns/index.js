import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import MultiBackend, { TouchTransition } from "react-dnd-multi-backend";
import ClickAwayListener from "react-click-away-listener";
import PropTypes from "prop-types";
import ColumnsList from "./columnsList";
import { IconClose } from "../../Utilities/SvgUtilities";

const ColumnReordering = (props) => {
    const {
        isManageColumnOpen,
        toggleManageColumns,
        originalColumns,
        isExpandContentAvailable,
        additionalColumn
    } = props;
    const additionalColumnHeader =
        additionalColumn && additionalColumn.length
            ? additionalColumn[0].Header
            : "";
    const getRemarksColumnIfAvailable = () => {
        return isExpandContentAvailable ? additionalColumn : [];
    };

    const concatedOriginalColumns = originalColumns.concat(
        getRemarksColumnIfAvailable()
    );

    const [managedColumns, setManagedColumns] = useState(originalColumns);
    const [searchedColumns, setSearchedColumns] = useState(
        concatedOriginalColumns
    );
    const [remarksColumnToManage, setRemarksColumnToManage] = useState(
        getRemarksColumnIfAvailable()
    );
    const [isErrorDisplayed, setIsErrorDisplayed] = useState(false);

    const HTML5toTouch = {
        backends: [
            {
                backend: HTML5Backend
            },
            {
                backend: TouchBackend,
                options: { enableMouseEvents: true },
                preview: true,
                transition: TouchTransition
            }
        ]
    };

    const filterColumnsList = (event) => {
        let { value } = event ? event.target : "";
        value = value ? value.toLowerCase() : "";
        if (value !== "") {
            setSearchedColumns(
                originalColumns
                    .filter((column) => {
                        return column.Header.toLowerCase().includes(value);
                    })
                    .concat(
                        getRemarksColumnIfAvailable().filter((column) => {
                            return column.Header.toLowerCase().includes(value);
                        })
                    )
            );
        } else {
            setSearchedColumns(concatedOriginalColumns);
        }
    };

    const updateColumnsInState = (columns) => {
        setManagedColumns(columns);
    };

    const findColumn = (columnList, columnHeader) => {
        return columnList.find((column) => {
            return column.Header === columnHeader;
        });
    };

    const isItemPresentInList = (list, headerValue) => {
        const filteredList = list.filter((item) => {
            return item.Header === headerValue;
        });
        return filteredList && filteredList.length > 0;
    };

    const isCheckboxSelected = (header) => {
        if (header === additionalColumnHeader) {
            return remarksColumnToManage.length > 0;
        }
        if (header === "Select All") {
            return (
                searchedColumns.length ===
                managedColumns.length + remarksColumnToManage.length
            );
        }
        return isItemPresentInList(managedColumns, header);
    };

    const isInnerCellSelected = (columnHeader, header) => {
        const columnListToSearch =
            columnHeader === additionalColumnHeader
                ? remarksColumnToManage
                : managedColumns;
        const selectedColumn = findColumn(columnListToSearch, columnHeader);
        return isItemPresentInList(selectedColumn.innerCells, header);
    };

    const findIndexOfItem = (
        type,
        columnsList,
        indexOfColumnToAdd,
        columnHeader,
        originalInnerCells
    ) => {
        if (type === "column") {
            return columnsList.findIndex((column) => {
                return (
                    column.Header === originalColumns[indexOfColumnToAdd].Header
                );
            });
        }
        return findColumn(columnsList, columnHeader).innerCells.findIndex(
            (cell) => {
                return (
                    cell.Header ===
                    originalInnerCells[indexOfColumnToAdd].Header
                );
            }
        );
    };

    const selectAllColumns = (event) => {
        if (event.currentTarget.checked) {
            setManagedColumns(originalColumns);
            setRemarksColumnToManage(getRemarksColumnIfAvailable());
        } else {
            setManagedColumns([]);
            setRemarksColumnToManage([]);
        }
    };

    const selectSingleColumn = (event) => {
        const { currentTarget } = event;
        const { checked, value } = currentTarget;

        if (value === additionalColumnHeader) {
            if (checked) {
                setRemarksColumnToManage(additionalColumn);
            } else {
                setRemarksColumnToManage([]);
            }
        } else if (checked) {
            // If column checkbox is checked
            // Find the index of selected column from original column array and also find the user selected column
            let indexOfColumnToAdd = originalColumns.findIndex((column) => {
                return column.Header === value;
            });
            const itemToAdd = originalColumns[indexOfColumnToAdd];

            // Loop through the managedColumns array to find the position of the column that is present previous to the user selected column
            // Find index of that previous column in original column list and push the new column next to that position
            let prevItemIndex = -1;
            while (indexOfColumnToAdd > 0 && prevItemIndex === -1) {
                indexOfColumnToAdd -= 1;
                prevItemIndex = findIndexOfItem(
                    "column",
                    managedColumns,
                    indexOfColumnToAdd
                );
            }

            const newColumnsList = [...managedColumns];
            newColumnsList.splice(prevItemIndex + 1, 0, itemToAdd);
            setManagedColumns(newColumnsList);
        } else {
            setManagedColumns(
                managedColumns.filter((column) => {
                    return column.Header !== value;
                })
            );
        }
    };

    const findAndSelectInnerCells = (
        stateColumnList,
        setStateColumnList,
        event
    ) => {
        const { currentTarget } = event;
        const { checked, dataset, value } = currentTarget;
        const { columnheader } = dataset;

        // Find the column in which checked/unchecked inner cell is present
        const selectedColumn = findColumn(stateColumnList, columnheader);
        const { originalInnerCells } = selectedColumn;
        if (originalInnerCells && originalInnerCells.length > 0) {
            if (checked) {
                // Find the index of selected column from original column array and also find the user selected column
                let indexOfColumnToAdd = originalInnerCells.findIndex(
                    (column) => {
                        return column.Header === value;
                    }
                );
                const itemToAdd = originalInnerCells[indexOfColumnToAdd];

                // Loop through the stateColumnList array to find the position of the column that is present previous to the user selected column
                // Find index of that previous column and push the new column to add in that position
                let prevItemIndex = -1;
                while (indexOfColumnToAdd > 0 && prevItemIndex === -1) {
                    indexOfColumnToAdd -= 1;
                    prevItemIndex = findIndexOfItem(
                        "innercell",
                        stateColumnList,
                        indexOfColumnToAdd,
                        columnheader,
                        originalInnerCells
                    );
                }

                const newColumnsList = [...stateColumnList];
                findColumn(newColumnsList, columnheader).innerCells.splice(
                    prevItemIndex + 1,
                    0,
                    itemToAdd
                );
                setStateColumnList(newColumnsList);
            } else {
                setStateColumnList(
                    stateColumnList.map((column) => {
                        const updatedColumn = column;
                        if (column.Header === columnheader) {
                            updatedColumn.innerCells = column.innerCells.filter(
                                (cell) => {
                                    return cell.Header !== value;
                                }
                            );
                        }
                        return updatedColumn;
                    })
                );
            }
        }
    };

    const selectInnerCells = (event) => {
        findAndSelectInnerCells(managedColumns, setManagedColumns, event);
    };

    const selectRemarksInnerCells = (event) => {
        findAndSelectInnerCells(
            remarksColumnToManage,
            setRemarksColumnToManage,
            event
        );
    };

    const doColumnUpdate = () => {
        setIsErrorDisplayed(false);
        if (managedColumns && managedColumns.length > 0) {
            setSearchedColumns(concatedOriginalColumns);
            props.updateColumnStructure(managedColumns, remarksColumnToManage);
            toggleManageColumns();
        } else {
            setIsErrorDisplayed(true);
        }
    };

    const resetInnerCells = (columnList) => {
        if (columnList && columnList.length) {
            return columnList.map((column) => {
                const newColumn = column;
                newColumn.innerCells = column.originalInnerCells;
                return column;
            });
        }
        return columnList;
    };

    const resetColumnUpdate = () => {
        setManagedColumns(resetInnerCells(originalColumns));
        setSearchedColumns(
            originalColumns.concat(getRemarksColumnIfAvailable())
        );
        setRemarksColumnToManage(
            resetInnerCells(getRemarksColumnIfAvailable())
        );
        setIsErrorDisplayed(false);
        props.updateColumnStructure(
            originalColumns,
            getRemarksColumnIfAvailable()
        );
    };

    useEffect(() => {
        setManagedColumns(originalColumns);
        setSearchedColumns(concatedOriginalColumns);
        setRemarksColumnToManage(getRemarksColumnIfAvailable());
    }, [originalColumns, isExpandContentAvailable, additionalColumn]);

    if (isManageColumnOpen) {
        return (
            <ClickAwayListener onClickAway={toggleManageColumns}>
                <div className="neo-grid-popover neo-grid-popover--column columns--grid">
                    <div className="neo-grid-popover__column column__grid">
                        <div className="column__chooser">
                            <div className="column__header">
                                <div>
                                    <strong>Column Chooser</strong>
                                </div>
                            </div>
                            <div className="column__body">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Search column"
                                        className="custom__ctrl"
                                        data-testid="filterColumnsList"
                                        onChange={filterColumnsList}
                                    />
                                </div>
                                <div className="column__selectAll">
                                    <div className="column__checkbox">
                                        <input
                                            type="checkbox"
                                            value="Select All"
                                            data-testid="selectAllCheckbox"
                                            checked={isCheckboxSelected(
                                                "Select All"
                                            )}
                                            onChange={selectAllColumns}
                                        />
                                    </div>
                                    <div className="column__selectTxt">
                                        Select All
                                    </div>
                                </div>
                                {searchedColumns.map((column) => {
                                    return (
                                        <div
                                            className="column__wrap"
                                            key={column.columnId}
                                        >
                                            <div className="column__checkbox">
                                                <input
                                                    type="checkbox"
                                                    value={column.Header}
                                                    checked={isCheckboxSelected(
                                                        column.Header
                                                    )}
                                                    onChange={
                                                        selectSingleColumn
                                                    }
                                                />
                                            </div>
                                            <div className="column__txt">
                                                {column.Header}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="column__settings">
                            <div className="column__header">
                                <div className="column__headerTxt">
                                    <strong>Column Settings</strong>
                                    {isErrorDisplayed ? (
                                        <strong className="column-warning">
                                            Select at least one column (other
                                            than {additionalColumnHeader})
                                        </strong>
                                    ) : null}
                                </div>
                                <div
                                    className="column__close"
                                    role="presentation"
                                    onClick={toggleManageColumns}
                                >
                                    <i>
                                        <IconClose />
                                    </i>
                                </div>
                            </div>
                            <div className="column__body">
                                <DndProvider
                                    backend={MultiBackend}
                                    options={HTML5toTouch}
                                >
                                    <ColumnsList
                                        columnsToManage={managedColumns}
                                        updateColumnsInState={
                                            updateColumnsInState
                                        }
                                        isInnerCellSelected={
                                            isInnerCellSelected
                                        }
                                        selectInnerCells={selectInnerCells}
                                    />
                                </DndProvider>
                                {remarksColumnToManage &&
                                remarksColumnToManage.length > 0 ? (
                                    <div className="column__reorder full-width">
                                        <div>
                                            {remarksColumnToManage[0].Header}
                                        </div>
                                        <div className="column__innerCells__wrap">
                                            {remarksColumnToManage[0]
                                                .originalInnerCells &&
                                            remarksColumnToManage[0]
                                                .originalInnerCells.length > 0
                                                ? remarksColumnToManage[0].originalInnerCells.map(
                                                      (cell) => {
                                                          return (
                                                              <div
                                                                  className="column__wrap"
                                                                  key={`${cell.Header}_${cell.accessor}`}
                                                              >
                                                                  <div className="column__checkbox">
                                                                      <input
                                                                          type="checkbox"
                                                                          data-columnheader={
                                                                              remarksColumnToManage[0]
                                                                                  .Header
                                                                          }
                                                                          value={
                                                                              cell.Header
                                                                          }
                                                                          checked={isInnerCellSelected(
                                                                              remarksColumnToManage[0]
                                                                                  .Header,
                                                                              cell.Header
                                                                          )}
                                                                          onChange={
                                                                              selectRemarksInnerCells
                                                                          }
                                                                      />
                                                                  </div>
                                                                  <div className="column__txt">
                                                                      {
                                                                          cell.Header
                                                                      }
                                                                  </div>
                                                              </div>
                                                          );
                                                      }
                                                  )
                                                : null}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                            <div className="column__footer">
                                <div className="column__btns">
                                    <button
                                        type="button"
                                        className="btns"
                                        onClick={resetColumnUpdate}
                                    >
                                        Reset
                                    </button>
                                    <button
                                        type="button"
                                        className="btns"
                                        onClick={toggleManageColumns}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btns btns__save"
                                        onClick={doColumnUpdate}
                                        data-testid="saveButton"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ClickAwayListener>
        );
    }
    return <div />;
};

ColumnReordering.propTypes = {
    isManageColumnOpen: PropTypes.any,
    toggleManageColumns: PropTypes.any,
    originalColumns: PropTypes.any,
    isExpandContentAvailable: PropTypes.any,
    additionalColumn: PropTypes.any,
    updateColumnStructure: PropTypes.any
};

export default ColumnReordering;
