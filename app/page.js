// app/page.js
'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

const Spinner = ({ color = 'text-white' }) => (
  <svg className={`animate-spin h-5 w-5 ${color}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function HomePage() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const router = useRouter();

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);

  // Nayi state form ko dikhane/chupane ke liye
  const [isFormVisible, setIsFormVisible] = useState(false);

  const fetchNotes = useCallback(async (token) => {
    const res = await fetch('/api/notes', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setNotes(data);
    } else {
      localStorage.removeItem('token');
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const decoded = jwtDecode(token);
      setUserInfo(decoded);
      fetchNotes(token);
    } catch (e) {
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, [router, fetchNotes]);

  const handleCreateNote = async (e) => {
    e.preventDefault();
    setError('');
    setIsCreating(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, content }),
      });
      if (res.ok) {
        setTitle('');
        setContent('');
        await fetchNotes(token);
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to create note.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    const token = localStorage.getItem('token');
    if (confirm('Are you sure you want to delete this note?')) {
      setDeletingNoteId(noteId);
      try {
        const res = await fetch(`/api/notes/${noteId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          await fetchNotes(token);
        } else {
          alert('Failed to delete note.');
        }
      } catch (err) {
        alert('An error occurred. Please try again.');
      } finally {
        setDeletingNoteId(null);
      }
    }
  };

  const handleUpdateNote = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/notes/${currentNote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: currentNote.title, content: currentNote.content })
      });
      if (res.ok) {
        setIsEditModalOpen(false);
        setCurrentNote(null);
        await fetchNotes(token);
      } else {
        alert('Failed to update note.');
      }
    } catch (err) {
      alert('An error occurred. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const openEditModal = (note) => {
    setCurrentNote({ ...note });
    setIsEditModalOpen(true);
  };

  const handleUpgrade = async () => {
    const token = localStorage.getItem('token');
    const tenantSlug = userInfo.email.split('@')[1].split('.')[0];
    const res = await fetch(`/api/tenants/${tenantSlug}/upgrade`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      alert('Upgraded to Pro! You can now create unlimited notes.');
      setError('');
    } else {
      alert('Failed to upgrade.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex items-center space-x-2 text-lg font-semibold text-gray-600">
          <Spinner color="text-indigo-600" />
          <span>Loading Your Notes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-600">SaaS Notes</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 hidden sm:block">{userInfo?.email}</span>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                router.push('/login');
              }}
              className="text-sm bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white p-2 md:p-4 rounded-xl shadow-lg mb-8">
          <button
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="w-full flex justify-between text-sm md:text-base items-center py-2 md:py-3 md:px-4 px-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition cursor-pointer"
          >
            <span>{isFormVisible ? 'Close Form' : 'Create a New Note'}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform duration-300 ${isFormVisible ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Collapsible Form Section */}
          <div className={`transition-all duration-500 text-sm md:text-base  ease-in-out overflow-hidden ${isFormVisible ? 'max-h-screen mt-6' : 'max-h-0'}`}>
            <form onSubmit={handleCreateNote} className="space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note Title"
                className="w-full p-3 border outline-none border-gray-300 rounded-lg  transition"
                required
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Note Content"
                className="w-full p-3 border outline-none border-gray-300 rounded-lg  transition"
                rows="4"
                required
              ></textarea>
              <button
                type="submit"
                disabled={isCreating}
                className="w-full flex justify-center py-2 px-3 md:py-3 md:px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition cursor-pointer disabled:bg-green-400 disabled:cursor-not-allowed"
              >
                {isCreating ? <Spinner /> : 'Save Note'}
              </button>
              {error && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-red-600">{error}</p>
                  {error.includes('limit') && userInfo?.role === 'ADMIN' && (
                    <button onClick={handleUpgrade} className="mt-2 text-sm bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition cursor-pointer">
                      Upgrade to Pro
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>

        <div>
          <h2 className="text-lg md:text-xl font-bold mb-4  text-gray-800">Your Notes</h2>
          <div className="space-y-1 md:space-y-4">
            {notes.length > 0 ? (
              notes.map((note) => (
                <div key={note.id} className="bg-white p-5 rounded-xl shadow-lg flex justify-between items-start transition hover:shadow-xl">
                  <div>
                    <h3 className="md:text-lg text-base font-bold text-gray-900">{note.title}</h3>
                    <p className="text-gray-600 mt-2 text-sm md:text-base whitespace-pre-wrap">{note.content}</p>
                  </div>
                  <div className="flex space-x-2 flex-shrink-0 ml-4">
                    <button onClick={() => openEditModal(note)} className="p-2 rounded-full hover:bg-gray-100 transition cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                    </button>
                    <button disabled={deletingNoteId === note.id} onClick={() => handleDeleteNote(note.id)} className="p-2 rounded-full hover:bg-gray-100 transition cursor-pointer disabled:opacity-50">
                      {deletingNoteId === note.id ? <Spinner color="text-red-500" /> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-8 text-center rounded-xl shadow-lg">
                <p className="text-gray-500">You haven't created any notes yet. Start by adding one!</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {isEditModalOpen && (
        <div className="fixed inset-0 md:text-base text-sm bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
            <h2 className="md:text-2xl text-lg font-bold mb-6">Edit Note</h2>
            <form onSubmit={handleUpdateNote}>
              <input
                type="text"
                value={currentNote.title}
                onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              <textarea
                value={currentNote.content}
                onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                rows="6"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              ></textarea>
              <div className="flex justify-end space-x-4">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={isUpdating} className="flex justify-center items-center py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition cursor-pointer disabled:bg-indigo-400">
                  {isUpdating ? <Spinner /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}