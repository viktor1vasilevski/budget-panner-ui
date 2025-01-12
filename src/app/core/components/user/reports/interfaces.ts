export interface Transaction {
  categoryName: string;
  amount: number;
  date: string;  // or Date if you're working with Date objects
  transactionStatus: string;
  categoryType: string;
}

 export interface GroupedTransaction {
  year: number;
  month: number;
  transactions: Transaction[];
}
