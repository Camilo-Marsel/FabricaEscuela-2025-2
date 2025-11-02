package com.FabricaEscuela.Feature1Back.service;

import com.FabricaEscuela.Feature1Back.config.JwtUtil;
import com.FabricaEscuela.Feature1Back.entity.CodigoVerificacion;
import com.FabricaEscuela.Feature1Back.entity.Usuario;
import com.FabricaEscuela.Feature1Back.repository.CodigoVerificacionRepository;
import com.FabricaEscuela.Feature1Back.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CodigoVerificacionRepository codigoVerificacionRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${verification.code.expiration}")
    private Long codeExpiration;

    @Transactional
    public String login(String correo, String password) {
        // Buscar usuario
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));

        // Validar contraseña
        if (!passwordEncoder.matches(password, usuario.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        // Eliminar códigos anteriores
        codigoVerificacionRepository.deleteByUsuario(usuario);

        // Generar código de 6 dígitos
        String codigo = generarCodigoAleatorio();

        // Crear y guardar código de verificación
        CodigoVerificacion codigoVerificacion = CodigoVerificacion.builder()
                .codigo(codigo)
                .usuario(usuario)
                .fechaCreacion(LocalDateTime.now())
                .fechaExpiracion(LocalDateTime.now().plusSeconds(codeExpiration / 1000))
                .usado(false)
                .build();

        codigoVerificacionRepository.save(codigoVerificacion);

        // Enviar email
        emailService.enviarCodigoVerificacion(correo, codigo);

        return "Código de verificación enviado al correo " + correo;
    }
    @Transactional
    public String loginConCedula(String cedula, String password) {
        // Buscar usuario por cédula
        Usuario usuario = usuarioRepository.findByCedula(cedula)
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));

        // Validar contraseña
        if (!passwordEncoder.matches(password, usuario.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        // ✅ Login directo SIN código de verificación
        // Generar JWT inmediatamente
        return jwtUtil.generateToken(usuario.getCorreo(), usuario.getRol().name());
    }

    @Transactional
    public String verificarCodigo(String correo, String codigo) {
        // Buscar usuario
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Buscar código válido
        CodigoVerificacion codigoVerificacion = codigoVerificacionRepository
                .findByCodigoAndUsuarioAndUsadoFalse(codigo, usuario)
                .orElseThrow(() -> new RuntimeException("Código inválido o ya usado"));

        // Verificar expiración
        if (LocalDateTime.now().isAfter(codigoVerificacion.getFechaExpiracion())) {
            throw new RuntimeException("El código ha expirado");
        }

        // Marcar código como usado
        codigoVerificacion.setUsado(true);
        codigoVerificacionRepository.save(codigoVerificacion);

        // Generar JWT
        return jwtUtil.generateToken(usuario.getCorreo(), usuario.getRol().name());
    }

    private String generarCodigoAleatorio() {
        Random random = new Random();
        int codigo = 100000 + random.nextInt(900000);
        return String.valueOf(codigo);
    }
}