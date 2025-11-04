import { collection, addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const contactsRef = collection(db, "contacts");

export const listenContacts = (callback) => {
  return onSnapshot(contactsRef, (snapshot) => {
    const contacts = [];
    snapshot.forEach(doc => {
      contacts.push({ id: doc.id, ...doc.data() });
    });
    callback(contacts);
  });
};

export const addContact = (contact) => {
  return addDoc(contactsRef, contact);
};

// contacts.js - Firebase delete funksiyası
export const deleteContact = async (id) => {
  try {
    // id-nin doğru tipdə olduğunu yoxlayaq
    if (typeof id !== 'string' && typeof id !== 'number') {
      throw new Error("Invalid ID format");
    }

    const contactDoc = doc(db, "contacts", id);
    await deleteDoc(contactDoc);
    console.log("✅ Contact deleted from Firebase");
  } catch (error) {
    console.error("Error deleting contact from Firebase:", error);
  }
};

