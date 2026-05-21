import Link from "next/link";
import { Box } from "@/components/system/primitives";
import { ButtonLink } from "@/components/system/ui";

export default function NotFound() {
  return (
    <Box
      as="main"
      alignItems="center"
      display="flex"
      flexDirection="column"
      gap="16px"
      justifyContent="center"
      minHeight="calc(100vh - 92px)"
      paddingX={[4, 6]}
      textAlign="center"
    >
      <Box as="p" color="text" fontSize={8} fontWeight="bold" lineHeight={1} margin={0}>
        404
      </Box>
      <Box as="h2" color="textMuted" fontSize={4} fontWeight="semibold" margin={0}>
        Page not found
      </Box>
      <Box as="p" color="textSoft" fontSize={1} margin={0}>
        The page you are looking for does not exist.
      </Box>
      <ButtonLink href="/" variant="primary" size="md" marginTop="8px">
        Go home
      </ButtonLink>
    </Box>
  );
}
