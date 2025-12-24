import { FileText, Edit2, Trash2 } from 'lucide-react';

export default function NoteCard({ note, onEdit, onDelete }) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer group relative">
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white break-words">{note.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 whitespace-pre-wrap break-words line-clamp-4">
                {note.content}
            </p>

            {/* Footer Info */}
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    {/* Date logic could go here if available */}
                    {/* Attachments indicator */}
                    {note.attachments && note.attachments.length > 0 && (
                        <span className="flex items-center text-indigo-600 dark:text-indigo-400">
                            <FileText size={16} className="mr-1" />
                            {note.attachments.length}
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(note); }}
                        className="p-1 text-gray-400 hover:text-blue-500 transition"
                    >
                        <Edit2 size={18} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
                        className="p-1 text-gray-400 hover:text-red-500 transition"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
