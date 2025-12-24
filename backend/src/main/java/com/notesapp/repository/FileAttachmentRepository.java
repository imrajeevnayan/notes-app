package com.notesapp.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.notesapp.entity.FileAttachment;

@Repository
public interface FileAttachmentRepository extends JpaRepository<FileAttachment, UUID> {

	List<FileAttachment> findByNoteId(UUID noteId);

	void deleteByNoteId(UUID noteId);
}
