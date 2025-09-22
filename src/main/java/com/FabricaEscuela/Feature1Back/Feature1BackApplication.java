package com.FabricaEscuela.Feature1Back;

import com.FabricaEscuela.Feature1Back.entity.Rol;
import com.FabricaEscuela.Feature1Back.entity.Usuario;
import com.FabricaEscuela.Feature1Back.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@SpringBootApplication
public class Feature1BackApplication {

	public static void main(String[] args) {
		SpringApplication.run(Feature1BackApplication.class, args);
	}

	@Bean
	CommandLineRunner init(UsuarioRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (userRepository.findByCorreo("admin").isEmpty()) {
				Usuario admin = new Usuario();
				admin.setCorreo("admin");
				admin.setPassword(passwordEncoder.encode("admin123")); // recuerda codificar la contraseña
				admin.setRol(Rol.ADMIN);
				userRepository.save(admin);
				System.out.println("Usuario admin creado: admin / admin123");
			}
		};
	}
}
