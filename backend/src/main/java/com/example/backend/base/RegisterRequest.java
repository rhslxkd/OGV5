package com.example.backend.base;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Size(min = 4, max = 10) String id,
        @NotBlank @Size(min = 8, max = 100) String pass,
        @NotBlank @Size(max = 30) String name
) {
}
