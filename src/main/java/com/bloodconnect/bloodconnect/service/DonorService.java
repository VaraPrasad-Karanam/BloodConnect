package com.bloodconnect.bloodconnect.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bloodconnect.bloodconnect.entity.Donor;
import com.bloodconnect.bloodconnect.repository.DonorRepository;

@Service
public class DonorService {

    private final DonorRepository donorRepository;

    public DonorService(DonorRepository donorRepository) {
        this.donorRepository = donorRepository;
    }

    public Donor registerDonor(Donor donor) {
        return donorRepository.save(donor);
    }

    public List<Donor> getAllDonors() {
        return donorRepository.findAll();
    }

    public Donor getDonorById(Long id) {
        return donorRepository.findById(id).orElse(null);
    }

    public List<Donor> searchDonors(String bloodGroup, String city) {
        return donorRepository
                .findByBloodGroupIgnoreCaseAndCityContainingIgnoreCaseAndAvailableTrueAndContactConsentTrue(
                        bloodGroup, city);
    }

    public void deleteDonor(Long id) {
        donorRepository.deleteById(id);
    }
}