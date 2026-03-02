import { useEffect, useState } from "react";
import axios from "axios";
import "../css/Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [originalOrders, setOriginalOrders] = useState([]);

  const setSearchData = async () => {

    try {

      const res = await axios.get(
        "https://localhost:7277/api/orders/getallorders"
      );

      setOrders(
        res.data.map((item, index) => ({
          ...item,
          rowId: index}
        ))
      );
      setOriginalOrders(
        JSON.parse(
          JSON.stringify(
            res.data.map((item, index) => ({
              ...item,
              rowId: index}
            ))
          )
        )
      );

    } catch (err) {

      console.error("Error fetching orders:", err);

    }

  };

  const handleSearch = () => {
    setSearchData();
  };

  const handleChange = (index, field, value) => {

    const updatedOrders = [...orders];

    updatedOrders[index] = {
      ...updatedOrders[index],

      [field]: field === "qty" ? Number(value) : value,
    };

    if(updatedOrders[index].rowstate === 1){
      updatedOrders[index].rowstate = 1;
    }
    else if(originalOrders[index][field] !== updatedOrders[index][field]) {
      updatedOrders[index].rowstate = 2;
    }
    else{
      updatedOrders[index].rowstate = originalOrders[index].rowstate;
    }

    setOrders(updatedOrders);

  };

  const handleNumberValue = (e) => {

    if (!/[0-9]/.test(e.key) && !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(e.key)) {
      e.preventDefault();
    }

    if (["e", "E", "+", "-", "."].includes(e.key)) {
      e.preventDefault();
    }
  };

  const getNextRowId = () => {

    if (orders.length === 0){
      return 0;
    } 

    const maxRowId = Math.max(
      ...orders.map(o => Number(o.rowId))
    );

    return maxRowId + 1;
  };

  const handleAddRow = () => {

    const newOrder = {
      rowId: getNextRowId(),
      orderId: "",
      orderSeq: "",
      productId: "",
      productName: "",
      qty: "",
      totalPrice: 0,
      orderDate: new Date().toISOString(),
      rowstate: 1,
    };

    setOrders([...orders, newOrder]);

  };

  const handleDeleteRow = (index) => {

    const deletedOrders = [...orders];

    if (deletedOrders[index].rowstate === 1) {
      // New row not saved yet → can remove safely
      deletedOrders.splice(index, 1);
    } else {
      // Existing row → mark as deleted
      deletedOrders[index].rowstate = 3;
    }

    setOrders(deletedOrders);
  };

  const handleSave = async () => {

    let insertedData = orders.filter(o => o.rowstate === 1);

    let updatedData = orders.filter(o => o.rowstate === 2);

    let deletedData = orders.filter(o => o.rowstate === 3);

    const removeFields = (data, fieldsToRemove) =>
      data.map(item => {
       const newItem = { ...item };
       fieldsToRemove.forEach(field => delete newItem[field]);
        return newItem;
      });

    insertedData = removeFields(insertedData, ["rowstate", "rowId", "productName"]);
    updatedData = removeFields(updatedData, ["rowstate", "rowId", "productName"]);
    deletedData = removeFields(deletedData, ["rowstate", "rowId", "productName"]);

    console.log("Inserted:", insertedData);
    console.log("Updated:", updatedData);
    console.log("Deleted:", deletedData);

    // Example API call
    try {
      await axios.post("https://localhost:7277/api/orders/save", {
        insertedData : insertedData,
        updatedData : updatedData,
        deletedData : deletedData
      });

      alert("Saved Successfully");

      // Reload fresh data
      setSearchData();

    } catch (error) {
      console.error("Save error:", error);
    }
  };


  return (
    <div style={{ padding: "20px" }}>
      <h2>Orders List</h2>

      {/* Search Section */}
      <div className="ordersbtns">
        <button className="btn-search" onClick={handleSearch}>Search</button>
        <button className="btn-add" onClick={handleAddRow}>+ Add</button>
        <button className="btn-save" onClick={handleSave}>Save</button>
      </div>

      <table border="1" >
        <thead>
          <tr>
            <th>No</th>
            <th></th>
            <th>Order ID</th>
            <th>Seq</th>
            <th>ProductId</th>
            <th>ProductName</th>
            <th>Qty</th>
            <th>Total Price</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No orders found
              </td>
            </tr>
          ) : (
            orders.map((o, index) => (
              <tr id={`row_${o.rowId}`} key={o.rowId} style={{ display: o.rowstate === 3 ? "none" : "" }} >
                <td>{index + 1}</td>
                <td>
                  <button className="btn-delete" onClick={() => handleDeleteRow(index)}>X</button>
                </td>
                <td>
                  <label className="exlabel" style={{ width: "100px" }}>{o.orderId}</label>
                </td>
                <td>
                  <label className="exlabel numbercontrol" style={{ width: "30px" }}>{o.orderSeq}</label>
                </td>
                <td>
                    <input className="exinput" type="text" value={o.productId} maxLength={10} style={{ width: "100px" }} onChange={(e) => handleChange(index, "productId", e.target.value)} />
                </td>
                <td>
                    <input className="exinput" type="text" value={o.productName} maxLength={40} style={{ width: "600px" }} onChange={(e) => handleChange(index, "productName", e.target.value)} />
                </td>
                <td>
                    <input className="exinput numbercontrol" type="text" inputMode="numeric" maxLength={5} value={o.qty} onKeyDown={(e) => handleNumberValue(e)} onChange={(e) => handleChange(index, "qty", e.target.value)} style={{ width: "50px" }} />
                </td>
                <td>
                  <label className="exlabel numbercontrol" style={{ width: "120px" }}>{o.totalPrice}</label>
                </td>
                <td>
                  <label className="exlabel">{new Date(o.orderDate).toLocaleString("en-GB", {day: "2-digit",month: "2-digit",year: "numeric",hour: "2-digit",minute: "2-digit",hour12: false})}</label>
                </td>
                <td style={{ display: "none" }}>
                  <input type="text" value={o.rowstate || 0} name="rowstate" readOnly />
                </td>
              </tr>
            ))
          )}
        </tbody>

      </table>

    </div>
  );
}

export default Orders;
