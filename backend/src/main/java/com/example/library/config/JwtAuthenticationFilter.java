package com.example.library.config;

import com.example.library.service.JwtService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.security.Security;
import java.security.SignatureException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String token = jwtService.getTokenString(request);
        try{
            if(token != null){
                Authentication authentication = jwtService.verifyToken(token);
                SecurityContextHolder.getContext().setAuthentication(authentication);
                filterChain.doFilter(request, response);
            }else{
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("토큰이 존재하지 않습니다.");
            }

        } catch (ExpiredJwtException | IllegalArgumentException | UsernameNotFoundException e){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("유효하지 않는 토큰입니다.");
        }
    }

}
