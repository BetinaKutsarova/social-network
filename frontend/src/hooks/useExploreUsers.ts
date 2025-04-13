import { useState, useCallback, useEffect, useRef } from "react";
import { api } from "../services/api";
import { User } from "../state/atoms";
import { PaginationState } from "../interfaces/pagination";

interface UseExploreUsersReturn {
  users: User[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationState;
  handlePageChange: (page: number) => void;
  searchUsers: (query: string) => void;
  fetchAllUsers: (page?: number) => Promise<void>;
  isSearchMode: boolean;
  searchQuery: string;
}

export const useExploreUsers = (debounceTime = 500): UseExploreUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 6,
    total: 0,
    hasMore: true,
  });
  
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchAllUsers = useCallback(
    async (page: number = 1) => {
      setIsLoading(true);
      setError(null);

      try {
        const params = {
          page,
          limit: pagination.limit,
        };

        const response = await api.get("/users/all", { params });
        setUsers(response.data.users);

        setPagination({
          page,
          limit: pagination.limit,
          total: response.data.total,
          hasMore: page * pagination.limit < response.data.total,
        });
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users");
      } finally {
        setIsLoading(false);
      }
    },
    [pagination.limit]
  );

  const performSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setIsSearchMode(false);
        return fetchAllUsers(1);
      }

      setIsSearchMode(true);
      setIsLoading(true);
      setError(null);

      try {
        const params = {
          query,
          page: 1, // Reset to first page for new searches
          limit: pagination.limit,
        };

        const response = await api.get("/users/search", { params });
        setUsers(response.data.users);

        setPagination({
          page: 1,
          limit: pagination.limit,
          total: response.data.total,
          hasMore: 1 * pagination.limit < response.data.total,
        });
      } catch (err) {
        console.error("Error searching users:", err);
        setError("Failed to search users");
      } finally {
        setIsLoading(false);
      }
    },
    [pagination.limit, fetchAllUsers]
  );

  const searchUsers = useCallback(
    (query: string) => {
      setSearchQuery(query);
      
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      debounceTimerRef.current = setTimeout(() => {
        performSearch(query);
      }, debounceTime);
    },
    [performSearch, debounceTime]
  );

  const searchWithPage = useCallback(
    async (page: number) => {
      if (!isSearchMode || !searchQuery.trim()) {
        return fetchAllUsers(page);
      }

      setIsLoading(true);
      setError(null);

      try {
        const params = {
          query: searchQuery,
          page,
          limit: pagination.limit,
        };

        const response = await api.get("/users/search", { params });
        setUsers(response.data.users);

        setPagination({
          page,
          limit: pagination.limit,
          total: response.data.total,
          hasMore: page * pagination.limit < response.data.total,
        });
      } catch (err) {
        console.error("Error searching users:", err);
        setError("Failed to search users");
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAllUsers, isSearchMode, searchQuery, pagination.limit]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (isSearchMode && searchQuery.trim()) {
        searchWithPage(newPage);
      } else {
        fetchAllUsers(newPage);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [isSearchMode, searchQuery, searchWithPage, fetchAllUsers]
  );

  useEffect(() => {
    fetchAllUsers(1);
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [fetchAllUsers]);

  return {
    users,
    isLoading,
    error,
    pagination,
    handlePageChange,
    searchUsers,
    fetchAllUsers,
    isSearchMode,
    searchQuery,
  };
};
