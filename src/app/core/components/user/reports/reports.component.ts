import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../../services/transaction.service';
import { AuthenticationManagerService } from '../../../services/authentication-manager/authentication-manager.service';
import { CommonModule } from '@angular/common';
import { GroupedTransaction, Transaction } from './interfaces';

@Component({
  selector: 'app-reports',
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
  standalone: true
})
export class ReportsComponent implements OnInit {

  // add comment

  data: any[] = [];
  incomeTransactions: Transaction[] = [];
  expenseTransactions: Transaction[] = [];

  totalPlannedIncome: number = 0;
  totalActualIncome: number = 0;

  totalPlannedExpense: number = 0;
  totalActualExpense: number = 0;

  groupedIncomeByMonth: GroupedTransaction[] = [];
  groupedExpenseByMonth: GroupedTransaction[] = [];

  monthlyBalances: { [key: string]: { planned: number; actual: number } } = {};

  constructor(
    private _transactionService: TransactionService,
    private _authenticationManagerService: AuthenticationManagerService
  ) {}

  ngOnInit(): void {
    this._transactionService
      .getReportForUser(this._authenticationManagerService.getUserId())
      .subscribe({
        next: (response: any) => {
          this.data = response.data;
          this.data = this.aggregateTransactions(this.data);

          this.incomeTransactions = this.data.filter(transaction => transaction.categoryType === 'Income');
          this.expenseTransactions = this.data.filter(transaction => transaction.categoryType === 'Expense');

          this.groupedIncomeByMonth = this.groupTransactionsByMonth(this.incomeTransactions);
          this.groupedExpenseByMonth = this.groupTransactionsByMonth(this.expenseTransactions);

          this.calculateTotalIncome();
          this.calculateTotalExpense();
          this.calculateMonthlyBalance();
        },
        error(err) {
          console.error('Error fetching data', err);
        },
      });
  }

  calculateMonthlyBalance() {
    this.groupedIncomeByMonth.forEach(group => {
      const incomePlannedTotal = this.calculateMonthlyTotal(group.transactions, 'Planned');
      const incomeActualTotal = this.calculateMonthlyTotal(group.transactions, 'Actual');
      
      const expenseGroup = this.groupedExpenseByMonth.find(eGroup => eGroup.year === group.year && eGroup.month === group.month);
      
      const expensePlannedTotal = this.calculateMonthlyTotal(expenseGroup?.transactions || [], 'Planned');
      const expenseActualTotal = this.calculateMonthlyTotal(expenseGroup?.transactions || [], 'Actual');
    
      const plannedBalance = incomePlannedTotal - expensePlannedTotal;
      const actualBalance = incomeActualTotal - expenseActualTotal;
  
      this.monthlyBalances[`${group.month}-${group.year}`] = {
        planned: plannedBalance,
        actual: actualBalance,
      };
    });
  }

  calculateMonthlyTotal(transactions: Transaction[], status: string): number {
    return transactions
      .filter(transaction => transaction.transactionStatus === status)
      .reduce((sum: number, transaction: Transaction) => sum + transaction.amount, 0);
  }

  aggregateTransactions(transactions: Transaction[]): Transaction[] {
    const aggregatedData: Transaction[] = [];

    transactions.forEach((transaction) => {
      const existingTransaction = aggregatedData.find(
        (t) =>
          t.categoryName === transaction.categoryName &&
          t.date === transaction.date &&
          t.transactionStatus === transaction.transactionStatus
      );

      if (existingTransaction) {
        existingTransaction.amount += transaction.amount;
      } else {
        aggregatedData.push({ ...transaction });
      }
    });

    return aggregatedData;
  }

  groupTransactionsByMonth(transactions: Transaction[]): GroupedTransaction[] {
    return transactions.reduce((result: GroupedTransaction[], transaction: Transaction) => {
      const transactionDate = new Date(transaction.date);
      const year = transactionDate.getFullYear();
      const month = transactionDate.getMonth() + 1;

      if (!transactionDate.getTime()) {
        console.warn('Invalid transaction date:', transaction.date);
        return result;
      }

      let existingGroup = result.find(group => group.year === year && group.month === month);

      if (!existingGroup) {
        existingGroup = { year, month, transactions: [] };
        result.push(existingGroup);
      }

      existingGroup.transactions.push(transaction);
      return result;
    }, []); 
  }

  calculateTotalIncome() {
    this.totalPlannedIncome = this.incomeTransactions
      .filter((transaction: Transaction) => transaction.transactionStatus === 'Planned')
      .reduce((sum: number, transaction: Transaction) => sum + transaction.amount, 0);

    this.totalActualIncome = this.incomeTransactions
      .filter((transaction: Transaction) => transaction.transactionStatus === 'Actual')
      .reduce((sum: number, transaction: Transaction) => sum + transaction.amount, 0);
  }

  calculateTotalExpense() {
    this.totalPlannedExpense = this.expenseTransactions
      .filter((transaction: Transaction) => transaction.transactionStatus === 'Planned')
      .reduce((sum: number, transaction: Transaction) => sum + transaction.amount, 0);

    this.totalActualExpense = this.expenseTransactions
      .filter((transaction: Transaction) => transaction.transactionStatus === 'Actual')
      .reduce((sum: number, transaction: Transaction) => sum + transaction.amount, 0);
  }
}
