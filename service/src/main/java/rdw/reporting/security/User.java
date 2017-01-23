package rdw.reporting.security;

import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@EqualsAndHashCode(of = {"id"})
public class User implements UserDetails {

	private String id;
	private String email;
	private String givenName;
	private List<Tenancy> tenancyChain;
	private String password;
	private String username;
	private Collection<GrantedAuthority> authorities;
	private boolean accountNonExpired;
	private boolean accountNonLocked;
	private boolean credentialsNonExpired;
	private boolean enabled;

}
