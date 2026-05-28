package com.psygenie.model.entities;

import com.psygenie.model.entities.enums.LocationEnum;

import javax.persistence.*;

@Entity
@Table(name = "locations")
public class Location extends BaseEntity {

    private LocationEnum name;

    public Location(LocationEnum locationEnum) {
        this.name = locationEnum;
    }

    public Location() {
    }

    @Column(unique = true)
    @Enumerated(EnumType.STRING)
    public LocationEnum getName() {
        return name;
    }

    public void setName(LocationEnum name) {
        this.name = name;
    }
}
