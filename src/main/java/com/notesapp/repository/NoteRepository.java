package com.notesapp.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.notesapp.entity.Note;

@Repository
public interface NoteRepository extends JpaRepository<Note, UUID> {

	List<Note> findByUserId(UUID userId);

	Optional<Note> findByIdAndUserId(UUID id, UUID userId);
}
