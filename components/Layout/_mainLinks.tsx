import { useState } from "react";
import { NavLink } from "@mantine/core";
import { IconArrowsDownUp, IconHome, IconMilk, IconUserStar, IconUsers } from "@tabler/icons-react";
import Link from "next/link";

export default function MainLinks() {
  const [active, setActive] = useState(false);
  return (
      <>
        <Link href='/products' style={{ textDecoration: 'none' }}>
          <NavLink
            py={20}
            key="home"
            active={active}
            label="Home"
            icon={<IconHome size="1rem" stroke={2} />}
            /*onClick={() => setActive(true)}*/
          />
        </Link>
        <Link href='/user/transactions' style={{ textDecoration: 'none' }}>
          <NavLink
            py={20}
            key="transactions"
            active={active}
            label="Movimentações"
            icon={<IconArrowsDownUp size="1rem" stroke={2} />}
            /*onClick={() => setActive(true)}*/
          />
        </Link>

        <Link href='/admin/users' style={{ textDecoration: 'none' }}>
          <NavLink
            py={20}
            key="users"
            active={active}
            label="Gerenciar Usuários"
            icon={<IconUsers size="1rem" stroke={2} />}
            /*onClick={() => setActive(true)}*/
          />
        </Link>

        <Link href='/admin/mayor' style={{ textDecoration: 'none' }}>
          <NavLink
            py={20}
            key="mayor"
            active={active}
            label="Gerenciar Prefeito"
            icon={<IconUserStar size="1rem" stroke={2} />}
            /*onClick={() => setActive(true)}*/
          />
        </Link>

        <Link href='/mayor/products' style={{ textDecoration: 'none' }}>
          <NavLink
            py={20}
            key="products"
            active={active}
            label="Gerenciar Produtos"
            icon={<IconMilk size="1rem" stroke={2} />}
            /*onClick={() => setActive(true)}*/
          />
        </Link>
      </>
  );
}