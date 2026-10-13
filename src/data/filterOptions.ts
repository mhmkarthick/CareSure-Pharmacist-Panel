import type { SelectOption } from '../types/table';

export const orderStatusOptions: SelectOption[] = [
{ value: 'all', label: 'All' },
{ value: 'Pending Approval', label: 'Pending Approval' },
{ value: 'Approved', label: 'Approved' },
{ value: 'Rejected', label: 'Rejected' },
{ value: 'Doctor Review', label: 'Doctor Review' },
{ value: 'Caller Clarification', label: 'Caller Clarification' }];


export const orderTypeOptions: SelectOption[] = [
{ value: 'all', label: 'All' },
{ value: 'OTC', label: 'OTC' },
{ value: 'Upload Prescription', label: 'Upload Prescription' },
{ value: 'Add Rx', label: 'Add Rx' }];


export const amountBandOptions: SelectOption[] = [
{ value: 'all', label: 'Any' },
{ value: 'under-500', label: 'Under ₹500' },
{ value: '500-1500', label: '₹500 – ₹1,500' },
{ value: 'over-1500', label: 'Over ₹1,500' }];


export const rxAvailabilityOptions: SelectOption[] = [
{ value: 'all', label: 'All' },
{ value: 'both', label: 'Uploaded + Doctor Rx' },
{ value: 'doctor', label: 'Doctor Rx only' },
{ value: 'uploaded', label: 'Uploaded only' },
{ value: 'none', label: 'None' }];


export const fulfilmentOptions: SelectOption[] = [
{ value: 'all', label: 'All' },
{ value: 'Awaiting Packing', label: 'Awaiting Packing' },
{ value: 'Packing', label: 'Packing' },
{ value: 'Ready for Dispatch', label: 'Ready for Dispatch' },
{ value: 'Out for Delivery', label: 'Out for Delivery' },
{ value: 'Delivered', label: 'Delivered' }];


export const doctorReferralStatusOptions: SelectOption[] = [
{ value: 'all', label: 'All' },
{ value: 'open', label: 'Open' },
{ value: 'Pending Review', label: 'Pending Review' },
{ value: 'In Review', label: 'In Review' },
{ value: 'Responded', label: 'Responded' },
{ value: 'Returned for Pharmacist Review', label: 'Returned' }];


export const callerReferralStatusOptions: SelectOption[] = [
{ value: 'all', label: 'All' },
{ value: 'open', label: 'Open' },
{ value: 'Pending', label: 'Pending' },
{ value: 'In Progress', label: 'In Progress' },
{ value: 'Clarification Completed', label: 'Clarification Completed' },
{ value: 'Returned to Workflow', label: 'Returned' }];


export const customerStatusOptions: SelectOption[] = [
{ value: 'all', label: 'All' },
{ value: 'Active', label: 'Active' },
{ value: 'Inactive', label: 'Inactive' },
{ value: 'Flagged', label: 'Flagged' }];