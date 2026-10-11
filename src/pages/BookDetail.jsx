import { CalendarDays, NotebookPen, Pencil, Trash2 } from 'lucide-react';
import '../styles/book-detail.css';

const statusText = {
  owned: 'Belum dibaca',
  reading: 'Sedang dibaca',
  finished: 'Selesai dibaca',
};

export function BookDetail({ book, isAdmin, onEdit, onDelete }) {
  if (!book) {
    return (
      <aside className="book-detail empty-detail">
        <NotebookPen size={24} />
        <p>Pilih buku untuk melihat detail dan catatan.</p>
      </aside>
    );
  }

  return (
    <aside className="book-detail">
      <img src={book.coverUrl} alt={`Cover ${book.title}`} />
      <div className="detail-heading">
        <span>{statusText[book.status]}</span>
        <h2>{book.title}</h2>
        <p>{book.author}</p>
      </div>

      <dl className="detail-list">
        <div>
          <dt>Genre</dt>
          <dd>{book.genre || '-'}</dd>
        </div>
        <div>
          <dt>Rating</dt>
          <dd>{book.rating ? `${book.rating}/5` : '-'}</dd>
        </div>
        <div>
          <dt>
            <CalendarDays size={15} />
            Selesai
          </dt>
          <dd>{book.finishedAt || '-'}</dd>
        </div>
      </dl>

      <section className="notes-panel">
        <h3>Catatan</h3>
        <p>{book.notes || 'Belum ada catatan untuk buku ini.'}</p>
      </section>

      {isAdmin && (
        <div className="detail-actions">
          <button className="ghost-button" type="button" onClick={() => onEdit(book)}>
            <Pencil size={16} />
            Edit
          </button>
          <button className="danger-button" type="button" onClick={() => onDelete(book.id)}>
            <Trash2 size={16} />
            Hapus
          </button>
        </div>
      )}
    </aside>
  );
}
