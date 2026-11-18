import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchNotifications,
  makeNotificationsAsRead,
  makeAllNotificationsAsRead,
} from "@/services/notifications";

export default function useNotifications() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetchNotifications({ page: 1, token })
      .then((response) => {
        if (!active) return;
        setItems(response.data);
        setPage(response.current_page);
        setLastPage(response.last_page);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  const loadMore = useCallback(async () => {
    if (page >= lastPage) return;

    try {
      const response = await fetchNotifications({ page: page + 1, token });
      setItems((current) => [...current, ...response.data]);
      setPage(response.current_page);
      setLastPage(response.last_page);
    } catch (err) {
      setError(err.message);
    }
  }, [page, lastPage, token]);

  const markAsRead = useCallback(
    async (id) => {
      setItems((current) =>
        current.map((n) =>
          n.id === id && !n.read_at
            ? { ...n, read_at: new Date().toISOString() }
            : n,
        ),
      );
      try {
        await makeNotificationsAsRead(id, { token });
      } catch (err) {
        setError(err.message);
      }
    },
    [token],
  );

  const markAllAsRead = useCallback(async () => {
    const now = new Date().toISOString();
    setItems((current) =>
      current.map((n) => (n.read_at ? n : { ...n, read_at: now })),
    );
    try {
      await makeAllNotificationsAsRead({ token });
    } catch (err) {
      setError(err.message);
    }
  }, [token]);

  const unreadCount = items.filter((n) => !n.read_at).length;

  return {
    items,
    loading,
    error,
    unreadCount,
    loadMore,
    markAsRead,
    markAllAsRead,
  };
}
