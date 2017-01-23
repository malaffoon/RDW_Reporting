package rdw.reporting.web.endpoints;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * Created on 1/19/17.
 */
@RestController
@RequestMapping("/report")
public class ReportingController {

    @Autowired
    JdbcTemplate jdbcTemplate;
    List<Map<String, Object>> result;

    @RequestMapping(value = "/ica/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Object foo(@PathVariable String id) {
        System.out.println(id);
        result = jdbcTemplate.queryForList("select * from edware_ca.dim_asmt");
        Map<String,Object> entry =  result.get(0);
            return(Arrays.toString(entry.entrySet().toArray()));

    }

}
