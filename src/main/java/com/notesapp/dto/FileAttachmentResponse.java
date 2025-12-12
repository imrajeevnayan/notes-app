package com.notesapp.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileAttachmentResponse {

	private UUID id;
	private String fileName;
	private String fileType;
	private Long fileSize;
	private LocalDateTime uploadedAt;
}
