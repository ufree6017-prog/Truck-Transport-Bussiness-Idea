import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserProfile, DriverProfile } from '../types';
import { mockDrivers, mockCredentials } from '../data/mockData';

interface AuthContextType {
  user: UserProfile | null;
  driverData: DriverProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (identifier: string, password?: string, role?: UserRole) => Promise<boolean>;
  signup: (name: string, email: string, phone: string, role: UserRole, extra?: any) => Promise<boolean>;
  logout: () => void;
  switchRolePersona: (targetRole: UserRole, driverStatus?: 'approved' | 'pending') => void;
  updateDriverProfile: (updated: Partial<DriverProfile>) => void;
}

const defaultCustomer: UserProfile = {
  id: 'cust-201',
  name: 'Priya Sharma',
  email: 'priya.sharma@example.com',
  phone: '+91 98210 44556',
  role: 'customer',
  city: 'Delhi NCR',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
};

const defaultAdmin: UserProfile = {
  id: 'admin-001',
  name: 'Rajesh Nair',
  email: 'rajesh.nair@trucksetu.com',
  phone: '+91 98200 99881',
  role: 'admin',
  city: 'Mumbai Hub HQ',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('trucksetu_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultCustomer;
      }
    }
    return defaultCustomer; // Default as customer so the homepage and booking are immediately active
  });

  const [driverData, setDriverData] = useState<DriverProfile | null>(() => {
    const saved = localStorage.getItem('trucksetu_driver_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return mockDrivers[0];
      }
    }
    return mockDrivers[0]; // Ramesh Kumar (Approved Tata Ace driver)
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('trucksetu_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('trucksetu_user');
    }
  }, [user]);

  useEffect(() => {
    if (driverData) {
      localStorage.setItem('trucksetu_driver_profile', JSON.stringify(driverData));
    }
  }, [driverData]);

  const login = async (identifier: string, password?: string, selectedRole?: UserRole): Promise<boolean> => {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanDigits = cleanId.replace(/\D/g, '');

    // 1. Admin login match (username, email, or mobile 9820099881)
    const isAdminMatch = 
      selectedRole === 'admin' ||
      cleanId.includes('admin') ||
      cleanId.includes('rajesh') ||
      cleanDigits.includes('9820099881');

    if (isAdminMatch) {
      const adminCred = mockCredentials.admin;
      const adminUser: UserProfile = {
        ...defaultAdmin,
        name: adminCred.name,
        email: adminCred.username,
        phone: adminCred.mobileNo
      };
      setUser(adminUser);
      return true;
    }

    // 2. Driver Pending match (Vikram Singh, mobile 9711884920)
    const isPendingDriverMatch = 
      cleanId.includes('vikram') ||
      cleanDigits.includes('9711884920');

    if (isPendingDriverMatch) {
      const pendingDriver = mockDrivers[1];
      setUser({
        id: pendingDriver.id,
        name: pendingDriver.name,
        email: pendingDriver.email,
        phone: pendingDriver.phone,
        role: 'driver',
        avatar: pendingDriver.avatar,
        city: pendingDriver.city
      });
      setDriverData(pendingDriver);
      return true;
    }

    // 3. Driver Approved match (Ramesh Kumar, mobile 9820411234 or selectedRole === 'driver')
    const isDriverMatch = 
      selectedRole === 'driver' ||
      cleanId.includes('driver') ||
      cleanId.includes('ramesh') ||
      cleanDigits.includes('9820411234');

    if (isDriverMatch) {
      const activeDriver = mockDrivers[0];
      setUser({
        id: activeDriver.id,
        name: activeDriver.name,
        email: activeDriver.email,
        phone: activeDriver.phone,
        role: 'driver',
        avatar: activeDriver.avatar,
        city: activeDriver.city
      });
      setDriverData(activeDriver);
      return true;
    }

    // 4. Default to customer (Priya Sharma, mobile 9821044556)
    const custCred = mockCredentials.customer;
    const custUser: UserProfile = {
      ...defaultCustomer,
      name: custCred.name,
      email: cleanId || custCred.username,
      phone: custCred.mobileNo
    };
    setUser(custUser);
    return true;
  };

  const signup = async (
    name: string, 
    email: string, 
    phone: string, 
    role: UserRole, 
    extra?: any
  ): Promise<boolean> => {
    if (role === 'driver') {
      const newDriver: DriverProfile = {
        id: `drv-${Date.now()}`,
        name,
        email,
        phone,
        role: 'driver',
        city: extra?.city || 'Delhi NCR',
        homeCity: extra?.city || 'Delhi NCR',
        currentCity: extra?.city || 'Delhi NCR',
        verificationStatus: 'pending',
        vehicleCategory: extra?.vehicleCategory || 'Tata Ace / Chota Hathi',
        vehicleNumber: extra?.vehicleNumber || 'DL 1L AB 9821',
        vehicleModel: extra?.vehicleModel || 'Tata Ace Gold',
        walletBalance: 0,
        minimumBalanceRequired: 500,
        rating: 5.0,
        tripsCount: 0,
        isOnline: false,
        documents: extra?.documents || [
          {
            id: 'doc-new-1',
            type: 'driving_license',
            name: 'Commercial Driving License',
            documentNumber: extra?.dlNumber || 'DL-2026-PENDING',
            uploadedAt: new Date().toISOString().split('T')[0],
            expiryDate: '2030-12-31',
            status: 'under_review'
          }
        ]
      };
      setUser({
        id: newDriver.id,
        name: newDriver.name,
        email: newDriver.email,
        phone: newDriver.phone,
        role: 'driver',
        city: newDriver.city
      });
      setDriverData(newDriver);
      return true;
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone,
      role,
      city: extra?.city || 'Mumbai',
      companyName: extra?.companyName,
      gstin: extra?.gstin
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const switchRolePersona = (targetRole: UserRole, driverStatus: 'approved' | 'pending' = 'approved') => {
    if (targetRole === 'admin') {
      setUser(defaultAdmin);
    } else if (targetRole === 'customer') {
      setUser(defaultCustomer);
    } else if (targetRole === 'driver') {
      if (driverStatus === 'pending') {
        const pendingDriver = mockDrivers[1]; // Vikram Singh
        setUser({
          id: pendingDriver.id,
          name: pendingDriver.name,
          email: pendingDriver.email,
          phone: pendingDriver.phone,
          role: 'driver',
          avatar: pendingDriver.avatar,
          city: pendingDriver.city
        });
        setDriverData(pendingDriver);
      } else {
        const approvedDriver = mockDrivers[0]; // Ramesh Kumar
        setUser({
          id: approvedDriver.id,
          name: approvedDriver.name,
          email: approvedDriver.email,
          phone: approvedDriver.phone,
          role: 'driver',
          avatar: approvedDriver.avatar,
          city: approvedDriver.city
        });
        setDriverData(approvedDriver);
      }
    }
  };

  const updateDriverProfile = (updated: Partial<DriverProfile>) => {
    if (driverData) {
      setDriverData(prev => prev ? { ...prev, ...updated } : null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        driverData,
        role: user?.role || null,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        switchRolePersona,
        updateDriverProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
