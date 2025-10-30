import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home Page", () => {
  it("renders the heading", () => {
    render(<Home />);
    const heading = screen.getByText(/Liquid Glass Design System/i);
    expect(heading).toBeInTheDocument();
  });
});
