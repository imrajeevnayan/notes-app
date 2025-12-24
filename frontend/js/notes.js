if (location.pathname.includes('dashboard.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        // Elements
        const notesContainer = document.getElementById('notesContainer');
        const loadingState = document.getElementById('loadingState');
        const emptyState = document.getElementById('emptyState');
        const modal = document.getElementById('noteModal');
        const modalTitle = document.getElementById('modalTitle');
        const noteForm = document.getElementById('noteForm');
        const noteId = document.getElementById('noteId');
        const noteTitle = document.getElementById('noteTitle');
        const noteContent = document.getElementById('noteContent');
        const noteError = document.getElementById('noteError');
        const searchInput = document.getElementById('searchInput');
        const viewBtns = document.querySelectorAll('.view-btn');
        const dropArea = document.getElementById('dropArea');
        const fileInput = document.getElementById('fileInput');
        const filesList = document.getElementById('filesList');

        // State
        let notes = [];
        let view = 'grid'; // 'grid' or 'list'
        let selectedFiles = [];

        // Load notes from backend
        async function loadNotes() {
            try {
                notes = await API.get('/notes');
                renderNotes();
            } catch (err) {
                noteError.textContent = 'Failed to load notes: ' + err.message;
            } finally {
                loadingState.style.display = 'none';
            }
        }

        // Render notes (grid or list view)
        function renderNotes(filter = notes) {
            notesContainer.innerHTML = '';
            if (filter.length === 0) {
                emptyState.classList.remove('hidden');
                return;
            }
            emptyState.classList.add('hidden');

            notesContainer.className = view === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-6';

            filter.forEach(n => {
                const el = document.createElement('div');
                el.className = 'bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer';
                const preview = n.content.length > 150 ? n.content.substring(0, 150) + '...' : n.content;
                el.innerHTML = `
                    <h3 class="text-xl font-semibold mb-2">${escapeHtml(n.title)}</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-4">${escapeHtml(preview)}</p>
                    ${n.attachments && n.attachments.length > 0 ? `<p class="text-sm text-indigo-600 dark:text-indigo-400 mb-2">${n.attachments.length} attachment(s)</p>` : ''}
                    <button class="mt-4 text-red-600 hover:text-red-800 text-sm font-medium" onclick="deleteNote('${n.id}')">Delete</button>
                `;
                el.addEventListener('click', (e) => {
                    if (!e.target.matches('button')) openEdit(n);
                });
                notesContainer.appendChild(el);
            });
        }

        // Escape HTML to prevent XSS
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // Open modal for create/edit
        function openEdit(note = {}) {
            modalTitle.textContent = note.id ? 'Edit Note' : 'Create Note';
            noteId.value = note.id || '';
            noteTitle.value = note.title || '';
            noteContent.value = note.content || '';
            noteError.textContent = '';
            selectedFiles = [];
            renderFilesList();
            modal.classList.remove('hidden');
        }

        // File Upload Handlers
        dropArea.addEventListener('click', () => fileInput.click());

        ['dragover', 'dragenter'].forEach(ev => dropArea.addEventListener(ev, (e) => {
            e.preventDefault();
            dropArea.classList.add('border-indigo-500', 'dark:border-indigo-400');
        }));

        ['dragleave', 'dragend'].forEach(ev => dropArea.addEventListener(ev, () => {
            dropArea.classList.remove('border-indigo-500', 'dark:border-indigo-400');
        }));

        dropArea.addEventListener('drop', (e) => {
            e.preventDefault();
            dropArea.classList.remove('border-indigo-500', 'dark:border-indigo-400');
            handleFiles(e.dataTransfer.files);
        });

        fileInput.addEventListener('change', () => handleFiles(fileInput.files));

        function handleFiles(files) {
            for (const file of files) {
                if (file.size > 10 * 1024 * 1024) { // 10MB limit
                    alert(`File ${file.name} exceeds 10MB limit.`);
                    continue;
                }
                selectedFiles.push(file);
            }
            renderFilesList();
        }

        function renderFilesList() {
            filesList.innerHTML = '';
            selectedFiles.forEach((file, index) => {
                const item = document.createElement('div');
                item.className = 'flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm';
                item.innerHTML = `
                    <span>${file.name} (${(file.size / 1024).toFixed(1)} KB)</span>
                    <button type="button" class="text-red-600 hover:text-red-800" onclick="removeFile(${index})">&times;</button>
                `;
                filesList.appendChild(item);
            });
        }

        window.removeFile = (index) => {
            selectedFiles.splice(index, 1);
            renderFilesList();
        };

        // Save note (text only) and then upload files separately
        noteForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = noteId.value;
            const title = noteTitle.value.trim();
            const content = noteContent.value.trim();
            if (!title || !content) {
                noteError.textContent = 'Title and content are required.';
                return;
            }

            try {
                let note;
                if (id) {
                    note = await API.put(`/notes/${id}`, { title, content });
                } else {
                    note = await API.post('/notes', { title, content });
                }

                // Upload files if any (after note is created/updated)
                if (selectedFiles.length > 0) {
                    const formData = new FormData();
                    selectedFiles.forEach(file => formData.append('files', file));

                    const fileResponse = await fetch(`${API_BASE_URL}/files/upload/${note.id}`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${TokenManager.getToken()}`
                        },
                        body: formData
                    });

                    if (!fileResponse.ok) {
                        const err = await fileResponse.json();
                        throw new Error(err.message || 'Failed to upload attachments');
                    }
                }

                modal.classList.add('hidden');
                selectedFiles = [];
                renderFilesList();
                loadNotes();
            } catch (err) {
                noteError.textContent = err.message || 'Failed to save note';
            }
        });

        // Delete note
        window.deleteNote = async (id) => {
            if (confirm('Are you sure you want to delete this note?')) {
                try {
                    await API.delete(`/notes/${id}`);
                    loadNotes();
                } catch (err) {
                    alert('Failed to delete note: ' + err.message);
                }
            }
        };

        // Event Listeners
        document.getElementById('createNoteBtn').addEventListener('click', () => openEdit());
        document.getElementById('closeModal').addEventListener('click', () => modal.classList.add('hidden'));
        document.getElementById('cancelBtn').addEventListener('click', () => {
            modal.classList.add('hidden');
            selectedFiles = [];
            renderFilesList();
        });

        // Search
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = notes.filter(n =>
                n.title.toLowerCase().includes(term) || n.content.toLowerCase().includes(term)
            );
            renderNotes(filtered);
        });

        // View Toggle
        viewBtns.forEach(btn => btn.addEventListener('click', () => {
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            view = btn.dataset.view;
            renderNotes();
        }));

        // Initial load
        loadNotes();
    });
}