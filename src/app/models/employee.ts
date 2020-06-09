import { LocationLeave } from '../models/location';
import { LocationSpecialWork } from '../models/location';

export class EmployeeMonthlyLeave {
   recordId: string;
   startDate: string;
   stopDate: string;
   leaveHour: Number;
   reason: string;
}

export class EmployeeMonthlySpecialWork {
   recordId: string;
   startDate: string;
   stopDate: string;
   workHour: Number;
   reason: string;
}

export class EmployeeMonthlyRevenue {
   month: string;
   revenueHour: Number;
   revenueAmount: Number;
   cmiRevenueHour: Number;
   cmiRevenueAmount: Number;
}

export class EmployeeMonthlyBuffer {
   recordId: string;
   month: string;
   hours: Number;
   reason: string;
}

export class EmployeeDetail {
   recordId: string;
   esaId: Number;
   esaSubType: Number;
   esaDesc: string;
   projName: string;
   ctsEmpId: Number;
   firstName: string;
   middleName: string;
   lastName: string;
   lowesUid: string;
   deptName: string;
   sowStart: string;
   sowStop: string;
   foreseeenStop: string;
   cityCode: string;
   cityName: string;
   workHourPerDay: Number;
   billingRate: Number;
   currency: string;
   leaves: EmployeeMonthlyLeave[];
   publicHolidays: LocationLeave[];
   specialWorkDays: {
      empSplWrk: EmployeeMonthlySpecialWork[],
      locSplWrk: LocationSpecialWork[]
   };
   buffers: EmployeeMonthlyBuffer[];
   revenue: EmployeeMonthlyRevenue[];
}