/*package com.FabricaEscuela.Feature1Back.service;

import com.FabricaEscuela.Feature1Back.DTO.ConductorDTO;
import com.FabricaEscuela.Feature1Back.entity.Conductor;
import com.FabricaEscuela.Feature1Back.entity.Usuario;
import com.FabricaEscuela.Feature1Back.entity.Rol;
import com.FabricaEscuela.Feature1Back.mapper.ConductorMapper;
import com.FabricaEscuela.Feature1Back.repository.ConductorRepository;
import com.FabricaEscuela.Feature1Back.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConductorService {

    private final ConductorRepository conductorRepository;
    private final UsuarioRepository usuarioRepository;
    private final ConductorMapper conductorMapper;
    private final PasswordEncoder passwordEncoder;

    public ConductorService(ConductorRepository conductorRepository,
                            UsuarioRepository usuarioRepository,
                            ConductorMapper conductorMapper, PasswordEncoder passwordEncoder) {
        this.conductorRepository = conductorRepository;
        this.usuarioRepository = usuarioRepository;
        this.conductorMapper = conductorMapper;
        this.passwordEncoder = passwordEncoder;
    }
    public List<ConductorDTO> getAllConductores() {
        return conductorRepository.findAll()
                .stream()
                .map(conductorMapper::toDTO)
                .toList();
    }

    public ConductorDTO getConductorById(Long id) {
        return conductorRepository.findById(id)
                .map(conductorMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Conductor no encontrado"));
    }

    @Transactional
    public ConductorDTO createConductor(ConductorDTO conductorDTO) {
        // Verificar que no exista conductor con esa cédula
        if (conductorRepository.findByCedula(conductorDTO.getCedula()).isPresent()) {
            throw new RuntimeException("Ya existe un conductor con esa cédula");
        }

        // Crear usuario automáticamente
        Usuario usuario = Usuario.builder()
                .correo(conductorDTO.getEmail() != null ? conductorDTO.getEmail() : conductorDTO.getCorreo())
                .cedula(conductorDTO.getCedula())
                .password(passwordEncoder.encode("password123")) // ✅ Contraseña por defecto
                .rol(Rol.CONDUCTOR)
                .build();
        usuario = usuarioRepository.save(usuario);

        // Crear conductor
        Conductor conductor = Conductor.builder()
                .nombreCompleto(conductorDTO.getNombreCompleto())
                .licencia(conductorDTO.getLicencia())
                .telefono(conductorDTO.getTelefono())
                .cedula(conductorDTO.getCedula())
                .usuario(usuario)
                .build();

        conductor = conductorRepository.save(conductor);
        return conductorMapper.toDTO(conductor);
    }

    public ConductorDTO updateConductor(Long id, ConductorDTO dto) {
        Conductor existente = conductorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conductor no encontrado"));

        existente.setLicencia(dto.getLicencia());
        existente.setNombreCompleto(dto.getNombreCompleto());
        existente.setTelefono(dto.getTelefono());
        // Usuario normalmente no se cambia

        return conductorMapper.toDTO(conductorRepository.save(existente));
    }

    public void deleteConductor(Long id) {
        if (!conductorRepository.existsById(id)) {
            throw new RuntimeException("Conductor no encontrado");
        }
        conductorRepository.deleteById(id);
    }
}
*/
package com.FabricaEscuela.Feature1Back.service;

import com.FabricaEscuela.Feature1Back.DTO.ConductorDTO;
import com.FabricaEscuela.Feature1Back.entity.Conductor;
import com.FabricaEscuela.Feature1Back.entity.Usuario;
import com.FabricaEscuela.Feature1Back.entity.Rol;
import com.FabricaEscuela.Feature1Back.mapper.ConductorMapper;
import com.FabricaEscuela.Feature1Back.repository.ConductorRepository;
import com.FabricaEscuela.Feature1Back.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConductorService {

    private final ConductorRepository conductorRepository;
    private final UsuarioRepository usuarioRepository;
    private final ConductorMapper conductorMapper;
    private final PasswordEncoder passwordEncoder;

    public ConductorService(ConductorRepository conductorRepository,
                            UsuarioRepository usuarioRepository,
                            ConductorMapper conductorMapper,
                            PasswordEncoder passwordEncoder) {
        this.conductorRepository = conductorRepository;
        this.usuarioRepository = usuarioRepository;
        this.conductorMapper = conductorMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public List<ConductorDTO> getAllConductores() {
        return conductorRepository.findAll()
                .stream()
                .map(conductorMapper::toDTO)
                .toList();
    }

    public ConductorDTO getConductorById(Long id) {
        return conductorRepository.findById(id)
                .map(conductorMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Conductor no encontrado"));
    }

    @Transactional
    public ConductorDTO createConductor(ConductorDTO conductorDTO) {
        // ✅ Validar que la contraseña venga en el DTO
        if (conductorDTO.getPassword() == null || conductorDTO.getPassword().isBlank()) {
            throw new RuntimeException("La contraseña es obligatoria");
        }

        // Verificar que no exista conductor con esa cédula
        if (conductorRepository.findByCedula(conductorDTO.getCedula()).isPresent()) {
            throw new RuntimeException("Ya existe un conductor con esa cédula");
        }

        // Verificar que no exista usuario con ese correo
        String correo = conductorDTO.getEmail() != null ? conductorDTO.getEmail() : conductorDTO.getCorreo();
        if (usuarioRepository.findByCorreo(correo).isPresent()) {
            throw new RuntimeException("Ya existe un usuario con ese correo");
        }

        // Verificar que no exista usuario con esa cédula
        if (usuarioRepository.findByCedula(conductorDTO.getCedula()).isPresent()) {
            throw new RuntimeException("Ya existe un usuario con esa cédula");
        }

        // ✅ Crear usuario con la contraseña proporcionada
        Usuario usuario = Usuario.builder()
                .correo(correo)
                .cedula(conductorDTO.getCedula())
                .password(passwordEncoder.encode(conductorDTO.getPassword())) // ✅ Usar password del DTO
                .rol(Rol.CONDUCTOR)
                .build();
        usuario = usuarioRepository.save(usuario);

        // Crear conductor
        Conductor conductor = Conductor.builder()
                .nombreCompleto(conductorDTO.getNombreCompleto())
                .licencia(conductorDTO.getLicencia())
                .telefono(conductorDTO.getTelefono())
                .cedula(conductorDTO.getCedula())
                .usuario(usuario)
                .build();

        conductor = conductorRepository.save(conductor);
        return conductorMapper.toDTO(conductor);
    }

    @Transactional
    public ConductorDTO updateConductor(Long id, ConductorDTO dto) {
        Conductor existente = conductorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conductor no encontrado"));

        existente.setLicencia(dto.getLicencia());
        existente.setNombreCompleto(dto.getNombreCompleto());
        existente.setTelefono(dto.getTelefono());

        return conductorMapper.toDTO(conductorRepository.save(existente));
    }

    @Transactional
    public void deleteConductor(Long id) {
        Conductor conductor = conductorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conductor no encontrado"));

        // ✅ Eliminar el usuario asociado también
        Usuario usuario = conductor.getUsuario();
        conductorRepository.deleteById(id);

        if (usuario != null) {
            usuarioRepository.delete(usuario);
        }
    }
}