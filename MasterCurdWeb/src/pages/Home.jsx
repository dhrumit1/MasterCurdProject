import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h2>Welcome to Billing System</h2>

      <Link to="/orders">Go to Orders</Link>
    </div>
  );
}

export default Home;
