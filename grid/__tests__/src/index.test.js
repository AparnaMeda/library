/* eslint-disable no-undef */
import React from "react";
import {
    render,
    screen,
    wait,
    cleanup,
    fireEvent
} from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom/extend-expect";
/* eslint-disable no-unused-vars */
import regeneratorRuntime from "regenerator-runtime";
import Grid from "../../src/index";

describe("render Customgrid ", () => {
    function mockOffsetSize(width, height) {
        Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
            configurable: true,
            value: height
        });
        Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
            configurable: true,
            value: width
        });
    }

    const mockDisplayCell = jest.fn(() => {
        return (
            <div className="flight-details">
                <strong>XX2225</strong>
                <span>31-Aug-2016</span>
            </div>
        );
    });

    const gridColumns = [
        {
            Header: "Id",
            accessor: "travelId",
            width: 50,
            disableFilters: true
        },
        {
            Header: "Flight",
            accessor: "flight",
            width: 100,
            innerCells: [
                {
                    Header: "Flight No",
                    accessor: "flightno"
                },
                {
                    Header: "Date",
                    accessor: "date"
                }
            ],
            sortValue: "flightno",
            Cell: mockDisplayCell
        },
        {
            Header: "SR",
            accessor: "sr",
            width: 90
        }
    ];

    const mockAdditionalColumn = {
        Header: "Remarks",
        innerCells: [{ Header: "Remarks", accessor: "remarks" }],
        displayCell: (rowData, DisplayTag) => {
            const { remarks } = rowData;
            return (
                <div className="details-wrap">
                    <DisplayTag columnKey="remarks" cellKey="remarks">
                        <ul>
                            <li>{remarks}</li>
                        </ul>
                    </DisplayTag>
                </div>
            );
        }
    };

    const data = [
        {
            travelId: 0,
            flight: {
                flightno: "XX2225",
                date: "31-Aug-2016"
            },
            segment: {
                from: "BCC",
                to: "ZZY"
            },
            details: {
                flightModel: 6518,
                bodyType: "Big Body",
                type: "Van",
                startTime: "01:23 (S)",
                endTime: "11:29 (E)",
                status: "To Be Cancelled",
                additionalStatus:
                    "Elit est consectetur deserunt et sit officia eu. Qui minim quis exercitation in irure elit velit nisi officia cillum laborum reprehenderit.aliqua ex sint cupidatat non",
                timeStatus: "10:02 hrs to depart"
            },
            weight: {
                percentage: "16%",
                value: "35490/20000 kg"
            },
            volume: {
                percentage: "54%",
                value: "31/60 cbm"
            },
            uldPositions: [
                {
                    position: "L1",
                    value: "7/9"
                },
                {
                    position: "Q1",
                    value: "9/3"
                },
                {
                    position: "L6",
                    value: "8/4"
                },
                {
                    position: "Q7",
                    value: "4/9"
                }
            ],
            revenue: {
                revenue: "$63,474.27",
                yeild: "$7.90"
            },
            sr: "74/ AWBs",
            queuedBooking: {
                sr: "88/ AWBs",
                volume: "7437 kg / 31 cbm"
            },
            remarks: "Enim aute magna."
        },
        {
            travelId: 1,
            flight: {
                flightno: "XX6983",
                date: "23-May-2016"
            },
            segment: {
                from: "AAB",
                to: "XXY"
            },
            details: {
                flightModel: 6593,
                bodyType: "Narrow Body",
                type: "Car",
                startTime: "07:48 (A)",
                endTime: "05:36 (E)",
                status: "Active",
                additionalStatus:
                    "Elit est dolore nostrud Lorem labore et elit voluptate elit commodo cupidatat. Sint quis dolor laboris sit ipsum aliquip.velit cupidatat tempor laborum cupidatat",
                timeStatus: "09:20 hrs to depart"
            },
            weight: {
                percentage: "76%",
                value: "40966/20000 kg"
            },
            volume: {
                percentage: "94%",
                value: "11/60 cbm"
            },
            uldPositions: [
                {
                    position: "L1",
                    value: "6/2"
                },
                {
                    position: "Q2",
                    value: "5/1"
                },
                {
                    position: "L6",
                    value: "6/4"
                },
                {
                    position: "Q5",
                    value: "3/7"
                }
            ],
            revenue: {
                revenue: "$77,213.84",
                yeild: "$4.36"
            },
            sr: "84/ AWBs",
            queuedBooking: {
                sr: "36/ AWBs",
                volume: "7692 kg / 78 cbm"
            },
            remarks: "Labore irure."
        }
    ];

    const mockGetRowEditOverlay = jest.fn(
        (rowData, DisplayTag, rowUpdateCallBack) => {
            const { flight } = rowData;
            const updateRowValue = () => {
                flight.flightno = "007";
                rowUpdateCallBack(rowData);
            };
            return (
                <div className="row-edit">
                    <div className="edit-flight">
                        <DisplayTag columnKey="flight" cellKey="flightno">
                            <div className="edit-flight-no">
                                <input
                                    type="text"
                                    value={flight.flightno}
                                    onChange={updateRowValue}
                                />
                            </div>
                        </DisplayTag>
                        <DisplayTag columnKey="flight" cellKey="date">
                            <div className="edit-flight-date">
                                <input
                                    type="date"
                                    value={flight.date}
                                    onChange={updateRowValue}
                                />
                            </div>
                        </DisplayTag>
                    </div>
                </div>
            );
        }
    );

    const mockRowActions = [
        { label: "Send SCR", value: "SCR" },
        { label: "Segment Summary", value: "SegmentSummary" },
        { label: "Open Summary", value: "OpenSummary" },
        { label: "Close Summary", value: "CloseSummary" }
    ];

    const mockGridHeight = "80vh";
    const mockGridWidth = "100%";
    const mockTitle = "AWBs";

    const mockRowActionCallback = jest.fn();
    const mockCalculateRowHeight = jest.fn((row, columnsInGrid) => {
        // Minimum height for each row
        let rowHeight = 50;
        if (columnsInGrid && columnsInGrid.length > 0 && row) {
            // Get properties of a row
            const { original, isExpanded } = row;
            // Find the column with maximum width configured, from grid columns list
            const columnWithMaxWidth = [...columnsInGrid].sort((a, b) => {
                return b.width - a.width;
            })[0];
            // Get column properties including the user resized column width (totalFlexWidth)
            const { id, width, totalFlexWidth } = columnWithMaxWidth;
            // Get row value of that column
            const rowValue = original[id];
            if (rowValue) {
                // Find the length of text of data in that column
                const textLength = Object.values(rowValue).join(",").length;
                // This is a formula that was created for the test data used.
                rowHeight += Math.ceil((80 * textLength) / totalFlexWidth);
                const widthVariable =
                    totalFlexWidth > width
                        ? totalFlexWidth - width
                        : width - totalFlexWidth;
                rowHeight += widthVariable / 1000;
            }
            // Add logic to increase row height if row is expanded
            if (isExpanded && mockAdditionalColumn) {
                // Increase height based on the number of inner cells in additional columns
                rowHeight +=
                    mockAdditionalColumn.innerCells &&
                    mockAdditionalColumn.innerCells.length > 0
                        ? mockAdditionalColumn.innerCells.length * 35
                        : 35;
            }
        }
        return rowHeight;
    });
    const mockUpdateRowData = jest.fn();
    const mockDeleteRowData = jest.fn();
    const mockSelectBulkData = jest.fn();

    function getDataToLoad() {
        return data;
    }

    const getData = async () => {
        const resp = await getDataToLoad();
        return resp;
    };

    let container;
    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });
    afterEach(cleanup);

    it("works with async/await", async () => {
        mockOffsetSize(600, 600);
        // eslint-disable-next-line no-shadow
        const { container } = render(
            <Grid
                title={mockTitle}
                gridHeight={mockGridHeight}
                gridWidth={mockGridWidth}
                loadData={getData}
                columns={gridColumns}
                columnToExpand={mockAdditionalColumn}
                rowActions={mockRowActions}
                rowActionCallback={mockRowActionCallback}
                getRowEditOverlay={mockGetRowEditOverlay}
                calculateRowHeight={mockCalculateRowHeight}
                updateRowData={mockUpdateRowData}
                deleteRowData={mockDeleteRowData}
                selectBulkData={mockSelectBulkData}
            />
        );
        await wait(() => expect(screen.getByText("AWBs")).toBeInTheDocument());

        const expander = container.getElementsByClassName("expander")[0];
        act(() => {
            expander.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });
        const expandRegion = container.getElementsByClassName("expand");
        expect(expandRegion.length).toBeGreaterThan(0);

        // Global Filter Search
        const input = container.getElementsByClassName("txt").item(0);
        fireEvent.change(input, { target: { value: "ABC1178" } });
        expect(input.value).toBe("ABC1178");
        fireEvent.change(input, { target: { value: "" } });
        expect(input.value).toBe("");

        // Column Filter Search
        const toggleColumnFilter = container.querySelector(
            "[data-testid='toggleColumnFilter']"
        );
        act(() => {
            toggleColumnFilter.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        const columnInput = container.getElementsByClassName("txt").item(1);
        fireEvent.change(columnInput, { target: { value: "222" } });
        expect(columnInput.value).toBe("222");
        fireEvent.change(columnInput, { target: { value: "" } });
        expect(columnInput.value).toBe("");
    });

    it("works with async/await", async () => {
        mockOffsetSize(600, 600);
        // eslint-disable-next-line no-shadow
        const { getAllByText, container } = render(
            <Grid
                title={mockTitle}
                gridHeight={mockGridHeight}
                gridWidth={mockGridWidth}
                loadData={getData}
                columns={gridColumns}
                columnToExpand={mockAdditionalColumn}
                rowActions={mockRowActions}
                rowActionCallback={mockRowActionCallback}
                getRowEditOverlay={mockGetRowEditOverlay}
                updateRowData={mockUpdateRowData}
                deleteRowData={mockDeleteRowData}
                selectBulkData={mockSelectBulkData}
            />
        );
        await wait(() => expect(screen.getByText("AWBs")).toBeInTheDocument());

        const expander = container.getElementsByClassName("expander")[0];
        act(() => {
            expander.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });
        const expandRegion = container.getElementsByClassName("expand");
        await wait(() => expect(expandRegion.length).toBeGreaterThan(0));

        // Apply Sort
        const toggleGroupSortOverLay = container.querySelector(
            "[data-testid='toggleGroupSortOverLay']"
        );
        act(() => {
            toggleGroupSortOverLay.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        let sortOverlay = container.querySelector(
            "[class='neo-popover__sort']"
        );
        let addNewSort = sortOverlay.querySelector("[class='sort__txt']");
        act(() => {
            addNewSort.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        let applySortButton = sortOverlay.querySelector(
            "[class='btns btns__save']"
        );
        act(() => {
            applySortButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        sortOverlay = container.querySelector("[class='neo-popover__sort']");
        await wait(() => expect(sortOverlay).toBeNull());

        // Apply Sort
        act(() => {
            toggleGroupSortOverLay.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        sortOverlay = container.querySelector("[class='neo-popover__sort']");
        addNewSort = sortOverlay.querySelector("[class='sort__txt']");
        act(() => {
            addNewSort.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Change Sort Order
        const sortOrderSelectList = document
            .querySelector(".sort__bodyContent")
            .getElementsByClassName("sort__reorder")[3]
            .getElementsByTagName("select")[0];

        act(() => {
            sortOrderSelectList.dispatchEvent(
                new MouseEvent("change", { bubbles: true })
            );
        });
        expect(getAllByText("Descending").length).toBeGreaterThan(0);
        applySortButton = sortOverlay.querySelector(
            "[class='btns btns__save']"
        );
        act(() => {
            applySortButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });
});
