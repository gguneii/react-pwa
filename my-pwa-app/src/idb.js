import { openDB } from "idb";

export const initDB = async () => {
  return openDB("postgram-db", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("pending-contacts")) {
        db.createObjectStore("pending-contacts", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });
};

export const saveContactIndexedDB = async (contact) => {
  const db = await initDB();
  await db.add("pending-contacts", contact);
};

export const getPendingContacts = async () => {
  const db = await initDB();
  return await db.getAll("pending-contacts");
};

export const clearPendingContacts = async () => {
  const db = await initDB();
  return await db.clear("pending-contacts");
};

// idb.js - IndexedDB delete funksiyası
export const deleteContactFromIndexedDB = async (id) => {
  const db = await initDB();
  await db.delete("pending-contacts", id);
  console.log("✅ Contact deleted from IndexedDB");
};
