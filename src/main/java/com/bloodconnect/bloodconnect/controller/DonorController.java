package com.bloodconnect.bloodconnect.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import com.bloodconnect.bloodconnect.entity.Donor;
import com.bloodconnect.bloodconnect.service.DonorService;

@RestController
@RequestMapping("/api/donors")
@CrossOrigin(origins = "*")
public class DonorController {

    private final DonorService donorService;

    public DonorController(DonorService donorService) {
        this.donorService = donorService;
    }

    // Register a new donor with validation
    @PostMapping
    public Donor registerDonor(@Valid @RequestBody Donor donor) {
        return donorService.registerDonor(donor);
    }

    // Search available donors who consented to contact sharing
    @GetMapping("/search")
    public List<Donor> searchDonors(
            @RequestParam String bloodGroup,
            @RequestParam String city) {

        return donorService.searchDonors(bloodGroup, city);
    }
}