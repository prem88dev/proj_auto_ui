export class WorkLocation {
   public recordId: string;
   public cityCode: string;
   public cityName: string;
   public siteInd: string;
}

export class LocationLeave {
   public recordId: string;
   public startDate: string;
   public stopDate: string;
   public totalDays: Number;
   public halfDayInd: string;
   public reason: string;
}

export class LocationSpecialWork {
   public recordId: string;
   public startDate: string;
   public stopDate: string;
   public halfDayInd: string;
   public reason: string;
}
