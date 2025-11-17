import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@knowledgenest.com' },
    update: {},
    create: {
      email: 'admin@knowledgenest.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Created admin user:', admin.email);

  // Create instructor users from top universities
  const instructorPassword = await bcrypt.hash('instructor123', 12);
  const instructor1 = await prisma.user.upsert({
    where: { email: 'instructor@knowledgenest.com' },
    update: {},
    create: {
      email: 'instructor@knowledgenest.com',
      name: 'Dr. Sarah Chen, MIT',
      password: instructorPassword,
      role: 'INSTRUCTOR',
    },
  });

  const instructor2 = await prisma.user.upsert({
    where: { email: 'prof.anderson@knowledgenest.com' },
    update: {},
    create: {
      email: 'prof.anderson@knowledgenest.com',
      name: 'Prof. James Anderson, Stanford',
      password: instructorPassword,
      role: 'INSTRUCTOR',
    },
  });

  const instructor3 = await prisma.user.upsert({
    where: { email: 'dr.mueller@knowledgenest.com' },
    update: {},
    create: {
      email: 'dr.mueller@knowledgenest.com',
      name: 'Dr. Klaus Müller, ETH Zürich',
      password: instructorPassword,
      role: 'INSTRUCTOR',
    },
  });

  const instructor4 = await prisma.user.upsert({
    where: { email: 'prof.patel@knowledgenest.com' },
    update: {},
    create: {
      email: 'prof.patel@knowledgenest.com',
      name: 'Prof. Raj Patel, Caltech',
      password: instructorPassword,
      role: 'INSTRUCTOR',
    },
  });

  console.log('✅ Created instructor users from top universities');

  // Create student user
  const studentPassword = await bcrypt.hash('student123', 12);
  const student = await prisma.user.upsert({
    where: { email: 'student@knowledgenest.com' },
    update: {},
    create: {
      email: 'student@knowledgenest.com',
      name: 'Jane Student',
      password: studentPassword,
      role: 'STUDENT',
    },
  });
  console.log('✅ Created student user:', student.email);

  // Create STEM Engineering Courses with prestigious instructors (Prices in INR)
  const courses = [
    {
      id: 'rocket-propulsion-101',
      title: '🚀 Rocket Propulsion Systems',
      description: 'Master the fundamentals of rocket propulsion, from chemical rockets to ion drives. Learn thrust calculations, nozzle design, and propellant chemistry used in SpaceX and NASA missions. Taught by MIT Aerospace Engineering faculty.',
      price: 499900, // ₹4,999
      thumbnail: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=800&h=600&fit=crop',
      instructorId: instructor1.id,
    },
    {
      id: 'advanced-mechanics',
      title: '⚙️ Advanced Mechanical Engineering',
      description: 'Deep dive into mechanical systems, thermodynamics, and material science. Design engines, turbines, and complex mechanical assemblies with CAD tools. Stanford University curriculum.',
      price: 399900, // ₹3,999
      thumbnail: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop',
      instructorId: instructor2.id,
    },
    {
      id: 'kinetic-energy-systems',
      title: '⚡ Kinetic Energy & Motion Systems',
      description: 'Explore kinetic energy conversion, flywheel systems, and regenerative braking. Build energy-efficient machines and understand momentum transfer. ETH Zürich research-based course. FREE COURSE!',
      price: 0, // FREE
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop',
      instructorId: instructor3.id,
    },
    {
      id: 'aerospace-structures',
      title: '✈️ Aerospace Structural Design',
      description: 'Learn to design aircraft and spacecraft structures. Study stress analysis, composite materials, and aerodynamic forces on modern aerospace vehicles. Caltech Aerospace Engineering.',
      price: 449900, // ₹4,499
      thumbnail: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop',
      instructorId: instructor4.id,
    },
    {
      id: 'robotics-automation',
      title: '🤖 Robotics & Automation Engineering',
      description: 'Build autonomous robots from scratch. Master kinematics, control systems, sensors, and AI integration for industrial and research robotics. MIT CSAIL curriculum.',
      price: 429900, // ₹4,299
      thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop',
      instructorId: instructor1.id,
    },
    {
      id: 'fluid-dynamics',
      title: '🌊 Computational Fluid Dynamics',
      description: 'Simulate fluid flow in rockets, aircraft, and turbines. Learn CFD software, Navier-Stokes equations, and aerodynamic optimization techniques. Stanford Mechanical Engineering.',
      price: 379900, // ₹3,799
      thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
      instructorId: instructor2.id,
    },
    {
      id: 'electric-propulsion',
      title: '⚡ Electric Vehicle Propulsion',
      description: 'Design electric motors, battery systems, and power electronics for EVs. Study Tesla-style drivetrains and regenerative systems. ETH Zürich Power Electronics Lab.',
      price: 399900, // ₹3,999
      thumbnail: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=600&fit=crop',
      instructorId: instructor3.id,
    },
    {
      id: 'materials-science',
      title: '🔬 Advanced Materials Science',
      description: 'Explore cutting-edge materials: carbon fiber, titanium alloys, and nanomaterials. Learn material selection for extreme environments. Caltech Materials Science. FREE COURSE!',
      price: 0, // FREE
      thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop',
      instructorId: instructor4.id,
    },
    {
      id: 'spacecraft-design',
      title: '🛸 Spacecraft Systems Design',
      description: 'Complete spacecraft design from concept to launch. Study orbital mechanics, life support, thermal control, and mission planning. MIT Aeronautics & Astronautics.',
      price: 499900, // ₹4,999
      thumbnail: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop',
      instructorId: instructor1.id,
    },
    {
      id: 'control-systems',
      title: '🎮 Control Systems Engineering',
      description: 'Master PID controllers, state-space models, and feedback systems. Design autopilots, stabilization systems, and industrial controllers. Stanford Control & Dynamical Systems.',
      price: 379900, // ₹3,799
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
      instructorId: instructor2.id,
    },
    {
      id: 'hypersonic-flight',
      title: '💨 Hypersonic Flight Engineering',
      description: 'Study Mach 5+ flight regimes, scramjet engines, and thermal protection systems. Design vehicles for hypersonic atmospheric entry. Caltech GALCIT research.',
      price: 479900, // ₹4,799
      thumbnail: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&h=600&fit=crop',
      instructorId: instructor4.id,
    },
    {
      id: 'manufacturing-tech',
      title: '🏭 Advanced Manufacturing Technology',
      description: 'Learn CNC machining, 3D printing, and additive manufacturing. Master production techniques for aerospace and automotive industries. ETH Zürich Manufacturing. FREE COURSE!',
      price: 0, // FREE
      thumbnail: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&h=600&fit=crop',
      instructorId: instructor3.id,
    },
  ];

  const createdCourses: any[] = [];
  for (const courseData of courses) {
    const course = await prisma.course.upsert({
      where: { id: courseData.id },
      update: {},
      create: {
        ...courseData,
        published: true,
      },
    });
    createdCourses.push(course);
  }
  console.log(`✅ Created ${createdCourses.length} STEM engineering courses`);

  // Create sample lessons with working YouTube educational videos
  const firstCourse = createdCourses[0];
  await prisma.lesson.createMany({
    data: [
      {
        title: 'Introduction to Rocket Science',
        videoUrl: 'https://www.youtube.com/watch?v=4TDnKy3LvjQ',
        duration: 3600,
        orderIndex: 1,
        courseId: firstCourse.id,
      },
      {
        title: 'How Rocket Engines Work',
        videoUrl: 'https://www.youtube.com/watch?v=DKtVpvzUF1Y',
        duration: 2880,
        orderIndex: 2,
        courseId: firstCourse.id,
      },
      {
        title: 'Rocket Propulsion Physics',
        videoUrl: 'https://www.youtube.com/watch?v=LbH1ZDImaI8',
        duration: 2400,
        orderIndex: 3,
        courseId: firstCourse.id,
      },
      {
        title: 'SpaceX Raptor Engine Explained',
        videoUrl: 'https://www.youtube.com/watch?v=LbH1ZDImaI8',
        duration: 3120,
        orderIndex: 4,
        courseId: firstCourse.id,
      },
    ],
  });

  // Add lessons for other courses with popular educational content
  await prisma.lesson.createMany({
    data: [
      // Mechanical Engineering - Course 2
      { title: 'Engineering Mechanics Introduction', videoUrl: 'https://www.youtube.com/watch?v=7yKwgXULWkU', duration: 3000, orderIndex: 1, courseId: createdCourses[1].id },
      { title: 'Thermodynamics Basics', videoUrl: 'https://www.youtube.com/watch?v=OH8m6BZQvXs', duration: 2700, orderIndex: 2, courseId: createdCourses[1].id },
      { title: 'Material Science Fundamentals', videoUrl: 'https://www.youtube.com/watch?v=BHZALtqAjeM', duration: 2900, orderIndex: 3, courseId: createdCourses[1].id },
      
      // Energy Systems - Course 3
      { title: 'Energy Conversion Principles', videoUrl: 'https://www.youtube.com/watch?v=BHZALtqAjeM', duration: 2800, orderIndex: 1, courseId: createdCourses[2].id },
      { title: 'Renewable Energy Systems', videoUrl: 'https://www.youtube.com/watch?v=7yKwgXULWkU', duration: 2600, orderIndex: 2, courseId: createdCourses[2].id },
      
      // Aerospace Structures - Course 4
      { title: 'Aircraft Structures Overview', videoUrl: 'https://www.youtube.com/watch?v=DKtVpvzUF1Y', duration: 3200, orderIndex: 1, courseId: createdCourses[3].id },
      { title: 'Composite Materials in Aerospace', videoUrl: 'https://www.youtube.com/watch?v=4TDnKy3LvjQ', duration: 2900, orderIndex: 2, courseId: createdCourses[3].id },
      
      // Robotics - Course 5
      { title: 'Introduction to Robotics', videoUrl: 'https://www.youtube.com/watch?v=0yD3uBshJB0', duration: 3300, orderIndex: 1, courseId: createdCourses[4].id },
      { title: 'Robot Kinematics and Dynamics', videoUrl: 'https://www.youtube.com/watch?v=llUBbpWVPQE', duration: 2800, orderIndex: 2, courseId: createdCourses[4].id },
      { title: 'Autonomous Navigation', videoUrl: 'https://www.youtube.com/watch?v=QR3U1dgc5RE', duration: 3100, orderIndex: 3, courseId: createdCourses[4].id },
      
      // Fluid Dynamics - Course 6
      { title: 'Fluid Mechanics Fundamentals', videoUrl: 'https://www.youtube.com/watch?v=7yKwgXULWkU', duration: 3000, orderIndex: 1, courseId: createdCourses[5].id },
      { title: 'Aerodynamics Principles', videoUrl: 'https://www.youtube.com/watch?v=DKtVpvzUF1Y', duration: 2850, orderIndex: 2, courseId: createdCourses[5].id },
      
      // Electric Vehicles - Course 7
      { title: 'Electric Motor Fundamentals', videoUrl: 'https://www.youtube.com/watch?v=BHZALtqAjeM', duration: 2900, orderIndex: 1, courseId: createdCourses[6].id },
      { title: 'Battery Technology Overview', videoUrl: 'https://www.youtube.com/watch?v=OH8m6BZQvXs', duration: 2700, orderIndex: 2, courseId: createdCourses[6].id },
      
      // Materials Science - Course 8
      { title: 'Advanced Materials Introduction', videoUrl: 'https://www.youtube.com/watch?v=BHZALtqAjeM', duration: 2800, orderIndex: 1, courseId: createdCourses[7].id },
      { title: 'Nanomaterials and Applications', videoUrl: 'https://www.youtube.com/watch?v=4TDnKy3LvjQ', duration: 2650, orderIndex: 2, courseId: createdCourses[7].id },
      
      // Spacecraft Design - Course 9
      { title: 'Orbital Mechanics Basics', videoUrl: 'https://www.youtube.com/watch?v=Am7EHnZWSGg', duration: 3400, orderIndex: 1, courseId: createdCourses[8].id },
      { title: 'Spacecraft Systems Engineering', videoUrl: 'https://www.youtube.com/watch?v=DKtVpvzUF1Y', duration: 2950, orderIndex: 2, courseId: createdCourses[8].id },
      { title: 'Mission Design and Planning', videoUrl: 'https://www.youtube.com/watch?v=4TDnKy3LvjQ', duration: 3200, orderIndex: 3, courseId: createdCourses[8].id },
      
      // Control Systems - Course 10
      { title: 'Control Theory Introduction', videoUrl: 'https://www.youtube.com/watch?v=7yKwgXULWkU', duration: 3100, orderIndex: 1, courseId: createdCourses[9].id },
      { title: 'PID Controllers Explained', videoUrl: 'https://www.youtube.com/watch?v=OH8m6BZQvXs', duration: 2800, orderIndex: 2, courseId: createdCourses[9].id },
      
      // Hypersonic Flight - Course 11
      { title: 'Hypersonic Aerodynamics', videoUrl: 'https://www.youtube.com/watch?v=DKtVpvzUF1Y', duration: 3300, orderIndex: 1, courseId: createdCourses[10].id },
      { title: 'Scramjet Engine Technology', videoUrl: 'https://www.youtube.com/watch?v=4TDnKy3LvjQ', duration: 3000, orderIndex: 2, courseId: createdCourses[10].id },
      
      // Manufacturing - Course 12
      { title: 'Modern Manufacturing Processes', videoUrl: 'https://www.youtube.com/watch?v=BHZALtqAjeM', duration: 2900, orderIndex: 1, courseId: createdCourses[11].id },
      { title: '3D Printing and Additive Manufacturing', videoUrl: 'https://www.youtube.com/watch?v=7yKwgXULWkU', duration: 2750, orderIndex: 2, courseId: createdCourses[11].id },
    ],
  });
  console.log('✅ Created lessons with YouTube educational content');

  // Create sample enrollment
  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: student.id,
        courseId: firstCourse.id,
      },
    },
    update: {},
    create: {
      userId: student.id,
      courseId: firstCourse.id,
      stripeSessionId: `sample_session_${Date.now()}`,
    },
  });
  console.log('✅ Created sample enrollment');

  // Get lessons for progress tracking
  const lessons = await prisma.lesson.findMany({
    where: { courseId: firstCourse.id },
    orderBy: { orderIndex: 'asc' },
  });

  // Create sample progress
  if (lessons.length > 0) {
    await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId: student.id,
          lessonId: lessons[0].id,
        },
      },
      update: {},
      create: {
        userId: student.id,
        lessonId: lessons[0].id,
        completed: true,
        watchTime: 1800,
      },
    });

    if (lessons.length > 1) {
      await prisma.progress.upsert({
        where: {
          userId_lessonId: {
            userId: student.id,
            lessonId: lessons[1].id,
          },
        },
        update: {},
        create: {
          userId: student.id,
          lessonId: lessons[1].id,
          completed: false,
          watchTime: 1200,
        },
      });
    }
  }
  console.log('✅ Created sample progress records');

  // Create sample reviews for multiple courses
  await prisma.review.upsert({
    where: {
      userId_courseId: {
        userId: student.id,
        courseId: firstCourse.id,
      },
    },
    update: {},
    create: {
      userId: student.id,
      courseId: firstCourse.id,
      rating: 5,
      text: 'Mind-blowing course! The rocket propulsion concepts are explained brilliantly. Perfect for aspiring aerospace engineers!',
    },
  });
  console.log('✅ Created sample reviews');

  console.log('🎉 Database seed completed successfully!');
  console.log('\n📝 Test Credentials:');
  console.log('Admin: admin@knowledgenest.com / admin123');
  console.log('Instructor: instructor@knowledgenest.com / instructor123');
  console.log('Student: student@knowledgenest.com / student123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

