import React from 'react';
import { useSelector } from 'react-redux';
import StayPayments from './stay/Payments';
import TravelPayments from './travel/Payments';

const Payments = () => {
  const { profile } = useSelector((state) => state.auth);
  const isStay = profile?.executiveType === 'stay';
  return isStay ? <StayPayments /> : <TravelPayments />;
};

export default Payments;
