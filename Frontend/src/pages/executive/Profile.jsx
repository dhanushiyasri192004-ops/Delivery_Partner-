import React from 'react';
import { useSelector } from 'react-redux';
import StayProfile from './stay/Profile';
import TravelProfile from './travel/Profile';

const Profile = () => {
  const { profile } = useSelector((state) => state.auth);
  const isStay = profile?.executiveType === 'stay';
  return isStay ? <StayProfile /> : <TravelProfile />;
};

export default Profile;
