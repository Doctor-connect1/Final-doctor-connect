import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Starting seed...");

    // Create Users
    console.log("Creating users...");
    const users = [];
    for (let i = 0; i < 80; i++) {
      const user = await prisma.user.create({
        data: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          username: faker.internet.userName(),
          password: faker.internet.password(),
          email: faker.internet.email(),
          role: faker.helpers.arrayElement(["Doctor", "Patient", "Admin"]),
          locationLatitude: faker.location.latitude(),
          locationLongitude: faker.location.longitude(),
          bio: faker.lorem.paragraph(),
          meetingPrice: parseFloat(faker.commerce.price()),
        },
      });
      users.push(user);
      console.log(`Created user ${i + 1}`);
    }

    // Create Doctors with proper user relationship
    console.log("Creating doctors...");
    const doctors = [];
    const doctorUsers = users
      .filter((user) => user.role === "Doctor")
      .slice(0, 20);
    for (const user of doctorUsers) {
      const doctor = await prisma.doctor.create({
        data: {
          userId: user.id,
          firstName: user.firstName || faker.person.firstName(),
          lastName: user.lastName || faker.person.lastName(),
          email: user.email,
          password: user.password,
          phone: faker.phone.number(),
          specialty: faker.person.jobTitle(),
          experience: faker.number.int({ min: 1, max: 30 }),
          bio: user.bio || faker.lorem.paragraph(),
          isVerified: faker.datatype.boolean(),
          locationLatitude: user.locationLatitude,
          locationLongitude: user.locationLongitude,
        },
      });
      doctors.push(doctor);
    }

    // Create Patients with proper user relationship
    console.log("Creating patients...");
    const patients = [];
    const patientUsers = users
      .filter((user) => user.role === "Patient")
      .slice(0, 50);
    for (const user of patientUsers) {
      const patient = await prisma.patient.create({
        data: {
          userId: user.id,
          firstName: user.firstName || faker.person.firstName(),
          lastName: user.lastName || faker.person.lastName(),
          email: user.email,
          phone: faker.phone.number(),
          dateOfBirth: faker.date.past({ years: 30 }),
          gender: faker.helpers.arrayElement(["Male", "Female"]),
          medicalHistory: faker.lorem.paragraph(),
          locationLatitude: user.locationLatitude,
          locationLongitude: user.locationLongitude,
          password: user.password,
          bio: user.bio || faker.lorem.paragraph(),
        },
      });
      patients.push(patient);
    }

    // Create Appointments with valid references
    console.log("Creating appointments...");
    for (let i = 0; i < 100; i++) {
      await prisma.appointment.create({
        data: {
          patientID: patientUsers[i % patientUsers.length].id,
          doctorID: doctorUsers[i % doctorUsers.length].id,
          appointmentDate: faker.date.future(),
          durationMinutes: faker.number.int({ min: 15, max: 120 }),
          status: faker.helpers.arrayElement([
            "pending",
            "confirmed",
            "rejected",
          ]),
          type: faker.helpers.arrayElement(["SUR_TERRAIN", "DISTANCE"]),
        },
      });
    }

    // Create Availabilities
    console.log("Creating availabilities...");
    for (const doctor of doctors) {
      for (let i = 0; i < 5; i++) {
        const startTime = faker.date.future();
        const endTime = new Date(startTime);
        endTime.setHours(endTime.getHours() + 2);

        await prisma.availability.create({
          data: {
            doctorID: doctor.id,
            availableDate: startTime,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            isAvailable: true,
          },
        });
      }
    }

    // Create Chatrooms with valid references
    console.log("Creating chatrooms...");
    const chatrooms = [];
    for (let i = 0; i < 30; i++) {
      const chatroom = await prisma.chatrooms.create({
        data: {
          patientID: patients[i % patients.length].id,
          doctorID: doctors[i % doctors.length].id,
          startTime: faker.date.past(),
        },
      });
      chatrooms.push(chatroom);
    }

    // Create ChatroomMessages
    console.log("Creating chatroom messages...");
    for (const chatroom of chatrooms) {
      for (let i = 0; i < 10; i++) {
        await prisma.chatroomMessage.create({
          data: {
            chatroomID: chatroom.id,
            senderID: faker.helpers.arrayElement([
              patientUsers[0].id,
              doctorUsers[0].id,
            ]),
            messageText: faker.lorem.sentence(),
          },
        });
      }
    }

    // Create Media for all entities (users, doctors, and patients)
    console.log("Creating media...");

    // Media for Users
    for (const user of users) {
      await prisma.media.create({
        data: {
          userID: user.id,
          url: `https://picsum.photos/200/300?random=${user.id}`, // Using Lorem Picsum for realistic image URLs
        },
      });
    }

    // Media for Doctors
    for (const doctor of doctors) {
      await prisma.media.create({
        data: {
          doctorId: doctor.id,
          url: `https://picsum.photos/200/300?random=${doctor.id + 1000}`,
        },
      });
    }

    // Media for Patients
    for (const patient of patients) {
      await prisma.media.create({
        data: {
          patientId: patient.id,
          url: `https://picsum.photos/200/300?random=${patient.id + 2000}`,
        },
      });
    }

    // Create DoctorReviews with shorter review text
    console.log("Creating doctor reviews...");
    for (const doctor of doctors) {
      for (let i = 0; i < 5; i++) {
        await prisma.doctorReview.create({
          data: {
            doctorID: doctor.id,
            patientID: patients[i % patients.length].id,
            rating: faker.number.int({ min: 1, max: 5 }),
            comment: faker.lorem.sentence().slice(0, 255),
            reviewText: faker.lorem.sentence().slice(0, 255), // Ensuring review text is less than 255 characters
            reviewDate: faker.date.past(),
          },
        });
      }
    }

    // Create Specialties
    for (let i = 0; i < 120; i++) {
      await prisma.specialty.create({
        data: {
          name: faker.name.jobTitle(),
          userId: users[i].id,
        },
      });
    }

    console.log("Seeding completed successfully");
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Fatal error during seeding:", error);
  process.exit(1);
});
