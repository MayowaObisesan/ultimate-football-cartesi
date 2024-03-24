import { PlayerCard } from "../components/PlayerCard/PlayerCard";
import players from "../utils/player.json";

const Players = () => {
  return (
    <section className="">
      <div className="font-bold text-center text-5xl leading-normal py-12">
        Available Players
      </div>
      <section className="">
        <div className="py-40">
          <header className="font-semibold text-5xl leading-normal px-4 pb-24">
            Goal Keepers
          </header>
          <div className="grid grid-cols-5 gap-16">
            {players
              .filter((it) => it.position.toLowerCase() === "goalkeeper")
              .map((eachPlayer, index) => (
                <PlayerCard
                  key={index}
                  name={eachPlayer.name}
                  rating={eachPlayer.overall_rating}
                  position={eachPlayer.position}
                  country={eachPlayer.nationality}
                  attributes={eachPlayer.attributes}
                />
              ))}
          </div>
        </div>
        <div className="bg-base-100 py-40">
          <header className="font-semibold text-5xl leading-normal px-4 pb-24">
            Defenders
          </header>
          <div className="grid grid-cols-5 gap-16">
            {players
              .filter((it) =>
                it.position.toLowerCase().split("-").includes("back")
              )
              .map((eachPlayer, index) => (
                <PlayerCard
                  key={index}
                  name={eachPlayer.name}
                  rating={eachPlayer.overall_rating}
                  position={eachPlayer.position}
                  country={eachPlayer.nationality}
                  attributes={eachPlayer.attributes}
                />
              ))}
          </div>
        </div>
        <div className="py-40">
          <header className="font-semibold text-5xl leading-normal px-4 pb-24">
            Midfielders
          </header>
          <div className="grid grid-cols-5 gap-16">
            {players
              .filter((it) =>
                it.position.toLowerCase().split(" ").includes("midfielder")
              )
              .map((eachPlayer, index) => (
                <PlayerCard
                  key={index}
                  name={eachPlayer.name}
                  rating={eachPlayer.overall_rating}
                  position={eachPlayer.position}
                  country={eachPlayer.nationality}
                  attributes={eachPlayer.attributes}
                />
              ))}
          </div>
        </div>
        <div className="bg-base-100 py-40">
          <header className="font-semibold text-5xl leading-normal px-4 pb-24">
            Strikers
          </header>
          <div className="grid grid-cols-5 gap-16">
            {players
              .filter((it) => it.position.toLowerCase() === "striker")
              .map((eachPlayer, index) => (
                <PlayerCard
                  key={index}
                  name={eachPlayer.name}
                  rating={eachPlayer.overall_rating}
                  position={eachPlayer.position}
                  country={eachPlayer.nationality}
                  attributes={eachPlayer.attributes}
                />
              ))}
          </div>
        </div>
      </section>
    </section>
  );
};

export default Players;
