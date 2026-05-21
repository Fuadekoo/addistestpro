import { Box } from "@/components/system/primitives";

export default function Home() {
  return (
    <Box
      as="main"
      alignItems="center"
      display="flex"
      justifyContent="center"
      minHeight="calc(100vh - 92px)"
      paddingX={[4, 6]}
      paddingY={[7, 8]}
    >
      <Box
        backgroundColor="rgba(255, 255, 255, 0.7)"
        border="1px solid"
        borderColor="line"
        borderRadius="xl"
        boxShadow="card"
        padding={[6, 8]}
        textAlign="center"
      >
        <Box
          as="p"
          color="textMuted"
          fontSize={1}
          fontWeight="semibold"
          letterSpacing="0.3em"
          margin={0}
          textTransform="uppercase"
        >
          Designed by
        </Box>
        <Box
          as="h1"
          color="text"
          fontSize={[6, 8]}
          fontWeight="bold"
          letterSpacing="-0.04em"
          lineHeight={1}
          margin="16px 0 0"
        >
          Fuad Abdurahman
        </Box>
      </Box>
    </Box>
  );
}
