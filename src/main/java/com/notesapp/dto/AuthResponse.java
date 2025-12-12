package com.notesapp.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

	private String token;
	private String type = "Bearer";
	private UUID userId;
	private String username;
	private String email;

	public AuthResponse(String token, UUID userId, String username, String email) {
		this.token = token;
		this.userId = userId;
		this.username = username;
		this.email = email;
	}
}
