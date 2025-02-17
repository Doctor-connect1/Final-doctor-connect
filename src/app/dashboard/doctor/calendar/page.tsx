"use client";

import { useState, useEffect } from "react";
import PageContainer from "../components/PageContainer";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit, FiTrash, FiX } from "react-icons/fi";
import Modal from "react-modal";

Modal.setAppElement("#root"); // Ensure this matches your root element ID

const CalendarPage = () => {
  const [events, setEvents] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" });
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  // Fetch existing appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/doctor/dashboard/appointments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }

        const data = await response.json();

        const formattedEvents = data.map((appointment) => ({
          id: appointment.id.toString(),
          title: `${appointment.patient} - ${appointment.type}`,
          start: appointment.time,
          end: new Date(
            new Date(appointment.time).getTime() +
              appointment.durationMinutes * 60 * 1000
          ).toISOString(),
          color: "#007E85",
          extendedProps: {
            type: appointment.type,
            patient: appointment.patient,
          },
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  const handleDateClick = (arg) => {
    const startTime = arg.dateStr;
    const endTime = new Date(
      new Date(startTime).getTime() + 60 * 60 * 1000
    ).toISOString(); // Default 1-hour duration
    setNewEvent({ title: "", start: startTime, end: endTime });
    setIsModalOpen(true);
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setIsModalOpen(true);
  };

  const handleSaveEvent = async () => {
    try {
      const token = localStorage.getItem("token");
      const email = newEvent.title;

      // First, find patient by email
      const patientResponse = await fetch(
        `/api/doctor/patients/find?email=${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!patientResponse.ok) {
        throw new Error("Patient not found");
      }

      const patient = await patientResponse.json();

      // Create appointment
      const appointmentResponse = await fetch("/api/doctor/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patientId: patient.id,
          start: newEvent.start,
          end: newEvent.end,
        }),
      });

      if (!appointmentResponse.ok) {
        const errorData = await appointmentResponse.json();
        throw new Error(errorData.error || "Failed to create appointment");
      }

      const createdAppointment = await appointmentResponse.json();

      // Add to local state
      setEvents([
        ...events,
        {
          id: createdAppointment.id,
          title: `${patient.firstName} ${patient.lastName} - Appointment`,
          start: createdAppointment.start,
          end: createdAppointment.end,
          color: "#007E85",
        },
      ]);

      setIsModalOpen(false);
      setNewEvent({ title: "", start: "", end: "" });
    } catch (error) {
      setAlertMessage(error.message);
      setShowAlert(true);
    }
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents(events.filter((event) => event.id !== selectedEvent.id));
      setIsModalOpen(false);
      setSelectedEvent(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setNewEvent({ title: "", start: "", end: "" });
  };

  return (
    <PageContainer title="Appointment Calendar">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Calendar Controls */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#007E85]">
            Manage Appointments
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#007E85] text-white rounded-lg hover:bg-[#006670] transition-colors"
          >
            <FiPlus />
            <span>New Appointment</span>
          </motion.button>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            height="650px"
            events={events}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            eventContent={(eventInfo) => (
              <motion.div
                className="p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-sm font-medium">
                  {eventInfo.event.title}
                </div>
                <div className="text-xs text-gray-600">
                  {eventInfo.timeText}
                </div>
              </motion.div>
            )}
            eventClassNames="hover:shadow-md transition-shadow"
            dayHeaderClassNames="bg-[#007E85] text-white"
            buttonText={{
              today: "Today",
              month: "Month",
              week: "Week",
              day: "Day",
            }}
            nowIndicator
            slotMinTime="08:00:00"
            slotMaxTime="20:00:00"
            allDaySlot={false}
            weekends={false}
            eventBackgroundColor="#007E85"
            eventBorderColor="#007E85"
            eventTextColor="#ffffff"
          />
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-[#007E85] mb-4">
            Upcoming Appointments
          </h3>
          <div className="space-y-3">
            {events
              .sort(
                (a, b) =>
                  new Date(a.start).getTime() - new Date(b.start).getTime()
              )
              .map((event) => (
                <motion.div
                  key={event.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  whileHover={{ scale: 1.01 }}
                >
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(event.start).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsModalOpen(true);
                      }}
                      className="text-[#007E85] hover:text-[#006670] p-2 rounded-full hover:bg-[#007E85]/10"
                    >
                      <FiEdit />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteEvent(event)}
                      className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-500/10"
                    >
                      <FiTrash />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </motion.div>

      {/* Modal for Appointment Details */}
      <AnimatePresence>
        {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            onRequestClose={handleCloseModal}
            className="modal"
            overlayClassName="modal-overlay"
            style={{
              content: {
                position: "fixed",
                top: "-1150px", // Start above the screen
                left: "75%",
                transform: "translateX(-50%)",
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                padding: "24px",
                maxWidth: "90%",
                width: "400px",
                height: "auto", // Auto height for flexibility
                zIndex: 1000, // Ensure the modal is on top
              },
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(4px)",
                zIndex: 999, // Ensure the overlay is below the modal
              },
            }}
          >
            <motion.div
              initial={{ y: -1500 }} // Start above the screen
              animate={{ y: 0 }} // Slide down to the center
              exit={{ y: -400 }} // Slide back up when closing
              transition={{ type: "spring", stiffness: 100, damping: 15 }} // Smooth spring animation
              className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()} // Prevent click propagation
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-[#007E85]">
                  {selectedEvent ? "Edit Appointment" : "New Appointment"}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX />
                </button>
              </div>
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Patient Email"
                  value={selectedEvent ? selectedEvent.title : newEvent.title}
                  onChange={(e) =>
                    selectedEvent
                      ? setSelectedEvent({
                          ...selectedEvent,
                          title: e.target.value,
                        })
                      : setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007E85]"
                />
                <input
                  type="datetime-local"
                  value={selectedEvent ? selectedEvent.start : newEvent.start}
                  onChange={(e) =>
                    selectedEvent
                      ? setSelectedEvent({
                          ...selectedEvent,
                          start: e.target.value,
                        })
                      : setNewEvent({ ...newEvent, start: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007E85]"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={selectedEvent ? handleSaveEvent : handleSaveEvent}
                    className="px-4 py-2 bg-[#007E85] text-white rounded-lg hover:bg-[#006670]"
                  >
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>

      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold text-[#007E85] mb-4">Error</h3>
            <p className="text-gray-700 mb-6">{alertMessage}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowAlert(false)}
                className="px-4 py-2 bg-[#007E85] text-white rounded-lg hover:bg-[#006670] transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default CalendarPage;
