import { useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { apiService } from '../services/apiService';
import { FAQItem } from '../services/mockDataService';

export const useFAQs = () => {
  const {
    faqs,
    faqsLoading,
    faqsError,
    setFAQs,
    addFAQ,
    updateFAQ,
    removeFAQ,
    setFAQsLoading,
    setFAQsError,
  } = useAppStore();

  const fetchFAQs = useCallback(async () => {
    setFAQsLoading(true);
    setFAQsError(null);
    try {
      const data = await apiService.faqs.getAll();
      setFAQs(data);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch FAQs';
      setFAQsError(errorMessage);
      throw error;
    } finally {
      setFAQsLoading(false);
    }
  }, [setFAQs, setFAQsLoading, setFAQsError]);

  const fetchFAQById = useCallback(async (id: string) => {
    setFAQsLoading(true);
    setFAQsError(null);
    try {
      const data = await apiService.faqs.getById(id);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch FAQ';
      setFAQsError(errorMessage);
      throw error;
    } finally {
      setFAQsLoading(false);
    }
  }, [setFAQsLoading, setFAQsError]);

  const createFAQ = useCallback(async (faq: Omit<FAQItem, 'id'>) => {
    setFAQsLoading(true);
    setFAQsError(null);
    try {
      const newFAQ = await apiService.faqs.create(faq);
      addFAQ(newFAQ);
      return newFAQ;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create FAQ';
      setFAQsError(errorMessage);
      throw error;
    } finally {
      setFAQsLoading(false);
    }
  }, [addFAQ, setFAQsLoading, setFAQsError]);

  const updateFAQById = useCallback(async (id: string, updates: Partial<FAQItem>) => {
    setFAQsLoading(true);
    setFAQsError(null);
    try {
      const updatedFAQ = await apiService.faqs.update(id, updates);
      updateFAQ(id, updates);
      return updatedFAQ;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update FAQ';
      setFAQsError(errorMessage);
      throw error;
    } finally {
      setFAQsLoading(false);
    }
  }, [updateFAQ, setFAQsLoading, setFAQsError]);

  const deleteFAQ = useCallback(async (id: string) => {
    setFAQsLoading(true);
    setFAQsError(null);
    try {
      await apiService.faqs.delete(id);
      removeFAQ(id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete FAQ';
      setFAQsError(errorMessage);
      throw error;
    } finally {
      setFAQsLoading(false);
    }
  }, [removeFAQ, setFAQsLoading, setFAQsError]);

  return {
    faqs,
    faqsLoading,
    faqsError,
    fetchFAQs,
    fetchFAQById,
    createFAQ,
    updateFAQById,
    deleteFAQ,
  };
};
