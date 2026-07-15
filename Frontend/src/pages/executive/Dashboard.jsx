import React from 'react';
import { useSelector } from 'react-redux';
import StayDashboard from './stay/Dashboard';
import TravelDashboard from './travel/Dashboard';

const Dashboard = () => {
  const { profile } = useSelector((state) => state.auth);
  const isStay = profile?.executiveType === 'stay';
  return isStay ? <StayDashboard /> : <TravelDashboard />;
};

export default Dashboard;
