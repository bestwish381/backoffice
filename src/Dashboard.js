import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import DashboardTable from "./DashboardTable";

function Dashboard() {
  const [total, setTotal] = useState(0);
  const [finishedCount, setFinishedCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    // Fetch data from the given API endpoint using axios
    axios
      .get("https://apido.trustyfy.com/user")
      .then((response) => {
        const data = response.data;
        var finished = 0;
        var review = 0;

        // Loop through each object and check the payment_status
        data.forEach((item) => {
          if (item.payment_status === "finished") finished++;
          if (item.payment_status === "review") review++;
        });

        setTotal(data.length);
        setFinishedCount(finished);
        setReviewCount(review);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // This empty dependency array means this useEffect runs once, similar to componentDidMount.

  return (
    <div>
      <div className="cardPanel">
        <div className="cardContainer cardContainer1">
          <div className="cardHeader">
            <span className="iconBox">
              <PersonOutlinedIcon className="iconContent" />
            </span>
          </div>
          <div className="cardBody">
            <h1 className="textTitle">{total}</h1>
          </div>
          <div className="cardFooter">
            <span>
              <b>Total Users</b>
            </span>
          </div>
        </div>

        <div className="cardContainer cardContainer2">
          <div className="cardHeader">
            <span className="iconBox">
              <svg className="iconContent2" />
            </span>
          </div>
          <div className="cardBody">
            <h1 className="textTitle">{finishedCount}</h1>
          </div>
          <div className="cardFooter">
            <span>
              <b>Finished Users</b>
            </span>
          </div>
        </div>

        <div className="cardContainer cardContainer3">
          <div className="cardHeader">
            <span className="iconBox">
              <SearchOutlinedIcon className="iconContent" />
            </span>
          </div>
          <div className="cardBody">
            <h1 className="textTitle">{reviewCount}</h1>
          </div>
          <div className="cardFooter">
            <span>
              <b>Payments to review</b>
            </span>
          </div>
        </div>

        <div className="cardContainer cardContainer4">
          <div className="cardHeader">
            <span className="iconBox">
              <SearchOutlinedIcon className="iconContent" />
            </span>
          </div>
          <div className="cardBody">
            <h1 className="textTitle">{reviewCount}</h1>
          </div>
          <div className="cardFooter">
            <span>
              <b>Reviewed Users</b>
            </span>
          </div>
        </div>
      </div>

      <DashboardTable />
    </div>
  );
}

export default Dashboard;
