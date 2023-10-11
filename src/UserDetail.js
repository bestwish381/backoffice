import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./UserDetail.css";
import { Button, Grid } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

// Función para obtener los datos del usuario
async function fetchUserData(email) {
  try {
    const response = await axios.get(
      `https://apido.trustyfy.com/user?email=${encodeURIComponent(email)}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Función para obtener el correo del referer
async function fetchRefererEmail(referrerId) {
  try {
    const response = await axios.get(
      `https://apido.trustyfy.com/user/${referrerId}`
    );
    return response.data.email;
  } catch (error) {
    throw error;
  }
}

// Función para obtener los detalles de los referals
async function fetchReferalDetails(referals) {
  const details = await Promise.all(
    referals.map(async (referal) => {
      try {
        const response = await axios.get(
          `https://apido.trustyfy.com/user/${referal.referal}`
        );
        return {
          email: response.data.email,
          paymentStatus: response.data.payment_status,
        };
      } catch (error) {
        console.error("Error fetching referal details: ", error);
        return null;
      }
    })
  );
  return details.filter(Boolean);
}

// Función para obtener los correos electrónicos de los referals
async function fetchReferalEmails(referals) {
  const emails = await Promise.all(
    referals.map((referal) => fetchRefererEmail(referal.referal))
  );
  return emails;
}

function UserDetail() {
  const { email } = useParams();
  const [userDetail, setUserDetail] = useState({});
  const [paymentStatus, setPaymentStatus] = useState("");
  const [clientComission, setClientComission] = useState("Default");
  const [fees, setFees] = useState([1, 2]);
  const [statusUpdated, setStatusUpdated] = useState(false);
  const [comissionUpdated, setComissionUpdated] = useState(false);
  const [referalDetails, setReferalDetails] = useState([]);
  const [refererEmail, setRefererEmail] = useState("");
  const [referalEmails, setReferalEmails] = useState([]);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    fetchUserData(email)
      .then((response) => {
        setUserDetail(response);
        setPaymentStatus(response.payment_status || "not defined");
        if (response.referrer) {
          fetchRefererEmail(response.referrer)
            .then((email) => setRefererEmail(email))
            .catch((error) =>
              console.error("Error fetching referer email: ", error)
            );
        }

        if (response.referals) {
          fetchReferalDetails(response.referals)
            .then((referalDetails) => setReferalDetails(referalDetails))
            .catch((error) =>
              console.error("Error fetching referal details: ", error)
            );

          fetchReferalEmails(response.referals)
            .then((emails) => setReferalEmails(emails))
            .catch((error) =>
              console.error("Error fetching referal emails: ", error)
            );
        }
      })
      .catch((error) => {
        console.error("Error fetching user data: ", error);
      });
  }, [email]);

  const handleStatusChange = useCallback(async () => {
    try {
      await axios.put(`https://apido.trustyfy.com/user/${userDetail.id}`, {
        payment_status: paymentStatus,
      });
      fetchUserData(email)
        .then((response) => {
          setUserDetail(response);
          setStatusUpdated(true);
        })
        .catch((error) =>
          console.error("Error fetching user data after status change: ", error)
        );
    } catch (error) {
      console.error("Error updating payment status: ", error);
    }
  }, [email, paymentStatus, userDetail.id]);

  const handleComissionChange = useCallback(async () => {
    try {
      await axios.put(`https://apido.trustyfy.com/user/${userDetail.id}`, {
        fees: fees,
        ref_category: clientComission === "Other" ? "custom" : clientComission,
      });
      fetchUserData(email)
        .then((response) => {
          setUserDetail(response);
          setComissionUpdated(true);
        })
        .catch((error) =>
          console.error(
            "Error fetching user data after commission change: ",
            error
          )
        );
    } catch (error) {
      console.error("Error updating commission: ", error);
    }
  }, [clientComission, email, fees, userDetail.id]);

  const totalPendingPayment =
    referalDetails.filter((referal) => referal.paymentStatus === "finished")
      .length * 50;

  return (
    <div className="user-detail-grid">
      <div className="user-detail-title">
        <div className="userDetail">
          <div className="avatarContent">
            <img
              src="https://preview.keenthemes.com/metronic8/demo1/assets/media/avatars/300-1.jpg"
              alt="image"
              className="avatar"
            />
          </div>

          <div className="userProfile">
            <div className="profileContent">
              <div>
                <span className="userName">{userDetail.account_name}</span>
                <br />
                <span className="userEmail">{userDetail.email}</span>
              </div>
            </div>

            <div className="priceContent">
              <div className="section">
                <span className="pricePanel">
                  <ArrowUpwardIcon className="icon1" />
                  &nbsp; <b className="price">$ 4,500</b>
                </span>
                <span className="userEmail">Earnings</span>
              </div>
              <div className="section">
                <span className="pricePanel">
                  <ArrowDownwardIcon className="icon2" />
                  &nbsp; <b className="price">$ 80</b>
                </span>
                <span className="userEmail">Projects</span>
              </div>
              <div className="section">
                <span className="pricePanel">
                  <ArrowUpwardIcon className="icon1" />
                  &nbsp; <b className="price">% 60</b>
                </span>
                <span className="userEmail">Success Rate</span>
              </div>
            </div>
          </div>
        </div>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="User Infomation" {...a11yProps(0)} />
            <Tab label="Affiliates" {...a11yProps(1)} />
            <Tab label="User Commission" {...a11yProps(2)} />
            <Tab label="Payments" {...a11yProps(3)} />
          </Tabs>
        </Box>
      </div>

      <Box sx={{ width: "100%", padding: "1rem" }}>
        <CustomTabPanel value={value} index={0} style={{ padding: 0 }}>
          <div className="card">
            <h1 className="title">User info</h1>

            <Grid container spacing={2} className="info">
              <Grid xs={4}>
                <strong>Email:</strong>
              </Grid>
              <Grid xs={8}>
                <span> {userDetail.email}</span>
              </Grid>
            </Grid>

            <Grid container spacing={2} className="info">
              <Grid xs={4}>
                <strong>id:</strong>
              </Grid>
              <Grid xs={8}>
                <span> {userDetail.id}</span>
              </Grid>
            </Grid>

            {statusUpdated && (
              <p className="updated-text">Payment status updated</p>
            )}

            <Grid container spacing={2} className="info">
              <Grid xs={4}>
                <strong>Payment status:</strong>
              </Grid>
              <Grid xs={8}>
                <span> {paymentStatus}</span>
                <select
                  className="selector"
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                >
                  <option value="finished">Finished</option>
                  <option value="pending">Pending</option>
                  <option value="waiting">Waiting</option>
                </select>
                <button onClick={handleStatusChange} className="button-filter">
                  Change
                </button>
              </Grid>
            </Grid>

            {statusUpdated && (
              <p className="updated-text">Payment status updated</p>
            )}

            <Grid container spacing={2} className="info">
              <Grid xs={4}>
                <strong>Referer:</strong>
              </Grid>
              <Grid xs={8}>
                <span> {refererEmail || "N/A"}</span>
              </Grid>
            </Grid>

            <Grid container spacing={2} className="info">
              <Grid xs={4}>
                <strong>Payment reference:</strong>
              </Grid>
              <Grid xs={8}>
                <span> {userDetail.payment_reference}</span>
              </Grid>
            </Grid>

            <Grid container spacing={2} className="info">
              <Grid xs={4}>
                <strong>Payment type:</strong>
              </Grid>
              <Grid xs={8}>
                <span> {userDetail.payment_type}</span>
              </Grid>
            </Grid>

            <Grid container spacing={2} className="info">
              <Grid xs={4}>
                <strong>Main Wallet:</strong>
              </Grid>
              <Grid xs={8}>
                <span> {userDetail.main_wallet}</span>
              </Grid>
            </Grid>
          </div>
        </CustomTabPanel>

        <CustomTabPanel value={value} index={1}>
          <div className="card">
            <h1 className="title">Affiliates</h1>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Paid</th>
                </tr>
              </thead>
              <tbody>
                {referalDetails.map((filteredReferalDetail, index) => (
                  <tr key={userDetail.referals[index]?.id_referal}>
                    <td>{userDetail.referals[index]?.id_referal}</td>
                    <td>
                      <Link
                        to={`/user/${encodeURIComponent(
                          filteredReferalDetail.email
                        )}`}
                      >
                        {filteredReferalDetail.email}
                      </Link>
                    </td>
                    <td>
                      {filteredReferalDetail.paymentStatus === "finished"
                        ? "Legacy plan"
                        : filteredReferalDetail.paymentStatus}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CustomTabPanel>

        <CustomTabPanel value={value} index={2}>
          <div className="card">
            {/* Client Commission */}
            <div>
              <h1 className="title">User Commission</h1>

              <Grid container spacing={2} className="info">
                <strong>Client Commission:</strong>
                <select
                  className="selector"
                  value={clientComission}
                  onChange={(e) => {
                    setClientComission(e.target.value);
                    if (e.target.value === "Default") setFees([100, 0]);
                    else if (e.target.value === "Sixth Society")
                      setFees([150, 50]);
                  }}
                >
                  <option value="Default">Default</option>
                  <option value="Sixth Society">Sixth Society</option>
                  <option value="Other">Other</option>
                </select>

                <button
                  onClick={handleComissionChange}
                  className="button-filter"
                >
                  Change
                </button>
              </Grid>

              {clientComission === "Other" ? (
                <div>
                  <div>
                    Commission first level:
                    <input
                      className="inputInteger"
                      type="number"
                      value={fees[0]}
                      onChange={(e) =>
                        setFees([Number(e.target.value), fees[1]])
                      }
                    />
                  </div>
                  <div>
                    Commission second level:
                    <input
                      className="inputInteger"
                      type="number"
                      value={fees[1]}
                      onChange={(e) =>
                        setFees([fees[0], Number(e.target.value)])
                      }
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div>
                    Commission first level:
                    <input
                      className="inputInteger"
                      type="number"
                      value={fees[0]}
                      onChange={(e) =>
                        setFees([Number(e.target.value), fees[1]])
                      }
                    />
                  </div>
                  <div>
                    Commission second level:
                    <input
                      className="inputInteger"
                      type="number"
                      value={fees[1]}
                      onChange={(e) =>
                        setFees([fees[0], Number(e.target.value)])
                      }
                    />
                  </div>
                </div>
              )}
              {comissionUpdated && (
                <p className="updated-text">Client Commission updated</p>
              )}
            </div>
          </div>
        </CustomTabPanel>

        <CustomTabPanel value={value} index={3}>
          <div className="card">
            <h1 className="title">Payments</h1>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Paid</th>
                  <th>Commission</th>
                </tr>
              </thead>
              <tbody>
                {referalDetails
                  .filter((referal) => referal.paymentStatus === "finished")
                  .map((filteredReferalDetail, index) => (
                    <tr key={userDetail.referals[index]?.id_referal}>
                      <td>{userDetail.referals[index]?.id_referal}</td>
                      <td>
                        <Link
                          to={`/user/${encodeURIComponent(
                            filteredReferalDetail.email
                          )}`}
                        >
                          {filteredReferalDetail.email}
                        </Link>
                      </td>
                      <td>{userDetail.referals[index]?.paid?.toString()}</td>
                      <td>$50</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <p className="info">Pending to pay: ${totalPendingPayment}</p>
          </div>
        </CustomTabPanel>
      </Box>
    </div>
  );
}

export default UserDetail;
