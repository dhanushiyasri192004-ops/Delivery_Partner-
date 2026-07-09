import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Delivery Partner Pages
import DeliveryDashboard from './pages/deliveryPartner/Dashboard';
import PickupVerification from './pages/deliveryPartner/PickupVerification';
import DeliveryVerification from './pages/deliveryPartner/DeliveryVerification';
import Wallet from './pages/deliveryPartner/Wallet';
import Profile from './pages/deliveryPartner/Profile';
import ActiveOrders from './pages/deliveryPartner/ActiveOrders';
import AssignedOrders from './pages/deliveryPartner/AssignedOrders';
import OrderHistory from './pages/deliveryPartner/OrderHistory';
import LiveTracking from './pages/deliveryPartner/LiveTracking';
import Withdraw from './pages/deliveryPartner/Withdraw';
import Notifications from './pages/deliveryPartner/Notifications';
import Settings from './pages/deliveryPartner/Settings';

// Technician Pages
import TechnicianDashboard from './pages/technician/Dashboard';
import AssignedServices from './pages/technician/AssignedServices';
import ActiveServices from './pages/technician/ActiveServices';
import CompletedServices from './pages/technician/CompletedServices';
import BeforeServicePhoto from './pages/technician/BeforeServicePhoto';
import AfterServicePhoto from './pages/technician/AfterServicePhoto';
import TechnicianNotifications from './pages/technician/Notifications';
import TechnicianProfile from './pages/technician/Profile';

// Executive Pages
import ExecutiveDashboard from './pages/executive/Dashboard';
import AssignedBookings from './pages/executive/AssignedBookings';
import BookingHistory from './pages/executive/BookingHistory';
import ExecutiveLiveTracking from './pages/executive/LiveTracking';
import ExecutiveWallet from './pages/executive/Wallet';
import ExecutiveProfile from './pages/executive/Profile';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Root Redirect */}
          <Route path="/" element={<Navigate to="/auth/login" replace />} />

          {/* Authentication Suite */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Delivery Partner Console */}
          <Route path="/delivery" element={<DashboardLayout />}>
            <Route path="dashboard" element={<DeliveryDashboard />} />
            <Route path="orders" element={<ActiveOrders />} />
            <Route path="assigned-orders" element={<AssignedOrders />} />
            <Route path="history" element={<OrderHistory />} />
            <Route path="pickup-verification/:orderId" element={<PickupVerification />} />
            <Route path="delivery-verification/:orderId" element={<DeliveryVerification />} />
            <Route path="tracking" element={<LiveTracking />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="withdraw" element={<Withdraw />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Service Technician Console */}
          <Route path="/technician" element={<DashboardLayout />}>
            <Route path="dashboard" element={<TechnicianDashboard />} />
            <Route path="services" element={<ActiveServices />} />
            <Route path="assigned-services" element={<AssignedServices />} />
            <Route path="completed-services" element={<CompletedServices />} />
            <Route path="before-photo" element={<BeforeServicePhoto />} />
            <Route path="after-photo" element={<AfterServicePhoto />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="notifications" element={<TechnicianNotifications />} />
            <Route path="profile" element={<TechnicianProfile />} />
          </Route>

          {/* Corporate Executive Console */}
          <Route path="/executive" element={<DashboardLayout />}>
            <Route path="dashboard" element={<ExecutiveDashboard />} />
            <Route path="trips" element={<AssignedBookings />} />
            <Route path="history" element={<BookingHistory />} />
            <Route path="tracking" element={<ExecutiveLiveTracking />} />
            <Route path="wallet" element={<ExecutiveWallet />} />
            <Route path="profile" element={<ExecutiveProfile />} />
          </Route>

          {/* Fallback Redirect */}
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
