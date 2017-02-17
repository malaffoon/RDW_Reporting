package rdw.reporting.repository;

import rdw.reporting.model.ICA;

import java.util.Optional;

/**
 * Created on 1/24/17.
 */
public interface InterimComprehensiveQuery {
    /**
     * Retrieves the exam by uniqueKey
     *
     * @param studentId student id
     * @return the ICA if found otherwise empty
     */
    Optional<ICA> getICAById(String studentId);

}
