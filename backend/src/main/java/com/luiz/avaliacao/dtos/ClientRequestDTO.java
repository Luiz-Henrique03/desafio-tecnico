package com.luiz.avaliacao.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ClientRequestDTO {
    @NotBlank(message = "O nome é obrigatório")
    private String name;

    @NotBlank(message = "O CPF é obrigatório")
    @Pattern(regexp = "\\d{11}", message = "O CPF deve conter 11 dígitos numéricos")
    private String cpf;

    @NotBlank(message = "O CEP é obrigatório")
    @Pattern(regexp = "\\d{8}", message = "O CEP deve conter 8 dígitos numéricos")
    private String cep;
}