package rdw.reporting.config;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "saml")
@Getter
@Setter
@ToString
public class SAMLProperties {

	/**
	 * The full file path to the Java KeyStore (JKS) file.
	 */
	private String keyStoreFile;

	/**
	 * Password for the JKS File.
	 */
	private String keyStorePassword;

	/**
	 * Private key alias in JKS used for SAML signing.
	 */
	private String privateKeyEntryAlias;

	/**
	 * Private kel alias password. May be same as JKS file password.
	 */
	private String privateKeyEntryPassword;

	/**
	 * Identity provider metadata URL.
	 */
	private String idpMetadataUrl;

	/**
	 * Service Provider entity id as registered in the IDP circle of trust.
	 */
	private String spEntityId;

}