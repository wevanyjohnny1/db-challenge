import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const balanceAllTransactions = await this.find();

    const allBalance = balanceAllTransactions.reduce(
      (accumulator, current) => {
        return {
          income:
            current.type === 'income'
              ? accumulator.income + Number(current.value)
              : accumulator.income,
          outcome:
            current.type === 'outcome'
              ? accumulator.outcome + Number(current.value)
              : accumulator.outcome,
        };
      },
      { income: 0, outcome: 0 },
    );

    const balance = {
      ...allBalance,
      total: allBalance.income - allBalance.outcome,
    };

    return balance;
  }
}

export default TransactionsRepository;
