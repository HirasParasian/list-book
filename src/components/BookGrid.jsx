import { Star } from 'lucide-react';
import '../styles/book-grid.css';

const statusLabels = {
  owned: 'Belum dibaca',
  reading: 'Sedang dibaca',
  finished: 'Selesai',
};

export function BookGrid({ books, loading, selectedBookId, onSelect }) {
  if (loading) {
    return <section className="book-grid"><p className="empty-state">Memuat koleksi...</p></section>;
  }

  if (!books.length) {
    return <section className="book-grid"><p className="empty-state">Belum ada buku yang cocok.</p></section>;
  }

  return (
    <section className="book-grid" aria-label="Daftar buku">
      {books.map((book) => (
        <button
          key={book.id}
          className={`book-card ${selectedBookId === book.id ? 'selected' : ''}`}
          type="button"
          onClick={() => onSelect(book.id)}
        >
          <img src={book.coverUrl} alt={`Cover ${book.title}`} />
          <span className="book-status">{statusLabels[book.status]}</span>
          <div className="book-card-body">
            <h2>{book.title}</h2>
            <p>{book.author}</p>
            <div className="book-meta">
              <span>{book.genre}</span>
              <span>
                <Star size={14} fill="currentColor" />
                {book.rating || '-'}
              </span>
            </div>
          </div>
        </button>
      ))}
    </section>
  );
}
