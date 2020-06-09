export class ProjectDesc {
   name: string;
}

export class Project {
   projId: Number;
   currency: string;
   billingMode: string;
   descArr: ProjectDesc[];

   constructor (projId, currency, billingMode, descArr) {
      this.projId = projId;
      this.currency = currency;
      this.billingMode = billingMode;
      this.descArr = descArr;
   }
}

export class MonthlyRevenue {
   month: string;
   revenueAmount: Number;
   cmiRevenueAmount: Number;
}

export class ProjectRevenue {
   projId: Number;
   annualRevenue: MonthlyRevenue[]
}