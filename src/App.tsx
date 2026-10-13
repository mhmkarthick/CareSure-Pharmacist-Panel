import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppStateProvider } from './contexts/AppStateContext';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { AllOrders } from './pages/orders/AllOrders';
import { PendingApproval } from './pages/orders/PendingApproval';
import { PendingOrderDetails } from './pages/orders/PendingOrderDetails';
import { ApprovedOrders } from './pages/orders/ApprovedOrders';
import { ApprovedOrderDetails } from './pages/orders/ApprovedOrderDetails';
import { RejectedOrders } from './pages/orders/RejectedOrders';
import { RejectedOrderDetails } from './pages/orders/RejectedOrderDetails';
import { OrderDetails } from './pages/orders/OrderDetails';
import { DoctorReferrals } from './pages/referrals/DoctorReferrals';
import { DoctorReferralDetails } from './pages/referrals/DoctorReferralDetails';
import { CallerReferrals } from './pages/referrals/CallerReferrals';
import { CallerReferralDetails } from './pages/referrals/CallerReferralDetails';
import { Customers } from './pages/Customers';
import { CustomerDetails } from './pages/CustomerDetails';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';

type DataState = 'ready' | 'loading' | 'empty' | 'error';

interface AppProps {
  /** Simulates the data layer so loading, empty and error states can be reviewed on every screen. */
  dataState?: DataState;
}

export function App({ dataState = 'ready' }: AppProps) {
  return (
    <AppStateProvider dataState={dataState}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate replace to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<AllOrders />} />
            <Route path="/orders/pending-approval" element={<PendingApproval />} />
            <Route path="/orders/pending-approval/:orderId" element={<PendingOrderDetails />} />
            <Route path="/orders/approved" element={<ApprovedOrders />} />
            <Route path="/orders/approved/:orderId" element={<ApprovedOrderDetails />} />
            <Route path="/orders/rejected" element={<RejectedOrders />} />
            <Route path="/orders/rejected/:orderId" element={<RejectedOrderDetails />} />
            <Route path="/orders/:orderId" element={<OrderDetails />} />
            <Route path="/referrals" element={<Navigate replace to="/referrals/doctor" />} />
            <Route path="/referrals/doctor" element={<DoctorReferrals />} />
            <Route path="/referrals/doctor/:referralId" element={<DoctorReferralDetails />} />
            <Route path="/referrals/caller" element={<CallerReferrals />} />
            <Route path="/referrals/caller/:referralId" element={<CallerReferralDetails />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/:customerId" element={<CustomerDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-right" richColors closeButton toastOptions={{ style: { fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' } }} />
    </AppStateProvider>);

}