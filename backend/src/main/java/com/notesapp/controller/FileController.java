package com.notesapp.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.notesapp.dto.FileAttachmentResponse;
import com.notesapp.service.FileStorageService;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @Autowired
    private FileStorageService fileStorageService;

    // Updated to support multiple file uploads
    @PostMapping(value = "/upload/{noteId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadFiles(
            @PathVariable UUID noteId,
            @RequestParam("files") List<MultipartFile> files,  // Accepts multiple files with form field name "files"
            Authentication authentication) {
        try {
            // Validate that files list is not empty (optional, based on your requirements)
            if (files == null || files.isEmpty() || files.stream().allMatch(MultipartFile::isEmpty)) {
                return ResponseEntity.badRequest().body(new ErrorResponse("No files provided or all files are empty"));
            }

            List<FileAttachmentResponse> responses = fileStorageService.storeFiles(files, noteId, authentication.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(responses);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/{fileId}")
    public ResponseEntity<?> downloadFile(@PathVariable UUID fileId, Authentication authentication) {
        try {
            Resource resource = fileStorageService.loadFileAsResource(fileId, authentication.getName());
            String fileName = fileStorageService.getFileName(fileId, authentication.getName());

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .body(resource);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<?> deleteFile(@PathVariable UUID fileId, Authentication authentication) {
        try {
            fileStorageService.deleteFile(fileId, authentication.getName());
            return ResponseEntity.ok(new SuccessResponse("File deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    // Inner response classes
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