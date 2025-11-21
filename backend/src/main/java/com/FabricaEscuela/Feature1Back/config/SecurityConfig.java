package com.FabricaEscuela.Feature1Back.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    @Order(1)
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configure(http))
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        // ============================================
                        // RUTAS PÚBLICAS
                        // ============================================
                        .requestMatchers("/h2-console/**").permitAll()
                        .requestMatchers("/api/auth/**", "/health").permitAll()
                        .requestMatchers("/swagger-ui/**").permitAll()
                        .requestMatchers("/swagger-ui.html").permitAll()
                        .requestMatchers("/v3/api-docs/**").permitAll()
                        .requestMatchers("/swagger-resources/**").permitAll()
                        .requestMatchers("/webjars/**").permitAll()
                        .requestMatchers("/", "/index.html", "/dashboard.html", "/admin-dashboard.html").permitAll()
                        .requestMatchers("/*.html").permitAll()
                        .requestMatchers("/css/**", "/js/**", "/images/**", "/static/**").permitAll()


                        // ============================================
                        // RUTAS PROTEGIDAS POR ROL
                        // ============================================

                        // TURNOS - Solo ADMIN puede crear/modificar/eliminar
                        .requestMatchers(HttpMethod.GET, "/api/turnos/**").hasAnyRole("ADMIN", "CONDUCTOR")
                        .requestMatchers(HttpMethod.POST, "/api/turnos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/turnos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/turnos/**").hasRole("ADMIN")

                        // ASIGNACIONES - Solo ADMIN puede gestionar
                        .requestMatchers(HttpMethod.GET, "/api/asignaciones/**").hasAnyRole("ADMIN", "CONDUCTOR")
                        .requestMatchers(HttpMethod.POST, "/api/asignaciones/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/asignaciones/**").hasAnyRole("ADMIN", "CONDUCTOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/asignaciones/**").hasRole("ADMIN")

                        // CONDUCTORES - Solo ADMIN
                        .requestMatchers("/api/conductores/me").hasAnyRole("CONDUCTOR", "ADMIN")
                        .requestMatchers("/api/conductores/**").hasRole("ADMIN")

                        // RUTAS - Solo ADMIN
                        .requestMatchers("/api/rutas/**").hasRole("ADMIN")

                        // ============================================
                        // FALLBACK - Cualquier otra ruta requiere autenticación
                        // ============================================
                        .requestMatchers("/api/**").authenticated()
                        .anyRequest().authenticated()
                )
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}