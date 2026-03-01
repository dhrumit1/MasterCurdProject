import { useEffect, useState } from "react";
import axios from "axios";
import "../css/Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [originalOrders, setOriginalOrders] = useState([]);

  const setSearchData = async () => {

    try {

      const res = await axios.get(
        "https://localhost:7277/api/orders"
      );

      setOrders(res.data);
      setOriginalOrders(JSON.parse(JSON.stringify(res.data)));

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

    if(originalOrders[index][field] !== updatedOrders[index][field]) {
      updatedOrders[index]["rowstate"] = 2;
    }
    else{
      updatedOrders[index]["rowstate"] = originalOrders[index]["rowstate"];
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

  const emptyOrder = {
    orderId: "",
    orderSeq: "",
    productName: "",
    qty: "",
    totalPrice: 0,
    orderDate: new Date().toISOString(),
    rowstate: 1,
  };

  const handleAddRow = () => {
    setOrders([...orders, emptyOrder]);
  };

  const handleDeleteRow = (index) => {
    const updatedOrders = orders.filter((_, i) => i !== index);
    setOrders(updatedOrders);
  };


  return (
    <div style={{ padding: "20px" }}>
      <h2>Orders List</h2>

      {/* Search Section */}
      <div className="ordersbtns">
        <button className="btn-search" onClick={handleSearch}>Search</button>
        <button className="btn-add" onClick={handleAddRow}>+ Add</button>
        <button className="btn-save">Save</button>
      </div>

      <table border="1" >
        <thead>
          <tr>
            <th>No</th>
            <th></th>
            <th>Order ID</th>
            <th>Seq</th>
            <th>Product</th>
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
              <tr id={index} key={index} >
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
                  <input type="text" value={o.rowstate || 0} name="rowstate"/>
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
