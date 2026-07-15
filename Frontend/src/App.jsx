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
import OrderDetails from './pages/deliveryPartner/OrderDetails';

// Technician Pages
import TechnicianDashboard from './pages/technician/Dashboard';
import AssignedServices from './pages/technician/AssignedServices';
import ActiveServices from './pages/technician/ActiveServices';
import CompletedServices from './pages/technician/CompletedServices';
import BeforeServicePhoto from './pages/technician/BeforeServicePhoto';
import AfterServicePhoto from './pages/technician/AfterServicePhoto';
import TechnicianNotifications from './pages/technician/Notifications';
import TechnicianProfile from './pages/technician/Profile';
import TechnicianWallet from './pages/technician/Wallet';

// Executive Switchers
import ExecutiveDashboard from './pages/executive/Dashboard';
import ExecutiveNotifications from './pages/executive/Notifications';
import ExecutiveSettings from './pages/executive/Settings';
import ExecutivePayments from './pages/executive/Payments';
import ExecutiveReports from './pages/executive/Reports';

// Stay Executive Pages
import RoomBookings from './pages/executive/stay/RoomBookings';
import RoomManagement from './pages/executive/stay/RoomManagement';
import Housekeeping from './pages/executive/stay/Housekeeping';
import GuestManagement from './pages/executive/stay/GuestManagement';
import CheckinCheckout from './pages/executive/stay/CheckinCheckout';
import ComplaintsSupport from './pages/executive/stay/ComplaintsSupport';
import Maintenance from './pages/executive/Maintenance';
import StaffManagement from './pages/executive/StaffManagement';

// Travel Executive Pages
import AssignedBookings from './pages/executive/travel/AssignedBookings';
import Buses from './pages/executive/travel/Buses';
import TravelRoutes from './pages/executive/travel/Routes';
import Schedules from './pages/executive/travel/Schedules';
import Passengers from './pages/executive/travel/Passengers';
import Cancelations from './pages/executive/travel/Cancelations';


// Shared Pages
import MembershipCard from './pages/shared/MembershipCard';

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
            <Route path="order-details/:orderId" element={<OrderDetails />} />
            <Route path="tracking" element={<LiveTracking />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="withdraw" element={<Withdraw />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="membership" element={<MembershipCard />} />
          </Route>

          {/* Service Technician Console */}
          <Route path="/technician" element={<DashboardLayout />}>
            <Route path="dashboard" element={<TechnicianDashboard />} />
            <Route path="services" element={<AssignedServices />} />
            <Route path="active-services" element={<ActiveServices />} />
            <Route path="completed-services" element={<CompletedServices />} />
            <Route path="history" element={<CompletedServices />} />
            <Route path="wallet" element={<TechnicianWallet />} />
            <Route path="notifications" element={<TechnicianNotifications />} />
            <Route path="profile" element={<TechnicianProfile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="membership" element={<MembershipCard />} />
          </Route>

          {/* Corporate Executive Console */}
          <Route path="/executive" element={<DashboardLayout />}>
            <Route path="dashboard" element={<ExecutiveDashboard />} />
            <Route path="trips" element={<AssignedBookings />} />
            <Route path="buses" element={<Buses />} />
            <Route path="routes" element={<TravelRoutes />} />
            <Route path="schedules" element={<Schedules />} />
            <Route path="passengers" element={<Passengers />} />
            <Route path="cancelations" element={<Cancelations />} />
            
            <Route path="profile" element={<Navigate to="/executive/settings" replace />} />
            <Route path="bookings" element={<RoomBookings />} />
            <Route path="rooms" element={<RoomManagement />} />
            <Route path="housekeeping" element={<Housekeeping />} />
            <Route path="guests" element={<GuestManagement />} />
            <Route path="checkin-checkout" element={<CheckinCheckout />} />
            <Route path="payments" element={<ExecutivePayments />} />
            <Route path="complaints" element={<ComplaintsSupport />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="staff" element={<StaffManagement />} />
            <Route path="notifications" element={<ExecutiveNotifications />} />
            <Route path="reports" element={<ExecutiveReports />} />
            <Route path="settings" element={<ExecutiveSettings />} />
            <Route path="membership" element={<MembershipCard />} />
          </Route>

          {/* Fallback Redirect */}
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
