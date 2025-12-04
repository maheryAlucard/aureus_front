import { useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { apiService } from '../services/apiService';
import { TeamMember, Division } from '../types';

export const useTeamMembers = () => {
  const {
    teamMembers,
    teamMembersLoading,
    teamMembersError,
    setTeamMembers,
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
    setTeamMembersLoading,
    setTeamMembersError,
  } = useAppStore();

  const fetchTeamMembers = useCallback(async () => {
    setTeamMembersLoading(true);
    setTeamMembersError(null);
    try {
      const data = await apiService.teamMembers.getAll();
      setTeamMembers(data);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch team members';
      setTeamMembersError(errorMessage);
      throw error;
    } finally {
      setTeamMembersLoading(false);
    }
  }, [setTeamMembers, setTeamMembersLoading, setTeamMembersError]);

  const fetchTeamMemberById = useCallback(async (id: string) => {
    setTeamMembersLoading(true);
    setTeamMembersError(null);
    try {
      const data = await apiService.teamMembers.getById(id);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch team member';
      setTeamMembersError(errorMessage);
      throw error;
    } finally {
      setTeamMembersLoading(false);
    }
  }, [setTeamMembersLoading, setTeamMembersError]);

  const fetchTeamMembersByDivision = useCallback(async (division: Division) => {
    setTeamMembersLoading(true);
    setTeamMembersError(null);
    try {
      const data = await apiService.teamMembers.getByDivision(division);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch team members by division';
      setTeamMembersError(errorMessage);
      throw error;
    } finally {
      setTeamMembersLoading(false);
    }
  }, [setTeamMembersLoading, setTeamMembersError]);

  const fetchFeaturedTeamMembers = useCallback(async () => {
    setTeamMembersLoading(true);
    setTeamMembersError(null);
    try {
      const data = await apiService.teamMembers.getFeatured();
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch featured team members';
      setTeamMembersError(errorMessage);
      throw error;
    } finally {
      setTeamMembersLoading(false);
    }
  }, [setTeamMembersLoading, setTeamMembersError]);

  const createTeamMember = useCallback(async (member: Omit<TeamMember, 'id'>) => {
    setTeamMembersLoading(true);
    setTeamMembersError(null);
    try {
      const newMember = await apiService.teamMembers.create(member);
      addTeamMember(newMember);
      return newMember;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create team member';
      setTeamMembersError(errorMessage);
      throw error;
    } finally {
      setTeamMembersLoading(false);
    }
  }, [addTeamMember, setTeamMembersLoading, setTeamMembersError]);

  const updateTeamMemberById = useCallback(async (id: string, updates: Partial<TeamMember>) => {
    setTeamMembersLoading(true);
    setTeamMembersError(null);
    try {
      const updatedMember = await apiService.teamMembers.update(id, updates);
      updateTeamMember(id, updates);
      return updatedMember;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update team member';
      setTeamMembersError(errorMessage);
      throw error;
    } finally {
      setTeamMembersLoading(false);
    }
  }, [updateTeamMember, setTeamMembersLoading, setTeamMembersError]);

  const deleteTeamMember = useCallback(async (id: string) => {
    setTeamMembersLoading(true);
    setTeamMembersError(null);
    try {
      await apiService.teamMembers.delete(id);
      removeTeamMember(id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete team member';
      setTeamMembersError(errorMessage);
      throw error;
    } finally {
      setTeamMembersLoading(false);
    }
  }, [removeTeamMember, setTeamMembersLoading, setTeamMembersError]);

  return {
    teamMembers,
    teamMembersLoading,
    teamMembersError,
    fetchTeamMembers,
    fetchTeamMemberById,
    fetchTeamMembersByDivision,
    fetchFeaturedTeamMembers,
    createTeamMember,
    updateTeamMemberById,
    deleteTeamMember,
  };
};

