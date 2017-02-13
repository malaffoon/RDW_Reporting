package rdw.reporting.service;

import rdw.reporting.model.Group;
import rdw.reporting.model.GroupSummary;
import rdw.reporting.security.User;

import javax.validation.constraints.NotNull;
import java.util.Optional;
import java.util.Set;

public interface GroupService {

	Set<GroupSummary> getGroupSummaries(@NotNull User user);

	Optional<Group> getGroup(@NotNull User user, long id);

}
