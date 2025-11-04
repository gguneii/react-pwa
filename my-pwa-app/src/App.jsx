import { CiMenuBurger } from "react-icons/ci";
import "./index.css";
import { MdDelete } from "react-icons/md";
import { IoIosCall } from "react-icons/io";
import {
  addContact,
  deleteContact,
  listenContacts,
} from "./js/services/contacts";

import {
  saveContactIndexedDB,
  getPendingContacts,
  clearPendingContacts,
} from "./idb";

import React, { useEffect, useState } from "react";

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: "", number: "" });

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker Registered: ", registration);
        })
        .catch((error) => {
          console.log("Service Worker Registration Failed: ", error);
        });
    }
  }, []);

  useEffect(() => {
    const unsub = listenContacts((data) => {
      setContacts(data);
    });
    return () => unsub();
  }, []);

  const handleSubmit = async () => {
    const contact = form;

    if (!navigator.onLine) {
      await saveContactIndexedDB(contact);
      alert("✅ Offline yadda saxlandı. İnternet gələndə göndəriləcək!");

      if ("serviceWorker" in navigator && "sync" in navigator.serviceWorker) {
        const reg = await navigator.serviceWorker.ready;
        reg.sync.register("sync-contacts");
      }
      setForm({ name: "", number: "" }); // ✅ RESET ADDED
      setModalOpen(false); // ✅ RESET ADDED
      return;
    }

    await addContact(contact);
    setForm({ name: "", number: "" }); // ✅ RESET ADDED
    setModalOpen(false); // ✅ RESET ADDED
  };
  const handleDelete = async (id) => {
    if (navigator.onLine) {
      try {
        // Online olduqda Firebase-ə silmə əməliyyatı
        if (typeof id !== "string" && typeof id !== "number") {
          throw new Error("Invalid ID format");
        }
        await deleteContact(id);
        console.log("✅ Contact deleted successfully from Firebase");
      } catch (error) {
        console.error("Error deleting contact from Firebase:", error);
      }
    } else {
      // Offline olduqda IndexedDB-dən silirik
      await deleteContactFromIndexedDB(id);
      alert("✅ Contact deleted offline, will sync when online");
    }
  };

  useEffect(() => {
    const handleOnline = async () => {
      const pending = await getPendingContacts(); // Offline-də saxlanmış kontaktları al
      if (pending.length === 0) return;

      for (const contact of pending) {
        // Firebase-ə sinxronlaşdırırıq
        await addContact(contact);
      }

      await clearPendingContacts(); // Sinxronlaşdırıldıqdan sonra pending data-i təmizləyirik
      console.log(
        "✅ Pending contacts synced to Firestore after going online!"
      );
    };

    // `online` event listener-ını yalnız bir dəfə əlavə edirik
    window.addEventListener("online", handleOnline);

    // `useEffect` bitəndə, event listener-ı təmizləyirik
    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []); // Burada boş array `[]` əlavə edirik ki, `useEffect` yalnız bir dəfə işə düşsün

  return (
    <>
      <nav>
        <a className="nav-logo" href="/">
          Postgram
        </a>
        <CiMenuBurger className="nav-menu" />
      </nav>

      <main>
        <h1>Share your contacts</h1>

        {contacts.map((contact) => (
          <div className="contacts pk-contact" key={contact.id}>
            <div className="contact-image">
              <img src="/icons/contact.avif" alt="contact thumb" />
            </div>
            <div className="contact-details">
              <div className="contact-title">{contact.name}</div>
              <div className="contact-numbers">{contact.number}</div>
            </div>
            <div className="contact-options">
              <IoIosCall />
              <MdDelete onClick={() => handleDelete(contact.id)} />
            </div>
          </div>
        ))}

        <button className="add-btn" onClick={() => setModalOpen(true)}>
          Add
        </button>

        {modalOpen && (
          <div className="modal-overlay" onClick={() => setModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <form className="add-contact">
                <h3>New Contact</h3>
                <input
                  name="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Full Name"
                  type="text"
                />
                <input
                  name="number"
                  placeholder="Phone Number"
                  value={form.number}
                  onChange={(e) => setForm({ ...form, number: e.target.value })}
                  type="text"
                />
                <button type="button" onClick={handleSubmit}>
                  Add Contact
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default App;
