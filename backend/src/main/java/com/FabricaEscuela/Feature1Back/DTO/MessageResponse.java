package com.FabricaEscuela.Feature1Back.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// ===================================
// MessageResponse DTO
// ===================================
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageResponse {
    private String mensaje;
}
