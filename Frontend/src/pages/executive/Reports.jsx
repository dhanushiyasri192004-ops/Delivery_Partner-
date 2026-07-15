import React from 'react';
import { useSelector } from 'react-redux';
import StayReports from './stay/Reports';
import TravelReports from './travel/Reports';

const Reports = () => {
  const { profile } = useSelector((state) => state.auth);
  const isStay = profile?.executiveType === 'stay';
  return isStay ? <StayReports /> : <TravelReports />;
};

export default Reports;
