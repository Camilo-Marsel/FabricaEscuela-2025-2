package com.FabricaEscuela.Feature1Back;

import com.FabricaEscuela.Feature1Back.entity.Conductor;
import com.FabricaEscuela.Feature1Back.entity.Rol;
import com.FabricaEscuela.Feature1Back.entity.Usuario;
import com.FabricaEscuela.Feature1Back.repository.ConductorRepository;
import com.FabricaEscuela.Feature1Back.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class Feature1BackApplication {

	public static void main(String[] args) {
		SpringApplication.run(Feature1BackApplication.class, args);
	}

	@Bean
	CommandLineRunner init(UsuarioRepository userRepository,
						   ConductorRepository conductorRepository, // ✅ AGREGADO
						   PasswordEncoder passwordEncoder) {
		return args -> {
			// ========================================
			// CREAR ADMIN
			// ========================================
			if (userRepository.findByCorreo("camiloike2@gmail.com").isEmpty()) {
				Usuario admin = new Usuario();
				admin.setCorreo("camiloike2@gmail.com");
				admin.setCedula("123456");
				admin.setPassword(passwordEncoder.encode("123456")); // ✅ Cambiado a "123"
				admin.setRol(Rol.ADMIN);
				userRepository.save(admin);
				System.out.println("✅ Usuario admin creado:");
				System.out.println("  Correo: camiloike2@gmail.com");
				System.out.println("  Cédula: 123456");
				System.out.println("  Contraseña: 123");
			}

			// ========================================
			// CREAR CONDUCTOR COMPLETO
			// ========================================
			if (userRepository.findByCedula("1144199553").isEmpty()) {
				// 1️⃣ Crear Usuario primero
				Usuario usuarioConductor = new Usuario();
				usuarioConductor.setCorreo("conductor@fleet.com");
				usuarioConductor.setCedula("1144199553");
				usuarioConductor.setPassword(passwordEncoder.encode("password"));
				usuarioConductor.setRol(Rol.CONDUCTOR);
				usuarioConductor = userRepository.save(usuarioConductor);

				// 2️⃣ Crear Conductor vinculado al Usuario
				Conductor conductor = new Conductor();
				conductor.setNombreCompleto("Juan Pérez González");
				conductor.setCedula("1144199553");
				conductor.setLicencia("C2-12345678");
				conductor.setTelefono("3001234567");
				conductor.setUsuario(usuarioConductor); // ✅ Vincular
				conductorRepository.save(conductor);

				System.out.println("✅ Conductor completo creado:");
				System.out.println("  Nombre: Juan Pérez González");
				System.out.println("  Cédula: 1144199553");
				System.out.println("  Correo: conductor@fleet.com");
				System.out.println("  Contraseña: password");
				System.out.println("  Licencia: C2-12345678");
			}

			System.out.println("\n====================================");
			System.out.println("🚀 Base de datos inicializada");
			System.out.println("====================================\n");
		};
	}
}