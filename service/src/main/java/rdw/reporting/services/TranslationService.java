package rdw.reporting.services;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.ImmutableSet;
import rdw.reporting.models.Translation;

import javax.validation.constraints.NotNull;
import java.util.Locale;

public interface TranslationService {

	/**
	 * @return All ranslations
	 */
	ImmutableSet<Translation> getTranslations();

	/**
	 * @param locale The locale by which the translations will be filtered
	 * @return Translations for a specific locale indexed by the message code
	 */
	ImmutableMap<String, String> getTranslationsForLocale(@NotNull Locale locale);

}
