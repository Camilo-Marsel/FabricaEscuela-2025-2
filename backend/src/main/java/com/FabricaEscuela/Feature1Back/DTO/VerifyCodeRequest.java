
package com.FabricaEscuela.Feature1Back.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


// ===================================
// VerifyCodeRequest DTO
// ===================================
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerifyCodeRequest {
    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "Formato de correo inválido")
    private String correo;

    @NotBlank(message = "El código es obligatorio")
    private String codigo;
}
