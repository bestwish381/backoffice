import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './UserDetail.css';

function UserDetail() {
  const { email } = useParams();
  const [userDetail, setUserDetail] = useState({});

  useEffect(() => {
    axios.get(`https://apido.trustyfy.com/user?email=${encodeURIComponent(email)}`)
      .then(response => {
        setUserDetail(response.data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, [email]);

  const renderList = (title, list, fields) => (
    <div className="info">
      <strong className="list-title">{title}:</strong>
      <ul className="list">
        {list.map((item, index) => (
          <li key={index} className="list-item">
            {fields.map(field => (
              <div key={field}>
                <strong>{field}:</strong> {item[field]}
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="card">
      <h1 className="title">{userDetail.account_name}</h1>
      <p className="info"><strong>Email:</strong> {userDetail.email}</p>
      <p className="info"><strong>Payment status:</strong> {userDetail.payment_status}</p>
      <p className="info"><strong>Payment reference:</strong> {userDetail.payment_reference}</p>
      <p className="info"><strong>Main Wallet:</strong> {userDetail.main_wallet}</p>
      {userDetail.wallets && renderList('Wallets', userDetail.wallets, ['id_wallet', 'wallet_address', 'wallet_type', 'wallet_name'])}
      {userDetail.tracked_wallets && renderList('Tracked Wallets', userDetail.tracked_wallets, ['id_tracked_wallet', 'wallet_address', 'wallet_name'])}
      {userDetail.contacts && renderList('Contacts', userDetail.contacts, ['contact_field_1', 'contact_field_2'])}
      {userDetail.companies && renderList('Companies', userDetail.companies, ['company_field_1', 'company_field_2'])}
      {userDetail.referals && renderList('Referrals', userDetail.referals, ['referral_field_1', 'referral_field_2'])}
    </div>
  );
}

export default UserDetail;
