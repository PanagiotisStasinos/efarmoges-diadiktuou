package DataClasses.JWToken;

import io.jsonwebtoken.*;

import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;
import java.io.IOException;
import java.security.Key;
import java.util.Date;
import java.util.Map;

public class JsonWebToken {
    private String key = "secret_key";
    private String jwt;

    public JsonWebToken(){
        this.jwt = null;
    }

    public String CreateJsonWebToken(String id, String isuser, String subject, long ttlMillis){
//The JWT signature algorithm we will be using to sign the token
        SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;

        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);

//We will sign our JWT with our ApiKey secret
        byte[] apiKeySecretBytes = DatatypeConverter.parseBase64Binary(key);
        Key signingKey = new SecretKeySpec(apiKeySecretBytes, signatureAlgorithm.getJcaName());

        Header header = Jwts.header();
        header.setType("JWT");

        JwtBuilder builder = Jwts.builder().setHeader((Map<String, Object>)
                header).setId(id)
                .setIssuedAt(now)
                .setSubject(subject)
                .setIssuer(isuser)
                .signWith(signatureAlgorithm, signingKey);

//if it has been specified, let's add the expiration
        if (ttlMillis >= 0) {
            long expMillis = nowMillis + ttlMillis;
            Date exp = new Date(expMillis);
            builder.setExpiration(exp);
        }

//Builds the JWT and serializes it to a compact, URL-safe string
        return builder.compact();
    }

    public String ParseJsonWebToken(String jwt) {
        try {
            //This line will throw an exception if it is not a signed JWS (as expected)
            Claims claims = Jwts.parser()
                    .setSigningKey(DatatypeConverter.parseBase64Binary(key))
                    .parseClaimsJws(jwt).getBody();

            System.out.println("ID: " + claims.getId());
            System.out.println("Subject: " + claims.getSubject());
            System.out.println("Issuer: " + claims.getIssuer());
            System.out.println("Expiration: " + claims.getExpiration());

            String r = "ID: " + claims.getId() + " Subject: " + claims.getSubject() + " Issuer: " + claims.getIssuer() + " Expiration: " + claims.getExpiration();
            return r;
        }
        catch (ExpiredJwtException eje){
            return "not signed token";
        }
    }

    public String JWT_get_ID(String jwt)throws IOException {
        try {
            //This line will throw an exception if it is not a signed JWS (as expected)
            Claims claims = Jwts.parser()
                    .setSigningKey(DatatypeConverter.parseBase64Binary(key))
                    .parseClaimsJws(jwt).getBody();

            return claims.getId();
        }
        catch (ExpiredJwtException eje){
            return "not signed token";
        }
    }
}