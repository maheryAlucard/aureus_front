import { useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { apiService } from '../services/apiService';
import { Project } from '../types';

export const useProjects = () => {
  const {
    projects,
    projectsLoading,
    projectsError,
    setProjects,
    addProject,
    updateProject,
    removeProject,
    setProjectsLoading,
    setProjectsError,
  } = useAppStore();

  const fetchProjects = useCallback(async () => {
    setProjectsLoading(true);
    setProjectsError(null);
    try {
      const data = await apiService.projects.getAll();
      setProjects(data);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch projects';
      setProjectsError(errorMessage);
      throw error;
    } finally {
      setProjectsLoading(false);
    }
  }, [setProjects, setProjectsLoading, setProjectsError]);

  const fetchProjectById = useCallback(async (id: string) => {
    setProjectsLoading(true);
    setProjectsError(null);
    try {
      const data = await apiService.projects.getById(id);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch project';
      setProjectsError(errorMessage);
      throw error;
    } finally {
      setProjectsLoading(false);
    }
  }, [setProjectsLoading, setProjectsError]);

  const createProject = useCallback(async (project: Omit<Project, 'id'>) => {
    setProjectsLoading(true);
    setProjectsError(null);
    try {
      const newProject = await apiService.projects.create(project);
      addProject(newProject);
      return newProject;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create project';
      setProjectsError(errorMessage);
      throw error;
    } finally {
      setProjectsLoading(false);
    }
  }, [addProject, setProjectsLoading, setProjectsError]);

  const updateProjectById = useCallback(async (id: string, updates: Partial<Project>) => {
    setProjectsLoading(true);
    setProjectsError(null);
    try {
      const updatedProject = await apiService.projects.update(id, updates);
      updateProject(id, updates);
      return updatedProject;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update project';
      setProjectsError(errorMessage);
      throw error;
    } finally {
      setProjectsLoading(false);
    }
  }, [updateProject, setProjectsLoading, setProjectsError]);

  const deleteProject = useCallback(async (id: string) => {
    setProjectsLoading(true);
    setProjectsError(null);
    try {
      await apiService.projects.delete(id);
      removeProject(id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete project';
      setProjectsError(errorMessage);
      throw error;
    } finally {
      setProjectsLoading(false);
    }
  }, [removeProject, setProjectsLoading, setProjectsError]);

  return {
    projects,
    projectsLoading,
    projectsError,
    fetchProjects,
    fetchProjectById,
    createProject,
    updateProjectById,
    deleteProject,
  };
};


