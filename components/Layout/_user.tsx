import { Box, Group, Menu, rem, Text, UnstyledButton, useMantineTheme } from "@mantine/core";
import { IconLogout, IconUser } from "@tabler/icons-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface UserProps {
  userName:  String | undefined,
  userEmail: String | undefined,
}

export default function User({ userName, userEmail }: UserProps) {
    const theme = useMantineTheme();
    return (
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Box
            sx={{
              borderTop: `${rem(1)} solid ${
                theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
              }`,
            }}
          >
            <UnstyledButton
              sx={{
                display: 'block',
                width: '100%',
                padding: theme.spacing.md,
                borderRadius: theme.radius.sm,
                color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
      
                '&:hover': {
                  backgroundColor:
                    theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                },
              }}
            >
              <Group>
                <IconUser size="1rem" stroke={2} />
                <Box sx={{ flex: 1 }}>
                  <Text size="sm" weight={500}>
                    {userName}
                  </Text>
                  <Text color="dimmed" size="xs">
                    {userEmail}
                  </Text>
                </Box>
              </Group>
            </UnstyledButton>
          </Box>
        </Menu.Target>

        <Menu.Dropdown>

          <Menu.Label>{userName}</Menu.Label>
          <Link href='/user' style={{ textDecoration: 'none' }}>
            <Menu.Item icon={<IconUser size={14} />}>Minha conta</Menu.Item>
          </Link>

          <Menu.Divider />

          <Menu.Item 
            onClick={() => signOut()} 
            color="red" 
            icon={<IconLogout size={14}/>}
          >
            Sair
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
}