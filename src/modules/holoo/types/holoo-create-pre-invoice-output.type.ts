export type HolooCreateInvoice = {
  Header: string;
  Success: {
    Id: string;
    ErpCode: string;
    Code: string;
    SanadCode?: string;
    ReturnParam1: string;
    ReturnParam2: string;
  };
  Failure: {
    Id: string;
    Error: string;
    ErrorCode: string;
  };
};