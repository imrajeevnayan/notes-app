package com.notesapp.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.notesapp.dto.NoteRequest;
import com.notesapp.dto.NoteResponse;
import com.notesapp.service.NoteService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

	@Autowired
	private NoteService noteService;

	@PostMapping
	public ResponseEntity<?> createNote(@Valid @RequestBody NoteRequest request, Authentication authentication) {
		try {
			NoteResponse response = noteService.createNote(request, authentication.getName());
			return ResponseEntity.status(HttpStatus.CREATED).body(response);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
		}
	}

	@GetMapping
	public ResponseEntity<?> getAllNotes(Authentication authentication) {
		try {
			List<NoteResponse> notes = noteService.getAllUserNotes(authentication.getName());
			return ResponseEntity.ok(notes);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
		}
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> getNoteById(@PathVariable UUID id, Authentication authentication) {
		try {
			NoteResponse response = noteService.getNoteById(id, authentication.getName());
			return ResponseEntity.ok(response);
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(e.getMessage()));
		}
	}

	@PutMapping("/{id}")
	public ResponseEntity<?> updateNote(@PathVariable UUID id, @Valid @RequestBody NoteRequest request,
			Authentication authentication) {
		try {
			NoteResponse response = noteService.updateNote(id, request, authentication.getName());
			return ResponseEntity.ok(response);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteNote(@PathVariable UUID id, Authentication authentication) {
		try {
			noteService.deleteNote(id, authentication.getName());
			return ResponseEntity.ok(new SuccessResponse("Note deleted successfully"));
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
		}
	}

	// Response classes
	public static class ErrorResponse {
		private String message;

		public ErrorResponse(String message) {
			this.message = message;
		}

		public String getMessage() {
			return message;
		}

		public void setMessage(String message) {
			this.message = message;
		}
	}

	public static class SuccessResponse {
		private String message;

		public SuccessResponse(String message) {
			this.message = message;
		}

		public String getMessage() {
			return message;
		}

		public void setMessage(String message) {
			this.message = message;
		}
	}
}
