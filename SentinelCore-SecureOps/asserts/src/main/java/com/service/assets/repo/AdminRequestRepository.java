package com.service.assets.repo;

import com.service.assets.model.AdminRequest;
import com.service.assets.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminRequestRepository extends JpaRepository<AdminRequest, Long> {
    List<AdminRequest> findByRequester(User requester);
    List<AdminRequest> findByStatus(AdminRequest.RequestStatus status);
}