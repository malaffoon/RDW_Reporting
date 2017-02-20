package rdw.reporting;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.core.io.Resource;
import rdw.reporting.support.YamlApplicationContextInitializer;

@SpringBootApplication
public class Application {


    public static void main(String[] args) {

        new SpringApplicationBuilder(Application.class).initializers(new YamlApplicationContextInitializer()).run(args);

    }
}