import React, { useContext } from "react";
import { Web3Context } from "../helpers/Web3Context";

const ROUNDS = {
  "Alpha Round": { roundId: 1 },
  "Beta Round": { roundId: 2 },
  "Season 18": { roundId: 3 },
};

const RoundSelector = () => {
  const { roundInView, setRoundInView } = useContext(Web3Context);
  return (
    <select className="px-2 py-1" value={roundInView} onChange={e => setRoundInView(e.target.value)}>
      {Object.entries(ROUNDS).map(([name, { roundId }]) => (
        <option value={roundId} key={roundId}>
          {name}
        </option>
      ))}
    </select>
  );
};

export default RoundSelector;
