package com.FabricaEscuela.Feature1Back.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginCedulaRequest {

    @NotBlank(message = "La cédula es obligatoria")
    private String cedula;

    @NotBlank(message = "La contraseña es obligatoria")
    private String password;
}