package com.luiz.avaliacao.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import com.luiz.avaliacao.domain.User;

public interface UserRepository extends JpaRepository<User, String> {
    UserDetails findByLogin(String login);
}