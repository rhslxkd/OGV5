package com.example.backend.base;

public record LoginRequest(
        String id,
        String pass
) { }