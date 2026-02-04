package com.luiz.avaliacao.dtos;

import com.luiz.avaliacao.domain.Client;
import lombok.Data;

@Data
public class ClientResponseDTO {
    private Long id;
    private String name;
    private String cpf;
    private String logradouro;
    private String bairro;
    private String cidade;
    private String uf;

    // Construtor que converte a Entidade Client para DTO
    public ClientResponseDTO(Client client) {
        this.id = client.getId();
        this.name = client.getName();
        this.cpf = client.getCpf();
        if (client.getAddress() != null) {
            this.logradouro = client.getAddress().getLogradouro();
            this.bairro = client.getAddress().getBairro();
            this.cidade = client.getAddress().getLocalidade();
            this.uf = client.getAddress().getUf();
        }
    }
}