package com.katya.app.service;

import com.katya.app.dto.request.LoginRequest;
import com.katya.app.dto.request.PasswordChangeRequest;
import com.katya.app.dto.response.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);

    LoginResponse refreshToken(String refreshTokenValue);

    void logout(String refreshTokenValue);

    void changePassword(Long userId, PasswordChangeRequest request);
}
