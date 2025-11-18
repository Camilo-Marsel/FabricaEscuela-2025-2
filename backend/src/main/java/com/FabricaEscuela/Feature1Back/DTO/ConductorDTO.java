package com.FabricaEscuela.Feature1Back.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConductorDTO {

    private Long id;

    @NotBlank(message = "El nombre completo es obligatorio")
    private String nombreCompleto;

    @NotBlank(message = "La licencia es obligatoria")
    private String licencia;

    @NotBlank(message = "El teléfono es obligatorio")
    private String telefono;

    @NotBlank(message = "La cédula es obligatoria")
    private String cedula; // ✅ Nuevo campo

    @Email(message = "Email inválido")
    private String email; // ✅ Alias para correo (compatibilidad frontend)

    private String correo; // ✅ Mantener para backend

    @NotBlank(message = "La contraseña es obligatoria")
    private String password;

    private Long usuarioId;
    private String usuarioCorreo;
    private String usuarioRol;

    // ✅ Campos adicionales que el frontend espera
    private String username; // Alias de nombreCompleto

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public @NotBlank(message = "El nombre completo es obligatorio") String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(@NotBlank(message = "El nombre completo es obligatorio") String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public @NotBlank(message = "La licencia es obligatoria") String getLicencia() {
        return licencia;
    }

    public void setLicencia(@NotBlank(message = "La licencia es obligatoria") String licencia) {
        this.licencia = licencia;
    }

    public @NotBlank(message = "El teléfono es obligatorio") String getTelefono() {
        return telefono;
    }

    public void setTelefono(@NotBlank(message = "El teléfono es obligatorio") String telefono) {
        this.telefono = telefono;
    }

    public @NotBlank(message = "La cédula es obligatoria") String getCedula() {
        return cedula;
    }

    public void setCedula(@NotBlank(message = "La cédula es obligatoria") String cedula) {
        this.cedula = cedula;
    }

    public @Email(message = "Email inválido") String getEmail() {
        return email;
    }

    public void setEmail(@Email(message = "Email inválido") String email) {
        this.email = email;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getUsuarioCorreo() {
        return usuarioCorreo;
    }

    public void setUsuarioCorreo(String usuarioCorreo) {
        this.usuarioCorreo = usuarioCorreo;
    }

    public String getUsuarioRol() {
        return usuarioRol;
    }

    public void setUsuarioRol(String usuarioRol) {
        this.usuarioRol = usuarioRol;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}


