import { useState, useEffect } from 'react';
import { X, Upload, Trash2, File as FileIcon } from 'lucide-react';
import api from '../services/api';

export default function NoteModal({ isOpen, onClose, onSave, note = null }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState([]); // New files
    const [existingFiles, setExistingFiles] = useState([]); // Files from backend
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setContent(note.content);
            setExistingFiles(note.attachments || []);
        } else {
            setTitle('');
            setContent('');
            setExistingFiles([]);
        }
        setFiles([]);
        setError('');
    }, [note, isOpen]);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const validFiles = newFiles.filter(f => f.size <= 10 * 1024 * 1024);
        if (newFiles.length !== validFiles.length) {
            alert('Some files were ignored because they exceed 10MB.');
        }
        setFiles(prev => [...prev, ...validFiles]);
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const deleteExistingFile = async (fileId) => {
        if (!confirm('Delete this attachment?')) return;
        try {
            await api.delete(`/files/${fileId}`);
            setExistingFiles(prev => prev.filter(f => f.id !== fileId));
        } catch (err) {
            alert('Failed to delete file');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!title.trim() || !content.trim()) {
            setError('Title and content are required');
            return;
        }

        try {
            setUploading(true);
            // 1. Save/Update Note
            let savedNote;
            if (note) {
                const res = await api.put(`/notes/${note.id}`, { title, content });
                savedNote = res.data;
            } else {
                const res = await api.post('/notes', { title, content });
                savedNote = res.data;
            }

            // 2. Upload Files if any
            if (files.length > 0) {
                const formData = new FormData();
                files.forEach(file => formData.append('files', file));

                await api.post(`/files/upload/${savedNote.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            onSave(savedNote);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save note');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold dark:text-white">{note ? 'Edit Note' : 'Create Note'}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Note Title"
                            className="w-full px-4 py-2 text-lg font-semibold border-b border-gray-200 dark:border-gray-700 focus:outline-none focus:border-blue-500 bg-transparent dark:text-white"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="mb-6">
                        <textarea
                            placeholder="Start typing..."
                            className="w-full px-4 py-2 min-h-[200px] resize-none focus:outline-none bg-transparent dark:text-gray-300"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                        />
                    </div>

                    {/* Attachments Section */}
                    <div className="mb-6">
                        <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                            <Upload size={16} /> Attachments
                        </label>

                        {/* New Files */}
                        {files.length > 0 && (
                            <div className="mb-2 space-y-2">
                                {files.map((file, i) => (
                                    <div key={i} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm dark:text-gray-200">
                                        <span className="truncate max-w-[80%]">{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                                        <button type="button" onClick={() => removeFile(i)} className="text-red-500 hover:text-red-700"><X size={16} /></button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Existing Files */}
                        {existingFiles.length > 0 && (
                            <div className="mb-2 space-y-2">
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Existing</p>
                                {existingFiles.map((file) => (
                                    <div key={file.id} className="flex justify-between items-center p-2 bg-blue-50 dark:bg-gray-700/50 border border-blue-100 dark:border-gray-600 rounded text-sm dark:text-gray-200">
                                        <div className="flex items-center gap-2 truncate max-w-[80%]">
                                            <FileIcon size={14} className="text-blue-500" />
                                            <span className="truncate">{file.fileName}</span>
                                        </div>
                                        <button type="button" onClick={() => deleteExistingFile(file.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <input type="file" multiple id="fileUpload" className="hidden" onChange={handleFileChange} />
                        <label htmlFor="fileUpload" className="inline-block px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-gray-700 dark:text-blue-400 rounded cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-600 transition">
                            + Add Files
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <button type="button" onClick={onClose} className="px-5 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">Cancel</button>
                        <button
                            type="submit"
                            disabled={uploading}
                            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {uploading ? 'Saving...' : 'Save Note'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
