package rdw.reporting.service;

import com.google.common.collect.ImmutableSet;
import rdw.reporting.model.Group;
import rdw.reporting.model.GroupSummary;
import rdw.reporting.security.User;

import javax.validation.constraints.NotNull;
import java.util.Optional;

public interface GroupService {

	ImmutableSet<GroupSummary> getGroupSummaries(@NotNull User user);

	Optional<Group> getGroup(@NotNull User user, long id);

}
