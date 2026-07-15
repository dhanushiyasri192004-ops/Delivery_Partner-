import React from 'react';
import { useSelector } from 'react-redux';
import StaySettings from './stay/Settings';
import TravelSettings from './travel/Settings';

const Settings = () => {
  const { profile } = useSelector((state) => state.auth);
  const isStay = profile?.executiveType === 'stay';
  return isStay ? <StaySettings /> : <TravelSettings />;
};

export default Settings;
