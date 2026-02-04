package com.luiz.avaliacao.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
    private ClientFactory clientFactory; 

    // 1. CRIAR (POST)
    @PostMapping
    public ResponseEntity<ClientResponseDTO> create(@RequestBody @Valid ClientRequestDTO data) {
        if (repository.existsByCpf(data.getCpf())) {
            return ResponseEntity.badRequest().build(); 
        }

        Client newClient = clientFactory.createClient(data);
        repository.save(newClient);

        return ResponseEntity.ok(new ClientResponseDTO(newClient));
    }

    // 2. LISTAR TUDO (GET)
    @GetMapping
    public ResponseEntity<List<ClientResponseDTO>> listAll() {
        var allClients = repository.findAll().stream()
                .map(ClientResponseDTO::new)
                .toList();
        return ResponseEntity.ok(allClients);
    }

    // 3. ATUALIZAR (PUT) - O que faltava para o botão "Editar" funcionar
    @PutMapping("/{id}")
    public ResponseEntity<ClientResponseDTO> update(@PathVariable Long id, @RequestBody @Valid ClientRequestDTO data) {
        // Busca o cliente ou dá erro
        Client client = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        // Verifica se mudou o CPF e se o novo já existe
        if (!client.getCpf().equals(data.getCpf()) && repository.existsByCpf(data.getCpf())) {
            return ResponseEntity.badRequest().build();
        }

        // Atualiza dados básicos
        client.setName(data.getName());
        client.setCpf(data.getCpf());

        // Lógica inteligente: Só busca no ViaCEP se o CEP mudou!
        if (client.getAddress() == null || !client.getAddress().getCep().equals(data.getCep())) {
             client.setAddress(clientFactory.buscarEnderecoPorCep(data.getCep()));
        }

        repository.save(client);
        return ResponseEntity.ok(new ClientResponseDTO(client));
    }

    // 4. DELETAR (DELETE) - O que faltava para o botão "Excluir" funcionar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}