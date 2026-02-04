package com.luiz.avaliacao.domain;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address { 
    private String logradouro;
    private String bairro;
    private String localidade; 
    private String uf;
    
    @Pattern(regexp = "\\d{8}", message = "CEP deve ter 8 dígitos")
    private String cep;
}