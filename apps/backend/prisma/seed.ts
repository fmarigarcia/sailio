/**
 * Sailio - Database Seed Script
 * Populates the development database with sample data for testing
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import type { Athlete, Session } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (in reverse order of dependencies)
  console.log('🗑️  Clearing existing data...');
  await prisma.trainingSessionData.deleteMany();
  await prisma.weatherCondition.deleteMany();
  await prisma.session.deleteMany();
  await prisma.athlete.deleteMany();
  await prisma.user.deleteMany();

  // Hash password for all sample users
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create sample coaches (users)
  console.log('👨‍🏫 Creating sample coaches...');
  const coach1 = await prisma.user.create({
    data: {
      email: 'coach@sailingclub.com',
      passwordHash: hashedPassword,
      firstName: 'Marina',
      lastName: 'Rodriguez',
      phone: '+34 123 456 789',
      certificationLevel: 'RYA Instructor Level 2',
      clubAffiliation: 'Barcelona Sailing Club',
      bio: 'Experienced sailing instructor with 15 years of coaching experience. Specialized in youth development and competitive sailing.',
      isActive: true,
      emailVerified: true,
    },
  });

  const coach2 = await prisma.user.create({
    data: {
      email: 'james.wilson@maritimeacademy.org',
      passwordHash: hashedPassword,
      firstName: 'James',
      lastName: 'Wilson',
      phone: '+44 207 123 4567',
      certificationLevel: 'RYA Yachtmaster Instructor',
      clubAffiliation: 'Royal Maritime Academy',
      bio: 'Former Olympic sailing coach now focused on developing the next generation of sailors.',
      isActive: true,
      emailVerified: true,
    },
  });

  // Create sample athletes
  console.log('⛵ Creating sample athletes...');
  const athletes: Athlete[] = [];

  // Athletes for Coach 1
  const athlete1 = await prisma.athlete.create({
    data: {
      coachId: coach1.id,
      firstName: 'Carlos',
      lastName: 'Mendez',
      dateOfBirth: new Date('2008-05-15'),
      email: 'carlos.mendez@email.com',
      phone: '+34 654 321 987',
      emergencyContactName: 'Rosa Mendez',
      emergencyContactPhone: '+34 654 321 988',
      sailingExperienceYears: 3,
      skillLevel: 'intermediate',
      boatTypes: ['Optimist', 'Laser'],
      certifications: ['RYA Level 1', 'Club Racing Certificate'],
      notes:
        'Very enthusiastic sailor with natural talent for racing. Needs to work on consistency in light winds.',
      isActive: true,
    },
  });
  athletes.push(athlete1);

  const athlete2 = await prisma.athlete.create({
    data: {
      coachId: coach1.id,
      firstName: 'Sofia',
      lastName: 'Garcia',
      dateOfBirth: new Date('2009-08-22'),
      email: 'sofia.garcia@email.com',
      emergencyContactName: 'Miguel Garcia',
      emergencyContactPhone: '+34 678 901 234',
      sailingExperienceYears: 2,
      skillLevel: 'beginner',
      boatTypes: ['Optimist'],
      certifications: ['RYA Level 1'],
      medicalNotes: 'No medical conditions',
      notes:
        'New to sailing but very eager to learn. Great attitude and listens well to instructions.',
      isActive: true,
    },
  });
  athletes.push(athlete2);

  const athlete3 = await prisma.athlete.create({
    data: {
      coachId: coach1.id,
      firstName: 'Alex',
      lastName: 'Thompson',
      dateOfBirth: new Date('2007-12-03'),
      email: 'alex.thompson@email.com',
      phone: '+34 612 345 678',
      emergencyContactName: 'Sarah Thompson',
      emergencyContactPhone: '+34 612 345 679',
      sailingExperienceYears: 5,
      skillLevel: 'advanced',
      boatTypes: ['Laser', '470', '29er'],
      certifications: ['RYA Level 2', 'International Youth Match Racing'],
      notes:
        'Experienced competitive sailor. Excellent boat handling skills, working on tactical awareness.',
      isActive: true,
    },
  });
  athletes.push(athlete3);

  // Athletes for Coach 2
  const athlete4 = await prisma.athlete.create({
    data: {
      coachId: coach2.id,
      firstName: 'Emma',
      lastName: 'Clarke',
      dateOfBirth: new Date('2008-10-18'),
      email: 'emma.clarke@email.com',
      emergencyContactName: 'David Clarke',
      emergencyContactPhone: '+44 7700 123 456',
      sailingExperienceYears: 4,
      skillLevel: 'intermediate',
      boatTypes: ['Optimist', 'Laser', 'Hobie Cat'],
      certifications: ['RYA Level 2'],
      medicalNotes: 'Mild asthma - has inhaler',
      notes: 'Strong technical skills but needs confidence building in heavy weather conditions.',
      isActive: true,
    },
  });
  athletes.push(athlete4);

  // Create sample training sessions
  console.log('🏃‍♂️ Creating sample training sessions...');
  const sessions: Session[] = [];

  // Session 1 - Recent completed session
  const session1 = await prisma.session.create({
    data: {
      coachId: coach1.id,
      sessionType: 'training',
      title: 'Upwind Technique Practice',
      description:
        'Focus on boat speed and pointing ability in moderate winds. Work on sail trim and body positioning.',
      sessionDate: new Date('2024-09-20'),
      startTime: new Date('2024-09-20T09:00:00Z'),
      endTime: new Date('2024-09-20T12:00:00Z'),
      durationMinutes: 180,
      locationName: 'Barcelona Harbor Training Area',
      latitude: 41.3851,
      longitude: 2.1734,
      waterBody: 'Mediterranean Sea',
      status: 'completed',
    },
  });
  sessions.push(session1);

  // Session 2 - Planned future session
  const session2 = await prisma.session.create({
    data: {
      coachId: coach1.id,
      sessionType: 'training',
      title: 'Downwind Skills Development',
      description: 'Practice jibing, spinnaker work, and boat handling in downwind conditions.',
      sessionDate: new Date('2024-09-28'),
      startTime: new Date('2024-09-28T14:00:00Z'),
      endTime: new Date('2024-09-28T17:00:00Z'),
      durationMinutes: 180,
      locationName: 'Barcelona Harbor Training Area',
      latitude: 41.3851,
      longitude: 2.1734,
      waterBody: 'Mediterranean Sea',
      status: 'completed',
    },
  });
  sessions.push(session2);

  // Session 2 - Planned future session
  const session4 = await prisma.session.create({
    data: {
      coachId: coach1.id,
      sessionType: 'training',
      title: 'Downwind Skills Development',
      description: 'Practice jibing, spinnaker work, and boat handling in downwind conditions.',
      sessionDate: new Date('2026-09-28'),
      startTime: new Date('2026-09-28T14:00:00Z'),
      endTime: new Date('2026-09-28T17:00:00Z'),
      durationMinutes: 180,
      locationName: 'Barcelona Harbor Training Area',
      latitude: 41.3851,
      longitude: 2.1734,
      waterBody: 'Mediterranean Sea',
      status: 'planned',
    },
  });
  sessions.push(session4);

  // Session 3 - Coach 2's session
  const session3 = await prisma.session.create({
    data: {
      coachId: coach2.id,
      sessionType: 'race',
      title: 'Club Championship Race Training',
      description:
        'Practice starts, mark roundings, and tactical sailing in preparation for the club championship.',
      sessionDate: new Date('2024-09-22'),
      startTime: new Date('2024-09-22T10:00:00Z'),
      endTime: new Date('2024-09-22T13:30:00Z'),
      durationMinutes: 210,
      locationName: 'Solent Race Area',
      latitude: 50.7314,
      longitude: -1.2982,
      waterBody: 'Solent',
      status: 'completed',
    },
  });
  sessions.push(session3);

  // Create weather conditions
  console.log('🌤️  Adding weather conditions...');
  await prisma.weatherCondition.create({
    data: {
      sessionId: session1.id,
      temperatureCelsius: 22.5,
      windSpeedKnots: 12.0,
      windDirectionDegrees: 225,
      windGustsKnots: 16.0,
      waveHeightMeters: 0.5,
      visibilityKm: 10.0,
      weatherDescription: 'Partly cloudy with good visibility',
      seaState: 'Slight',
      tideState: 'Rising',
      dataSource: 'manual',
    },
  });

  await prisma.weatherCondition.create({
    data: {
      sessionId: session2.id,
      temperatureCelsius: 18.0,
      windSpeedKnots: 18.5,
      windDirectionDegrees: 270,
      windGustsKnots: 22.0,
      waveHeightMeters: 1.2,
      visibilityKm: 8.0,
      weatherDescription: 'Overcast with moderate winds',
      seaState: 'Moderate',
      tideState: 'High',
      dataSource: 'manual',
    },
  });

  await prisma.weatherCondition.create({
    data: {
      sessionId: session3.id,
      temperatureCelsius: 18.0,
      windSpeedKnots: 18.5,
      windDirectionDegrees: 270,
      windGustsKnots: 22.0,
      waveHeightMeters: 1.2,
      visibilityKm: 8.0,
      weatherDescription: 'Overcast with moderate winds',
      seaState: 'Moderate',
      tideState: 'High',
      dataSource: 'manual',
    },
  });

  // Create training session data
  console.log('📊 Adding training session data...');

  // Training data for session 1
  await prisma.trainingSessionData.create({
    data: {
      sessionId: session1.id,
      athleteId: athlete1.id,
      skillFocus: ['upwind technique', 'sail trim', 'boat speed'],
      performanceRating: 7,
      techniqueNotes: 'Good progress on sail trim. Needs to work on consistent hiking position.',
      improvementAreas: ['Body position stability', 'consistent hiking'],
      strengthsObserved: ['Excellent feel for wind shifts', 'good boat handling'],
      boatUsed: 'Laser',
      sailConfiguration: 'Main + Standard Rig',
      distanceSailedNm: 8.5,
      sessionGoals: ['Improve pointing ability and maintain boat speed upwind'],
      goalsAchieved: ['Improve pointing ability and maintain boat speed upwind'],
      nextSessionFocus: ['Downwind technique and jibing'],
      overallSatisfaction: 8,
      coachNotes:
        'Carlos showed significant improvement today. His boat speed was consistently good.',
      athleteFeedback: 'Really enjoyed working on the upwind sailing. Feel more confident now.',
      athleteSelfRating: 7,
    },
  });

  await prisma.trainingSessionData.create({
    data: {
      sessionId: session1.id,
      athleteId: athlete2.id,
      skillFocus: ['basic technique', 'steering', 'sail control'],
      performanceRating: 5,
      techniqueNotes: 'Still learning basic controls. Good progress on steering smoothly.',
      improvementAreas: ['Sail trim timing', 'confidence in stronger winds'],
      strengthsObserved: ['Good learning attitude', 'follows instructions well'],
      boatUsed: 'Optimist',
      sailConfiguration: 'Main only',
      distanceSailedNm: 4.2,
      sessionGoals: ['Build confidence and master basic sailing controls'],
      goalsAchieved: ['Build confidence and master basic sailing controls'],
      nextSessionFocus: ['Tacking and basic maneuvers'],
      overallSatisfaction: 6,
      coachNotes: 'Sofia is making steady progress. Needs more time to build muscle memory.',
      athleteFeedback: 'Getting more comfortable with the boat. Want to practice more.',
      athleteSelfRating: 5,
    },
  });

  await prisma.trainingSessionData.create({
    data: {
      sessionId: session1.id,
      athleteId: athlete3.id,
      skillFocus: ['advanced technique', 'boat tuning', 'speed optimization'],
      performanceRating: 9,
      techniqueNotes: 'Excellent technique throughout. Minor adjustments to traveler use.',
      improvementAreas: ['Tactical awareness in fleet situations'],
      strengthsObserved: ['Superior boat handling', 'excellent speed', 'good tactical thinking'],
      boatUsed: 'Laser',
      sailConfiguration: 'Main + Standard Rig',
      distanceSailedNm: 12.3,
      sessionGoals: ['Fine-tune racing technique and boat setup'],
      goalsAchieved: ['Fine-tune racing technique and boat setup'],
      nextSessionFocus: ['Fleet racing tactics and match racing scenarios'],
      overallSatisfaction: 9,
      coachNotes: 'Alex is ready for higher level competition. Excellent session.',
      athleteFeedback: 'Love the technical challenges. Ready for more advanced training.',
      athleteSelfRating: 8,
    },
  });

  // Training data for session 3
  await prisma.trainingSessionData.create({
    data: {
      sessionId: session3.id,
      athleteId: athlete4.id,
      skillFocus: ['race starts', 'mark roundings', 'tactical sailing'],
      performanceRating: 6,
      techniqueNotes: 'Good starts but needs work on mark approach speed control.',
      improvementAreas: ['Confidence in close quarters', 'heavy weather technique'],
      strengthsObserved: ['Good tactical awareness', 'clean boat handling'],
      boatUsed: 'Laser',
      sailConfiguration: 'Main + Standard Rig',
      distanceSailedNm: 15.2,
      sessionGoals: ['Prepare for club championship racing'],
      goalsAchieved: [],
      nextSessionFocus: ['Heavy weather confidence building'],
      overallSatisfaction: 6,
      coachNotes: 'Emma has the skills but needs more confidence in competitive situations.',
      athleteFeedback: 'Found the strong winds challenging but learned a lot about racing.',
      athleteSelfRating: 6,
    },
  });

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   👨‍🏫 Coaches created: 2`);
  console.log(`   ⛵ Athletes created: 4`);
  console.log(`   🏃‍♂️ Sessions created: 4`);
  console.log(`   🌤️  Weather records: 3`);
  console.log(`   📊 Training records: 4`);
  console.log('\n🔐 Login credentials:');
  console.log('   Coach 1: coach@sailingclub.com / password123');
  console.log('   Coach 2: james.wilson@maritimeacademy.org / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
