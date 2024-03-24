export const PlayerListCard = ({ _playerData, handleClick }) => {
  return (
    <div
      className="card flex flex-row items-center gap-3 p-3 bg-base-200"
      onClick={handleClick}
    >
      <div className="flex flex-col flex-1">
        <div className="player-name">{_playerData.name}</div>
        <div className="player-position text-sm">{_playerData.position}</div>
      </div>
      <div className="">{_playerData.overall_rating || _playerData.rating}</div>
    </div>
  );
};
