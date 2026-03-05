package com.saigana.medvault.controller;

import com.saigana.medvault.entity.Appointment;
import com.saigana.medvault.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping("/book")
    public ResponseEntity<?> book(@RequestBody Map<String, String> payload, Authentication authentication) {
        String patientEmail = authentication.getName();
        Long doctorUserId = Long.parseLong(payload.get("doctorId"));
        String reason = payload.get("reason");
        String date = payload.get("date");
        String time = payload.get("time");

        Appointment appointment = appointmentService.bookAppointment(
                patientEmail, doctorUserId, reason, date, time
        );

        return ResponseEntity.ok(appointment);
    }
    // Add this to src/main/java/com/saigana.medvault.controller/AppointmentController.java

    @GetMapping("/patient/my-bookings")
    public ResponseEntity<List<Appointment>> getMyBookings(Authentication authentication) {
        String email = authentication.getName();
        // Use the existing service logic to find the patient and their appointments
        List<Appointment> bookings = appointmentService.getPatientAppointments(email);
        return ResponseEntity.ok(bookings);
    }
    @PostMapping("/pay/{id}")
    public ResponseEntity<?> payForAppointment(@PathVariable Long id, Authentication authentication) {
        try {
            String patientEmail = authentication.getName();
            // Call the service to update status to PAID
            Appointment updatedAppointment = appointmentService.processPayment(patientEmail, id);
            return ResponseEntity.ok(updatedAppointment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/doctor/stats")
    public ResponseEntity<Map<LocalDate, Long>> getStats(Authentication auth) {
        return ResponseEntity.ok(appointmentService.getAppointmentStats(auth.getName()));
    }
}