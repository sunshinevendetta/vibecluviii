"use client";
import { useState } from "react";
import customStyles from "../styles/CustomCard.module.css";
import fArtists from "./f.json";
import sArtists from "./s.json";

type StageData = {
  artist: string;
  time: string;
  spotify?: string;
};

type DayData = {
  day: string;
  stages: Record<string, StageData[]>;
};

// Combine artists from both days
const allArtists: DayData[] = [fArtists, sArtists];

export default function Artists() {
  const [sortCriteria, setSortCriteria] = useState<"alphabetical" | "stage" | "day">("day");

  // Flatten all artists for easier sorting
  const getAllArtists = () => {
    const artists = allArtists.flatMap((dayData) =>
      Object.entries(dayData.stages).flatMap(([stage, artists]) =>
        artists.map((artist) => ({
          ...artist,
          stage,
          day: dayData.day,
        }))
      )
    );

    // Sorting based on criteria
    return artists.sort((a, b) => {
      if (sortCriteria === "alphabetical") {
        return a.artist.localeCompare(b.artist);
      } else if (sortCriteria === "stage") {
        return a.stage.localeCompare(b.stage);
      } else {
        return new Date(a.time).getTime() - new Date(b.time).getTime();
      }
    });
  };

  const sortedArtists = getAllArtists();

  return (
    <div className={customStyles.customContainer}>
      <h1>Artists</h1>
      <div className={customStyles.sortOptions}>
        <button onClick={() => setSortCriteria("alphabetical")}>Sort by Alphabetical</button>
        <button onClick={() => setSortCriteria("stage")}>Sort by Stage</button>
        <button onClick={() => setSortCriteria("day")}>Sort by Day</button>
      </div>
      <div className={customStyles.grid}>
        {sortedArtists.map((artist, index) => (
          <div key={index} className={customStyles.card}>
            <h3>{artist.artist}</h3>
            <p>{artist.time}</p>
            <p>Stage: {artist.stage}</p>
            <p>Day: {artist.day}</p>
            {artist.spotify && <a href={artist.spotify}>Listen on Spotify</a>}
          </div>
        ))}
      </div>
    </div>
  );
}
