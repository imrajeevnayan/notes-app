package com.notesapp.service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.notesapp.dto.FileAttachmentResponse;
import com.notesapp.entity.FileAttachment;
import com.notesapp.entity.Note;
import com.notesapp.entity.User;
import com.notesapp.repository.FileAttachmentRepository;
import com.notesapp.repository.NoteRepository;
import com.notesapp.repository.UserRepository;

@Service
public class FileStorageService {

	@Value("${file.upload-dir}")
	private String uploadDir;

	@Autowired
	private FileAttachmentRepository fileAttachmentRepository;

	@Autowired
	private NoteRepository noteRepository;

	@Autowired
	private UserRepository userRepository;

	private static final List<String> ALLOWED_FILE_TYPES = Arrays.asList("application/pdf", "image/png", "image/jpeg",
			"image/jpg", "image/gif", "text/plain", "application/msword",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document");

	private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

	@Transactional
	public FileAttachmentResponse storeFile(MultipartFile file, UUID noteId, String username) {
		User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

		Note note = noteRepository.findByIdAndUserId(noteId, user.getId())
				.orElseThrow(() -> new RuntimeException("Note not found or access denied"));

		// Validate file
		validateFile(file);

		try {
			// Create upload directory if it doesn't exist
			Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
			Files.createDirectories(uploadPath);

			// Generate unique filename
			String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
			String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
			String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

			// Copy file to upload directory
			Path targetLocation = uploadPath.resolve(uniqueFilename);
			Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

			// Save file metadata to database
			FileAttachment fileAttachment = new FileAttachment();
			fileAttachment.setFileName(originalFilename);
			fileAttachment.setFileType(file.getContentType());
			fileAttachment.setFileSize(file.getSize());
			fileAttachment.setFilePath(uniqueFilename);
			fileAttachment.setNote(note);

			FileAttachment savedFile = fileAttachmentRepository.save(fileAttachment);

			return new FileAttachmentResponse(savedFile.getId(), savedFile.getFileName(), savedFile.getFileType(),
					savedFile.getFileSize(), savedFile.getUploadedAt());
		} catch (IOException ex) {
			throw new RuntimeException("Could not store file. Please try again!", ex);
		}
	}

	@Transactional(readOnly = true)
	public Resource loadFileAsResource(UUID fileId, String username) {
		User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

		FileAttachment fileAttachment = fileAttachmentRepository.findById(fileId)
				.orElseThrow(() -> new RuntimeException("File not found"));

		// Check if user owns the note that contains this file
		Note note = fileAttachment.getNote();
		if (!note.getUser().getId().equals(user.getId())) {
			throw new RuntimeException("Access denied");
		}

		try {
			Path filePath = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(fileAttachment.getFilePath());
			Resource resource = new UrlResource(filePath.toUri());

			if (resource.exists()) {
				return resource;
			} else {
				throw new RuntimeException("File not found");
			}
		} catch (MalformedURLException ex) {
			throw new RuntimeException("File not found", ex);
		}
	}

	@Transactional
	public void deleteFile(UUID fileId, String username) {
		User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

		FileAttachment fileAttachment = fileAttachmentRepository.findById(fileId)
				.orElseThrow(() -> new RuntimeException("File not found"));

		// Check if user owns the note that contains this file
		Note note = fileAttachment.getNote();
		if (!note.getUser().getId().equals(user.getId())) {
			throw new RuntimeException("Access denied");
		}

		try {
			// Delete physical file
			Path filePath = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(fileAttachment.getFilePath());
			Files.deleteIfExists(filePath);

			// Delete database record
			fileAttachmentRepository.delete(fileAttachment);
		} catch (IOException ex) {
			throw new RuntimeException("Could not delete file", ex);
		}
	}

	private void validateFile(MultipartFile file) {
		if (file.isEmpty()) {
			throw new RuntimeException("File is empty");
		}

		if (file.getSize() > MAX_FILE_SIZE) {
			throw new RuntimeException("File size exceeds maximum limit of 10MB");
		}

		String contentType = file.getContentType();
		if (contentType == null || !ALLOWED_FILE_TYPES.contains(contentType)) {
			throw new RuntimeException("File type not allowed. Allowed types: PDF, images, text files, Word documents");
		}
	}

	public String getFileName(UUID fileId, String username) {
		User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

		FileAttachment fileAttachment = fileAttachmentRepository.findById(fileId)
				.orElseThrow(() -> new RuntimeException("File not found"));

		// Check if user owns the note that contains this file
		Note note = fileAttachment.getNote();
		if (!note.getUser().getId().equals(user.getId())) {
			throw new RuntimeException("Access denied");
		}

		return fileAttachment.getFileName();
	}
    public List<FileAttachmentResponse> storeFiles(List<MultipartFile> files, UUID noteId, String username) {
        List<FileAttachmentResponse> responses = new ArrayList<>();

        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                // Optionally skip or log empty files
                continue;
            }

            // Reuse your existing single-file storage logic
            FileAttachmentResponse response = storeFile(file, noteId, username);
            responses.add(response);
        }

        if (responses.isEmpty()) {
            throw new RuntimeException("No valid files were uploaded");
        }

        return responses;
    }
}
