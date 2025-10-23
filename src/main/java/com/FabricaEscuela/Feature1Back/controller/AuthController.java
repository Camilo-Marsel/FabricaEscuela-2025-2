package com.FabricaEscuela.Feature1Back.controller;

import com.FabricaEscuela.Feature1Back.DTO.AuthResponse;
import com.FabricaEscuela.Feature1Back.DTO.LoginRequest;
import com.FabricaEscuela.Feature1Back.DTO.MessageResponse;
import com.FabricaEscuela.Feature1Back.DTO.VerifyCodeRequest;
import com.FabricaEscuela.Feature1Back.config.JwtUtil;
import com.FabricaEscuela.Feature1Back.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            String mensaje = authService.login(request.getCorreo(), request.getPassword());
            return ResponseEntity.ok(MessageResponse.builder()
                    .mensaje(mensaje)
                    .build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(MessageResponse.builder()
                            .mensaje(e.getMessage())
                            .build());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verificarCodigo(@Valid @RequestBody VerifyCodeRequest request) {
        try {
            String token = authService.verificarCodigo(request.getCorreo(), request.getCodigo());
            String rol = jwtUtil.getRolFromToken(token);

            return ResponseEntity.ok(AuthResponse.builder()
                    .token(token)
                    .correo(request.getCorreo())
                    .rol(rol)
                    .mensaje("Autenticación exitosa")
                    .build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(MessageResponse.builder()
                            .mensaje(e.getMessage())
                            .build());
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validarToken(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");

            if (jwtUtil.validateToken(token)) {
                String correo = jwtUtil.getCorreoFromToken(token);
                String rol = jwtUtil.getRolFromToken(token);

                return ResponseEntity.ok(AuthResponse.builder()
                        .token(token)
                        .correo(correo)
                        .rol(rol)
                        .mensaje("Token válido")
                        .build());
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(MessageResponse.builder()
                                .mensaje("Token inválido")
                                .build());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(MessageResponse.builder()
                            .mensaje("Error al validar token")
                            .build());
        }
    }
}