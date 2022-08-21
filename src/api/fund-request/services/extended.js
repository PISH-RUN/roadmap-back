"use strict";

const {
  walletService,
  fundRequestService,
  transactionHistoryService,
} = require("../../../utils/services");

module.exports = {
  async withdrawRequest(userId, amount) {
    // get user's wallet
    const wallet = await walletService().findOneBy({ user: userId });

    // update or create found request
    const foundReq = await fundRequestService().updateOrCreate(
      { wallet: wallet.id },
      { amount, status: "request" }
    );

    return foundReq;
  },

  async withdrawAnswer(userId, amount) {
    // get user's wallet
    const wallet = await walletService().findOneBy(
      { user: userId },
      { populate: ["fund_request"] }
    );

    // in transactional way
    // update balance
    // update fund-request
    // create transaction-history

    let updatedWallet;
    let updatedFundRequest;
    let transactionHistory;
    try {
      updatedWallet = await walletService().update(wallet.id, {
        data: { balance: wallet.balance - amount },
      });

      updatedFundRequest = await fundRequestService().update(
        wallet.fund_request.id,
        {
          data: {
            amount: wallet.fund_request.amount - amount,
            status: "done",
          },
        }
      );

      transactionHistory = await transactionHistoryService().create({
        data: {
          type: "fundWithdraw",
          wallet: wallet.id,
          amount,
        },
      });

      return updatedFundRequest;
    } catch (e) {
      console.log(e);

      // rollback
      if (updatedWallet) {
        await walletService().update(wallet.id, {
          data: { balance: wallet.balance },
        });
      }

      if (updatedFundRequest) {
        await fundRequestService().update(wallet.fund_request.id, {
          data: {
            status: wallet.fund_request.status,
          },
        });
      }

      if (transactionHistory) {
        await transactionHistoryService().delete(transactionHistory.id);
      }
    }
  },
};
