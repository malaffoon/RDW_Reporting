package rdw.reporting.web.security;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.saml.SAMLCredential;
import org.springframework.security.saml.userdetails.SAMLUserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class SAMLUserDetailsServiceImpl implements SAMLUserDetailsService {

	public Object loadUserBySAML(SAMLCredential credential) throws UsernameNotFoundException {

		// The method is supposed to identify local account of user referenced by
		// data in the SAML assertion and return UserDetails object describing the user.

		// In a real scenario, this implementation has to locate user in a arbitrary
		// dataStore based on information present in the SAMLCredential and
		// returns such a date in a form of application specific UserDetails object.
		// return new User(userID, "<abc123>", true, true, true, true, authorities);

		return credential;
	}

}