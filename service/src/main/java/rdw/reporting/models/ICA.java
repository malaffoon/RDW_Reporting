package rdw.reporting.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.*;

/**
 * Created on 1/23/17.
 */

public class ICA {
    private Metadata metadata;
    private Location location;
    private Score score;

    public static class Builder {
        private Metadata metadata;
        private Location location;
        private Score score;

        public Builder withMetadata(Metadata newMetadata) {
            this.metadata = newMetadata;
            return this;
        }

        public Builder withLocation(Location newLocation) {
            this.location = newLocation;
            return this;
        }

        public Builder withScore(Score newScore) {
            this.score = newScore;
            return this;
        }

        public ICA build() {
            return new ICA(this);
        }
    }

    private ICA(Builder builder) {
        metadata = builder.metadata;
        location = builder.location;
        score = builder.score;
    }

    public Metadata getMetadata() {
        return metadata;
    }

    public Location getLocation() {
        return location;
    }

    public Score getScore() {
        return score;
    }
}

class Location {
    private LinkedHashMap<String,String> state;
    private LinkedHashMap<String,String> district;
    private LinkedHashMap<String,String> institution;

    public static class Builder {
        private LinkedHashMap<String,String> state;
        private LinkedHashMap<String,String> district;
        private LinkedHashMap<String,String> institution;

        public Builder withLocation
    }

    public LinkedHashMap<String, String> getState() {
        return state;
    }

    public LinkedHashMap<String, String> getDistrict() {
        return district;
    }

    public LinkedHashMap<String, String> getInstitution() {
        return institution;
    }
}

class Metadata {
    public String id;
    public String subject;
    public String type;
    public String period;
    public Date date;
    public int grade;
    public Location location;
}
class Score {
    public LinkedHashMap<String,String> range;
    public ArrayList<String> cut_points;
}


