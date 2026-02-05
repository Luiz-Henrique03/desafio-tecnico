package com.luiz.avaliacao.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.luiz.avaliacao.domain.User;
import com.luiz.avaliacao.dtos.AuthenticationDTO;
import com.luiz.avaliacao.dtos.LoginResponseDTO;
import com.luiz.avaliacao.dtos.RefreshRequestDTO;
import com.luiz.avaliacao.dtos.RegisterDTO;
import com.luiz.avaliacao.repository.UserRepository;
import com.luiz.avaliacao.security.TokenService;
import com.luiz.avaliacao.service.RefreshTokenService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TokenService tokenService;
    @Autowired
    private RefreshTokenService refreshTokenService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid AuthenticationDTO data){
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.getLogin(),data.getPassword());
        var auth = authenticationManager.authenticate(usernamePassword);

        var user = (User) auth.getPrincipal();
        var token = tokenService.generateToken(user);
        var refreshToken = refreshTokenService.createRefreshToken(user.getId());

        return ResponseEntity.ok(new LoginResponseDTO(token, refreshToken.getToken()));
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody @Valid RegisterDTO data){
        if(this.userRepository.findByLogin(data.getLogin()) != null) return ResponseEntity.badRequest().build();

        String encryptedPassword = passwordEncoder.encode(data.getPassword());
        User newUser = new User(data.getLogin(), encryptedPassword);

        this.userRepository.save(newUser);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<LoginResponseDTO> refreshToken(@RequestBody @Valid RefreshRequestDTO request){
        return refreshTokenService.findByToken(request.getToken())
                .map(refreshTokenService::verifyExpiration)
                .map(refreshToken -> {
                    String token = tokenService.generateToken(refreshToken.getUser());
                    return ResponseEntity.ok(new LoginResponseDTO(token, request.getToken()));
                })
                .orElseThrow(() -> new RuntimeException("Refresh token inválido ou inexistente!"));
    }
    
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody @Valid RefreshRequestDTO body) {
        refreshTokenService.deleteByToken(body.getToken());
        return ResponseEntity.noContent().build();
    }
}