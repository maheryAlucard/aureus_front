import { useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { apiService } from '../services/apiService';
import { BlogPost } from '../types';

export const useBlogPosts = () => {
  const {
    blogPosts,
    blogPostsLoading,
    blogPostsError,
    setBlogPosts,
    addBlogPost,
    updateBlogPost,
    removeBlogPost,
    setBlogPostsLoading,
    setBlogPostsError,
  } = useAppStore();

  const fetchBlogPosts = useCallback(async () => {
    setBlogPostsLoading(true);
    setBlogPostsError(null);
    try {
      const data = await apiService.blogPosts.getAll();
      setBlogPosts(data);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch blog posts';
      setBlogPostsError(errorMessage);
      throw error;
    } finally {
      setBlogPostsLoading(false);
    }
  }, [setBlogPosts, setBlogPostsLoading, setBlogPostsError]);

  const fetchBlogPostById = useCallback(async (id: string) => {
    setBlogPostsLoading(true);
    setBlogPostsError(null);
    try {
      const data = await apiService.blogPosts.getById(id);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch blog post';
      setBlogPostsError(errorMessage);
      throw error;
    } finally {
      setBlogPostsLoading(false);
    }
  }, [setBlogPostsLoading, setBlogPostsError]);

  const fetchBlogPostBySlug = useCallback(async (slug: string) => {
    setBlogPostsLoading(true);
    setBlogPostsError(null);
    try {
      const data = await apiService.blogPosts.getBySlug(slug);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch blog post';
      setBlogPostsError(errorMessage);
      throw error;
    } finally {
      setBlogPostsLoading(false);
    }
  }, [setBlogPostsLoading, setBlogPostsError]);

  const createBlogPost = useCallback(async (post: Omit<BlogPost, 'id'>) => {
    setBlogPostsLoading(true);
    setBlogPostsError(null);
    try {
      const newPost = await apiService.blogPosts.create(post);
      addBlogPost(newPost);
      return newPost;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create blog post';
      setBlogPostsError(errorMessage);
      throw error;
    } finally {
      setBlogPostsLoading(false);
    }
  }, [addBlogPost, setBlogPostsLoading, setBlogPostsError]);

  const updateBlogPostById = useCallback(async (id: string, updates: Partial<BlogPost>) => {
    setBlogPostsLoading(true);
    setBlogPostsError(null);
    try {
      const updatedPost = await apiService.blogPosts.update(id, updates);
      updateBlogPost(id, updates);
      return updatedPost;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update blog post';
      setBlogPostsError(errorMessage);
      throw error;
    } finally {
      setBlogPostsLoading(false);
    }
  }, [updateBlogPost, setBlogPostsLoading, setBlogPostsError]);

  const deleteBlogPost = useCallback(async (id: string) => {
    setBlogPostsLoading(true);
    setBlogPostsError(null);
    try {
      await apiService.blogPosts.delete(id);
      removeBlogPost(id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete blog post';
      setBlogPostsError(errorMessage);
      throw error;
    } finally {
      setBlogPostsLoading(false);
    }
  }, [removeBlogPost, setBlogPostsLoading, setBlogPostsError]);

  return {
    blogPosts,
    blogPostsLoading,
    blogPostsError,
    fetchBlogPosts,
    fetchBlogPostById,
    fetchBlogPostBySlug,
    createBlogPost,
    updateBlogPostById,
    deleteBlogPost,
  };
};
