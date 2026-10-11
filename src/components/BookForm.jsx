import { useState } from 'react';
import { ImagePlus, Save, X } from 'lucide-react';
import { uploadCover } from '../lib/cloudinary.js';
import '../styles/book-form.css';

const initialBook = {
  title: '',
  author: '',
  genre: '',
  status: 'owned',
  finishedAt: '',
  notes: '',
  rating: '',
  coverUrl: '',
};

export function BookForm({ book, onClose, onSave }) {
  const [form, setForm] = useState({ ...initialBook, ...book });
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleCoverUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSaving(true);
    setErrorMessage('');
    try {
      const coverUrl = await uploadCover(file);
      updateField('coverUrl', coverUrl);
    } catch (error) {
      setErrorMessage(`Upload cover gagal: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setErrorMessage('');
    try {
      await onSave({
        ...form,
        rating: form.rating ? Number(form.rating) : null,
      });
    } catch (error) {
      setErrorMessage(`Buku gagal disimpan: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <form className="book-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <div>
            <p className="eyebrow">Editor</p>
            <h2>{book.id ? 'Edit buku' : 'Tambah buku'}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Tutup form">
            <X size={18} />
          </button>
        </div>

        <label>
          Judul
          <input required value={form.title} onChange={(event) => updateField('title', event.target.value)} />
        </label>

        <label>
          Penulis
          <input required value={form.author} onChange={(event) => updateField('author', event.target.value)} />
        </label>

        <div className="form-row">
          <label>
            Genre
            <input value={form.genre} onChange={(event) => updateField('genre', event.target.value)} />
          </label>
          <label>
            Rating
            <input
              min="1"
              max="5"
              step="0.5"
              type="number"
              value={form.rating ?? ''}
              onChange={(event) => updateField('rating', event.target.value)}
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            Status
            <select value={form.status} onChange={(event) => updateField('status', event.target.value)}>
              <option value="owned">Belum dibaca</option>
              <option value="reading">Sedang dibaca</option>
              <option value="finished">Selesai</option>
            </select>
          </label>
          <label>
            Tanggal selesai
            <input
              type="date"
              value={form.finishedAt || ''}
              onChange={(event) => updateField('finishedAt', event.target.value)}
              disabled={form.status !== 'finished'}
            />
          </label>
        </div>

        <label>
          Catatan
          <textarea value={form.notes} onChange={(event) => updateField('notes', event.target.value)} />
        </label>

        <label className="upload-area">
          <ImagePlus size={18} />
          <span>{form.coverUrl ? 'Ganti cover' : 'Upload cover'}</span>
          <input type="file" accept="image/*" onChange={handleCoverUpload} />
        </label>

        {form.coverUrl && <img className="cover-preview" src={form.coverUrl} alt="Preview cover buku" />}

        {errorMessage && <p className="form-error">{errorMessage}</p>}

        <button className="primary-button" type="submit" disabled={saving}>
          <Save size={18} />
          {saving ? 'Menyimpan...' : 'Simpan'}
        </button>
      </form>
    </div>
  );
}
