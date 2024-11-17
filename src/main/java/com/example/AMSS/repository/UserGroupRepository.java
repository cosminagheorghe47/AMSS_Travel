package com.example.AMSS.repository;

import com.example.AMSS.model.UserGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserGroupRepository extends JpaRepository<UserGroup, Long> {
    List<UserGroup> findByUserId(Long userId);

    List<UserGroup> findByGroupId(Long groupId);
}
