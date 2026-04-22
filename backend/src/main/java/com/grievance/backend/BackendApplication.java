package com.grievance.backend;

import com.grievance.backend.model.User;
import com.grievance.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner seedDefaultAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			try {
				String[] adminEmails = { "admin@municipality.com", "admin@municipality" };

				for (String adminEmail : adminEmails) {
					if (userRepository.findByEmail(adminEmail).isEmpty()) {
						User admin = new User();
						admin.setName("Municipality Admin");
						admin.setEmail(adminEmail);
						admin.setPassword(passwordEncoder.encode("admin123"));
						admin.setRole(User.Role.ADMIN);
						admin.setPhone("0000000000");

						userRepository.save(admin);
						System.out.println("Default admin user created: " + adminEmail);
					} else {
						System.out.println("Default admin already exists: " + adminEmail);
					}
				}

			} catch (Exception e) {
				System.out.println("⚠️ Skipping admin seeding (table may not exist yet)");
			}
		};
	}
}