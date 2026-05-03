# Lecture Hall Management System — Booking Confirmation Module

This repository contains the **Booking Confirmation Module** (Module 3) for the Lecture Hall Management System, developed by **Group 19**.

## About the Project

This system serves as an administrative control panel for managing university lecture halls and their reservations. It provides a clean, minimalistic interface for administrators to seamlessly allocate rooms for events, modify existing reservations, and manage the physical spaces available on campus.

### Key Features

*   **Allocate Lecture Halls:** Administrators can create new bookings by selecting an available lecture hall, specifying the event name, date, start/end times, and purpose.
*   **Manage Bookings:** View a comprehensive list of all scheduled events across all halls.
*   **Update & Cancel:** Modify details of an existing booking if schedules change, or cancel them entirely. Cancellations utilize a "soft delete" system, preserving the booking history for record-keeping.
*   **Hall Management:** Keep track of all physical lecture halls on campus. Administrators can add new halls, update seating capacities, and list available facilities like projectors, ACs, and whiteboards.
*   **RESTful API:** A robust Node.js/Express backend connected to MongoDB, providing endpoints for all CRUD operations.

## Group 19 — Roles & Responsibilities

Our team was specifically responsible for building the core administrative booking capabilities:

*   **Ayush Agarwal:** Core API logic and server architecture.
*   **Vaibhav Rawat:** Frontend interface and hall allocation workflows.
*   **Adeshwar Singh:** Database schema design, connection logic, and booking cancellation features.
*   **Mehta Aryan Rajesh:** Lecture hall detail updates and API testing integration.

## Tech Stack

*   **Frontend:** Vanilla HTML, CSS, JavaScript
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB Atlas (Mongoose)
