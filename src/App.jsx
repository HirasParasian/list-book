import { useMemo, useState } from 'react';
import { BookOpen, Library, LockKeyhole, Search, SlidersHorizontal } from 'lucide-react';
import { BookForm } from './components/BookForm.jsx';
import { BookGrid } from './components/BookGrid.jsx';
import { BookDetail } from './pages/BookDetail.jsx';
import { useBooks } from './hooks/useBooks.js';
import { useAuth } from './hooks/useAuth.js';
import './styles/app.css';

const statusOptions = [
  { value: 'all', label: 'Semua' },
  { value: 'owned', label: 'Belum dibaca' },
  { value: 'reading', label: 'Dibaca' },
  { value: 'finished', label: 'Selesai' },
];

export default function App() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const { books, loading, saveBook, removeBook } = useBooks();
  const { user, isAdmin, signIn, signOut } = useAuth();

  const selectedBook = books.find((book) => book.id === selectedBookId) ?? null;

  const filteredBooks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return books.filter((book) => {
      const matchesStatus = status === 'all' || book.status === status;
      const searchable = [book.title, book.author, book.genre]
        .join(' ')
        .toLowerCase();

      return matchesStatus && searchable.includes(normalizedQuery);
    });
  }, [books, query, status]);

  const stats = useMemo(() => {
    return {
      total: books.length,
      finished: books.filter((book) => book.status === 'finished').length,
      reading: books.filter((book) => book.status === 'reading').length,
    };
  }, [books]);

  const handleSave = async (book) => {
    const savedId = await saveBook(book);
    setEditingBook(null);
    setSelectedBookId(savedId);
  };

  return (
    <main className="app-shell">
      <header className="hero">
        <nav className="topbar" aria-label="Navigasi utama">
          <div className="brand-mark">
            <Library size={20} />
            <span>Rak Buku</span>
          </div>
          {isAdmin ? (
            <button className="ghost-button" type="button" onClick={signOut}>
              <LockKeyhole size={16} />
              Keluar
            </button>
          ) : (
            <button className="ghost-button" type="button" onClick={signIn}>
              <LockKeyhole size={16} />
              Admin
            </button>
          )}
        </nav>

        <section className="hero-content">
          <div>
            <p className="eyebrow">Koleksi pribadi</p>
            <h1>Buku yang sedang, akan, dan sudah selesai dibaca.</h1>
            <p className="hero-copy">
              Katalog tenang untuk menyimpan catatan, rating, genre, cover, dan jejak kecil dari setiap bacaan.
            </p>
          </div>
          <div className="stats-panel" aria-label="Ringkasan koleksi">
            <span>{stats.total}<small>Buku</small></span>
            <span>{stats.finished}<small>Selesai</small></span>
            <span>{stats.reading}<small>Dibaca</small></span>
          </div>
        </section>
      </header>

      <section className="workspace">
        <aside className="sidebar">
          <div className="search-box">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari judul, penulis, genre"
              aria-label="Cari buku"
            />
          </div>

          <div className="filter-group">
            <div className="filter-title">
              <SlidersHorizontal size={16} />
              Status
            </div>
            <div className="segmented-control">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  className={status === option.value ? 'active' : ''}
                  type="button"
                  onClick={() => setStatus(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {isAdmin && (
            <button
              className="primary-button"
              type="button"
              onClick={() => setEditingBook({})}
            >
              <BookOpen size={18} />
              Tambah Buku
            </button>
          )}

          {user && !isAdmin && (
            <p className="muted-note">Akun ini belum terdaftar sebagai admin.</p>
          )}
        </aside>

        <BookGrid
          books={filteredBooks}
          loading={loading}
          selectedBookId={selectedBookId}
          onSelect={setSelectedBookId}
        />

        <BookDetail
          book={selectedBook}
          isAdmin={isAdmin}
          onEdit={setEditingBook}
          onDelete={removeBook}
        />
      </section>

      {editingBook && (
        <BookForm
          book={editingBook}
          onClose={() => setEditingBook(null)}
          onSave={handleSave}
        />
      )}
    </main>
  );
}
