package rdw.reporting.web.servlet.view;

import org.springframework.core.Ordered;
import org.springframework.web.servlet.View;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.view.AbstractCachingViewResolver;

import java.util.Locale;

/**
 * The purpose of this class is to decorate a view resolver and convert the HTML it produces
 * from a model and template into a PDF after it has rendered
 * @See ITextHtmlToPdfView
 */
public class ITextHtmlToPdfViewResolver extends AbstractCachingViewResolver implements Ordered {

	private final ViewResolver resolver;
	private int order = Integer.MAX_VALUE;
	private String characterEncoding;

	public ITextHtmlToPdfViewResolver(ViewResolver resolver) {
		this.resolver = resolver;
	}

	@Override
	public int getOrder() {
		return order;
	}

	public void setOrder(int value) {
		this.order = value;
	}

	public String getCharacterEncoding() {
		return characterEncoding;
	}

	public void setCharacterEncoding(String value) {
		this.characterEncoding = value;
	}

	@Override
	protected View loadView(String name, Locale locale) throws Exception {
		return new ITextHtmlToPdfView(resolver.resolveViewName(name, locale), getCharacterEncoding());
	}

}
