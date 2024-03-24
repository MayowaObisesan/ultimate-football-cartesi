import {
  ArcadeHeroContainer,
  ArcadeHeroContent,
  ArcadeHeroContentContainer,
  ArcadeHeroImage,
} from "./page";

const gameData = {
  name: "Cartesian Battleship",
  slug: "arcade-wars",
  description: "",
  shortDescription: "All arcade games in one place",
  image: "https://rolluplab.io/projects/cartesian-battleship/H0D4hej.md.jpg",
  category: "adventure, casual",
  minAge: 0,
  popularityStatus: "low",
};

export const ArcadeWars = () => {
  return (
    <ArcadeHeroContainer>
      <ArcadeHeroContentContainer>
        <ArcadeHeroContent
          header={gameData.name}
          description={gameData.description || gameData.shortDescription}
        >
          <button className="btn btn-primary rounded-box">Play Now</button>
        </ArcadeHeroContent>
        <ArcadeHeroImage src={gameData.image} />
      </ArcadeHeroContentContainer>
    </ArcadeHeroContainer>
  );
};
