package com.service.assets.controller;

import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import com.service.assets.model.AdminRequest;
import com.service.assets.model.User;
import com.service.assets.repo.UserRepository;
import com.service.assets.service.AdminRequestService;

class AdminRequestControllerTest {

//    @AfterEach
//    void clearSecurityContext() {
//        SecurityContextHolder.clearContext();
//    }
//
//    @Test
//    void getMyRequestsUsesSecurityContextWhenNoAuthenticationArgumentIsProvided() {
//        AdminRequestService requestService = mock(AdminRequestService.class);
//        UserRepository userRepository = mock(UserRepository.class);
//        AdminRequestController controller = new AdminRequestController(requestService, userRepository);
//
//        User user = new User("alice", "alice@example.com", "pw", User.MyRole.EMPLOYEE, OffsetDateTime.now());
//        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(user));
//        when(requestService.getUserRequests(any(User.class))).thenReturn(Collections.emptyList());
//
//        SecurityContextHolder.getContext().setAuthentication(new TestingAuthenticationToken("alice", "password"));
//
//        ResponseEntity<java.util.List<AdminRequest>> response = controller.getMyRequests(null, new MockHttpServletRequest());
//
//        assertEquals(200, response.getStatusCode().value());
//        assertEquals(Collections.emptyList(), response.getBody());
//    }
}
