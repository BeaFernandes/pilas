import { useState } from "react";
import { NavLink } from "@mantine/core";
import { IconArrowsDownUp, IconHome, IconUser } from "@tabler/icons-react";
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
        <Link href='/user/movements' style={{ textDecoration: 'none' }}>
          <NavLink
            py={20}
            key="movements"
            active={active}
            label="Movimentações"
            icon={<IconArrowsDownUp size="1rem" stroke={2} />}
            /*onClick={() => setActive(true)}*/
          />
        </Link>
      </>
  );
}