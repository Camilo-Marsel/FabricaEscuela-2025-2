package com.FabricaEscuela.Feature1Back.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// ===================================
// AuthResponse DTO
// ===================================
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private String correo;
    private String rol;
    private String mensaje;
}
