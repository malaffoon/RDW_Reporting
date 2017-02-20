package rdw.reporting.repository.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Repository;
import rdw.reporting.model.ICA;
import rdw.reporting.repository.InterimComprehensiveQuery;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

/**
 * Created on 1/24/17.
 */
@Repository
public class InterimComprehensiveQueryImpl implements InterimComprehensiveQuery{
    private final NamedParameterJdbcTemplate jdbcTemplate;
    private final String EXAM_QUERY_COLUMN_LIST =
            "edware_ca.fact_asmt_outcome_vw.student_id, \n" +
            "edware_ca.dim_student.first_name AS first_name, \n" +
            "edware_ca.dim_student.middle_name AS middle_name, \n" +
            "edware_ca.dim_student.last_name AS last_name, \n" +
            "edware_ca.fact_asmt_outcome_vw.enrl_grade AS grade, \n" +
            "edware_ca.fact_asmt_outcome_vw.district_id AS district_id, \n" +
            "edware_ca.dim_inst_hier.district_name AS district_name, \n" +
            "edware_ca.fact_asmt_outcome_vw.school_id AS school_id, \n" +
            "edware_ca.dim_inst_hier.school_name AS school_name, \n" +
            "edware_ca.fact_asmt_outcome_vw.state_code AS state_code, \n" +
            "edware_ca.fact_asmt_outcome_vw.date_taken AS date_taken, \n" +
            "edware_ca.dim_asmt.asmt_subject AS asmt_subject, \n" +
            "edware_ca.dim_asmt.asmt_period AS asmt_period, \n" +
            "edware_ca.dim_asmt.asmt_period_year AS asmt_period_year, \n" +
            "edware_ca.dim_asmt.asmt_type AS asmt_type, \n" +
            "edware_ca.dim_asmt.asmt_score_min AS asmt_score_min, \n" +
            "edware_ca.dim_asmt.asmt_score_max AS asmt_score_max, \n" +
            "edware_ca.dim_asmt.asmt_perf_lvl_name_1 AS asmt_cut_point_name_1, \n" +
            "edware_ca.dim_asmt.asmt_perf_lvl_name_2 AS asmt_cut_point_name_2, \n" +
            "edware_ca.dim_asmt.asmt_perf_lvl_name_3 AS asmt_cut_point_name_3, \n" +
            "edware_ca.dim_asmt.asmt_perf_lvl_name_4 AS asmt_cut_point_name_4, \n" +
            "edware_ca.dim_asmt.asmt_perf_lvl_name_5 AS asmt_cut_point_name_5, \n" +
            "edware_ca.dim_asmt.asmt_cut_point_1 AS asmt_cut_point_1, \n" +
            "edware_ca.dim_asmt.asmt_cut_point_2 AS asmt_cut_point_2, \n" +
            "edware_ca.dim_asmt.asmt_cut_point_3 AS asmt_cut_point_3, \n" +
            "edware_ca.dim_asmt.asmt_cut_point_4 AS asmt_cut_point_4, \n" +
            "edware_ca.dim_asmt.asmt_claim_perf_lvl_name_1 AS asmt_claim_perf_lvl_name_1, \n" +
            "edware_ca.dim_asmt.asmt_claim_perf_lvl_name_2 AS asmt_claim_perf_lvl_name_2, \n" +
            "edware_ca.dim_asmt.asmt_claim_perf_lvl_name_3 AS asmt_claim_perf_lvl_name_3, \n" +
            "edware_ca.fact_asmt_outcome_vw.asmt_grade AS asmt_grade, \n" +
            "edware_ca.fact_asmt_outcome_vw.asmt_score AS asmt_score, \n" +
            "edware_ca.fact_asmt_outcome_vw.asmt_score_range_min AS asmt_score_range_min, \n" +
            "edware_ca.fact_asmt_outcome_vw.asmt_score_range_max AS asmt_score_range_max, \n" +
            "edware_ca.fact_asmt_outcome_vw.date_taken_day AS date_taken_day, \n" +
            "edware_ca.fact_asmt_outcome_vw.date_taken_month AS date_taken_month, \n" +
            "edware_ca.fact_asmt_outcome_vw.date_taken_year AS date_taken_year, \n" +
            "edware_ca.fact_asmt_outcome_vw.asmt_perf_lvl AS asmt_perf_lvl, \n" +
            "edware_ca.dim_asmt.asmt_claim_1_name AS asmt_claim_1_name, \n" +
            "edware_ca.dim_asmt.asmt_claim_2_name AS asmt_claim_2_name, \n" +
            "edware_ca.dim_asmt.asmt_claim_3_name AS asmt_claim_3_name, \n" +
            "edware_ca.dim_asmt.asmt_claim_4_name AS asmt_claim_4_name, \n" +
            "edware_ca.dim_asmt.asmt_claim_1_score_min AS asmt_claim_1_score_min, \n" +
            "edware_ca.dim_asmt.asmt_claim_2_score_min AS asmt_claim_2_score_min, \n" +
            "edware_ca.dim_asmt.asmt_claim_3_score_min AS asmt_claim_3_score_min, \n" +
            "edware_ca.dim_asmt.asmt_claim_4_score_min AS asmt_claim_4_score_min, \n" +
            "edware_ca.dim_asmt.asmt_claim_1_score_max AS asmt_claim_1_score_max, \n" +
            "edware_ca.dim_asmt.asmt_claim_2_score_max AS asmt_claim_2_score_max, \n" +
            "edware_ca.dim_asmt.asmt_claim_3_score_max AS asmt_claim_3_score_max, \n" +
            "edware_ca.dim_asmt.asmt_claim_4_score_max AS asmt_claim_4_score_max, \n" +
            "edware_ca.fact_asmt_outcome_vw.asmt_claim_1_score AS asmt_claim_1_score, \n" +
            "edware_ca.fact_asmt_outcome_vw.asmt_claim_2_score AS asmt_claim_2_score, \n" +
            "edware_ca.fact_asmt_outcome_vw.asmt_claim_3_score AS asmt_claim_3_score, \n" +
            "edware_ca.fact_asmt_outcome_vw.asmt_claim_4_score AS asmt_claim_4_score, \n" +
            "edware_ca.fact_asmt_outcome_vw.asmt_claim_1_score_range_min AS asmt_claim_1_score_range_min, \n" +
            "edware_ca.fact_asmt_outcome_vw.asmt_claim_2_score_range_min AS asmt_claim_2_score_range_min, \n" +
            "edware_ca.fact_asmt_outcome_vw.asmt_claim_3_score_range_min AS asmt_claim_3_score_range_min, \n" +
            "edware_ca.fact_asmt_outcome_vw.asmt_claim_4_score_range_min AS asmt_claim_4_score_range_min, \n" +
            "edware_ca.fact_asmt_outcome_vw.asmt_claim_1_score_range_max AS asmt_claim_1_score_range_max, \n" +
            "edware_ca.fact_asmt_outcome_vw.asmt_claim_2_score_range_max AS asmt_claim_2_score_range_max, \n" +
            "edware_ca.fact_asmt_outcome_vw.asmt_claim_3_score_range_max AS asmt_claim_3_score_range_max, \n" +
            "edware_ca.fact_asmt_outcome_vw.asmt_claim_4_score_range_max AS asmt_claim_4_score_range_max, \n" +
            "edware_ca.fact_asmt_outcome_vw.asmt_claim_1_perf_lvl AS asmt_claim_1_perf_lvl, \n" +
            "edware_ca.fact_asmt_outcome_vw.asmt_claim_2_perf_lvl AS asmt_claim_2_perf_lvl, \n" +
            "edware_ca.fact_asmt_outcome_vw.asmt_claim_3_perf_lvl AS asmt_claim_3_perf_lvl, \n" +
            "edware_ca.fact_asmt_outcome_vw.asmt_claim_4_perf_lvl AS asmt_claim_4_perf_lvl, \n" +
            "edware_ca.fact_asmt_outcome_vw.acc_asl_video_embed AS acc_asl_video_embed, \n" +
            "edware_ca.fact_asmt_outcome_vw.acc_noise_buffer_nonembed AS acc_noise_buffer_nonembed, \n" +
            "edware_ca.fact_asmt_outcome_vw.acc_print_on_demand_items_nonembed AS acc_print_on_demand_items_nonembed, \n" +
            "edware_ca.fact_asmt_outcome_vw.acc_braile_embed AS acc_braile_embed, \n" +
            "edware_ca.fact_asmt_outcome_vw.acc_closed_captioning_embed AS acc_closed_captioning_embed, \n" +
            "edware_ca.fact_asmt_outcome_vw.acc_text_to_speech_embed AS acc_text_to_speech_embed, \n" +
            "edware_ca.fact_asmt_outcome_vw.acc_abacus_nonembed AS acc_abacus_nonembed, \n" +
            "edware_ca.fact_asmt_outcome_vw.acc_alternate_response_options_nonembed AS acc_alternate_response_options_nonembed, \n" +
            "edware_ca.fact_asmt_outcome_vw.acc_calculator_nonembed AS acc_calculator_nonembed, \n" +
            "edware_ca.fact_asmt_outcome_vw.acc_multiplication_table_nonembed AS acc_multiplication_table_nonembed, \n" +
            "edware_ca.fact_asmt_outcome_vw.acc_print_on_demand_nonembed AS acc_print_on_demand_nonembed, \n" +
            "edware_ca.fact_asmt_outcome_vw.acc_read_aloud_nonembed AS acc_read_aloud_nonembed, \n" +
            "edware_ca.fact_asmt_outcome_vw.acc_scribe_nonembed AS acc_scribe_nonembed, \n" +
            "edware_ca.fact_asmt_outcome_vw.acc_speech_to_text_nonembed AS acc_speech_to_text_nonembed, \n" +
            "edware_ca.fact_asmt_outcome_vw.acc_streamline_mode AS acc_streamline_mode, \n" +
            "edware_ca.fact_asmt_outcome_vw.administration_condition AS administration_condition, \n" +
            "coalesce(edware_ca.fact_asmt_outcome_vw.complete, true) AS complete \n";

    @Autowired
    public InterimComprehensiveQueryImpl(@Qualifier("queryJdbcTemplate") NamedParameterJdbcTemplate queryJdbcTemplate) {
        this.jdbcTemplate = queryJdbcTemplate;
    }

    @Override
    public Optional<ICA> getICAById(String studentId) {
        final SqlParameterSource parameters = new MapSqlParameterSource("studentId",studentId);
        // "3efe8485-9c16-4381-ab78-692353104cce"  as a sample student ID
        String querySQL = "SELECT \n" +
                        EXAM_QUERY_COLUMN_LIST +
                        "FROM edware_ca.fact_asmt_outcome_vw \n" +
                        "JOIN edware_ca.dim_student ON edware_ca.fact_asmt_outcome_vw.student_rec_id = edware_ca.dim_student.student_rec_id \n" +
                        "JOIN edware_ca.dim_asmt ON edware_ca.dim_asmt.asmt_rec_id = edware_ca.fact_asmt_outcome_vw.asmt_rec_id \n" +
                        "JOIN edware_ca.dim_inst_hier ON edware_ca.dim_inst_hier.district_id = edware_ca.fact_asmt_outcome_vw.district_id AND  edware_ca.dim_inst_hier.school_id = edware_ca.fact_asmt_outcome_vw.school_id \n" +
                        "WHERE edware_ca.fact_asmt_outcome_vw.state_code IN ('CA') AND edware_ca.fact_asmt_outcome_vw.student_id = :studentId \n" +
                        "   AND edware_ca.fact_asmt_outcome_vw.rec_status = 'C' \n" +
                        "   AND (edware_ca.fact_asmt_outcome_vw.asmt_type IN ( 'SUMMATIVE') \n" +
                        "       AND (edware_ca.fact_asmt_outcome_vw.administration_condition = 'IN' OR edware_ca.fact_asmt_outcome_vw.administration_condition IS NULL) \n" +
                        "       OR edware_ca.fact_asmt_outcome_vw.asmt_type IN ('INTERIM COMPREHENSIVE') \n" +
                        "       OR edware_ca.fact_asmt_outcome_vw.administration_condition IS NULL \n" +
                        "       OR edware_ca.fact_asmt_outcome_vw.administration_condition IN ('SD', 'NS')) \n" +
                        "   AND edware_ca.fact_asmt_outcome_vw.date_taken = '20151203' \n" +
                        "   AND edware_ca.dim_asmt.asmt_type = 'INTERIM COMPREHENSIVE' \n" +
                        "   AND edware_ca.fact_asmt_outcome_vw.asmt_year = 2016 \n" +
                        "ORDER BY edware_ca.dim_asmt.asmt_subject DESC, edware_ca.dim_asmt.asmt_period_year DESC";


        Optional<ICA> icaOptional;
        try {
            icaOptional = Optional.of(jdbcTemplate.queryForObject(querySQL, parameters, new ICARowMapper()));
        } catch (EmptyResultDataAccessException e) {
            icaOptional = Optional.empty();
        }

        return icaOptional;
    }

    private class ICARowMapper implements RowMapper<ICA> {
        @Override
        public ICA mapRow(ResultSet rs, int rowNum) throws SQLException {
            ICA ica = new ICA();
            ica.setMetadataId(rs.getString("student_id"))
                    .setMetadataSubject(rs.getString("asmt_subject"))
                    .setMetadataType(rs.getString("asmt_type"))
                    .setMetadataPeriod(rs.getString("asmt_period"))
                    .setMetadataDate(rs.getString("date_taken"),"yyyyMMdd")
                    .setMetadataGrade(rs.getString("asmt_grade"))
                    .setMetadataLocationDistrict(rs.getString("district_name"))
                    .setMetadataLocationState(rs.getString("state_code"))
                    .setMetadataLocationInstitution(rs.getString("school_name"))
                    .setMetadataScoreMinimum(rs.getInt("asmt_score_min"))
                    .setMetadataScoreMaximum(rs.getInt("asmt_score_max"))
                    .setMetadataScoreCutPoints(rs.getInt("asmt_cut_point_1"),
                            rs.getInt("asmt_cut_point_2"),
                            rs.getInt("asmt_cut_point_3"),
                            rs.getInt("asmt_cut_point_4"))
                    .setStudentName(String.format("%s %s %s", rs.getString("first_name"),
                                                                        rs.getString("middle_name"),
                                                                        rs.getString("last_name")))
                    .setStudentAccommodations(new int[]{1,3,5,7})
                    .setStudentPerformanceLevel(rs.getInt("asmt_perf_lvl"))
                    .setStudentPerformanceComplete(rs.getBoolean("complete"))
                    .setStudentPerformanceValid(true)
                    .setStudentPerformanceScore(rs.getInt("asmt_score"),
                                                rs.getInt("asmt_score_range_min"),
                                                rs.getInt("asmt_score_range_max"))
                    .addStudentPerformanceClaims(0, rs.getInt("asmt_claim_1_score"))
                    .addStudentPerformanceClaims(1, rs.getInt("asmt_claim_2_score"))
                    .addStudentPerformanceClaims(2, rs.getInt("asmt_claim_3_score"))
                    .addStudentPerformanceClaims(3, rs.getInt("asmt_claim_4_score"));
            
                    return ica;
        }
    }
}
