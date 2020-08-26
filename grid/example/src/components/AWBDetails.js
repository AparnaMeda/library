import React from "react";
import { withFormik } from "formik";

function AWBDetails(props) {
    const {
        shipment_prefix,
        origin,
        destination,
        master_document_number,
        agent_code,
        service_cargo_class
    } = props.rowData;
    const { values, errors, touched, handleChange, handleSubmit } = props;
    console.log(values.product_name);
    let awbNo = [...master_document_number]
        // eslint-disable-next-line eqeqeq
        .map((d, i) => (i % 4 == 0 ? " " + d : d))
        .join("")
        .trim();
    return (
        <div>
            <button type="submit" onClick={handleSubmit}>
                Save
            </button>
            <div>
                <h4>{`${shipment_prefix}-${awbNo}`}</h4>
            </div>
            <div>QA Completed</div>
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <p>Org-Dest.</p>
                                <p>
                                    {origin} &nbsp; {destination}
                                </p>
                            </td>
                            <td>
                                <p>Agent</p>
                                <p>{agent_code}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <div>
                    <div style={{ width: 50 }}>
                        <label>Product</label>
                        <br />

                        <input
                            type="text"
                            value={values.product_name}
                            style={{ width: 50 }}
                            onChange={handleChange}
                            name="product_name"
                        />
                        {errors.product_name && touched.product_name && (
                            <span style={{ color: "red" }}>
                                {errors.product_name}
                            </span>
                        )}
                    </div>
                    <div style={{ marginTop: -33, marginLeft: 90 }}>
                        <label>SC</label>
                        <br />
                        <select>
                            <option>{service_cargo_class}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div>SCC</div>
        </div>
    );
}

export default withFormik({
    mapPropsToValues: (props) => props.rowData,
    validate: (values) => {
        const errors = {};

        if (!values.product_name) {
            errors.product_name = "Required";
        }

        return errors;
    },

    handleSubmit: (values, { setSubmitting }) => {
        setTimeout(() => {
            alert(JSON.stringify(values, null, 1));
            setSubmitting(false);
        }, 1000);
    }
})(AWBDetails);
