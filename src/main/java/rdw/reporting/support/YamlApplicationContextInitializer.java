package rdw.reporting.support;

import org.springframework.boot.env.YamlPropertySourceLoader;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.PropertySource;
import org.springframework.core.io.Resource;

import java.io.IOException;

public class YamlApplicationContextInitializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {

        try {

            Resource[] resources = applicationContext.getResources("classpath*:**.sql.yml");
            YamlPropertySourceLoader sourceLoader = new YamlPropertySourceLoader();
            for (Resource res : resources) {
                PropertySource<?> yamlTestProperties = sourceLoader.load(res.getFilename(), res, null);
                applicationContext.getEnvironment().getPropertySources().addLast(yamlTestProperties);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}