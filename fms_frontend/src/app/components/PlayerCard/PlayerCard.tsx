import "./PlayerCard.css";

interface NotGoalKeeperProps {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

interface GoalKeeperProps {
  diving: number;
  handling: number;
  kicking: number;
  reflexes: number;
  speed: number;
  positioning: number;
}

interface PlayerProps {
  name: string;
  rating: number;
  position: string;
  country: string;
  attributes: GoalKeeperProps | NotGoalKeeperProps;
}

export const PlayerCard: React.FC<PlayerProps> = ({
  name,
  rating,
  position,
  country,
  attributes,
}) => {
  return (
    <div id="card" className="active">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 267.3 427.3">
        <clipPath id="svgPath">
          <path
            fill="#000"
            d="M265.3 53.9a33.3 33.3 0 0 1-17.8-5.5 32 32 0 0 1-13.7-22.9c-.2-1.1-.4-2.3-.4-3.4 0-1.3-1-1.5-1.8-1.9a163 163 0 0 0-31-11.6A257.3 257.3 0 0 0 133.7 0a254.9 254.9 0 0 0-67.1 8.7 170 170 0 0 0-31 11.6c-.8.4-1.8.6-1.8 1.9 0 1.1-.2 2.3-.4 3.4a32.4 32.4 0 0 1-13.7 22.9A33.8 33.8 0 0 1 2 53.9c-1.5.1-2.1.4-2 2v293.9c0 3.3 0 6.6.4 9.9a22 22 0 0 0 7.9 14.4c3.8 3.2 8.3 5.3 13 6.8 12.4 3.9 24.8 7.5 37.2 11.5a388.7 388.7 0 0 1 50 19.4 88.7 88.7 0 0 1 25 15.5v.1-.1c7.2-7 16.1-11.3 25-15.5a427 427 0 0 1 50-19.4l37.2-11.5c4.7-1.5 9.1-3.5 13-6.8 4.5-3.8 7.2-8.5 7.9-14.4.4-3.3.4-6.6.4-9.9V231.6 60.5v-4.6c.4-1.6-.3-1.9-1.7-2z"
          />
        </clipPath>
      </svg>
      <div id="card-inner">
        <div id="card-top">
          <div className="info">
            {/* <div className="value">94</div> */}
            <div className="position">{position}</div>
            <div className="country">
              <div></div>
            </div>
            <div className="club">
              <div></div>
            </div>
          </div>

          <div className="image font-black text-9xl text-right">{rating}</div>
          <div className="backfont">FUTB</div>
        </div>
        <div id="card-bottom">
          <div className="name">{name}</div>
          <div className="card-stats">
            <div>
              <ul>
                <li>
                  <span>{attributes?.pace}</span>
                  <span>pac</span>
                </li>
                <li>
                  <span>{attributes?.shooting}</span>
                  <span>sho</span>
                </li>
                <li>
                  <span>{attributes?.passing}</span>
                  <span>pas</span>
                </li>
              </ul>
            </div>
            <div>
              <ul>
                <li>
                  <span>{attributes?.dribbling}</span>
                  <span>dri</span>
                </li>
                <li>
                  <span>{attributes?.defending}</span>
                  <span>def</span>
                </li>
                <li>
                  <span>{attributes?.physical}</span>
                  <span>phy</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
