package com.service.assets.controller;

import com.service.assets.model.PerformanceMetric;
import com.service.assets.repo.PerformanceMetricRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/metrics")
@CrossOrigin(origins = "http://localhost:5173")
public class MetricController {

    @Autowired
    private PerformanceMetricRepository performanceMetricRepository;

    @GetMapping
    public List<PerformanceMetric> getAllMetrics() {
        return performanceMetricRepository.findAll();
    }
}