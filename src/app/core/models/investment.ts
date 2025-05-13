export interface Investment {
  id: number;
  userId: number;
  type: 'stock' | 'bond' | 'mutualFund' | 'goldBond';
  transactionType: 'buy' | 'sell';

  // Common fields
  investmentDate?: string;
  purchasePrice?: number;
  quantity?: number;
  currentPrice?: number;
  currentValue?: number;

  // stock-specific fields
  stockName?: string;
  dematAccount?: string;
  numberOfShares?: number;
  brokerage?: number;
  brokerageType?: '%' | 'rs';

  // Bond-specific fields
  fixedIncomeName?: string;
  investmentAmount?: number;
  rateOfInterest?: number; 
  compoundingFrequency?:
    | 'monthly'
    | 'quarterly'
    | 'half-yearly'
    | 'yearly'
    | 'on maturity';
  interestType?: 'accrued' | 'interest payout';
  maturityDate?: string;

  // Mutual Fund-specific fields
  schemeName?: string;
  folioNumber?: string;
  amount?: number;
  units?: number;
  price?: number;

  // Gold Bond-specific fields
  securityName?: string;
  purchaseDate?: string;
  couponRate?: number;

  sellPrice?: number;
  redemptionDate?: string;
  sellAt?: string;
}
