package com.psygenie.service;

import com.psygenie.model.entities.Location;
import com.psygenie.model.entities.enums.LocationEnum;

import java.util.List;

public interface LocationService {
    List<Location> initLocations();

    Location getLocationByName(LocationEnum locationEnum);
}
