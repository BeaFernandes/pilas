import containsRole from "@/utils/auth/containsRole";
import { Accordion, NavLink } from "@mantine/core";
import { IconArrowsDownUp, IconGauge, IconHome, IconMilk, IconShoppingCart, IconUserShield, IconUserStar, IconUsers } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface MainLinksProps {
  activeLink: string,
}

export default function MainLinks({ activeLink }: MainLinksProps) {
  const { data: session, status } = useSession();
  return (
      <>
        <Link href='/' style={{ textDecoration: 'none' }}>
          <NavLink
            py='md'
            key="home"
            active={activeLink == '/'}
            label="Início"
            icon={<IconHome size="1rem" stroke={2} />}
            sx={{color: '#343434'}}
          />
        </Link>

        <Link href='/products' style={{ textDecoration: 'none' }}>
          <NavLink
            py='md'
            key="home"
            active={activeLink == '/products'}
            label="Comprar"
            icon={<IconShoppingCart size="1rem" stroke={2} />}
            sx={{color: '#343434'}}
          />
        </Link>

        <Link href='/user/transactions' style={{ textDecoration: 'none' }}>
          <NavLink
            py='md'
            key="transactions"
            active={activeLink == '/user/transactions'}
            label="Transações"
            icon={<IconArrowsDownUp size="1rem" stroke={2} />}
            sx={{color: '#343434'}}
          />
        </Link>

        {
          containsRole(session?.user, 'ADMIN') ? 
            <NavLink
              py='md'
              label="Administrador"
              icon={<IconUserShield size="1rem" stroke={2} />}
              childrenOffset={0}
              sx={{color: '#343434'}}
              defaultOpened={new RegExp('/admin/.*').test(activeLink)}
            >
              <Link href='/admin/users' style={{ textDecoration: 'none' }}>
                <NavLink
                  py='md'
                  pl='xl'
                  key="users"
                  active={activeLink == '/admin/users'}
                  label="Gerenciar Usuários"
                  icon={<IconUsers size="1rem" stroke={2} />}
                  sx={{color: '#343434'}}
                />
              </Link>

              <Link href='/admin/mayor' style={{ textDecoration: 'none' }}>
                <NavLink
                  py='md'
                  pl='xl'
                  key="mayor"
                  active={activeLink == '/admin/mayor'}
                  label="Gerenciar Prefeito"
                  icon={<IconUserStar size="1rem" stroke={2} />}
                  sx={{color: '#343434'}}
                />
              </Link>
            </NavLink>
          :
            <></>
        }
        
        {
          containsRole(session?.user, 'MAYOR') || 
          containsRole(session?.user, "ADMIN") ?
            <NavLink
              py='md'
              label="Prefeito"
              icon={<IconUserStar size="1rem" stroke={2} />}
              childrenOffset={0}
              sx={{color: '#343434'}}
              defaultOpened={new RegExp('/mayor/.*').test(activeLink)}
            >
              <Link href='/mayor/users' style={{ textDecoration: 'none' }}>
                <NavLink
                  py='md'
                  pl='xl'
                  key="users"
                  active={new RegExp('/mayor/users.*').test(activeLink)}
                  label="Gerenciar Usuários"
                  icon={<IconUsers size="1rem" stroke={2} />}
                  sx={{color: '#343434'}}
                />
              </Link>

              <Link href='/mayor/products' style={{ textDecoration: 'none' }}>
                <NavLink
                  py='md'
                  pl='xl'
                  key="products"
                  active={activeLink == '/mayor/products'}
                  label="Gerenciar Produtos"
                  icon={<IconMilk size="1rem" stroke={2} />}
                  sx={{color: '#343434'}}
                />
              </Link>
            </NavLink>
          :
            <></>
        }
      </>
  );
}