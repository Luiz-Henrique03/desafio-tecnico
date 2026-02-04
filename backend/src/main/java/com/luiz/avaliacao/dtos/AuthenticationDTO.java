package com.luiz.avaliacao.dtos;
import lombok.Data;

@Data // O Lombok gera Getters, Setters e toString sozinho
public class AuthenticationDTO {
    private String login;
    private String password;
}