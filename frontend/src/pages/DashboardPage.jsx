import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import { Search, Plus, Grid, List, Moon, Sun, LogOut, FileText } from 'lucide-react';

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const [notes, setNotes] = useState([]);
    const [view, setView] = useState('grid');
    const [search, setSearch] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [loading, setLoading] = useState(true);

    // Theme Init
    useEffect(() => {
        const saved = localStorage.getItem('theme');
        if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        setDarkMode(!darkMode);
        if (!darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    // Fetch Notes
    const fetchNotes = async () => {
        try {
            const res = await api.get('/notes');
            setNotes(res.data);
        } catch (err) {
            console.error('Failed to fetch notes', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    // Handlers
    const handleSave = (savedNote) => {
        setNotes(prev => {
            const index = prev.findIndex(n => n.id === savedNote.id);
            if (index >= 0) {
                const newNotes = [...prev];
                newNotes[index] = savedNote;
                return newNotes;
            }
            return [savedNote, ...prev];
        });
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.delete(`/notes/${id}`);
            setNotes(prev => prev.filter(n => n.id !== id));
        } catch (err) {
            alert('Failed to delete note');
        }
    };

    const filteredNotes = notes.filter(n =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.content.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            {/* Navbar */}
            <nav className="bg-white dark:bg-gray-800 shadow sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                                Notes App
                            </span>
                        </div>

                        <div className="flex-1 flex items-center justify-center px-8">
                            <div className="w-full max-w-md relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search notes..."
                                    className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-100 dark:bg-gray-700 dark:border-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                            </button>

                            <div className="hidden sm:flex items-center border rounded-lg overflow-hidden border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => setView('grid')}
                                    className={`p-2 ${view === 'grid' ? 'bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400' : 'bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}
                                >
                                    <Grid size={20} />
                                </button>
                                <button
                                    onClick={() => setView('list')}
                                    className={`p-2 ${view === 'list' ? 'bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400' : 'bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}
                                >
                                    <List size={20} />
                                </button>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {user?.username}
                                </span>
                                <button onClick={logout} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full" title="Logout">
                                    <LogOut size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header Actions */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Notes</h1>
                    <button
                        onClick={() => { setEditingNote(null); setIsModalOpen(true); }}
                        className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
                    >
                        <Plus size={20} />
                        <span className="font-medium">New Note</span>
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading notes...</div>
                ) : filteredNotes.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="inline-block p-4 rounded-full bg-blue-50 dark:bg-gray-800 text-blue-500 mb-4">
                            <FileText size={48} />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No notes found</h3>
                        <p className="text-gray-500 dark:text-gray-400">Create your first note to get started!</p>
                    </div>
                ) : (
                    <div className={view === 'grid'
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        : "space-y-4 max-w-3xl mx-auto"
                    }>
                        {filteredNotes.map(note => (
                            <NoteCard
                                key={note.id}
                                note={note}
                                onEdit={(n) => { setEditingNote(n); setIsModalOpen(true); }}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </main>

            <NoteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                note={editingNote}
            />
        </div>
    );
}
