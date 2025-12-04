import { useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { apiService } from '../services/apiService';
import { Testimonial, Division } from '../types';

export const useTestimonials = () => {
  const {
    testimonials,
    testimonialsLoading,
    testimonialsError,
    setTestimonials,
    addTestimonial,
    updateTestimonial,
    removeTestimonial,
    setTestimonialsLoading,
    setTestimonialsError,
  } = useAppStore();

  const fetchTestimonials = useCallback(async () => {
    setTestimonialsLoading(true);
    setTestimonialsError(null);
    try {
      const data = await apiService.testimonials.getAll();
      setTestimonials(data);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch testimonials';
      setTestimonialsError(errorMessage);
      throw error;
    } finally {
      setTestimonialsLoading(false);
    }
  }, [setTestimonials, setTestimonialsLoading, setTestimonialsError]);

  const fetchTestimonialById = useCallback(async (id: string) => {
    setTestimonialsLoading(true);
    setTestimonialsError(null);
    try {
      const data = await apiService.testimonials.getById(id);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch testimonial';
      setTestimonialsError(errorMessage);
      throw error;
    } finally {
      setTestimonialsLoading(false);
    }
  }, [setTestimonialsLoading, setTestimonialsError]);

  const fetchTestimonialsByDivision = useCallback(async (division: Division) => {
    setTestimonialsLoading(true);
    setTestimonialsError(null);
    try {
      const data = await apiService.testimonials.getByDivision(division);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch testimonials by division';
      setTestimonialsError(errorMessage);
      throw error;
    } finally {
      setTestimonialsLoading(false);
    }
  }, [setTestimonialsLoading, setTestimonialsError]);

  const createTestimonial = useCallback(async (testimonial: Omit<Testimonial, 'id'>) => {
    setTestimonialsLoading(true);
    setTestimonialsError(null);
    try {
      const newTestimonial = await apiService.testimonials.create(testimonial);
      addTestimonial(newTestimonial);
      return newTestimonial;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create testimonial';
      setTestimonialsError(errorMessage);
      throw error;
    } finally {
      setTestimonialsLoading(false);
    }
  }, [addTestimonial, setTestimonialsLoading, setTestimonialsError]);

  const updateTestimonialById = useCallback(async (id: string, updates: Partial<Testimonial>) => {
    setTestimonialsLoading(true);
    setTestimonialsError(null);
    try {
      const updatedTestimonial = await apiService.testimonials.update(id, updates);
      updateTestimonial(id, updates);
      return updatedTestimonial;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update testimonial';
      setTestimonialsError(errorMessage);
      throw error;
    } finally {
      setTestimonialsLoading(false);
    }
  }, [updateTestimonial, setTestimonialsLoading, setTestimonialsError]);

  const deleteTestimonial = useCallback(async (id: string) => {
    setTestimonialsLoading(true);
    setTestimonialsError(null);
    try {
      await apiService.testimonials.delete(id);
      removeTestimonial(id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete testimonial';
      setTestimonialsError(errorMessage);
      throw error;
    } finally {
      setTestimonialsLoading(false);
    }
  }, [removeTestimonial, setTestimonialsLoading, setTestimonialsError]);

  return {
    testimonials,
    testimonialsLoading,
    testimonialsError,
    fetchTestimonials,
    fetchTestimonialById,
    fetchTestimonialsByDivision,
    createTestimonial,
    updateTestimonialById,
    deleteTestimonial,
  };
};

