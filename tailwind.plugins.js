const plugin = require("tailwindcss/plugin");

const flattenColorPalette = (colors) =>
  Object.assign(
    {},
    ...Object.entries(colors ?? {}).flatMap(([color, values]) =>
      typeof values == "object"
        ? Object.entries(flattenColorPalette(values)).map(([number, hex]) => ({
            [color + (number === "DEFAULT" ? "" : `-${number}`)]: hex,
          }))
        : [{ [`${color}`]: values }]
    )
  );

const defaultBoxShadow = [
  `var(--tw-ring-offset-shadow, 0 0 #0000)`,
  `var(--tw-ring-shadow, 0 0 #0000)`,
  `var(--tw-shadow)`,
  `var(--tw-hl-shadow)`,
].join(", ");

module.exports = plugin(
  ({ matchUtilities, theme, addBase }) => {
    addBase({
      ":root": {
        "--tw-hl-size": "1px",
        "--tw-hl-color": "hsl(var(--bc) / 0.1)",
      },
    });
    // Position and size
    matchUtilities(
      {
        highlight: (value) => {
          return {
            "--tw-hl-size": value,
            "--tw-hl-shadow": `inset 0px 0px 0px var(--tw-hl-size) var(--tw-hl-color)`,
            "box-shadow": defaultBoxShadow,
          };
        },
        "highlight-t": (value) => {
          return {
            "--tw-hl-size": value,
            "--tw-hl-shadow": `inset 0px var(--tw-hl-size) 0px 0px var(--tw-hl-color)`,
            "box-shadow": defaultBoxShadow,
          };
        },
        "highlight-b": (value) => {
          return {
            "--tw-hl-size": value,
            "--tw-hl-shadow": `inset 0px calc(0px - var(--tw-hl-size)) 0px 0px var(--tw-hl-color)`,
            "box-shadow": defaultBoxShadow,
          };
        },
        "highlight-l": (value) => {
          return {
            "--tw-hl-size": value,
            "--tw-hl-shadow": `inset var(--tw-hl-size) 0px 0px 0px var(--tw-hl-color)`,
            "box-shadow": defaultBoxShadow,
          };
        },
        "highlight-r": (value) => {
          return {
            "--tw-hl-size": value,
            "--tw-hl-shadow": `inset calc(0px - var(--tw-hl-size)) 0px 0px 0px var(--tw-hl-color)`,
            "box-shadow": defaultBoxShadow,
          };
        },
        "highlight-x": (value) => {
          return {
            "--tw-hl-size": value,
            "--tw-hl-shadow": `inset var(--tw-hl-size) 0px 0px 0px var(--tw-hl-color), inset calc(0px - var(--tw-hl-size)) 0px 0px 0px var(--tw-hl-color)`,
            "box-shadow": defaultBoxShadow,
          };
        },
        "highlight-y": (value) => {
          return {
            "--tw-hl-size": value,
            "--tw-hl-shadow": `inset 0px var(--tw-hl-size) 0px 0px var(--tw-hl-color), inset 0px calc(0px - var(--tw-hl-size)) 0px 0px var(--tw-hl-color)`,
            "box-shadow": defaultBoxShadow,
          };
        },
      },
      {
        values: theme("highlightWidth"),
        type: ["line-width", "length"],
      }
    );

    // Color
    matchUtilities(
      {
        highlight: (value) => {
          return {
            "--tw-hl-color":
              typeof value === "function" ? value({ opacityValue: 1 }) : value,
          };
        },
      },
      {
        values: (({ DEFAULT: _, ...colors }) => colors)(
          flattenColorPalette(theme("colors"))
        ),
        type: ["color"],
      }
    );
  },
  // @ts-ignore
  {
    theme: {
      highlightWidth: {
        DEFAULT: "1px",
        0: "0px",
        2: "2px",
        3: "3px",
        4: "4px",
        6: "6px",
        8: "8px",
      },
    },
  }
);
