package com.psygenie.model.repostiory;

import com.psygenie.model.entities.Hobby;
import com.psygenie.model.entities.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface HobbyRepository extends JpaRepository<Hobby, Long> {
    Set<Hobby> findAllByCreator(String creator);

    List<Hobby> findAllByLocation(Location location);
}
