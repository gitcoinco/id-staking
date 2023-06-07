import React from "react";
import { formatGtc } from "./StakingModal/utils";
import UnstakeButton from "./UnstakeButton";

const StakeItem = ({ icon, pending, roundEnded, unstake, title, description, amount, buttonText, buttonHandler }) => {
  return (
    <div className="flex items-start md:items-center mx-auto border-b pb-10 mb-10 border-divider flex-col md:flex-row">
      <div className="flex flex-1 items-center justify-start">
        <div className="w-20 h-20 mr-5 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500">
          {icon}
        </div>
        <div className="flex-col text-left">
          <h2 className="text-gray-900 text-lg mb-0">{title}</h2>
          <div className="leading-relaxed text-base">{description}</div>
        </div>
      </div>
      <div className="flex flex-col md:flex-auto items-center justify-center flex-grow text-left md:text-center md:my-0 my-7">
        <h2 className="text-gray-900 text-lg title-font font-medium mb-0">{formatGtc(amount)} GTC</h2>
        <span className="leading-relaxed text-base">Staked</span>
      </div>
      {roundEnded ? (
        <UnstakeButton amount={amount} handler={() => unstake(amount)} />
      ) : (
        <button
          disabled={pending}
          onClick={buttonHandler}
          className="flex md:max-w-button w-full justify-center text-white text-center bg-purple-connectPurple border-0 py-2 focus:outline-none hover:bg-indigo-600 rounded-sm text-lg"
        >
          <span>{buttonText}</span>
        </button>
      )}
    </div>
  );
};

export default StakeItem;
