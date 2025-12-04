import { useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { apiService } from '../services/apiService';
import { PricingPackage } from '../services/mockDataService';

export const usePricingPackages = () => {
  const {
    pricingPackages,
    pricingPackagesLoading,
    pricingPackagesError,
    setPricingPackages,
    addPricingPackage,
    updatePricingPackage,
    removePricingPackage,
    setPricingPackagesLoading,
    setPricingPackagesError,
  } = useAppStore();

  const fetchPricingPackages = useCallback(async () => {
    setPricingPackagesLoading(true);
    setPricingPackagesError(null);
    try {
      const data = await apiService.pricingPackages.getAll();
      setPricingPackages(data);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch pricing packages';
      setPricingPackagesError(errorMessage);
      throw error;
    } finally {
      setPricingPackagesLoading(false);
    }
  }, [setPricingPackages, setPricingPackagesLoading, setPricingPackagesError]);

  const fetchPricingPackageById = useCallback(async (id: string) => {
    setPricingPackagesLoading(true);
    setPricingPackagesError(null);
    try {
      const data = await apiService.pricingPackages.getById(id);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch pricing package';
      setPricingPackagesError(errorMessage);
      throw error;
    } finally {
      setPricingPackagesLoading(false);
    }
  }, [setPricingPackagesLoading, setPricingPackagesError]);

  const createPricingPackage = useCallback(async (pkg: Omit<PricingPackage, 'id'>) => {
    setPricingPackagesLoading(true);
    setPricingPackagesError(null);
    try {
      const newPkg = await apiService.pricingPackages.create(pkg);
      addPricingPackage(newPkg);
      return newPkg;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create pricing package';
      setPricingPackagesError(errorMessage);
      throw error;
    } finally {
      setPricingPackagesLoading(false);
    }
  }, [addPricingPackage, setPricingPackagesLoading, setPricingPackagesError]);

  const updatePricingPackageById = useCallback(async (id: string, updates: Partial<PricingPackage>) => {
    setPricingPackagesLoading(true);
    setPricingPackagesError(null);
    try {
      const updatedPkg = await apiService.pricingPackages.update(id, updates);
      updatePricingPackage(id, updates);
      return updatedPkg;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update pricing package';
      setPricingPackagesError(errorMessage);
      throw error;
    } finally {
      setPricingPackagesLoading(false);
    }
  }, [updatePricingPackage, setPricingPackagesLoading, setPricingPackagesError]);

  const deletePricingPackage = useCallback(async (id: string) => {
    setPricingPackagesLoading(true);
    setPricingPackagesError(null);
    try {
      await apiService.pricingPackages.delete(id);
      removePricingPackage(id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete pricing package';
      setPricingPackagesError(errorMessage);
      throw error;
    } finally {
      setPricingPackagesLoading(false);
    }
  }, [removePricingPackage, setPricingPackagesLoading, setPricingPackagesError]);

  return {
    pricingPackages,
    pricingPackagesLoading,
    pricingPackagesError,
    fetchPricingPackages,
    fetchPricingPackageById,
    createPricingPackage,
    updatePricingPackageById,
    deletePricingPackage,
  };
};
