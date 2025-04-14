import { useState, useEffect, useCallback } from "react";
import { useAtom } from "jotai";
import { activeSectionAtom, userPostsAtom, userAtom } from "../state/atoms";
import { api } from "../services/api";
import { PaginationState } from "../interfaces/pagination";

export const useUserPosts = (userId?: string) => {
  const [user] = useAtom(userAtom);
  const [activeSection] = useAtom(activeSectionAtom);
  const [userPosts, setUserPosts] = useAtom(userPostsAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0,
    hasMore: true,
  });

  const targetUserId = userId || user?.id;

  const fetchUserPosts = useCallback(
    async (page: number = 1) => {
      if (!targetUserId) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get(`/post/${targetUserId}`, {
          params: {
            page,
            limit: pagination.limit,
          },
        });

        setUserPosts(response.data.posts);

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
    [targetUserId, pagination.limit, setUserPosts]
  );

  const setPageSize = useCallback(
    (newLimit: number) => {
      setPagination((prev) => ({
        ...prev,
        limit: newLimit,
        page: 1, // Reset to first page when changing page size
      }));
      fetchUserPosts(1);
    },
    [fetchUserPosts]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      fetchUserPosts(newPage);
    },
    [fetchUserPosts]
  );

  useEffect(() => {
    if (activeSection === "posts" && targetUserId) {
      fetchUserPosts(1); // Start with first page
    }
  }, [activeSection, targetUserId, fetchUserPosts]);

  return {
    userPosts,
    isLoading,
    error,
    refreshPosts: fetchUserPosts,
    pagination,
    handlePageChange,
    setPageSize,
  };
};
