package rdw.reporting.config.data;


import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.config.YamlPropertiesFactoryBean;
import org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;

/**
 * Configuration for DataSources.  Queries
 */
@Configuration
public class DataSourceConfiguration {

    //@Bean
    //public static PropertySourcesPlaceholderConfigurer properties() {
    //    PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer = new PropertySourcesPlaceholderConfigurer();
    //    YamlPropertiesFactoryBean yaml = new YamlPropertiesFactoryBean();
    //    yaml.setResources(new ClassPathResource("groups.sql.yml"));
    //    propertySourcesPlaceholderConfigurer.setProperties(yaml.getObject());
    //    return propertySourcesPlaceholderConfigurer;
    //}

    @Bean(name = "queryDataSource")
    @ConfigurationProperties(prefix = "spring.datasource")
    public DataSource queriesDataSource() {
        return DataSourceBuilder
                .create()
                .build();
    }

    @Bean(name = "queryJdbcTemplate")
    public NamedParameterJdbcTemplate queryJdbcTemplate() {
        return new NamedParameterJdbcTemplate(queriesDataSource());
    }

}