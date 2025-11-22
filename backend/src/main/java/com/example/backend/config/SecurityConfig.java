package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity //특정 메서드에 @PreAuthorize("hasRole('ADMIN')")같은걸로 권한 설정 가능하게 함.
public class SecurityConfig {

    // 화이트리스트 방식.(다 막고 허용된것만 들이기)
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {
        http.csrf(csrf -> csrf.disable()) //API 서비스는 csrf비활성화.
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // 프리플라이트 허용
                        .requestMatchers("/api/auth/register", "/api/auth/login", "/api/auth/logout", "/api/auth/id-available").permitAll() //8080을 가져올때 걸려. 그래서 회원가입은 안걸림 프론트~ㅈ밥! 화이트리스트임.
                        .requestMatchers("/api/movie/**").hasRole("ADMIN") // 권한 값에 맞게 조정
                        .requestMatchers("/api/board/**").hasAnyRole("USER", "ADMIN")
                        .anyRequest().authenticated())
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable());
        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration conf = new CorsConfiguration();
        conf.setAllowedOrigins(List.of("http://localhost:3000")); // 와일드카드(*) 금지
        conf.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
        conf.setAllowedHeaders(List.of("*"));
        conf.setAllowCredentials(true); // 쿠키 허용
        conf.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", conf);
        return source;
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception {
        return cfg.getAuthenticationManager();
    }
}
