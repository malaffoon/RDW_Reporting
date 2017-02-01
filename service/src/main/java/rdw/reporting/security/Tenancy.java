package rdw.reporting.security;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class Tenancy {

	private String roleId;
	private String name;
	private String level;
	private String clientId;
	private String client;
	private String groupOfStatesId;
	private String groupOfStates;
	private String stateId;
	private String state;
	private String groupOfDistrictsId;
	private String groupOfDistricts;
	private String districtId;
	private String district;
	private String groupOfInstitutionsId;
	private String groupOfInstitutions;
	private String institutionId;
	private String institution;

}
