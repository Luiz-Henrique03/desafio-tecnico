package com.luiz.avaliacao.factory;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.luiz.avaliacao.domain.Address;
import com.luiz.avaliacao.domain.Client;
import com.luiz.avaliacao.dtos.ClientRequestDTO;

@Component
public class ClientFactory {

    private final RestClient restClient;

    public ClientFactory() {
        this.restClient = RestClient.create();
    }

    public Client createClient(ClientRequestDTO data) {

        Address address = GetAdressByCEP(data.getCep());

        return Client.builder()
                .name(data.getName())
                .cpf(data.getCpf())
                .address(address) 
                .build();
    }

    public Address GetAdressByCEP(String cep) {

        String url = "https://viacep.com.br/ws/" + cep + "/json/";
        
        ViaCepResponse response = restClient.get()
                .uri(url)
                .retrieve()
                .body(ViaCepResponse.class);

        if (response == null || response.cep() == null) {
            throw new RuntimeException("CEP inválido ou não encontrado: " + cep);
        }

        return Address.builder()
                .cep(response.cep().replace("-", ""))
                .logradouro(response.logradouro())
                .bairro(response.bairro())
                .localidade(response.localidade())
                .uf(response.uf())
                .build();
    }

    record ViaCepResponse(String cep, String logradouro, String bairro, String localidade, String uf) {}
}