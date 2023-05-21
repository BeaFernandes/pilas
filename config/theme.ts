import { MantineThemeOverride, MANTINE_SIZES } from "@mantine/core";

const theme: MantineThemeOverride = {
  colorScheme: "light",
  defaultRadius: 8,
  colors: {
    'blue': ['#2399EF'],
    'light-blue': ['#4AC4F3'],
    'dark-blue': ['#112C55'],
    'black': ['#0e0e11'],
    'light-black': ['#343434'],
    'gray': ['#9A9A9A'],
    'light-gray': ['#F7F7F7'],
  },
  primaryColor: 'blue',
  defaultGradient: {
    from: 'light-blue',
    to: 'blue',
    deg: 45,
  },
};

export default theme;