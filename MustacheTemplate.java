package org.opentestsystem.rdw.reporting.model;

import com.github.mustachejava.DefaultMustacheFactory;
import com.github.mustachejava.Mustache;
import com.github.mustachejava.MustacheFactory;

import javax.validation.constraints.NotNull;
import java.io.StringWriter;
import java.util.Locale;

public class MustacheTemplate implements Template {

    private Mustache mustache;

    public MustacheTemplate(final String templateFilePath) {
        this(templateFilePath, new DefaultMustacheFactory());
    }

    public MustacheTemplate(final String templateFilePath, final MustacheFactory mustacheFactory) {
        this.mustache = mustacheFactory.compile(templateFilePath);
    }

    @Override
    public byte[] render(final @NotNull Object model, final @NotNull Locale locale) {
        final StringWriter writer = new StringWriter();
        mustache.execute(writer, model);
        return writer.toString().getBytes("UTF-8");
    }

}
