import { useState, useEffect } from 'react';
import { File as FileIcon, Download, Image as ImageIcon, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function FileAttachment({ file, onDelete }) {
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const isImage = file.fileType?.startsWith('image/');

    useEffect(() => {
        let objectUrl = null;

        const fetchImage = async () => {
            if (!isImage || !file.id) return;

            try {
                setLoading(true);
                // Fetch the image as a blob with authentication headers
                const response = await api.get(`/files/${file.id}`, { responseType: 'blob' });
                objectUrl = URL.createObjectURL(response.data);
                setImageUrl(objectUrl);
            } catch (err) {
                console.error("Failed to load image", err);
            } finally {
                setLoading(false);
            }
        };

        if (isImage) {
            fetchImage();
        }

        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [file.id, isImage]);

    const handleDownload = async () => {
        try {
            const response = await api.get(`/files/${file.id}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed", error);
            alert("Failed to download file");
        }
    };

    return (
        <div className="group relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700/50 transition hover:shadow-md">
            {/* Image Preview */}
            {isImage ? (
                <div className="aspect-video w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    {loading ? (
                        <Loader2 className="animate-spin text-blue-500" />
                    ) : imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={file.fileName}
                            className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                            onClick={() => window.open(imageUrl, '_blank')}
                        />
                    ) : (
                        <div className="text-gray-400 flex flex-col items-center">
                            <ImageIcon size={24} />
                            <span className="text-xs mt-1">Preview error</span>
                        </div>
                    )}
                </div>
            ) : (
                /* Generic File Icon */
                <div className="p-4 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <FileIcon className="text-blue-500 w-10 h-10" />
                </div>
            )}

            {/* Metadata & Actions */}
            <div className="p-3 flex justify-between items-center bg-white dark:bg-gray-800">
                <div className="flex-1 min-w-0 mr-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate" title={file.fileName}>
                        {file.fileName}
                    </p>
                    <p className="text-xs text-gray-400">
                        {(file.fileSize / 1024).toFixed(1)} KB
                    </p>
                </div>

                <div className="flex gap-1">
                    <button
                        type="button"
                        onClick={handleDownload}
                        className="p-1.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Download"
                    >
                        <Download size={16} />
                    </button>
                    {onDelete && (
                        <button
                            type="button"
                            onClick={() => onDelete(file.id)}
                            className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                            title="Delete"
                        >
                            <Trash2 size={16} /> {/* Note: Trash2 needs import in parent or pass component */}
                        </button>
                    )}
                </div>
            </div>

            {/* Delete button (Overlay for images) */}
            {onDelete && isImage && (
                <button
                    onClick={() => onDelete(file.id)}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                    <Trash2 size={16} />
                </button>
            )}
        </div>
    );
}

// Helper for Trash Icon since I didn't import it at top
import { Trash2 } from 'lucide-react';
