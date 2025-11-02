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
				admin.setCorreo("camiloike2@gmail.com");
				admin.setCedula("123");
				admin.setPassword(passwordEncoder.encode("123")); // recuerda codificar la contraseña
				admin.setRol(Rol.ADMIN);
				userRepository.save(admin);
				System.out.println("Usuario admin creado: admin / admin123");
			}
			if (userRepository.findByCorreo("conductor@fleet.com").isEmpty()) {
				Usuario conductor = new Usuario();
				conductor.setCorreo("conductor@fleet.com");
				conductor.setCedula("1144199553"); // ✅ Una de las cédulas del frontend
				conductor.setPassword(passwordEncoder.encode("password"));
				conductor.setRol(Rol.CONDUCTOR);
				userRepository.save(conductor);
				System.out.println("Usuario conductor creado:");
				System.out.println("  Cédula: 1144199553");
				System.out.println("  Contraseña: password");
			}
		};
	}
}
