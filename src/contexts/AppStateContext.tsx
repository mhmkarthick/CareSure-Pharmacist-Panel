import React, { createContext, useContext } from 'react';
import { useWorkflowState, type WorkflowState } from '../hooks/useWorkflowState';
import type { DataState } from '../types/preferences';

interface AppStateValue extends WorkflowState {
  dataState: DataState;
}

const AppStateContext = createContext<AppStateValue | null>(null);

interface AppStateProviderProps {
  dataState: DataState;
  children: React.ReactNode;
}

export function AppStateProvider({ dataState, children }: AppStateProviderProps) {
  const workflow = useWorkflowState();
  return <AppStateContext.Provider value={{ ...workflow, dataState }}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const value = useContext(AppStateContext);
  if (!value) throw new Error('useAppState must be used within AppStateProvider');
  return value;
}