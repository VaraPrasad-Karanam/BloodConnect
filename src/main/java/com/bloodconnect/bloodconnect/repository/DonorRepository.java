package com.bloodconnect.bloodconnect.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bloodconnect.bloodconnect.entity.Donor;

public interface DonorRepository extends JpaRepository<Donor, Long> {

    List<Donor> findByBloodGroupIgnoreCaseAndCityContainingIgnoreCaseAndAvailableTrueAndContactConsentTrue(
            String bloodGroup, String city);
}