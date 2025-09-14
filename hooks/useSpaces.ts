
import { useState, useCallback } from 'react';
import * as spacesApi from '@/lib/api/spaces';
import { Space } from '@/types/api';

export const useSpaces = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSpaces = useCallback(async (params: any) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedSpaces = await spacesApi.getSpaces(params);
      setSpaces(fetchedSpaces);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch spaces');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSpace = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await spacesApi.deleteSpace(id);
      setSpaces((prevSpaces) => prevSpaces.filter((space) => space.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete space');
    } finally {
      setLoading(false);
    }
  };

  return { spaces, loading, error, getSpaces, deleteSpace };
};
