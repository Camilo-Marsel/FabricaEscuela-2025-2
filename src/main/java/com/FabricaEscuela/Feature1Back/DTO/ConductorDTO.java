package com.FabricaEscuela.Feature1Back.DTO;

import com.FabricaEscuela.Feature1Back.entity.Usuario;
import lombok.Data;

@Data
public class ConductorDTO {
    private Long id;
    private String nombreCompleto;
    private String licencia;
    private String telefono;

    private Usuario usuario; // Objeto completo para mapeo automático

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public String getLicencia() {
        return licencia;
    }

    public void setLicencia(String licencia) {
        this.licencia = licencia;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}



