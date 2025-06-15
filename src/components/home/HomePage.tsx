"use client";

import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ArrowForward,
  School,
  EmojiEvents,
  EventNote,
} from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";

/**
 * Landing page component for the Student Merit Management System
 */
export default function HomePage() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Hero section */}
      <Box
        sx={{
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                }}
              >
                Student Merit Management System
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  maxWidth: "600px",
                }}
              >
                Track your achievements, join events, and build your academic
                profile.
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  component={Link}
                  href="/auth/login"
                  variant="contained"
                  size="large"
                  color="secondary"
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontWeight: 600,
                  }}
                >
                  Sign In
                </Button>
                <Button
                  component={Link}
                  href="/dashboard"
                  variant="outlined"
                  size="large"
                  color="inherit"
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderColor: "primary.contrastText",
                    "&:hover": {
                      borderColor: "primary.contrastText",
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                    },
                  }}
                >
                  Dashboard
                </Button>
              </Stack>
            </Grid>

            <Grid
              size={{ xs: 12, md: 6 }}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: { xs: "280px", sm: "320px", md: "400px" },
                  height: { xs: "280px", sm: "320px", md: "400px" },
                }}
              >
                <Image
                  src="/globe.svg"
                  alt="Student Merit Management System Logo"
                  fill
                  style={{
                    filter: "brightness(0) invert(1)",
                    opacity: 0.9,
                  }}
                  priority
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features section */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: { xs: 6, md: 8 },
            }}
          >
            Why Use Our Merit System?
          </Typography>

          <Grid container spacing={4}>
            {[
              {
                icon: <School fontSize="large" color="primary" />,
                title: "Track Academic Progress",
                description:
                  "Keep track of your academic achievements and merit points earned through your university journey.",
              },
              {
                icon: <EventNote fontSize="large" color="primary" />,
                title: "Discover Events",
                description:
                  "Find and register for university events, workshops, and activities that interest you.",
              },
              {
                icon: <EmojiEvents fontSize="large" color="primary" />,
                title: "Earn Merit Points",
                description:
                  "Earn merit points for your participation and achievements in academic and extracurricular activities.",
              },
            ].map((feature, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    fontWeight={600}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to action */}
      <Box
        sx={{
          backgroundColor: "background.default",
          py: { xs: 6, md: 8 },
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container maxWidth="md">
          <Stack
            direction="column"
            spacing={3}
            alignItems="center"
            textAlign="center"
          >
            <Typography variant="h4" component="h3" fontWeight={600}>
              Ready to get started?
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: "600px" }}
            >
              Sign in with your university credentials to access your dashboard,
              view events, and track your merit points.
            </Typography>

            <Button
              component={Link}
              href="/auth/login"
              variant="contained"
              color="primary"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                mt: 2,
                py: 1.5,
                px: 4,
              }}
            >
              Sign In Now
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 4,
          backgroundColor:
            theme.palette.mode === "light" ? "grey.100" : "grey.900",
          borderTop: "1px solid",
          borderColor: "divider",
          mt: "auto",
        }}
      >
        <Container maxWidth="lg">
          <Grid
            container
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} Student Merit Management System
              </Typography>
            </Grid>
            <Grid
              size={{ xs: 12, md: 6 }}
              sx={{
                display: "flex",
                justifyContent: { xs: "flex-start", md: "flex-end" },
              }}
            >
              <Stack direction="row" spacing={3}>
                <Link href="/help" passHref style={{ textDecoration: "none" }}>
                  <Typography variant="body2" color="text.secondary">
                    Help
                  </Typography>
                </Link>
                <Link
                  href="/privacy"
                  passHref
                  style={{ textDecoration: "none" }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Privacy
                  </Typography>
                </Link>
                <Link href="/terms" passHref style={{ textDecoration: "none" }}>
                  <Typography variant="body2" color="text.secondary">
                    Terms
                  </Typography>
                </Link>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
