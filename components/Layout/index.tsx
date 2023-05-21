import { ReactNode, useState } from 'react';
import {
  AppShell,
  Navbar,
  Header,
  MediaQuery,
  Burger,
  useMantineTheme,
  Image,
  Group,
} from '@mantine/core';
import MainLinks from './_mainLinks'
import User from './_user';
import { useSession } from 'next-auth/react';


interface PageLayoutProps {
  children: ReactNode
}

export default function AppShellDemo({children}: PageLayoutProps) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const { data: session, status } = useSession();

  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
          <Navbar.Section grow mt="xs">
            <MainLinks />
          </Navbar.Section>
          <Navbar.Section>
            <User userName={session?.user.name} userEmail={session?.user.email}/>
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={65} px="md" pt={0} pb={0}>
          <Group sx={{ height: '100%' }} position="apart">
            <Image maw={80} src="Logo.png" ml='md' alt="Logo da Act" withPlaceholder/>

            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

          </Group>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
}