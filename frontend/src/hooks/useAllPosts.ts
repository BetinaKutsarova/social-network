import { useState, useEffect, useCallback } from "react";
import { useAtom } from "jotai";
import { activeSectionAtom, allPostsAtom } from "../state/atoms";
import { api } from "../services/api";
import { PaginationState } from "../interfaces/pagination";

export const useAllPosts = () => {
  const [activeSection] = useAtom(activeSectionAtom);
  const [allPosts, setAllPosts] = useAtom(allPostsAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0,
    hasMore: true,
  });

  const fetchAllPosts = useCallback(
    async (page: number = 1) => {
      setIsLoading(true);
      setError(null);

      try {
        const params = {
          page,
          limit: pagination.limit,
        };

        const response = await api.get(`/post/`, { params });
        setAllPosts(response.data.posts);

        setPagination({
          page,
          limit: pagination.limit,
          total: response.data.total,
          hasMore: page * pagination.limit < response.data.total,
        });
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts");
      } finally {
        setIsLoading(false);
      }
    },
    [pagination.limit, setAllPosts]
  );

  const setPageSize = useCallback(
    (newLimit: number) => {
      setPagination((prev) => ({
        ...prev,
        limit: newLimit,
        page: 1, // Reset to first page when changing page size
      }));
      fetchAllPosts(1);
    },
    [fetchAllPosts]
  );

  const handlePageChange = (newPage: number) => {
    fetchAllPosts(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

	useEffect(() => {
    if (activeSection === 'posts') {
      fetchAllPosts(1); // Start with first page
    }
  }, [activeSection, fetchAllPosts]);

  return {
    allPosts,
    isLoading,
    error,
    refreshPosts: fetchAllPosts,
    setPageSize,
    pagination,
    handlePageChange,
  };
};
