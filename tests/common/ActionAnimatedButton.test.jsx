import { render, screen, fireEvent } from "@testing-library/react";
import { ActionAnimatedButton } from "@/components/ui/features/common/ActionAnimatedButton";
import { Search, Loader2 } from "lucide-react";

// Mock lucide-react components for testing
jest.mock("lucide-react", () => ({
  Loader2: (props) => <svg data-testid="loader-icon" {...props} />,
  Search: (props) => <svg data-testid="search-icon" {...props} />, // Mock Search icon
}));

// Mock framer-motion components for testing
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe("<ActionAnimatedButton />", () => {
  const defaultProps = {
    onClick: jest.fn(),
    loading: { vision: false, text: false },
    phase: 1,
    total: 3,
    defaultText: "Realizar acción",
    visionLoadingText: "Procesando visión {{phase}}/{{total}}",
    textLoadingText: "Finalizando análisis",
    Icon: Search, // Use Search as an example default icon
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the default state with custom icon and text", () => {
    render(<ActionAnimatedButton {...defaultProps} />);

    expect(
      screen.getByRole("button", { name: /realizar acción/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId("search-icon")).toBeInTheDocument(); // Expect the Search icon
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("displays vision loading state with loader icon and dynamic text", () => {
    render(
      <ActionAnimatedButton
        {...defaultProps}
        loading={{ vision: true, text: false }}
      />
    );

    expect(screen.getByText(/procesando visión 1\/3/i)).toBeInTheDocument();
    expect(screen.getByTestId("loader-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("search-icon")).not.toBeInTheDocument(); // Icon should be hidden
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("displays text loading state with loader icon and dynamic text", () => {
    render(
      <ActionAnimatedButton
        {...defaultProps}
        loading={{ vision: false, text: true }}
      />
    );

    expect(screen.getByText(/finalizando análisis/i)).toBeInTheDocument();
    expect(screen.getByTestId("loader-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("search-icon")).not.toBeInTheDocument(); // Icon should be hidden
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("calls onClick when button is clicked and not loading", () => {
    render(<ActionAnimatedButton {...defaultProps} />);

    fireEvent.click(screen.getByRole("button"));
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when loading is active (vision)", () => {
    render(
      <ActionAnimatedButton
        {...defaultProps}
        loading={{ vision: true, text: false }}
      />
    );

    fireEvent.click(screen.getByRole("button"));
    expect(defaultProps.onClick).not.toHaveBeenCalled();
  });

  it("does not call onClick when loading is active (text)", () => {
    render(
      <ActionAnimatedButton
        {...defaultProps}
        loading={{ vision: false, text: true }}
      />
    );

    fireEvent.click(screen.getByRole("button"));
    expect(defaultProps.onClick).not.toHaveBeenCalled();
  });

  it("renders with default texts and icon if not provided", () => {
    // Remove specific text and icon props to test defaults
    const propsWithoutDefaults = {
      onClick: jest.fn(),
      loading: { vision: false, text: false },
      phase: 1,
      total: 3,
    };
    render(<ActionAnimatedButton {...propsWithoutDefaults} />);

    // Default text from component: "Analizar imagen"
    expect(
      screen.getByRole("button", { name: /analizar imagen/i })
    ).toBeInTheDocument();
    // Default icon from component: Search
    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
  });

  it("displays vision loading text with default values", () => {
    const propsWithoutDefaults = {
      onClick: jest.fn(),
      loading: { vision: true, text: false },
      phase: 1,
      total: 3,
    };
    render(<ActionAnimatedButton {...propsWithoutDefaults} />);
    // Default visionLoadingText from component: "Analizando con modelo de visión {{phase}}/{{total}}"
    expect(
      screen.getByText(/analizando con modelo de visión 1\/3/i)
    ).toBeInTheDocument();
  });

  it("displays text loading text with default values", () => {
    const propsWithoutDefaults = {
      onClick: jest.fn(),
      loading: { vision: false, text: true },
      phase: 1,
      total: 3,
    };
    render(<ActionAnimatedButton {...propsWithoutDefaults} />);
    // Default textLoadingText from component: "Generando respuesta final"
    expect(screen.getByText(/generando respuesta final/i)).toBeInTheDocument();
  });
});
