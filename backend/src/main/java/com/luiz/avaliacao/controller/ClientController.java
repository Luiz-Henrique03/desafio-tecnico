package com.luiz.avaliacao.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.luiz.avaliacao.domain.Client;
import com.luiz.avaliacao.dtos.ClientRequestDTO;
import com.luiz.avaliacao.dtos.ClientResponseDTO;
import com.luiz.avaliacao.factory.ClientFactory;
import com.luiz.avaliacao.repository.ClientRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("clients")
public class ClientController {

    @Autowired
    private ClientRepository repository;

    @Autowired
    private ClientFactory clientFactory; // Injeção da nossa Factory

    @PostMapping
    public ResponseEntity<ClientResponseDTO> create(@RequestBody @Valid ClientRequestDTO data) {
        if (repository.existsByCpf(data.getCpf())) {
            return ResponseEntity.badRequest().build(); // CPF já existe
        }

        Client newClient = clientFactory.createClient(data);
        
        repository.save(newClient);

        return ResponseEntity.ok(new ClientResponseDTO(newClient));
    }

    @GetMapping
    public ResponseEntity<List<ClientResponseDTO>> listAll() {
        var allClients = repository.findAll().stream()
                .map(ClientResponseDTO::new)
                .toList();
        return ResponseEntity.ok(allClients);
    }
    
    // Você pode adicionar GetById, Put e Delete aqui depois para completar o CRUD
}