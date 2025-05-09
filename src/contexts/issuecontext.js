import React, { createContext, useState, useEffect, useCallback } from 'react';
import { REACT_APP_KOKANJE_API } from '../env';

// API base URL from environment variable or default to localhost
const API_BASE_URL = REACT_APP_KOKANJE_API;

// Create the Issue Context
export const IssueContext = createContext();

// Issue Provider Component
export const IssueProvider = ({ children }) => {
  const [allIssues, setAllIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    unit: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10
  });
  const [sorting, setSorting] = useState({
    field: 'id',
    direction: 'asc'
  });

  // Apply filters and sorting to issues in memory
  const applyFilters = useCallback(() => {
    if (!allIssues.length) return;
    
    let result = [...allIssues];
    
    // Apply status filter
    if (filters.status) {
      result = result.filter(issue => issue.status === filters.status);
    }
    
    // Apply unit filter
    if (filters.unit) {
      result = result.filter(issue => issue.unit === filters.unit);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let valueA = a[sorting.field];
      let valueB = b[sorting.field];
      
      // Handle status field with custom order: 'created', 'in progress', 'resolved', 'closed'
      if (sorting.field === 'status') {
        const statusOrder = {
          'created': 1,
          'in progress': 2,
          'resolved': 3,
          'closed': 4
        };
        
        const orderA = statusOrder[valueA] || 999;
        const orderB = statusOrder[valueB] || 999;
        
        return sorting.direction === 'asc' 
          ? orderA - orderB 
          : orderB - orderA;
      }
      
      // Handle date fields
      if (sorting.field === 'modified_at' || sorting.field === 'created_at') {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }
      
      // Handle string fields
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sorting.direction === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      }
      
      // Handle numeric fields
      return sorting.direction === 'asc' 
        ? valueA - valueB 
        : valueB - valueA;
    });
    
    // Update filtered issues
    setFilteredIssues(result);
    
    // Update pagination
    const totalPages = Math.ceil(result.length / pagination.itemsPerPage);
    setPagination(prev => ({
      ...prev,
      totalPages: totalPages || 1,
      currentPage: Math.min(prev.currentPage, totalPages || 1)
    }));
  }, [allIssues, filters, pagination.itemsPerPage, sorting]);
  
  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);
  
  // Update sorting
  const updateSorting = useCallback((field) => {
    setSorting(prev => {
      if (prev.field === field) {
        // Toggle direction if same field
        return {
          field,
          direction: prev.direction === 'asc' ? 'desc' : 'asc'
        };
      } else {
        // Default to ascending for new field
        return {
          field,
          direction: 'asc'
        };
      }
    });
  }, []);
  
  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      status: "",
      unit: ""
    });
  }, []);
  
  // Effect to apply filters whenever filters, sorting, or allIssues change
  useEffect(() => {
    applyFilters();
  }, [filters, sorting, allIssues, applyFilters]);
  
  // Fetch all issues with pagination
  const fetchIssues = useCallback(async (page = 1, itemsPerPage = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('items_per_page', itemsPerPage);
      
      const response = await fetch(`${API_BASE_URL}/api.php?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setAllIssues(data.issues);
      setPagination({
        currentPage: data.pagination.current_page,
        totalPages: data.pagination.total_pages,
        itemsPerPage: data.pagination.items_per_page
      });
    } catch (err) {
      setError(err.message);
      console.error('Error fetching issues:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single issue by ID
  const fetchIssue = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api.php?id=${id}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching issue:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new issue
  const createIssue = useCallback(async (issueData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(issueData)
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Refresh the issues list
      fetchIssues(pagination.currentPage, pagination.itemsPerPage);
      
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error creating issue:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchIssues, pagination]);

  // Update an existing issue
  const updateIssue = useCallback(async (issueData) => {
    setLoading(true);
    setError(null);
    const { id } = issueData;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api.php/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(issueData)
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Refresh the issues list
      fetchIssues(pagination.currentPage, pagination.itemsPerPage);
      
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error updating issue:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchIssues, pagination]);

  // Context value
  const contextValue = {
    issues: filteredIssues,
    allIssues,
    loading,
    error,
    pagination,
    filters,
    sorting,
    updateFilters,
    resetFilters,
    updateSorting,
    fetchIssues,
    fetchIssue,
    createIssue,
    updateIssue
  };

  return (
    <IssueContext.Provider value={contextValue}>
      {children}
    </IssueContext.Provider>
  );
};

export default IssueContext;
