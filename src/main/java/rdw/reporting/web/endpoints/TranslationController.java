package rdw.reporting.web.endpoints;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import rdw.reporting.service.TranslationService;

import java.util.Locale;
import java.util.Map;

@RestController
public class TranslationController {

	@Autowired
	private TranslationService translationService;

	@RequestMapping("/api/translations/{locale}")
	public Map<String, String> getTranslations(@PathVariable Locale locale) {
		return translationService.getTranslationsForLocale(locale);
	}

}
