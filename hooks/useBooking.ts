
import { useState } from 'react';
import * as bookingApi from '@/lib/api/bookings';

export const useBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAvailability = async (spaceId: string, params: any) => {
    setLoading(true);
    setError(null);
    try {
      const availability = await bookingApi.checkAvailability(spaceId, params);
      return availability;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to check availability');
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData: any) => {
    setLoading(true);
    setError(null);
    try {
      const newBooking = await bookingApi.createBooking(bookingData);
      return newBooking;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, checkAvailability, createBooking };
};
