import { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db, firebaseReady } from '../lib/firebase.js';
import { sampleBooks } from '../data/sampleBooks.js';

const booksCollection = firebaseReady ? collection(db, 'books') : null;

export function useBooks() {
  const [books, setBooks] = useState(sampleBooks);
  const [loading, setLoading] = useState(Boolean(firebaseReady));

  useEffect(() => {
    if (!firebaseReady) return undefined;

    const booksQuery = query(booksCollection, orderBy('createdAt', 'desc'));
    return onSnapshot(
      booksQuery,
      (snapshot) => {
        setBooks(snapshot.docs.map((bookDoc) => ({ id: bookDoc.id, ...bookDoc.data() })));
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        alert(`Data buku gagal dimuat: ${error.message}`);
      },
    );
  }, []);

  const saveBook = async (book) => {
    if (!firebaseReady) {
      const fallbackId = book.id || crypto.randomUUID();
      setBooks((current) => {
        const nextBook = { ...book, id: fallbackId };
        return book.id
          ? current.map((item) => (item.id === book.id ? nextBook : item))
          : [nextBook, ...current];
      });
      return fallbackId;
    }

    const payload = {
      title: book.title,
      author: book.author,
      genre: book.genre,
      status: book.status,
      finishedAt: book.finishedAt || '',
      notes: book.notes,
      rating: book.rating,
      coverUrl: book.coverUrl || '/placeholder-cover.svg',
      updatedAt: serverTimestamp(),
    };

    if (book.id) {
      await setDoc(doc(db, 'books', book.id), payload, { merge: true });
      return book.id;
    }

    const created = await addDoc(booksCollection, {
      ...payload,
      createdAt: serverTimestamp(),
    });
    return created.id;
  };

  const removeBook = async (bookId) => {
    if (!firebaseReady) {
      setBooks((current) => current.filter((book) => book.id !== bookId));
      return;
    }

    await deleteDoc(doc(db, 'books', bookId));
  };

  return { books, loading, saveBook, removeBook };
}
