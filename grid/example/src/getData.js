import axios from "axios";
import routes from "./qualityAuditAPIResponse.json";

export const fetchData = async (index, pageSize) => {
    // const pageNumber = Math.floor(index / pageSize) + 1;
    // const response = await axios(
    //     //`https://skyforceapi.azurewebsites.net/api/cargoflightdetails?currentPage=${pageNumber}&pageSize=${pageSize}`
    //     `https://sxgfhbcma2.execute-api.us-east-2.amazonaws.com/default/cargoFlightList?currentPage=${pageNumber}&pageSize=${pageSize}`
    // );
    // if (response && response.data && response.data.data) {
    //     const { result } = response.data.data;
    //     if (result) {
    //         console.log(routes);
    //         return routes;
    //     }
    // }
    return routes;
};
