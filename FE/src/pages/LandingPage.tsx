import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Divider,
  TextField,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CourseCard from "../components/CourseCard";
import { useCourses } from "../hooks/useCourses";
import client from "../api/client";
import schoolData from "../data/public_schools_lebanon.json";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import VolunteerActivismRoundedIcon from "@mui/icons-material/VolunteerActivismRounded";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import LebanonMapImg from "../public/lebanon-map-nkb.png";

type SchoolEntry = { Caza: string; Area: string; "School Name": string };
const SCHOOL_DATA = schoolData as SchoolEntry[];
const PRIVATE_SCHOOLS = ["IC", "ACS", "College"];

const STATS = [
  { value: "50k+", label: "Active Learners" },
  { value: "1.2k", label: "Expert Courses" },
  { value: "100%", label: "Always Free" },
  { value: "24/7", label: "Global Access" },
];

const FEATURES = [
  {
    icon: LockOpenRoundedIcon,
    title: "Free Forever",
    body: "Every course, every resource — no paywalls, no subscriptions. Quality education should never come with a price tag.",
  },
  {
    icon: PublicRoundedIcon,
    title: "Built for Everyone",
    body: "Designed for displaced learners, under-served communities, and anyone who needs access to quality content.",
  },
  {
    icon: AutoStoriesRoundedIcon,
    title: "Curated Curriculum",
    body: "Courses are submitted by verified Professionals and organized by grade, subject, and institution for clarity.",
  },
  {
    icon: VolunteerActivismRoundedIcon,
    title: "Community Driven",
    body: "Educators contribute because they believe in the mission. Every course is an act of generosity.",
  },
];

const FOOTER_PLATFORM = [
  "Explore Courses",
  "Study Guides",
  "Certification",
  "Scholarships",
];
const FOOTER_COMMUNITY = [
  "Student Forum",
  "Become a Professional",
  "Donations",
  "Support",
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [madristiSchool, setMadristiSchool] = useState("");
  const [pubCaza, setPubCaza] = useState("");
  const [pubArea, setPubArea] = useState("");
  const [pubSchool, setPubSchool] = useState("");

  const cazas = useMemo(
    () => [...new Set(SCHOOL_DATA.map((s) => s.Caza))].sort(),
    [],
  );
  const areas = useMemo(
    () =>
      pubCaza
        ? [
            ...new Set(
              SCHOOL_DATA.filter((s) => s.Caza === pubCaza).map((s) => s.Area),
            ),
          ].sort()
        : [],
    [pubCaza],
  );
  const publicSchools = useMemo(
    () =>
      pubArea
        ? SCHOOL_DATA.filter((s) => s.Caza === pubCaza && s.Area === pubArea)
            .map((s) => s["School Name"])
            .sort()
        : [],
    [pubCaza, pubArea],
  );

  const analyticsSchool =
    madristiSchool === "Public School"
      ? pubSchool || "Public School"
      : madristiSchool;
  const canVisit =
    madristiSchool === "Public School" ? !!pubSchool : !!madristiSchool;
  const { data: rawCourses } = useCourses();
  const courses = (Array.isArray(rawCourses) ? rawCourses : []).filter(
    (c) => !c.isKidToKid && !c.isHealthContent && !c.isSpecialNeeds,
  );
  const sample = courses.slice(0, 3);

  return (
    <Box sx={{ bgcolor: "#edf2f5", minHeight: "100vh" }}>
      <Navbar />

      {/* ─── Hero ─── */}
      <Box
        sx={{
          position: "relative",
          minHeight: 700,
          px: { xs: 4, md: 8 },
          py: { xs: 12, md: 16 },
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          background:
            "linear-gradient(145deg, #023d2e 0%, #0d5c40 40%, #1b6b51 100%)",
        }}
      >
        {/* Decorative shapes */}
        <Box
          sx={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            bgcolor: "rgba(166,242,209,0.06)",
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -120,
            left: "35%",
            width: 360,
            height: 360,
            borderRadius: "50%",
            bgcolor: "rgba(166,242,209,0.04)",
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "30%",
            left: -60,
            width: 220,
            height: 220,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.03)",
            zIndex: 0,
          }}
        />

        {/* Grid texture */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(166,242,209,0.07) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            zIndex: 0,
          }}
        />

        <Box
          sx={{
            maxWidth: 1280,
            mx: "auto",
            width: "100%",
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          {/* Left: text */}
          <Box sx={{ maxWidth: 640, flex: "1 1 auto" }}>
            {/* Pill badge */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "rgba(166,242,209,0.12)",
                border: "1px solid rgba(166,242,209,0.25)",
                borderRadius: "100px",
                px: 2,
                py: 0.75,
                mb: 4,
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  bgcolor: "#a6f2d1",
                  borderRadius: "50%",
                }}
              />
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "0.6875rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#a6f2d1",
                }}
              >
                Free Learning for Lebanon
              </Typography>
            </Box>

            <Typography
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2.75rem", md: "4.5rem" },
                letterSpacing: "-0.04em",
                lineHeight: 1.0,
                color: "#e0ffee",
                mb: 3,
              }}
            >
              Knowledge is the
              <Box component="span" sx={{ color: "#a6f2d1", display: "block" }}>
                great equalizer.
              </Box>
            </Typography>

            <Typography
              sx={{
                fontWeight: 400,
                fontSize: { xs: "1.0625rem", md: "1.25rem" },
                lineHeight: 1.65,
                color: "rgba(224,255,238,0.75)",
                maxWidth: 500,
                mb: 5,
              }}
            >
              Access hundreds of free, curated courses. Built for every student
              — especially those who need it most.
            </Typography>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 6 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/auth?tab=register")}
                sx={{
                  px: 5,
                  py: 1.75,
                  fontSize: "1rem",
                  borderRadius: "8px",
                  bgcolor: "#a6f2d1",
                  color: "#023d2e",
                  fontWeight: 700,
                  boxShadow: "0px 8px 24px 0px rgba(166,242,209,0.25)",
                  "&:hover": {
                    bgcolor: "#bff7db",
                    boxShadow: "0px 12px 32px 0px rgba(166,242,209,0.35)",
                  },
                }}
              >
                Start Learning Free →
              </Button>
              <Button
                size="large"
                onClick={() => navigate("/courses")}
                sx={{
                  px: 5,
                  py: 1.75,
                  fontSize: "1rem",
                  borderRadius: "8px",
                  bgcolor: "rgba(255,255,255,0.08)",
                  color: "#e0ffee",
                  border: "1px solid rgba(166,242,209,0.2)",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "rgba(255,255,255,0.14)" },
                }}
              >
                Browse Courses
              </Button>
            </Box>

            {/* Trust row */}
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              {["No credit card", "No ads ever", "Always free"].map((item) => (
                <Box
                  key={item}
                  sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
                >
                  <CheckRoundedIcon
                    sx={{ fontSize: "0.875rem", color: "#a6f2d1" }}
                  />
                  <Typography
                    sx={{
                      fontSize: "0.8125rem",
                      color: "rgba(224,255,238,0.65)",
                      fontWeight: 500,
                    }}
                  >
                    {item}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Right: Lebanon map image */}
          <Box
            component="img"
            src={LebanonMapImg}
            alt="Lebanon map"
            sx={{
              display: { xs: "none", lg: "block" },
              height: 480,
              width: "auto",
              objectFit: "contain",
              flexShrink: 0,
            }}
          />
        </Box>
      </Box>

      {/* ─── Ministry Section ─── */}
      <Box sx={{ px: { xs: 4, md: 8 }, pt: 8, pb: 0, bgcolor: "#edf2f5" }}>
        <Box sx={{ maxWidth: 1280, mx: "auto" }}>
          {/* School picker cards */}
          <Box sx={{ mb: madristiSchool === "Public School" ? 2 : 3 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "0.6875rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "text.secondary",
                mb: 2,
              }}
            >
              Access Madristi — select your school
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {[...PRIVATE_SCHOOLS, "Public School"].map((s) => {
                const active = madristiSchool === s;
                const isPublic = s === "Public School";
                return (
                  <Box
                    key={s}
                    onClick={() => {
                      if (active) {
                        setMadristiSchool("");
                        setPubCaza("");
                        setPubArea("");
                        setPubSchool("");
                      } else {
                        setMadristiSchool(s);
                        setPubCaza("");
                        setPubArea("");
                        setPubSchool("");
                      }
                    }}
                    sx={{
                      flex: "1 1 120px",
                      minWidth: 120,
                      maxWidth: 220,
                      py: 2.5,
                      px: 3,
                      borderRadius: "12px",
                      border: "2px solid",
                      borderColor: active
                        ? "primary.main"
                        : "rgba(169,180,185,0.25)",
                      bgcolor: active
                        ? "rgba(27,107,81,0.06)"
                        : "background.paper",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.15s",
                      boxShadow: active
                        ? "0px 4px 16px rgba(27,107,81,0.15)"
                        : "0px 2px 8px rgba(0,0,0,0.04)",
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: "rgba(27,107,81,0.04)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "10px",
                        bgcolor: active
                          ? "primary.main"
                          : "rgba(169,180,185,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 1,
                        transition: "all 0.15s",
                      }}
                    >
                      {isPublic ? (
                        <PublicRoundedIcon
                          sx={{
                            fontSize: "1.1rem",
                            color: active ? "#a6f2d1" : "text.secondary",
                          }}
                        />
                      ) : (
                        <SchoolOutlinedIcon
                          sx={{
                            fontSize: "1.1rem",
                            color: active ? "#a6f2d1" : "text.secondary",
                          }}
                        />
                      )}
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.9375rem",
                        color: active ? "primary.main" : "text.primary",
                      }}
                    >
                      {s}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* Public school cascade */}
          {madristiSchool === "Public School" && (
            <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
              <TextField
                select
                label="Caza"
                value={pubCaza}
                onChange={(e) => {
                  setPubCaza(e.target.value);
                  setPubArea("");
                  setPubSchool("");
                }}
                size="small"
                sx={{
                  minWidth: 160,
                  flex: 1,
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "background.paper",
                    borderRadius: "8px",
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <em style={{ color: "#a9b4b9" }}>Select caza</em>
                </MenuItem>
                {cazas.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Area"
                value={pubArea}
                onChange={(e) => {
                  setPubArea(e.target.value);
                  setPubSchool("");
                }}
                size="small"
                disabled={!pubCaza}
                sx={{
                  minWidth: 160,
                  flex: 1,
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "background.paper",
                    borderRadius: "8px",
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <em style={{ color: "#a9b4b9" }}>Select area</em>
                </MenuItem>
                {areas.map((a) => (
                  <MenuItem key={a} value={a}>
                    {a}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="School"
                value={pubSchool}
                onChange={(e) => setPubSchool(e.target.value)}
                size="small"
                disabled={!pubArea}
                sx={{
                  minWidth: 200,
                  flex: 2,
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "background.paper",
                    borderRadius: "8px",
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <em style={{ color: "#a9b4b9" }}>Select school</em>
                </MenuItem>
                {publicSchools.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          )}

          {/* Banner */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 3,
              px: { xs: 3, md: 5 },
              py: 3,
              borderRadius: "14px",
              background: "linear-gradient(135deg, #023d2e 0%, #1b6b51 100%)",
              border: "1px solid rgba(166,242,209,0.18)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Box
                sx={{
                  bgcolor: "rgba(166,242,209,0.12)",
                  border: "1px solid rgba(166,242,209,0.2)",
                  borderRadius: "10px",
                  px: 2,
                  py: 1,
                  flexShrink: 0,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: "0.625rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#a6f2d1",
                  }}
                >
                  Official
                </Typography>
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "0.9375rem", md: "1.0625rem" },
                    color: "#e0ffee",
                    lineHeight: 1.3,
                  }}
                >
                  Lebanese Ministry of Education — Madristi Platform
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.8125rem",
                    color: "rgba(224,255,238,0.6)",
                    mt: 0.25,
                  }}
                >
                  {canVisit
                    ? `Visiting as: ${analyticsSchool}`
                    : "Select your school above to continue"}
                </Typography>
              </Box>
            </Box>
            <Box
              onClick={() => {
                if (!canVisit) return;
                client
                  .post("/analytics/madristi-click", {
                    school: analyticsSchool,
                  })
                  .catch(() => {});
                window.open(
                  "https://madristi.mehe.gov.lb",
                  "_blank",
                  "noopener,noreferrer",
                );
              }}
              sx={{
                bgcolor: canVisit ? "#a6f2d1" : "rgba(166,242,209,0.2)",
                color: canVisit ? "#023d2e" : "rgba(166,242,209,0.4)",
                px: 3,
                py: 1.25,
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "0.875rem",
                flexShrink: 0,
                fontFamily: "'Public Sans', sans-serif",
                cursor: canVisit ? "pointer" : "not-allowed",
                transition: "all 0.2s",
                "&:hover": {
                  bgcolor: canVisit ? "#8de8be" : "rgba(166,242,209,0.2)",
                },
              }}
            >
              Visit Madristi →
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ─── Sample Courses ─── */}
      <Box sx={{ px: { xs: 4, md: 8 }, py: 12, bgcolor: "#edf2f5" }}>
        <Box sx={{ maxWidth: 1280, mx: "auto" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              mb: 8,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "0.625rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "primary.main",
                  mb: 1,
                }}
              >
                Curated Catalog
              </Typography>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "2rem", md: "2.5rem" },
                  letterSpacing: "-0.025em",
                  color: "text.primary",
                  lineHeight: 1,
                }}
              >
                Featured Courses
              </Typography>
            </Box>
            <Box
              onClick={() => navigate("/courses")}
              sx={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color: "primary.main",
                }}
              >
                View All Courses
              </Typography>
              <ArrowForwardRoundedIcon
                sx={{ fontSize: "1rem", color: "primary.main" }}
              />
            </Box>
          </Box>

          {sample.length > 0 ? (
            <Grid container spacing={4}>
              {sample.map((course, i) => (
                <Grid item xs={12} md={i === 0 ? 6 : 3} key={course.id}>
                  <CourseCard
                    course={course}
                    size={i === 0 ? "large" : "normal"}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              sx={{
                textAlign: "center",
                py: 12,
                bgcolor: "#e4eaee",
                borderRadius: "12px",
                border: "2px dashed rgba(169,180,185,0.35)",
              }}
            >
              <AutoStoriesRoundedIcon
                sx={{ fontSize: "3rem", color: "text.disabled", mb: 2 }}
              />
              <Typography sx={{ color: "text.secondary", fontSize: "1rem" }}>
                No courses yet. Be the first Professional to add one!
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/auth?tab=register")}
                sx={{ mt: 3, borderRadius: "8px", px: 4 }}
              >
                Register as Professional
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* ─── Why NoKidBehind ─── */}
      <Box
        sx={{
          px: { xs: 4, md: 8 },
          py: 14,
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(160deg, #0a1f18 0%, #0d2b20 50%, #0f3326 100%)",
        }}
      >
        {/* Dot grid texture */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(166,242,209,0.05) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(27,107,81,0.25) 0%, transparent 70%)",
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 380,
            height: 380,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(27,107,81,0.15) 0%, transparent 70%)",
            zIndex: 0,
          }}
        />

        <Box
          sx={{ maxWidth: 1280, mx: "auto", position: "relative", zIndex: 1 }}
        >
          <Box sx={{ textAlign: "center", mb: 10 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "0.625rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#a6f2d1",
                mb: 1.5,
              }}
            >
              Our Mission
            </Typography>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2rem", md: "2.75rem" },
                letterSpacing: "-0.035em",
                color: "#e0ffee",
                lineHeight: 1.05,
              }}
            >
              Why No Kid Behind?
            </Typography>
            <Typography
              sx={{
                fontSize: "1.0625rem",
                color: "rgba(224,255,238,0.6)",
                mt: 2.5,
                maxWidth: 560,
                mx: "auto",
                lineHeight: 1.65,
              }}
            >
              We believe that geography, income, and circumstance should never
              determine a child's access to knowledge.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <Grid item xs={12} sm={6} md={3} key={title}>
                <Box
                  sx={{
                    bgcolor: "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "16px",
                    p: 4,
                    height: "100%",
                    border: "1px solid rgba(166,242,209,0.1)",
                    transition:
                      "transform 0.2s, border-color 0.2s, background 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      bgcolor: "rgba(255,255,255,0.07)",
                      borderColor: "rgba(166,242,209,0.25)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: "rgba(166,242,209,0.1)",
                      border: "1px solid rgba(166,242,209,0.15)",
                      borderRadius: "12px",
                      width: 48,
                      height: 48,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 3,
                    }}
                  >
                    <Icon sx={{ color: "#a6f2d1", fontSize: "1.375rem" }} />
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.0625rem",
                      color: "#e0ffee",
                      mb: 1.25,
                    }}
                  >
                    {title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      color: "rgba(224,255,238,0.55)",
                      lineHeight: 1.7,
                    }}
                  >
                    {body}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* ─── Stats ─── */}
      <Box
        sx={{
          bgcolor: "#1b6b51",
          py: 12,
          px: { xs: 4, md: 8 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -60,
            right: 80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.04)",
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -80,
            left: 60,
            width: 240,
            height: 240,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.03)",
            zIndex: 0,
          }}
        />
        <Box
          sx={{ maxWidth: 1280, mx: "auto", position: "relative", zIndex: 1 }}
        >
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1.75rem", md: "2.25rem" },
                letterSpacing: "-0.03em",
                color: "#e0ffee",
              }}
            >
              Trusted by students across Lebanon
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {STATS.map((stat) => (
              <Grid item xs={6} md={3} key={stat.label}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 3,
                    borderRadius: "12px",
                    bgcolor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(166,242,209,0.12)",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: "2.5rem", md: "3.5rem" },
                      letterSpacing: "-0.05em",
                      lineHeight: 1,
                      color: "#a6f2d1",
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.625rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "rgba(166,242,209,0.6)",
                      mt: 1.5,
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* ─── CTA Banner ─── */}
      <Box sx={{ px: { xs: 4, md: 8 }, py: 12, bgcolor: "#edf2f5" }}>
        <Box
          sx={{
            maxWidth: 1280,
            mx: "auto",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #023d2e 0%, #1b6b51 100%)",
            px: { xs: 5, md: 10 },
            py: { xs: 6, md: 8 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: 5,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -60,
              right: -60,
              width: 300,
              height: 300,
              borderRadius: "50%",
              bgcolor: "rgba(166,242,209,0.07)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -80,
              left: "50%",
              width: 220,
              height: 220,
              borderRadius: "50%",
              bgcolor: "rgba(166,242,209,0.04)",
            }}
          />
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1.75rem", md: "2.5rem" },
                letterSpacing: "-0.035em",
                color: "#e0ffee",
                lineHeight: 1.1,
                mb: 1.5,
              }}
            >
              Ready to start learning?
            </Typography>
            <Typography
              sx={{
                fontSize: "1.0625rem",
                color: "rgba(224,255,238,0.7)",
                lineHeight: 1.6,
                maxWidth: 480,
              }}
            >
              Join thousands of students who already have access to free,
              quality education — no matter where they are.
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              flexShrink: 0,
              position: "relative",
              zIndex: 1,
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/auth?tab=register")}
              sx={{
                px: 5,
                py: 1.75,
                fontSize: "1rem",
                borderRadius: "8px",
                bgcolor: "#a6f2d1",
                color: "#023d2e",
                fontWeight: 700,
                whiteSpace: "nowrap",
                boxShadow: "0px 8px 24px 0px rgba(0,0,0,0.2)",
                "&:hover": { bgcolor: "#bff7db" },
              }}
            >
              Create Free Account
            </Button>
            <Button
              size="large"
              onClick={() => navigate("/courses")}
              sx={{
                px: 5,
                py: 1.5,
                fontSize: "0.9375rem",
                borderRadius: "8px",
                bgcolor: "rgba(255,255,255,0.08)",
                color: "rgba(224,255,238,0.85)",
                border: "1px solid rgba(166,242,209,0.2)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.14)" },
              }}
            >
              Browse First
            </Button>
          </Box>
        </Box>
      </Box>

      {/* ─── Footer ─── */}
      <Box sx={{ bgcolor: "#0a1a15", px: { xs: 4, md: 8 }, py: 10 }}>
        <Box sx={{ maxWidth: 1280, mx: "auto" }}>
          <Grid container spacing={6} sx={{ mb: 8 }}>
            <Grid item xs={12} md={5}>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: "1.5rem",
                  letterSpacing: "-0.04em",
                  color: "#e0ffee",
                  mb: 1,
                }}
              >
                No Kid Behind
              </Typography>
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: "0.9375rem",
                  color: "rgba(224,255,238,0.5)",
                  lineHeight: 1.65,
                  maxWidth: 384,
                  mb: 3,
                }}
              >
                A non-profit learning platform dedicated to providing
                high-quality educational content to anyone, anywhere, at no
                cost.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/auth?tab=register")}
                sx={{
                  borderRadius: "8px",
                  px: 3,
                  py: 1.25,
                  fontWeight: 700,
                  bgcolor: "#a6f2d1",
                  color: "#023d2e",
                  "&:hover": { bgcolor: "#bff7db" },
                }}
              >
                Join the Platform
              </Button>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "0.625rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#a6f2d1",
                  mb: 3,
                }}
              >
                Platform
              </Typography>
              {FOOTER_PLATFORM.map((item) => (
                <Typography
                  key={item}
                  sx={{
                    fontSize: "0.875rem",
                    color: "rgba(224,255,238,0.45)",
                    mb: 2,
                    cursor: "default",
                    "&:hover": { color: "rgba(224,255,238,0.8)" },
                    transition: "color 0.15s",
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "0.625rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#a6f2d1",
                  mb: 3,
                }}
              >
                Community
              </Typography>
              {FOOTER_COMMUNITY.map((item) => (
                <Typography
                  key={item}
                  sx={{
                    fontSize: "0.875rem",
                    color: "rgba(224,255,238,0.45)",
                    mb: 2,
                    cursor: "default",
                    "&:hover": { color: "rgba(224,255,238,0.8)" },
                    transition: "color 0.15s",
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Grid>
          </Grid>
          <Divider sx={{ borderColor: "rgba(166,242,209,0.1)", mb: 4 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography
              sx={{ fontSize: "0.8125rem", color: "rgba(224,255,238,0.35)" }}
            >
              © 2026 No Kid Behind. Built for accessibility and resilience.
            </Typography>
            <Box sx={{ display: "flex", gap: 4 }}>
              {["Terms", "Privacy", "Contact"].map((item) => (
                <Typography
                  key={item}
                  sx={{
                    fontSize: "0.8125rem",
                    color: "rgba(224,255,238,0.35)",
                    cursor: "default",
                    "&:hover": { color: "rgba(224,255,238,0.65)" },
                    transition: "color 0.15s",
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
