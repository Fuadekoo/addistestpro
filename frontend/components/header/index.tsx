"use client";

import styled from "@emotion/styled";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboardIcon, Music4Icon, RadioTowerIcon } from "lucide-react";
import { Box } from "@/components/system/primitives";

const navigationItems = [
  {
    href: "/",
    label: "Home",
    icon: RadioTowerIcon,
  },
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    href: "/songs",
    label: "Songs",
    icon: Music4Icon,
  },
] as const;

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

const HeaderShell = styled.header(({ theme }) => ({
  position: "sticky",
  top: 0,
  zIndex: 40,
  backdropFilter: "blur(22px)",
  backgroundColor: "rgba(255, 255, 255, 0.74)",
  borderBottom: `1px solid ${theme.colors.line}`,
}));

const HeaderInner = styled(Box)({
  margin: "0 auto",
  width: "100%",
});

const BrandLink = styled(Link)(({ theme }) => ({
  alignItems: "center",
  display: "inline-flex",
  gap: "14px",
  textDecoration: "none",
  width: "fit-content",
  "&:focus-visible": {
    outline: `3px solid rgba(36, 87, 255, 0.2)`,
    outlineOffset: "4px",
    borderRadius: theme.radii.md,
  },
}));

const BrandMark = styled(Box)(({ theme }) => ({
  alignItems: "center",
  background:
    "linear-gradient(135deg, rgba(15, 23, 42, 1) 0%, rgba(36, 87, 255, 1) 100%)",
  borderRadius: theme.radii.lg,
  boxShadow: theme.shadows.glow,
  color: theme.colors.primaryText,
  display: "inline-flex",
  height: "46px",
  justifyContent: "center",
  width: "46px",
}));

const NavRail = styled.nav(({ theme }) => ({
  alignItems: "center",
  backgroundColor: "rgba(238, 244, 255, 0.82)",
  border: `1px solid ${theme.colors.line}`,
  borderRadius: theme.radii.xl,
  display: "flex",
  gap: "6px",
  padding: "6px",
}));

const NavItem = styled(Link)<{ $active: boolean }>(({ theme, $active }) => ({
  alignItems: "center",
  backgroundColor: $active ? theme.colors.surface : "transparent",
  border: $active ? `1px solid ${theme.colors.line}` : "1px solid transparent",
  borderRadius: theme.radii.md,
  boxShadow: $active ? theme.shadows.soft : "none",
  color: $active ? theme.colors.text : theme.colors.textMuted,
  display: "inline-flex",
  flex: "1 1 0%",
  fontSize: "14px",
  fontWeight: 600,
  gap: "10px",
  justifyContent: "center",
  minHeight: "42px",
  padding: "0 16px",
  textDecoration: "none",
  transition: "background-color 160ms ease, color 160ms ease, border-color 160ms ease, transform 160ms ease",
  "&:hover": {
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    transform: "translateY(-1px)",
  },
  "&:focus-visible": {
    outline: `3px solid rgba(36, 87, 255, 0.2)`,
    outlineOffset: "2px",
  },
  "@media (min-width: 72em)": {
    flex: "0 0 auto",
  },
}));

export default function Header() {
  const pathname = usePathname();

  return (
    <HeaderShell>
      <HeaderInner
        display="flex"
        flexDirection={["column", "column", "row"]}
        gap="16px"
        justifyContent="space-between"
        alignItems={["stretch", "stretch", "center"]}
        maxWidth="1280px"
        padding="16px"
      >
        <BrandLink href="/">
          <BrandMark>
            <RadioTowerIcon size={20} />
          </BrandMark>
          <Box>
            <Box
              as="p"
              color="text"
              fontSize={1}
              fontWeight="bold"
              letterSpacing="-0.03em"
              margin={0}
            >
              Addis Music
            </Box>
            <Box as="p" color="textSoft" fontSize={0} margin="2px 0 0">
              Dashboard and song library
            </Box>
          </Box>
        </BrandLink>

        <NavRail aria-label="Primary">
          {navigationItems.map((item) => {
            const active = isActivePath(pathname, item.href);
            const Icon = item.icon;

            return (
              <NavItem
                key={item.href}
                href={item.href}
                $active={active}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </NavItem>
            );
          })}
        </NavRail>
      </HeaderInner>
    </HeaderShell>
  );
}
