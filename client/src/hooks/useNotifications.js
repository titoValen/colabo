import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchNotifications,
  makeNotificationsAsRead,
  makeAllNotificationsAsRead,
  sendPresenceHeartbeat,
} from "@/services/notifications";
import { getNotificationText } from "@/utils/notificationsText";

const REFRESH_INTERVAL = 30_000;

export default function useNotifications() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [dataToken, setDataToken] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const mountedRef = useRef(false);
  const generationRef = useRef(0);
  const itemsRef = useRef(items);
  const knownIdsRef = useRef(new Set());
  const initializedRef = useRef(false);
  const loadingMoreRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    const generation = ++generationRef.current;
    let active = true;
    let refreshInFlight = false;
    let heartbeatInFlight = false;
    knownIdsRef.current = new Set();
    initializedRef.current = false;
    loadingMoreRef.current = false;

    const canUpdate = () =>
      active && mountedRef.current && generationRef.current === generation;

    const refresh = async (showToasts = false) => {
      if (refreshInFlight || !token) return;
      refreshInFlight = true;

      try {
        const response = await fetchNotifications({ page: 1, token });
        if (!canUpdate()) return;

        const freshItems = response.data ?? [];
        const wasInitialized = initializedRef.current;
        const newItems = freshItems.filter(
          (notification) => !knownIdsRef.current.has(notification.id),
        );

        freshItems.forEach((notification) =>
          knownIdsRef.current.add(notification.id),
        );

        if (showToasts && wasInitialized) {
          newItems.reverse().forEach((notification) => {
            const text = getNotificationText(notification);
            toast(
              [text.title, text.body].filter(Boolean).join(" — "),
              { id: `notification-${notification.id}` },
            );
          });
        }

        if (!wasInitialized) {
          setDataToken(token);
          setItems(freshItems);
          setPage(response.current_page ?? 1);
          initializedRef.current = true;
        } else {
          setItems((current) => {
            const merged = new Map(
              freshItems.map((notification) => [notification.id, notification]),
            );
            current.forEach((notification) => {
              if (!merged.has(notification.id)) {
                merged.set(notification.id, notification);
              }
            });
            return [...merged.values()];
          });
        }

        setLastPage(response.last_page ?? 1);
        setUnreadCount(
          response.unread_count ??
            freshItems.filter((notification) => !notification.read_at).length,
        );
        setError("");
      } catch (requestError) {
        if (canUpdate()) {
          if (!initializedRef.current) {
            setDataToken(token);
            setItems([]);
            setPage(1);
            setLastPage(1);
            setUnreadCount(0);
          }
          setError(requestError.message);
        }
      } finally {
        refreshInFlight = false;
        if (canUpdate()) setLoading(false);
      }
    };

    const heartbeat = async () => {
      if (
        heartbeatInFlight ||
        !token ||
        document.visibilityState !== "visible"
      ) {
        return;
      }
      heartbeatInFlight = true;

      try {
        await sendPresenceHeartbeat({ token });
        if (canUpdate()) setError("");
      } catch (requestError) {
        if (canUpdate()) setError(requestError.message);
      } finally {
        heartbeatInFlight = false;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void refresh(true);
        void heartbeat();
      }
    };

    void refresh();
    void heartbeat();
    const refreshInterval = window.setInterval(() => {
      if (document.visibilityState === "visible") void refresh(true);
    }, REFRESH_INTERVAL);
    const heartbeatInterval = window.setInterval(() => {
      void heartbeat();
    }, REFRESH_INTERVAL);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      active = false;
      window.clearInterval(refreshInterval);
      window.clearInterval(heartbeatInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [token]);

  const loadMore = useCallback(async () => {
    if (
      page >= lastPage ||
      loadingMoreRef.current ||
      !token ||
      dataToken !== token
    ) {
      return;
    }
    const generation = generationRef.current;
    loadingMoreRef.current = true;

    try {
      const response = await fetchNotifications({ page: page + 1, token });
      if (!mountedRef.current || generationRef.current !== generation) return;

      response.data.forEach((notification) =>
        knownIdsRef.current.add(notification.id),
      );
      setItems((current) => [...current, ...response.data]);
      setPage(response.current_page);
      setLastPage(response.last_page);
      setUnreadCount(response.unread_count ?? unreadCount);
      setError("");
    } catch (requestError) {
      if (mountedRef.current && generationRef.current === generation) {
        setError(requestError.message);
      }
    } finally {
      if (generationRef.current === generation) loadingMoreRef.current = false;
    }
  }, [page, lastPage, token, dataToken, unreadCount]);

  const markAsRead = useCallback(
    async (id) => {
      const notification = itemsRef.current.find((item) => item.id === id);
      if (!notification || notification.read_at || !token || dataToken !== token) {
        return;
      }
      const generation = generationRef.current;

      try {
        await makeNotificationsAsRead(id, { token });
        if (!mountedRef.current || generationRef.current !== generation) return;

        setItems((current) =>
          current.map((item) =>
            item.id === id
              ? { ...item, read_at: new Date().toISOString() }
              : item,
          ),
        );
        setUnreadCount((current) => Math.max(0, current - 1));
        setError("");
      } catch (requestError) {
        if (mountedRef.current && generationRef.current === generation) {
          setError(requestError.message);
        }
      }
    },
    [token, dataToken],
  );

  const markAllAsRead = useCallback(async () => {
    if (!token || dataToken !== token) return;
    const generation = generationRef.current;

    try {
      await makeAllNotificationsAsRead({ token });
      if (!mountedRef.current || generationRef.current !== generation) return;

      const now = new Date().toISOString();
      setItems((current) =>
        current.map((item) => (item.read_at ? item : { ...item, read_at: now })),
      );
      setUnreadCount(0);
      setError("");
    } catch (requestError) {
      if (mountedRef.current && generationRef.current === generation) {
        setError(requestError.message);
      }
    }
  }, [token, dataToken]);

  const hasCurrentData = Boolean(token) && dataToken === token;
  return {
    items: hasCurrentData ? items : [],
    loading: Boolean(token) && (!hasCurrentData || loading),
    error: hasCurrentData ? error : "",
    unreadCount: hasCurrentData ? unreadCount : 0,
    hasMore: hasCurrentData && page < lastPage,
    loadMore,
    markAsRead,
    markAllAsRead,
  };
}
