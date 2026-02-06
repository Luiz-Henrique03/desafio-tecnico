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
        this.restClient = RestClient.builder()
                .defaultHeader("User-Agent", "AvaliacaoTecnica-App/1.0")
                .build();
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
        String cleanCep = cep.replaceAll("\\D", "");
        
        String url = "http://viacep.com.br/ws/" + cleanCep + "/json/";
        
        try {
            ViaCepResponse response = restClient.get()
                    .uri(url)
                    .retrieve()
                    .body(ViaCepResponse.class);
    
            if (response == null || response.cep() == null || Boolean.TRUE.equals(response.erro())) {
                throw new RuntimeException("CEP não encontrado na base de dados: " + cep);
            }
    
            return Address.builder()
                    .cep(response.cep().replace("-", ""))
                    .logradouro(response.logradouro())
                    .bairro(response.bairro())
                    .localidade(response.localidade())
                    .uf(response.uf())
                    .build();
                    
        } catch (RuntimeException e) {
            System.err.println("Erro ao buscar CEP: " + e.getMessage());
            throw new RuntimeException("Não foi possível buscar o CEP. Verifique se é válido ou tente mais tarde.");
        }
    }

    record ViaCepResponse(String cep, String logradouro, String bairro, String localidade, String uf, Boolean erro) {}
}