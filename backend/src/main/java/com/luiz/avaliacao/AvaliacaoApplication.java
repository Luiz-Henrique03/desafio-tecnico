package com.luiz.avaliacao;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.luiz.avaliacao.domain.User;
import com.luiz.avaliacao.repository.UserRepository;

@SpringBootApplication
public class AvaliacaoApplication {

	public static void main(String[] args) {
		SpringApplication.run(AvaliacaoApplication.class, args);
	}

	@Bean
    @SuppressWarnings("unused")
	CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (userRepository.findByLogin("admin") == null) {
				
				String encryptedPassword = passwordEncoder.encode("123");
				User admin = new User("admin", encryptedPassword);
				
				userRepository.save(admin);
				System.out.println("Usuário ADMIN criado com sucesso: admin / 123");
			}
		};
	}
}