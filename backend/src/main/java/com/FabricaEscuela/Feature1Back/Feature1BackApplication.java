package com.FabricaEscuela.Feature1Back;

import com.FabricaEscuela.Feature1Back.entity.*;
import com.FabricaEscuela.Feature1Back.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;

@SpringBootApplication
public class Feature1BackApplication {

	public static void main(String[] args) {
		SpringApplication.run(Feature1BackApplication.class, args);
	}

	@Bean
	CommandLineRunner init(
			UsuarioRepository usuarioRepository,
			ConductorRepository conductorRepository,
			RutaRepository rutaRepository,
			TurnoRepository turnoRepository,
			AsignacionTurnoRepository asignacionTurnoRepository,
			PasswordEncoder passwordEncoder) {

		return args -> {
			// ========================================
			// 1️⃣ CREAR ADMIN
			// ========================================
			if (usuarioRepository.findByCorreo("camiloike2@gmail.com").isEmpty()) {
				Usuario admin = new Usuario();
				admin.setCorreo("camiloike2@gmail.com");
				admin.setCedula("123456");
				admin.setPassword(passwordEncoder.encode("123456"));
				admin.setRol(Rol.ADMIN);
				usuarioRepository.save(admin);

				System.out.println("✅ Usuario admin creado:");
				System.out.println("  Correo: camiloike2@gmail.com");
				System.out.println("  Cédula: 123456");
				System.out.println("  Contraseña: 123456");
			}

			// ========================================
			// 2️⃣ CREAR CONDUCTOR COMPLETO
			// ========================================
			Conductor conductor = null;
			if (usuarioRepository.findByCedula("1144199553").isEmpty()) {
				// Crear Usuario primero
				Usuario usuarioConductor = new Usuario();
				usuarioConductor.setCorreo("conductor@fleet.com");
				usuarioConductor.setCedula("1144199553");
				usuarioConductor.setPassword(passwordEncoder.encode("password"));
				usuarioConductor.setRol(Rol.CONDUCTOR);
				usuarioConductor = usuarioRepository.save(usuarioConductor);

				// Crear Conductor vinculado al Usuario
				conductor = new Conductor();
				conductor.setNombreCompleto("Juan Pérez González");
				conductor.setCedula("1144199553");
				conductor.setLicencia("C2-12345678");
				conductor.setTelefono("3001234567");
				conductor.setUsuario(usuarioConductor);
				conductor = conductorRepository.save(conductor);

				System.out.println("✅ Conductor completo creado:");
				System.out.println("  Nombre: Juan Pérez González");
				System.out.println("  Cédula: 1144199553");
				System.out.println("  Correo: conductor@fleet.com");
				System.out.println("  Contraseña: password");
			} else {
				// Si ya existe, obtenerlo
				conductor = conductorRepository.findByCedula("1144199553").orElse(null);
			}

			// ========================================
			// 3️⃣ CREAR RUTA DE PRUEBA
			// ========================================
			Ruta ruta = null;
			if (rutaRepository.findAll().isEmpty()) {
				ruta = new Ruta();
				ruta.setNombre("Ruta Norte 1");
				ruta.setOrigen("Terminal Norte");
				ruta.setDestino("Centro Ciudad");
				ruta.setDuracionEnMinutos(45);
				ruta = rutaRepository.save(ruta);

				System.out.println("✅ Ruta creada: " + ruta.getNombre());
			} else {
				ruta = rutaRepository.findAll().get(0);
			}

			// ========================================
			// 4️⃣ CREAR TURNOS (PLANTILLAS) PARA HOY Y MAÑANA
			// ========================================
			LocalDate hoy = LocalDate.now();
			DayOfWeek diaHoy = hoy.getDayOfWeek();
			DayOfWeek diaMañana = hoy.plusDays(1).getDayOfWeek();

			// Turno de HOY (6:00 AM - 2:00 PM)
			Turno turnoHoy = turnoRepository.findByRutaAndDiaSemana(ruta, diaHoy)
					.stream()
					.findFirst()
					.orElse(null);

			if (turnoHoy == null) {
				turnoHoy = Turno.builder()
						.ruta(ruta)
						.diaSemana(diaHoy)
						.horaInicio(LocalTime.of(6, 0))
						.horaFin(LocalTime.of(14, 0))
						.duracionHoras(8)
						.numeroSemana(1)
						.estado(EstadoTurno.ACTIVO)
						.build();
				turnoHoy = turnoRepository.save(turnoHoy);
				System.out.println("✅ Turno creado para HOY (" + diaHoy + "): 06:00-14:00");
			}

			// Turno de MAÑANA (6:00 AM - 2:00 PM)
			Turno turnoMañana = turnoRepository.findByRutaAndDiaSemana(ruta, diaMañana)
					.stream()
					.findFirst()
					.orElse(null);

			if (turnoMañana == null) {
				turnoMañana = Turno.builder()
						.ruta(ruta)
						.diaSemana(diaMañana)
						.horaInicio(LocalTime.of(6, 0))
						.horaFin(LocalTime.of(14, 0))
						.duracionHoras(8)
						.numeroSemana(1)
						.estado(EstadoTurno.ACTIVO)
						.build();
				turnoMañana = turnoRepository.save(turnoMañana);
				System.out.println("✅ Turno creado para MAÑANA (" + diaMañana + "): 06:00-14:00");
			}

			// ========================================
			// 5️⃣ ASIGNAR TURNOS AL CONDUCTOR
			// ========================================
			if (conductor != null && turnoHoy != null) {
				// Asignación de HOY
				boolean tieneAsignacionHoy = asignacionTurnoRepository
						.findByConductorAndFechaInicio(conductor, hoy)
						.isPresent();

				if (!tieneAsignacionHoy) {
					AsignacionTurno asignacionHoy = AsignacionTurno.builder()
							.conductor(conductor)
							.turno(turnoHoy)
							.fechaInicio(hoy)
							.fechaFin(null)
							.estado(EstadoAsignacion.PROGRAMADA)
							.build();
					asignacionTurnoRepository.save(asignacionHoy);
					System.out.println("✅ Turno de HOY asignado a " + conductor.getNombreCompleto());
				}

				// Asignación de MAÑANA
				LocalDate mañana = hoy.plusDays(1);
				boolean tieneAsignacionMañana = asignacionTurnoRepository
						.findByConductorAndFechaInicio(conductor, mañana)
						.isPresent();

				if (!tieneAsignacionMañana && turnoMañana != null) {
					AsignacionTurno asignacionMañana = AsignacionTurno.builder()
							.conductor(conductor)
							.turno(turnoMañana)
							.fechaInicio(mañana)
							.fechaFin(null)
							.estado(EstadoAsignacion.PROGRAMADA)
							.build();
					asignacionTurnoRepository.save(asignacionMañana);
					System.out.println("✅ Turno de MAÑANA asignado a " + conductor.getNombreCompleto());
				}
			}

			System.out.println("\n====================================");
			System.out.println("🚀 Base de datos inicializada");
			System.out.println("====================================\n");
		};
	}
}