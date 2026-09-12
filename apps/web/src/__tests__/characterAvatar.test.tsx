import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CharacterAvatar } from "../components/character/CharacterAvatar";

describe("2D Character Avatar Layering Engine", () => {
  it("renders SVG avatar with default cosmetics and background", () => {
    render(
      <CharacterAvatar
        cosmetics={{
          hairId: "hair_spiky_amber",
          outfitId: "outfit_adventurer",
          backgroundId: "bg_forest",
        }}
      />
    );

    const avatar = screen.getByLabelText("Character Sprite Avatar");
    expect(avatar).toBeInTheDocument();
  });

  it("renders different background environments dynamically", () => {
    const { container: forestContainer } = render(
      <CharacterAvatar
        cosmetics={{
          hairId: "hair_mage_violet",
          outfitId: "outfit_mage_robe",
          backgroundId: "bg_celestial",
        }}
      />
    );

    expect(forestContainer.querySelector("svg")).toBeInTheDocument();
  });
});
