"use client";

import { useEffect, useState, useRef } from "react"; // Import useRef
import {
  getAll,
  create as dbCreate,
  update as dbUpdate,
} from "@/services/database/indexeddb";
import {
  userProfileStore,
  initialProfile,
  userProfileSchema,
} from "@/components/schemas/userProfile";

export function useUserProfile() {
  const STORE = userProfileStore.modelName;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const isInitializing = useRef(false); // Nueva referencia para controlar la inicialización

  useEffect(() => {
    async function init() {
      if (isInitializing.current) {
        return; // Si ya se está inicializando, no hacer nada
      }
      isInitializing.current = true; // Marcar como inicializando

      try {
        const all = await getAll(STORE);
        if (all.length > 0) {
          setProfile(all[0]);
        } else {
          const parsed = userProfileSchema.safeParse(initialProfile);
          if (!parsed.success) throw parsed.error;
          const created = await dbCreate(STORE, parsed.data);
          setProfile(created);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
        isInitializing.current = false; // Marcar como finalizado
      }
    }
    init();
  }, []);

  async function updateProfile(data) {
    setLoading(true);
    try {
      const toSave = { ...profile, ...data };
      const parsed = userProfileSchema.safeParse(toSave);
      if (!parsed.success) throw parsed.error;
      const updated = await dbUpdate(STORE, parsed.data);
      setProfile(updated);
      return updated;
    } finally {
      setLoading(false);
    }
  }

  return { profile, loading, updateProfile };
}
