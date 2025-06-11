package com.example.library.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.Key;
import java.time.Duration;
import java.util.Date;

@Service
public class JwtService {
    private final static String HEADER = "Authorization";
    private final static String PREFIX = "Bearer ";
    private final static String ACCESS_TOKEN = "access_token";
    private final static String REFRESH_TOKEN = "refresh_token";
    private final SecretKey secretKey;
    private final SecretKey refreshKey;
    private final UserDetailsService userDetailsService;


    public JwtService(@Value("${jwt.secret-key}") String secretKey, @Value("${jwt.refresh-key}") String refreshKey, UserDetailsService userDetailsService){
        this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64URL.decode(secretKey));
        this.refreshKey = Keys.hmacShaKeyFor(Decoders.BASE64URL.decode(refreshKey));
        this.userDetailsService = userDetailsService;

    }


    public String getTokenString(HttpServletRequest request){
        String header = request.getHeader(HEADER);
        if(header != null && header.startsWith(PREFIX)){
            return header.substring(PREFIX.length());
        }
        return null;
    }

    public String generateToken(String username, String type){
        if( type == null || !type.equals(REFRESH_TOKEN)){type = ACCESS_TOKEN;}
        long now = (new Date()).getTime();
        Date expiration = new Date( now + (type.equals(ACCESS_TOKEN) ? 180000 : 360000));

        return Jwts.builder()
                .setSubject(username)
                .setExpiration(expiration)
                .signWith(type.equals(ACCESS_TOKEN) ? secretKey : refreshKey)
                .compact();
    }

    public Authentication verifyToken(String token){
        String username = parseClaims(token,ACCESS_TOKEN).getSubject();
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        return new UsernamePasswordAuthenticationToken(userDetails,null, userDetails.getAuthorities());
    }

    public Claims parseClaims(String token, String type){
        try{
            return Jwts.parserBuilder().setSigningKey(type.equals(ACCESS_TOKEN)?secretKey:refreshKey).build()
                    .parseClaimsJws(token).getBody();
        } catch (ExpiredJwtException e){
            return e.getClaims();
        }
    }

}
