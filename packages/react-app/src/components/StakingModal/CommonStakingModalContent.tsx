// @ts-nocheck
import React, { useState, useEffect, useCallback } from "react";
import { Button, Modal } from "antd";
import { formatGtc, parseGtc } from "./utils";
import { ethers } from "ethers";

export default function CommonStakingModalContent({
  title,
  totalAmountStaked,
  newStakeAmount,
  onStake,
  resetAmounts,
  renderStakeForm,
  renderStakeSummary,
  writeContracts,
  readContracts,
  tx,
  address,
  isModalVisible,
  setIsModalVisible,
}) {
  const [buttonText, setButtonText] = useState("Submit");
  const [modalStatus, setModalStatus] = useState(1);

  /*
  Modal Status
  
  1) Initial
  2) Approving
  3) Stake
  4) Staking
  */

  const checkIfNeedsApprovalForAmount = useCallback(
    async amount => {
      if (address && readContracts?.Token && readContracts?.IDStaking) {
        const allowance = await readContracts.Token.allowance(address, readContracts.IDStaking.address);
        return !allowance || allowance.isZero() || allowance.lt(amount);
      }
    },
    [readContracts.Token, readContracts.IDStaking, address],
  );

  // User approves usage of token
  const approve = async () => {
    await tx(writeContracts.Token.approve(readContracts.IDStaking.address, parseGtc("10000000")));
  };

  const reset = () => {
    resetAmounts();
    setModalStatus(1);
    setButtonText("Submit");
    setIsModalVisible(false);
  };

  return (
    <Modal
      title={title}
      visible={isModalVisible}
      onCancel={reset}
      okText={`Create a Passport`}
      footer={
        <Button
          onClick={async () => {
            if (await checkIfNeedsApprovalForAmount(newStakeAmount)) {
              setModalStatus(2);
              setButtonText("Approving... (Transaction 1 of 2)");
              await approve();
              setButtonText("Stake");
              setModalStatus(3);
              return;
            } else if (modalStatus === 3) {
              setButtonText("Staking... (Transaction 2 of 2)");
            } else {
              setButtonText("Staking...");
            }

            setModalStatus(4);

            try {
              await onStake();
            } finally {
              reset();
            }
          }}
          disabled={totalAmountStaked <= 0}
          loading={modalStatus === 2 || modalStatus === 4}
          style={{ backgroundColor: "#6F3FF5", color: "white" }}
        >
          {buttonText}
        </Button>
      }
    >
      <>
        <p>Your stake amount (in GTC)</p>

        {renderStakeForm(modalStatus > 1)}

        {modalStatus === 2 && (
          <div className="mt-4 border-2 border-blue-alertBorder px-4 py-6 rounded-md bg-blue-alertBg font-libre-franklin">
            In order to stake any GTC (self or community) on a Passport, you must first approve the use of your GTC with
            the Smart Contract.
            <br />
            You should set an approval of at least <b>{formatGtc(newStakeAmount)} GTC</b>.
          </div>
        )}

        {modalStatus >= 3 && (
          <div>
            {renderStakeSummary()}
            <div className="border-2 border-gray-200 px-4 py-6 rounded-lg bg-yellow-200 mt-4">
              <h1>Important!</h1>
              <ul className="list-disc ml-4">
                <li>
                  Your staked GTC will be locked when the grant round starts, and you will not be able to withdraw it
                  until after the round ends.
                </li>
                <li>
                  The staking contract has been checked by our engineering team, but it has not been audited by a
                  professional audit firm.
                </li>
              </ul>
            </div>
          </div>
        )}
      </>
    </Modal>
  );
}
