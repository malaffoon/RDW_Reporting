package rdw.reporting.repositories;

import rdw.reporting.models.Translation;

import javax.validation.constraints.NotNull;
import java.util.Locale;
import java.util.Set;

public interface TranslationRepository {

	Set<Translation> getTranslations();

	Set<Translation> getTranslationsForLocale(@NotNull Locale locale);

}
