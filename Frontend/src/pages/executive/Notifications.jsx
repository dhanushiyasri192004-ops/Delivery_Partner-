import React from 'react';
import { useSelector } from 'react-redux';
import StayNotifications from './stay/Notifications';
import TravelNotifications from './travel/Notifications';

const Notifications = () => {
  const { profile } = useSelector((state) => state.auth);
  const isStay = profile?.executiveType === 'stay';
  return isStay ? <StayNotifications /> : <TravelNotifications />;
};

export default Notifications;
