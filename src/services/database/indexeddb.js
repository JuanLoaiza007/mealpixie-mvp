import { print_error, print_log } from "@/utils/development";
import { userProfileStore } from "@/components/schemas/userProfile";

const STORES_CONFIG = [userProfileStore];

const DB_NAME = "CardLens-DB";

export async function openDB() {
  // 1) Abre con la versión actual (sin forzar) para inspeccionar
  const { db: db0, needsUpgrade } = await new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    let called = false;
    request.onupgradeneeded = () => {
      // Si no pasamos versión, onupgradeneeded no se dispara.
    };
    request.onsuccess = () => {
      if (called) return;
      called = true;
      const db = request.result;
      // Determinar si falta alguna store
      const missing = STORES_CONFIG.some(
        ({ modelName }) => !db.objectStoreNames.contains(modelName)
      );
      resolve({ db, needsUpgrade: missing });
    };
    request.onerror = () => reject(request.error);
  });

  if (!needsUpgrade) {
    print_log("✅ IndexedDB listo (sin cambios).");
    return db0;
  }

  // 2) Si faltan stores, cerramos e incrementamos versión
  const newVersion = db0.version + 1;
  db0.close();
  print_log(`🔄 Actualizando IndexedDB a versión ${newVersion}...`);

  // 3) Reabre con version nueva y crea stores faltantes
  return await new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, newVersion);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      for (const {
        modelName,
        storeConfig = {},
        indexes = [],
      } of STORES_CONFIG) {
        if (!db.objectStoreNames.contains(modelName)) {
          const config = {
            keyPath: storeConfig.keyPath || "id",
            autoIncrement: true,
            ...storeConfig,
          };
          const store = db.createObjectStore(modelName, config);
          print_log(`✅ Store "${modelName}" creado.`);
          for (const { name, keyPath, options } of indexes) {
            store.createIndex(name, keyPath, options);
            print_log(`   🔍 Índice "${name}" en "${modelName}".`);
          }
        }
      }
    };

    request.onsuccess = () => {
      print_log(`✅ IndexedDB actualizado a v${newVersion}.`);
      resolve(request.result);
    };
    request.onerror = () => {
      print_error("❌ Error al actualizar IndexedDB:", request.error);
      reject(request.error);
    };
  });
}

export async function getAll(storeName) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getById(storeName, id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function create(storeName, data) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const req = store.add(data);
    req.onsuccess = () => resolve({ ...data, id: req.result });
    req.onerror = () => reject(req.error);
  });
}

export async function update(storeName, data) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const req = store.put(data);
    req.onsuccess = () => resolve(data);
    req.onerror = () => reject(req.error);
  });
}

export async function remove(storeName, id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const req = store.delete(id);
    req.onsuccess = () => resolve(id);
    req.onerror = () => reject(req.error);
  });
}
