package com.luiz.avaliacao.dtos;
import lombok.Data;

@Data 
public class AuthenticationDTO {
    private String login;
    private String password;
}