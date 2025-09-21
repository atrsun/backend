export type HolooCustomer = {
  Customer: [
    {
      EconomicId: string;
      IsPurchaser: boolean;
      IsSeller: boolean;
      IsBlackList: boolean;
      IsVaseteh: boolean;
      VasetehPorsant: number;
      Mandeh: number;
      Credit: number;
      ErpCode: string;
      type: number;
      IsActive: true;
      selectedPriceType: number;
      isAmer: boolean;
      Code?: string;
      Name?: string;
      BesSarfasl?: string;
      Mobile?: string;
      WebId?: string;
    },
  ];
};
