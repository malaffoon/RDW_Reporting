package rdw.reporting.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import rdw.reporting.model.Group;
import rdw.reporting.model.GroupSummary;
import rdw.reporting.security.User;
import rdw.reporting.service.GroupService;

import java.util.Set;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

	@Autowired
	private GroupService service;

	@RequestMapping
	public Set<GroupSummary> getGroupSummaries(@AuthenticationPrincipal User user) {
		return service.getGroupSummaries(user);
	}

	@RequestMapping(value = "/{id}/students")
	public Group getGroup(@AuthenticationPrincipal User user, @PathVariable String id) {
		return service.getGroup(user, Long.parseLong(id))
			.orElseThrow(ResourceNotFoundException::new);
	}

}
