import { NestFactory } from '@nestjs/core';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { AppModule } from '../src/app.module';
import { Plan, PlanDocument } from '../src/modules/plans/schemas/plan.schema';
import { Agency, AgencyDocument } from '../src/modules/agencies/schemas/agency.schema';
import { User, UserDocument } from '../src/modules/users/schemas/user.schema';
import { PlanInterval, PlanStatus, AgencyStatus, UserRole } from '../src/shared/enums';
import * as bcrypt from 'bcrypt';

async function createDemoAgency() {
  console.log('🚀 Creating demo agency...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const planModel: Model<PlanDocument> = app.get(getModelToken(Plan.name));
  const agencyModel: Model<AgencyDocument> = app.get(getModelToken(Agency.name));
  const userModel: Model<UserDocument> = app.get(getModelToken(User.name));

  try {
    // 1. Create Demo Plan if it doesn't exist
    console.log('📋 Creating demo plan...');
    let demoPlan = await planModel.findOne({ name: 'demo-plan' });
    
    if (!demoPlan) {
      demoPlan = await planModel.create({
        name: 'demo-plan',
        displayName: 'Demo Plan',
        description: 'Free demo plan for testing all features with limited usage',
        price: 0,
        interval: PlanInterval.MONTHLY,
        maxVehicles: 5,
        maxDrivers: 5,
        maxTripsPerMonth: 50,
        features: [
          'Up to 5 vehicles',
          'Up to 5 drivers', 
          '50 trips per month',
          'Basic dashboard',
          'Trip management',
          'Customer management',
          'Basic reporting',
          '7-day demo period'
        ],
        status: PlanStatus.ACTIVE,
        isVisible: true,
        sortOrder: 0,
        isPopular: false
      });
      console.log('✅ Demo plan created:', demoPlan.name);
    } else {
      console.log('ℹ️  Demo plan already exists');
    }

    // 2. Create Demo Agency
    console.log('🏢 Creating demo agency...');
    let demoAgency = await agencyModel.findOne({ email: 'demo@arwapark.com' });
    
    if (!demoAgency) {
      const demoExpiresAt = new Date();
      demoExpiresAt.setDate(demoExpiresAt.getDate() + 30); // 30 days demo

      demoAgency = await agencyModel.create({
        name: 'ArwaPark Demo Agency',
        email: 'demo@arwapark.com',
        phoneNumber: '+1234567890',
        whatsappNumber: '+1234567890',
        countryCode: 'US',
        planId: demoPlan._id,
        status: AgencyStatus.DEMO,
        demoExpiresAt,
        isEmailVerified: true,
        isPhoneVerified: true,
        isWhatsappVerified: true,
        marketingConsent: false,
        source: 'demo-script',
        address: '123 Demo Street, Demo City, DC 12345',
        website: 'https://demo.arwapark.com',
        timezone: 'UTC',
        currency: 'USD',
        language: 'en',
        subscriptionStartedAt: new Date(),
        subscriptionEndsAt: demoExpiresAt,
        currentVehicles: 0,
        currentDrivers: 0,
        currentMonthTrips: 0
      });
      console.log('✅ Demo agency created:', demoAgency.name);
    } else {
      console.log('ℹ️  Demo agency already exists');
    }

    // 3. Create Demo Super Admin User
    console.log('👤 Creating demo admin user...');
    let demoUser = await userModel.findOne({ email: 'admin@arwapark.com' });
    
    if (!demoUser) {
      const hashedPassword = await bcrypt.hash('demo123456', 12);
      
      demoUser = await userModel.create({
        name: 'Demo Admin',
        email: 'admin@arwapark.com',
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        agencyId: demoAgency._id,
        isActive: true,
        emailVerified: true,
        lastLogin: new Date()
      });
      console.log('✅ Demo admin user created:', demoUser.email);
    } else {
      console.log('ℹ️  Demo admin user already exists');
    }

    // 4. Create Demo Agency Admin User
    console.log('👤 Creating demo agency admin user...');
    let demoAgencyAdmin = await userModel.findOne({ email: 'agency@arwapark.com' });
    
    if (!demoAgencyAdmin) {
      const hashedPassword = await bcrypt.hash('demo123456', 12);
      
      demoAgencyAdmin = await userModel.create({
        name: 'Demo Agency Admin',
        email: 'agency@arwapark.com',
        password: hashedPassword,
        role: UserRole.AGENCY_ADMIN,
        agencyId: demoAgency._id,
        isActive: true,
        emailVerified: true,
        lastLogin: new Date()
      });
      console.log('✅ Demo agency admin user created:', demoAgencyAdmin.email);
    } else {
      console.log('ℹ️  Demo agency admin user already exists');
    }

    // 5. Create Demo Agency User (Driver)
    console.log('👤 Creating demo driver user...');
    let demoDriver = await userModel.findOne({ email: 'driver@arwapark.com' });
    
    if (!demoDriver) {
      const hashedPassword = await bcrypt.hash('demo123456', 12);
      
      demoDriver = await userModel.create({
        name: 'Demo Driver',
        email: 'driver@arwapark.com',
        password: hashedPassword,
        role: UserRole.DRIVER,
        agencyId: demoAgency._id,
        isActive: true,
        emailVerified: true,
        lastLogin: new Date()
      });
      console.log('✅ Demo driver user created:', demoDriver.email);
    } else {
      console.log('ℹ️  Demo driver user already exists');
    }

    // Summary
    console.log('\n🎉 Demo agency setup completed successfully!');
    console.log('\n📊 Demo Data Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📋 Plan: ${demoPlan.displayName} (${demoPlan.name})`);
    console.log(`   - Price: $${demoPlan.price}/${demoPlan.interval}`);
    console.log(`   - Limits: ${demoPlan.maxVehicles} vehicles, ${demoPlan.maxDrivers} drivers, ${demoPlan.maxTripsPerMonth} trips/month`);
    console.log('');
    console.log(`🏢 Agency: ${demoAgency.name}`);
    console.log(`   - Email: ${demoAgency.email}`);
    console.log(`   - Status: ${demoAgency.status}`);
    console.log(`   - Demo expires: ${demoAgency.demoExpiresAt?.toLocaleDateString()}`);
    console.log('');
    console.log('👥 Demo Users:');
    console.log(`   - Super Admin: admin@arwapark.com (password: demo123456)`);
    console.log(`   - Agency Admin: agency@arwapark.com (password: demo123456)`);
    console.log(`   - Driver: driver@arwapark.com (password: demo123456)`);
    console.log('');
    console.log('🌐 Access URLs:');
    console.log('   - Backend API: https://arwapark.digima.cloud/api');
    console.log('   - Frontend: http://localhost:3000 (after setup)');
    console.log('   - API Docs: https://arwapark.digima.cloud/api/docs');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n💡 You can now login with any of the demo users to test the system!');
    
  } catch (error) {
    console.error('❌ Error creating demo agency:', error);
    throw error;
  } finally {
    await app.close();
  }
}

// Run the script
if (require.main === module) {
  createDemoAgency()
    .then(() => {
      console.log('\n✨ Script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Script failed:', error);
      process.exit(1);
    });
}

export default createDemoAgency;