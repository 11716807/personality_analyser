package com.psygenie;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class PsyGenieApplication {

    public static void main(String[] args) {
        SpringApplication.run(PsyGenieApplication.class, args);
    }

}
