import React from 'react';
import { CompassIcon } from 'lucide-react';
import { RecordNotice } from '../components/order/RecordNotice';

export function NotFound() {
  return (
    <RecordNotice
      icon={CompassIcon}
      title="Page not found"
      message="The address you opened doesn't match any screen in the Pharmacist Panel."
      to="/dashboard"
      actionLabel="Go to Dashboard" />);


}