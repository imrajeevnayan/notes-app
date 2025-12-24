package com.notesapp.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.notesapp.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.notesapp.dto.FileAttachmentResponse;
import com.notesapp.dto.NoteRequest;
import com.notesapp.dto.NoteResponse;
import com.notesapp.entity.Note;
import com.notesapp.repository.NoteRepository;
import com.notesapp.repository.UserRepository;

@Service
public class NoteService {

	@Autowired
	private NoteRepository noteRepository;

	@Autowired
	private UserRepository userRepository;

	@Transactional
	public NoteResponse createNote(NoteRequest request, String username) {
		User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

		Note note = new Note();
		note.setTitle(request.getTitle());
		note.setContent(request.getContent());
		note.setUser(user);

		Note savedNote = noteRepository.save(note);
		return convertToResponse(savedNote);
	}

	@Transactional
	public NoteResponse updateNote(UUID noteId, NoteRequest request, String username) {
		User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

		Note note = noteRepository.findByIdAndUserId(noteId, user.getId())
				.orElseThrow(() -> new RuntimeException("Note not found or access denied"));

		note.setTitle(request.getTitle());
		note.setContent(request.getContent());

		Note updatedNote = noteRepository.save(note);
		return convertToResponse(updatedNote);
	}

	@Transactional
	public void deleteNote(UUID noteId, String username) {
		User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

		Note note = noteRepository.findByIdAndUserId(noteId, user.getId())
				.orElseThrow(() -> new RuntimeException("Note not found or access denied"));

		noteRepository.delete(note);
	}

	@Transactional(readOnly = true)
	public NoteResponse getNoteById(UUID noteId, String username) {
		User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

		Note note = noteRepository.findByIdAndUserId(noteId, user.getId())
				.orElseThrow(() -> new RuntimeException("Note not found or access denied"));

		return convertToResponse(note);
	}

	@Transactional(readOnly = true)
	public List<NoteResponse> getAllUserNotes(String username) {
		User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

		List<Note> notes = noteRepository.findByUserId(user.getId());
		return notes.stream().map(this::convertToResponse).collect(Collectors.toList());
	}

	private NoteResponse convertToResponse(Note note) {
		NoteResponse response = new NoteResponse();
		response.setId(note.getId());
		response.setTitle(note.getTitle());
		response.setContent(note.getContent());
		response.setCreatedAt(note.getCreatedAt());
		response.setUpdatedAt(note.getUpdatedAt());

		List<FileAttachmentResponse> fileResponses = note.getFileAttachments().stream()
				.map(file -> new FileAttachmentResponse(file.getId(), file.getFileName(), file.getFileType(),
						file.getFileSize(), file.getUploadedAt()))
				.collect(Collectors.toList());

		response.setFileAttachments(fileResponses);
		return response;
	}
}
