import { useEffect, useRef, useCallback } from "react";

interface UseAutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  delay?: number;
  enabled?: boolean;
}

export function useAutoSave<T>({
  data,
  onSave,
  delay = 1000,
  enabled = true,
}: UseAutoSaveOptions<T>) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef<T>(data);
  const isSavingRef = useRef(false);

  const save = useCallback(async () => {
    if (isSavingRef.current || !enabled) return;

    isSavingRef.current = true;
    try {
      await onSave(data);
      previousDataRef.current = data;
    } catch (error) {
      console.error("Auto-save failed:", error);
    } finally {
      isSavingRef.current = false;
    }
  }, [data, onSave, enabled]);

  useEffect(() => {
    if (!enabled) return;

    const dataChanged =
      JSON.stringify(data) !== JSON.stringify(previousDataRef.current);

    if (dataChanged) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        save();
      }, delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, save, enabled]);

  return { isSaving: isSavingRef.current };
}
