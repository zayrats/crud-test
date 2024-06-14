interface Admin {
  id: number;
  email: string;
  password: string;
}
interface User {
  id: number;
  email: string;
  password: string;
  role: Position;
  name: string;
  department?: string;
  bookings?: Booking[];
  approvals?: Approval[];
  driverBookings?: Booking[];
  approverBookings?: Booking[];
  activities?: ActivityLog[];
}

interface Booking {
  id: number;
  bookingName: string;
  description: string;
  userId: number; // user dengan role employee
  vehicleId: number;
  driverId: number; // user dengan role employee
  approverId: number; // user dengan role supervisor
  startDate: Date;
  endDate: Date;
  status: BookingStatus;
  purpose: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  vehicle?: Vehicle;
  driver?: User;
  approver?: User;
  approvals?: Approval[];
}

interface Approval {
  id: number;
  bookingId: number;
  approverId: number;
  level: number;
  status: ApprovalStatus;
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
  booking?: Booking;
  approver?: User;
}


interface Vehicle {
  id: number;
  type: VehicleType;
  model: string;
  licensePlate: string;
  ownedBy: OwnershipType;
  fuelConsumption?: number;
  lastServiceDate?: Date;
  bookings?: Booking[];
  fuelConsumptions?: FuelConsumption[];
  serviceHistories?: ServiceHistory[];
}

interface ServiceHistory {
  id: number;
  vehicleId: number;
  serviceDate: Date;
  description: string;
  cost: number;
  createdAt: Date;
  vehicle?: Vehicle;
}

interface FuelConsumption {
  id: number;
  vehicleId: number;
  date: Date;
  cost: number;
  amount: number;
  kilometers: number;
  distanceTravelled: number;
  createdAt: Date;
  vehicle?: Vehicle;
}

interface ActivityLog {
  id: number;
  userId: number;
  action: string;
  description: string;
  timestamp: Date;
  user?: User;
}

enum Position {
  'MANAGER',
  'SUPERVISOR',
  'EMPLOYEE'
}

enum VehicleType {
  PASSENGER = 'PASSENGER',
  CARGO = 'CARGO'
}

enum OwnershipType {
  COMPANY = 'COMPANY',
  RENTAL = 'RENTAL'
}

enum BookingStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}
