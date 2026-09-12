import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Button } from "../components/ui/Button";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Badge } from "../components/ui/Badge";

describe("UI Primitives & Accessibility", () => {
  it("renders Button with accessible attributes and handles disabled state", () => {
    render(<Button disabled>Quest Button</Button>);
    const btn = screen.getByRole("button", { name: "Quest Button" });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-disabled", "true");
  });

  it("renders Button with loading state and aria-busy", () => {
    render(<Button isLoading>Completing</Button>);
    const btn = screen.getByRole("button", { name: "Completing" });
    expect(btn).toHaveAttribute("aria-busy", "true");
  });

  it("renders ProgressBar with accessible role and aria attributes", () => {
    render(<ProgressBar value={400} max={1000} label="XP Progress" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "400");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "1000");
    expect(bar).toHaveAttribute("aria-label", "XP Progress");
  });

  it("renders Badge with appropriate styling variant", () => {
    render(<Badge variant="amber">Intellect +10</Badge>);
    expect(screen.getByText("Intellect +10")).toBeInTheDocument();
  });
});
