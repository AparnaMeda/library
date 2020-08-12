import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { Accordion, Form } from "react-bootstrap";
import { ReactComponent as IconUpArrow } from "../images/downarrow.svg";

let accordianArray = [];
export default function LeftDrawer(props) {
    const [leftDrawData, setLeftDrawData] = useState([]);
    const [leftDrawTemp, setLeftDrawTemp] = useState([]);
    const [filterType, setFilterType] = useState([]);
    const [filterTypeTemp, setFilterTypeTemp] = useState([]);
    const [activeState, setActiveState] = useState("1");
    const [accordianArr, setAccordianArr] = useState([]);
    const [showUpArrow, setShowUpArrow] = useState("");
    const [showDownArrow, setShowDownArrow] = useState("none");

    useEffect(() => {
        let typeArray = [];
        setLeftDrawData(props.filterData.filter);
        setLeftDrawTemp(props.filterData.filter);
        props.filterData.filter.forEach((item) => {
            if (item.types) {
                item.types.forEach((type) => {
                    typeArray.push(type.name);
                });
            }
        });
        setFilterType(typeArray);
        setFilterTypeTemp(typeArray);
    }, [props.filterData.filter]);
    /**
     * Method To filter out the filters displayed at the left drawer
     * @param {*} e triggered on typing on the search field
     */
    const searchFilterHandler = (e) => {
        let filteredList = [];
        let filteredTypeList = [];
        const searchKey = e.target.value;
        if (leftDrawData) {
            filteredList = leftDrawTemp.filter((item) => {
                if (item.types) {
                    filteredTypeList = item.types.filter((type) => {
                        return (
                            type.name &&
                            type.name
                                .toLowerCase()
                                .includes(searchKey.toLowerCase())
                        );
                    });
                    if (filteredTypeList.length > 0 && searchKey !== "") {
                        setActiveState("2");
                        return true;
                    } else {
                        setActiveState("1");
                    }
                    return (
                        item.name &&
                        item.name
                            .toLowerCase()
                            .includes(searchKey.toLowerCase())
                    );
                } else {
                    return (
                        item.name &&
                        item.name
                            .toLowerCase()
                            .includes(searchKey.toLowerCase())
                    );
                }
            });
        }
        setLeftDrawData(filteredList);
        setFilterType(filteredTypeList);
    };
    leftDrawData.forEach((item) => {
        if (item.types) {
            accordianArray.push({ name: item.name, accordianShow: "" });
        }
    });
    /**
     * Method To change the accordian arrow direction on toggling
     * @param {*} name is dynamic filter name
     * @param {*} className is the dynamic className of the div
     */
    const handleAccordianArrow = (name, className) => {
        accordianArray.forEach((item) => {
            let index = accordianArray.indexOf(item);
            if (item.name === name) {
                if (className === "show card-header") {
                    accordianArray[index] = {
                        name: item.name,
                        accordianShow: ""
                    };
                } else {
                    accordianArray[index] = {
                        name: item.name,
                        accordianShow: "show"
                    };
                }
            }
        });
        setAccordianArr(accordianArray);
        accordianArray = [];
    };

    const handleAccordian = () => {
        if (showUpArrow === "" || showDownArrow === "none") {
            setShowUpArrow("none");
            setShowDownArrow("");
        } else {
            setShowUpArrow("");
            setShowDownArrow("none");
        }
    };

    let accordianHeads = leftDrawData.map((item, index) => {
        if (item.types.length) {
            let show = "";
            accordianArr.forEach((accord) => {
                if (accord.name === item.name) {
                    show = accord.accordianShow;
                }
            });
            return (
                <div key={index}>
                    <Accordion>
                        <Card>
                            <Accordion.Toggle
                                onClick={(e) => {
                                    handleAccordian();
                                }}
                                style={{ fontWeight: item.weight }}
                                className={show}
                                as={Card.Header}
                                eventKey="1"
                            >
                                {item.name}
                                <div
                                    className="accordionLeft"
                                    style={{ display: showUpArrow }}
                                >
                                    <IconUpArrow />
                                </div>
                                <div
                                    className="accordionRight"
                                    style={{ display: showDownArrow }}
                                >
                                    <IconUpArrow />
                                </div>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="1">
                                <Card.Body>
                                    <ul className="firstAccordion" key={index}>
                                        {item.types &&
                                            item.types.map((type, index) => {
                                                return (
                                                    <li
                                                        style={{
                                                            fontWeight:
                                                                type.weight
                                                        }}
                                                        onClick={(e) => {
                                                            props.fromLeftToRight(
                                                                item.name,
                                                                type.dataType,
                                                                type.enabled,
                                                                type.name,
                                                                item.field,
                                                                item.condition,
                                                                type.dataSource,
                                                                type.validationMessage,
                                                                type.options
                                                            );
                                                            // props.addedFilterCount();
                                                        }}
                                                        key={index}
                                                    >
                                                        {type.name}
                                                    </li>
                                                );
                                            })}
                                    </ul>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </div>
            );
        } else {
            return <div key={index}></div>;
        }
    });
    let fieldHeads = leftDrawData.map((item, index) => {
        if (item.field.length) {
            return (
                <div className="fieldHeads" key={index}>
                    <li
                        style={{ fontWeight: item.weight }}
                        onClick={(e) => {
                            props.fromLeftToRight(
                                item.name,
                                item.dataType,
                                item.enabled,
                                item.types,
                                item.field,
                                item.condition,
                                item.dataSource,
                                item.validationMessage,
                                item.options
                            );
                            //props.addedFilterCount();
                        }}
                    >
                        {item.name}
                    </li>
                </div>
            );
        } else {
            return <div key={index}></div>;
        }
    });
    let conditionHeads = leftDrawData.map((item, index) => {
        if (item.condition.length) {
            return (
                <div className="conditionHeads" key={index}>
                    <li
                        style={{ fontWeight: item.weight }}
                        onClick={(e) => {
                            props.fromLeftToRight(
                                item.name,
                                item.dataType,
                                item.enabled,
                                item.types,
                                item.field,
                                item.condition,
                                item.dataSource,
                                item.validationMessage,
                                item.options
                            );
                            //props.addedFilterCount();
                        }}
                    >
                        {item.name}
                    </li>
                </div>
            );
        } else {
            return <div key={index}></div>;
        }
    });
    let normalHeads = leftDrawData.map((item, index) => {
        if (
            !(item.condition.length || item.types.length || item.field.length)
        ) {
            return (
                <div className="normalHeads" key={index}>
                    <li
                        style={{ fontWeight: item.weight }}
                        onClick={(e) => {
                            props.fromLeftToRight(
                                item.name,
                                item.dataType,
                                item.enabled,
                                item.types,
                                item.field,
                                item.condition,
                                item.dataSource,
                                item.validationMessage,
                                item.options
                            );
                            //props.addedFilterCount();
                        }}
                    >
                        {item.name}
                    </li>
                </div>
            );
        } else {
            return <div key={index}></div>;
        }
    });
    return (
        <div>
            <Form.Row>
                <Form.Control
                    required
                    type="text"
                    placeholder="Search a Filter"
                    defaultValue=""
                    className="customControl"
                    onChange={searchFilterHandler}
                />
            </Form.Row>
            <div className="leftDrawer">
                <div>{accordianHeads}</div>
                <div>{fieldHeads}</div>
                <div>{conditionHeads}</div>
                <div>{normalHeads}</div>
            </div>
        </div>
    );
}
