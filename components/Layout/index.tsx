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
import Head from 'next/head';


interface PageLayoutProps {
  children: ReactNode,
  title: string,
  activeLink: string,
}

export default function AppShellDemo({children, title, activeLink}: PageLayoutProps) {
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
            <MainLinks activeLink={activeLink} />
          </Navbar.Section>
          <Navbar.Section>
            <User userName={session?.user.name} userEmail={session?.user.email}/>
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={65} px="md" pt={0} pb={0}>
          <Group sx={{ height: '100%' }} position="apart">
            <Image maw={80} src="/Logo.png" ml='md' alt="Logo da Act" withPlaceholder/>

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
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      {children}
    </AppShell>
  );
}