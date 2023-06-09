import { MantineThemeOverride } from "@mantine/core";

const theme: MantineThemeOverride = {
  colorScheme: "light",
  defaultRadius: '',
  colors: {
    'actBlue': ['#2399EF'],
    'lightBlue': ['#4AC4F3'],
    'darkBlue': ['#112C55'],
    'black': ['#0e0e11'],
    'lightBlack': ['#343434'],
    'actGray': ['#9A9A9A'],
    'lightGray': ['#F7F7F7'],
  },
  primaryColor: 'blue',
  defaultGradient: {
    from: 'light-blue',
    to: 'blue',
    deg: 45,
  },
};

export default theme;