package rdw.reporting.web.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.saml.SAMLCredential;
import org.springframework.security.saml.userdetails.SAMLUserDetailsService;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.HashSet;

@Service
public class SAMLUserDetailsServiceImpl implements SAMLUserDetailsService {

	public Object loadUserBySAML(SAMLCredential credential) throws UsernameNotFoundException {

		final Collection<GrantedAuthority> authorities = new HashSet<>();
		authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

		/*
			todo: parse sbacTenancyChain into authorities
		 */
		final String[] tenancyChain = credential.getAttributeAsStringArray("sbacTenancyChain");

		return User.builder()
			.id(credential.getAttributeAsString("sbacUUID"))
			.email(credential.getAttributeAsString("mail"))
			.givenName(credential.getAttributeAsString("givenName"))
			.username(credential.getNameID().getValue())
			.password("[REDACTED]")
			.enabled(true)
			.credentialsNonExpired(true)
			.accountNonExpired(true)
			.accountNonLocked(true)
			.authorities(authorities)
			.build();
	}

}