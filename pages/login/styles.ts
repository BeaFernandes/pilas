import { createStyles, getBreakpointValue, rem, em } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  container: {
    userSelect: 'none',
    overflowY: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f8f9fa',
  },

  card: {
    width: 400,

    [`@media (max-width: ${em(420)})`]: {
      width: 350,
    },

    [`@media (max-width: ${em(320)})`]: {
      width: 280,
    },
  }
  
}));

export default useStyles