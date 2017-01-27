package rdw.reporting.models;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * Created on 1/23/17.
 */

public class ICA {
    private Metadata metadata;
    private Student student;


    public ICA() {
        this.metadata = new Metadata();
        this.student = new Student();
    }

    public Metadata getMetadata() {
        return metadata;
    }

    public Student getStudent() {
        return student;
    }

    public void setMetadata(Metadata metadata) {
        this.metadata = metadata;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public ICA setMetadataId(String id){
        if (this.metadata != null) {
            this.metadata.setId(id);
        }
        return this;
    }
    public ICA setMetadataSubject(String subject){
        if (this.metadata != null) {
            this.metadata.setSubject(subject);
        }
        return this;
    }
    public ICA setMetadataType(String type){
        if (this.metadata != null) {
            this.metadata.setType(type);
        }
        return this;
    }
    public ICA setMetadataPeriod(String period){
        if (this.metadata != null) {
            this.metadata.setPeriod(period);
        }
        return this;
    }
    public ICA setMetadataDate(String date, String format){
        if (this.metadata != null) {
            this.metadata.setDate(date, format);
        }
        return this;
    }
    public ICA setMetadataGrade(String grade){
        if (this.metadata != null) {
            this.metadata.setGrade(grade);
        }
        return this;
    }
    public ICA setMetadataLocationState(String state){
        if (this.metadata != null) {
            this.metadata.setLocationState(state);
        }
        return this;
    }
    public ICA setMetadataLocationDistrict(String district){
        if (this.metadata != null) {
            this.metadata.setLocationDistrict(district);
        }
        return this;
    }
    public ICA setMetadataLocationInstitution(String institution){
        if (this.metadata != null) {
            this.metadata.setLocationInstitution(institution);
        }
        return this;
    }

    public void setMetadataScore(Score score){
        if (this.metadata != null) {
            this.metadata.setScore(score);
        }
    }
    public ICA setMetadataScoreMinimum(int min){
        if (this.metadata != null) {
            this.metadata.setScoreMinimum(min);
        }
        return this;
    }
    public ICA setMetadataScoreMaximum(int max){
        if (this.metadata != null) {
            this.metadata.setScoreMaximum(max);
        }
        return this;
    }
    public ICA setMetadataScoreCutPoints(int... cutPoint){
        if (this.metadata != null) {
            this.metadata.setScoreCutPoints(cutPoint);
        }
        return this;
    }

    public ICA setStudentName(String name) {
        if (this.student != null) {
            this.student.setName(name);
        }
        return this;
    }

    public ICA setStudentAccommodations(int[] accommodations) {
        if (this.student != null) {
            this.student.setAccommodations(accommodations);
        }
        return this;
    }

    public ICA setStudentPerformanceLevel(int level){
        if (this.student != null) {
            this.student.setPerformanceLevel(level);
        }
        return this;
    }
    public ICA setStudentPerformanceValid(boolean valid){
        if (this.student != null) {
            this.student.setPerformanceValid(valid);
        }
        return this;
    }
    public ICA setStudentPerformanceComplete(boolean complete){
        if (this.student != null){
            this.student.setPerformanceComplete(complete);
        }
        return this;
    }
    public ICA setStudentPerformanceScore(int value, int min, int max){
        if (this.student != null){
            this.student.setPerformanceScore(value, min, max);
        }
        return this;
    }
    public ICA addStudentPerformanceClaims(int id, int performance){
        if (this.student != null){
            this.student.addPerformanceClaim(id, performance);
        }
        return this;
    }
}
class Metadata {
    private String id;
    private String subject;
    private String type;
    private String period;
    private String date;
    private String grade;
    private Location location;
    private Score score;

    public Metadata(String id, String subject, String type, String period, String date, String grade, Location location, Score score) {
        this.id = id;
        this.subject = subject;
        this.type = type;
        this.period = period;
        this.date = date;
        this.grade = grade;
        this.location = location;
        this.score = score;
    }

    public Metadata() {
        location = new Location();
        score = new Score();
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public void setDate(String date, String format) {

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(format);
        DateTimeFormatter outFormatter = DateTimeFormatter.ofPattern("MM-dd-yyyy");
        LocalDate ld = LocalDate.parse(date, formatter);

        this.date = ld.format(outFormatter);
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public Metadata setLocationState(String state) {
        this.location.setState(state);
        return this;
    }

    public Metadata setLocationDistrict(String district) {
        this.location.setDistrict(district);
        return this;
    }

    public Metadata setLocationInstitution(String institution) {
        this.location.setInstitution(institution);
        return this;
    }

    public void setScore(Score score) {
        this.score = score;
    }

    public Metadata setScoreMinimum(int min) {
        this.score.setMinimum(min);
        return this;
    }

    public Metadata setScoreMaximum(int max) {
        this.score.setMaximum(max);
        return this;
    }


    public Metadata addScoreCutPoints(int... cutPoint) {
        this.score.addCutPoints(cutPoint);
        return this;
    }

    public Metadata setScoreCutPoints(int... cutPoint) {
        this.score.setCutPoints(cutPoint);
        return this;
    }

    public String getId() {
        return id;
    }

    public String getSubject() {
        return subject;
    }

    public String getType() {
        return type;
    }

    public String getPeriod() {
        return period;
    }

    public String getDate() {
        return date;
    }

    public String getGrade() {
        return grade;
    }

    public Location getLocation() {
        return location;
    }

    public Score getScore() {
        return score;
    }
}

class Score {
    private int minimum;
    private int maximum;
    private List<Integer> cutPoints;

    public Score(int min, int max, List<Integer> cutPoints) {
        this.minimum = min;
        this.maximum = max;
        this.cutPoints = cutPoints;
    }

    public Score() {
        cutPoints = new ArrayList<>(3);
    }

    public void addCutPoints(int... points) {
        for (int point : points) {
            cutPoints.add(point);
        }
    }

    public void setMinimum(int minimum) {
        this.minimum = minimum;
    }

    public void setMaximum(int maximum) {
        this.maximum = maximum;
    }


    public Score setCutPoints(int... cutPoint) {
        this.cutPoints.clear();
        addCutPoints(cutPoint);
        return this;
    }

    public int getMinimum() {
        return minimum;
    }

    public int getMaximum() {
        return maximum;
    }

    public List<Integer> getCutPoints() {
        return cutPoints;
    }
}

class Location {
    private String state;
    private String district;
    private String institution;

    public Location(String state, String district, String institution) {
        this.state = state;
        this.district = district;
        this.institution = institution;
    }

    public Location() {}

    public void setState(String state) {
        this.state = state;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }

    public String getState() {
        return state;
    }

    public String getDistrict() {
        return district;
    }

    public String getInstitution() {
        return institution;
    }
}


class Student {
    private String name;
    private int[] accommodations;
    private Performance performance;

    public Student(String name, int[] accommodations, Performance performance) {
        this.name = name;
        this.accommodations = accommodations;
        this.performance = performance;
    }

    public Student() {
        accommodations = new int[15];
        performance = new Performance();
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAccommodations(int[] accommodations) {
        this.accommodations = accommodations;
    }

    public void setPerformance(Performance performance) {
        this.performance = performance;
    }

    public Student setPerformanceScore(int value, int min, int max) {
        if (this.performance != null) {
            this.performance.setScore(value, min, max);
        }
        return this;
    }

    public Student setPerformanceLevel(int level){
        if(this.performance != null) {
            this.performance.setLevel(level);
        }
        return this;
    }
    public Student setPerformanceValid(boolean valid){
        if(this.performance != null) {
            this.performance.setValid(valid);
        }
        return this;
    }
    public Student setPerformanceComplete(boolean complete){
        if(this.performance != null) {
            this.performance.setComplete(complete);
        }
        return this;
    }

    public Student addPerformanceClaim(int id, int performance){
        if(this.performance != null) {
            this.performance.addClaim(id, performance);
        }
        return this;
    }

    public String getName() {
        return name;
    }

    public int[] getAccommodations() {
        return accommodations;
    }

    public Performance getPerformance() {
        return performance;
    }
}

class Performance {
    private int level;
    private boolean valid;
    private boolean complete;
    private Map<String,Integer> score;
    private List<Map<String,Integer>> claims;

    public Performance(int level, boolean valid, boolean complete, Map<String, Integer> score, List<Map<String, Integer>> claims) {
        this.level = level;
        this.valid = valid;
        this.complete = complete;
        this.score = score;
        this.claims = claims;
    }

    public Performance() {
        score = new LinkedHashMap<>();
        claims = new ArrayList<>();

    }

    public void addClaim(int id, int performance) {
        Map<String,Integer> entry = new LinkedHashMap<>();
        entry.put("id", id);
        entry.put("performance", performance);
        claims.add(id, entry);
    }

    public void setClaims(List<Map<String,Integer>> claims) {
        this.claims = claims;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public void setComplete(boolean complete) {
        this.complete = complete;
    }

    public void setScore(Map<String, Integer> score) {
        this.score = score;
    }

    public void setScore(int value, int min, int max) {
        this.score.put("value", value);
        this.score.put("range_min", min);
        this.score.put("range_max", max);
    }

    public int getLevel() {
        return level;
    }

    public boolean isValid() {
        return valid;
    }

    public boolean isComplete() {
        return complete;
    }

    public Map<String, Integer> getScore() {
        return score;
    }

    public List<Map<String, Integer>> getClaims() {
        return claims;
    }
}