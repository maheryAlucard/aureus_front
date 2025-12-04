import { useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { apiService } from '../services/apiService';
import { Lead } from '../types';

export const useLeads = () => {
  const {
    leads,
    leadsLoading,
    leadsError,
    setLeads,
    addLead,
    updateLead,
    removeLead,
    setLeadsLoading,
    setLeadsError,
  } = useAppStore();

  const fetchLeads = useCallback(async () => {
    setLeadsLoading(true);
    setLeadsError(null);
    try {
      const data = await apiService.leads.getAll();
      setLeads(data);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch leads';
      setLeadsError(errorMessage);
      throw error;
    } finally {
      setLeadsLoading(false);
    }
  }, [setLeads, setLeadsLoading, setLeadsError]);

  const fetchLeadById = useCallback(async (id: string) => {
    setLeadsLoading(true);
    setLeadsError(null);
    try {
      const data = await apiService.leads.getById(id);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch lead';
      setLeadsError(errorMessage);
      throw error;
    } finally {
      setLeadsLoading(false);
    }
  }, [setLeadsLoading, setLeadsError]);

  const createLead = useCallback(async (lead: Omit<Lead, 'id' | 'date' | 'status'>) => {
    setLeadsLoading(true);
    setLeadsError(null);
    try {
      const newLead = await apiService.leads.create(lead);
      addLead(newLead);
      return newLead;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create lead';
      setLeadsError(errorMessage);
      throw error;
    } finally {
      setLeadsLoading(false);
    }
  }, [addLead, setLeadsLoading, setLeadsError]);

  const updateLeadById = useCallback(async (id: string, updates: Partial<Lead>) => {
    setLeadsLoading(true);
    setLeadsError(null);
    try {
      const updatedLead = await apiService.leads.update(id, updates);
      updateLead(id, updates);
      return updatedLead;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update lead';
      setLeadsError(errorMessage);
      throw error;
    } finally {
      setLeadsLoading(false);
    }
  }, [updateLead, setLeadsLoading, setLeadsError]);

  const updateLeadStatus = useCallback(async (id: string, status: Lead['status']) => {
    setLeadsLoading(true);
    setLeadsError(null);
    try {
      const updatedLead = await apiService.leads.updateStatus(id, status);
      updateLead(id, { status });
      return updatedLead;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update lead status';
      setLeadsError(errorMessage);
      throw error;
    } finally {
      setLeadsLoading(false);
    }
  }, [updateLead, setLeadsLoading, setLeadsError]);

  const deleteLead = useCallback(async (id: string) => {
    setLeadsLoading(true);
    setLeadsError(null);
    try {
      await apiService.leads.delete(id);
      removeLead(id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete lead';
      setLeadsError(errorMessage);
      throw error;
    } finally {
      setLeadsLoading(false);
    }
  }, [removeLead, setLeadsLoading, setLeadsError]);

  return {
    leads,
    leadsLoading,
    leadsError,
    fetchLeads,
    fetchLeadById,
    createLead,
    updateLeadById,
    updateLeadStatus,
    deleteLead,
  };
};


