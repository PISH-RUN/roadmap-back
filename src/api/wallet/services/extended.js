"use strict";

const {
  walletService,
  transactionHistoryService,
} = require("../../../utils/services");

module.exports = {
  async chargeDeposit(userId, amount) {
    // get user's wallet
    const wallet = await walletService().findOneBy({ user: userId });
    if (!wallet) throw new Error("Wallet not found");

    // in transactional style
    // charge the wallet
    // create history
    let transactionHistory;
    let updatedWallet;
    try {
      updatedWallet = await walletService().update(wallet.id, {
        data: { balance: wallet.balance + amount },
      });
      transactionHistory = await transactionHistoryService().create({
        data: {
          type: "chargeDeposit",
          amount,
          wallet: updatedWallet.id,
        },
      });

      return updatedWallet;
    } catch (e) {
      console.log(e);
      // handle rollback
      if (wallet) {
        await walletService().update(wallet.id, {
          data: { balance: wallet.balance },
        });
      }

      if (transactionHistory) {
        await transactionHistoryService().delete(transactionHistory.id);
      }
    }
  },

  async purchaseDeposit(sourceUserId, targetUserId, amount) {
    // get user(target)'s wallet
    const targetWallet = await walletService().findOneBy({
      user: targetUserId,
    });

    // get source wallet
    const sourceWallet = await walletService().findOneBy({
      user: sourceUserId,
    });

    if (!targetWallet || !sourceWallet) throw new Error("Wallet not found");

    // in transactional style
    // witdraw source wallet
    // deposit target wallet
    // create history for both wallets
    let updatedTargetWallet;
    let updatedSourceWallet;
    let targetTransactionHistory;
    let sourceTransactionHistory;
    try {
      updatedTargetWallet = await walletService().update(targetWallet.id, {
        data: { balance: targetWallet.balance + amount },
      });

      updatedSourceWallet = await walletService().update(sourceWallet.id, {
        data: { balance: sourceWallet.balance - amount },
      });

      targetTransactionHistory = await transactionHistoryService().create({
        data: {
          type: "purchaseDeposit",
          amount,
          wallet: updatedTargetWallet.id,
        },
      });

      sourceTransactionHistory = await transactionHistoryService().create({
        data: {
          type: "purchaseWithdraw",
          amount,
          wallet: updatedSourceWallet.id,
        },
      });

      return sourceWallet;
    } catch (e) {
      console.log(e);
      // rollback

      if (updatedTargetWallet) {
        await walletService().update(targetWallet.id, {
          data: { balance: targetWallet.balance },
        });
      }

      if (updatedSourceWallet) {
        await walletService().update(sourceWallet.id, {
          data: { balance: sourceWallet.balance },
        });
      }

      if (targetTransactionHistory) {
        await transactionHistoryService().delete(targetTransactionHistory.id);
      }

      if (sourceTransactionHistory) {
        await transactionHistoryService().delete(sourceTransactionHistory.id);
      }

      throw new Error("Purchase deposit fail");
    }
  },

  async checkBalance(userId, amount) {
    // get user(target)'s wallet
    const wallet = await walletService().findOneBy({ user: userId });

    const { balance } = wallet;

    if (balance > amount) {
      return true;
    }

    return false;
  },
};
