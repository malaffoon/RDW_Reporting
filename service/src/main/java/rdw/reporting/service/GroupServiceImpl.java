package rdw.reporting.service;

import com.google.common.collect.ImmutableSet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import rdw.reporting.model.Group;
import rdw.reporting.model.GroupSummary;
import rdw.reporting.repository.GroupRepository;
import rdw.reporting.security.User;

import javax.validation.constraints.NotNull;

import java.util.Optional;

import static com.google.common.base.Preconditions.checkNotNull;

@Service
public class GroupServiceImpl implements GroupService {

	private final GroupRepository repository;

	@Autowired
	public GroupServiceImpl(@NotNull GroupRepository repository) {
		this.repository = checkNotNull(repository);
	}

	public ImmutableSet<GroupSummary> getGroupSummaries(@NotNull User user) {
		return ImmutableSet.copyOf(repository.getGroupSummaries(user));
	}

	public Optional<Group> getGroup(@NotNull User user, long id) {
		return repository.getGroup(user, id);
	}

}
