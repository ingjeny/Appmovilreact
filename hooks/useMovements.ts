import { useState, useEffect, useCallback } from 'react';
import { Movement } from '../types';
import { storageService } from '../services/storage';

export function useMovements() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMovements = useCallback(async () => {
    setLoading(true);
    const data = await storageService.getMovements();
    setMovements(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadMovements();
  }, [loadMovements]);

  const addMovement = async (movement: Movement) => {
    await storageService.addMovement(movement);
    await loadMovements();
  };

  const deleteMovement = async (id: string) => {
    await storageService.deleteMovement(id);
    await loadMovements();
  };

  const clearAll = async () => {
    await storageService.clearAllData();
    await loadMovements();
  };

  return {
    movements,
    loading,
    addMovement,
    deleteMovement,
    clearAll,
    refresh: loadMovements,
  };
}