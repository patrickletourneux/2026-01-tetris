import { useState, useEffect } from 'react';
import { NasaApiAdapter } from '../api/NasaApiAdapter';
import type { NasaPhoto } from '../../domain/ports/INasaApi';

const nasaApi = new NasaApiAdapter();

/**
 * Hook React pour récupérer et gérer la photo NASA en arrière-plan.
 */
export function useNasaBackground() {
  const [photo, setPhoto] = useState<NasaPhoto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    nasaApi.fetchPhotoOfTheDay()
      .then(data => {
        setPhoto(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { photo, loading, error };
}
