import { useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { apiService } from '../services/apiService';
import { Devis } from '../types';

export const useDevis = () => {
  const {
    devis,
    devisLoading,
    devisError,
    setDevis,
    addDevis,
    updateDevis,
    removeDevis,
    setDevisLoading,
    setDevisError,
  } = useAppStore();

  const fetchDevis = useCallback(async () => {
    setDevisLoading(true);
    setDevisError(null);
    try {
      const data = await apiService.devis.getAll();
      setDevis(data);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch devis';
      setDevisError(errorMessage);
      throw error;
    } finally {
      setDevisLoading(false);
    }
  }, [setDevis, setDevisLoading, setDevisError]);

  const fetchDevisById = useCallback(async (id: string) => {
    setDevisLoading(true);
    setDevisError(null);
    try {
      const data = await apiService.devis.getById(id);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch devis';
      setDevisError(errorMessage);
      throw error;
    } finally {
      setDevisLoading(false);
    }
  }, [setDevisLoading, setDevisError]);

  const fetchDevisByUserId = useCallback(async (userId: string) => {
    setDevisLoading(true);
    setDevisError(null);
    try {
      const data = await apiService.devis.getByUserId(userId);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch devis by user';
      setDevisError(errorMessage);
      throw error;
    } finally {
      setDevisLoading(false);
    }
  }, [setDevisLoading, setDevisError]);

  const createDevis = useCallback(async (devis: Omit<Devis, 'id' | 'createdAt'>) => {
    setDevisLoading(true);
    setDevisError(null);
    try {
      const newDevis = await apiService.devis.create(devis);
      addDevis(newDevis);
      return newDevis;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create devis';
      setDevisError(errorMessage);
      throw error;
    } finally {
      setDevisLoading(false);
    }
  }, [addDevis, setDevisLoading, setDevisError]);

  const updateDevisById = useCallback(async (id: string, updates: Partial<Devis>) => {
    setDevisLoading(true);
    setDevisError(null);
    try {
      const updatedDevis = await apiService.devis.update(id, updates);
      updateDevis(id, updates);
      return updatedDevis;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update devis';
      setDevisError(errorMessage);
      throw error;
    } finally {
      setDevisLoading(false);
    }
  }, [updateDevis, setDevisLoading, setDevisError]);

  const deleteDevis = useCallback(async (id: string) => {
    setDevisLoading(true);
    setDevisError(null);
    try {
      await apiService.devis.delete(id);
      removeDevis(id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete devis';
      setDevisError(errorMessage);
      throw error;
    } finally {
      setDevisLoading(false);
    }
  }, [removeDevis, setDevisLoading, setDevisError]);

  return {
    devis,
    devisLoading,
    devisError,
    fetchDevis,
    fetchDevisById,
    fetchDevisByUserId,
    createDevis,
    updateDevisById,
    deleteDevis,
  };
};

