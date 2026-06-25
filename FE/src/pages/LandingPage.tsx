import { useState, useMemo, useEffect } from "react";
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
import arSchoolData from "../data/List_of_schools_arabic.json";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import VolunteerActivismRoundedIcon from "@mui/icons-material/VolunteerActivismRounded";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import LebanonMapImg from "../public/lebanon-map-nkb.png";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../i18n/translations";

type SchoolEntry = { Caza: string; Area: string; "School Name": string };
type ArSchoolEntry = { "القضاء": string; "المنطقة": string; "اسم المدرسة": string };
const SCHOOL_DATA = schoolData as SchoolEntry[];
const AR_SCHOOL_DATA = arSchoolData as ArSchoolEntry[];

const FEATURE_ICONS = [
  LockOpenRoundedIcon,
  PublicRoundedIcon,
  AutoStoriesRoundedIcon,
  VolunteerActivismRoundedIcon,
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = translations[lang].landing;
  const isRtl = lang === "ar";

  const [pubCaza, setPubCaza] = useState("");
  const [pubArea, setPubArea] = useState("");
  const [pubSchool, setPubSchool] = useState("");

  // Reset cascade when language changes
  useEffect(() => {
    setPubCaza("");
    setPubArea("");
    setPubSchool("");
  }, [lang]);

  const cazas = useMemo(
    () => isRtl
      ? [...new Set(AR_SCHOOL_DATA.map((s) => s["القضاء"]))].sort()
      : [...new Set(SCHOOL_DATA.map((s) => s.Caza))].sort(),
    [isRtl],
  );
  const areas = useMemo(
    () => pubCaza
      ? isRtl
        ? [...new Set(AR_SCHOOL_DATA.filter((s) => s["القضاء"] === pubCaza).map((s) => s["المنطقة"]))].sort()
        : [...new Set(SCHOOL_DATA.filter((s) => s.Caza === pubCaza).map((s) => s.Area))].sort()
      : [],
    [pubCaza, isRtl],
  );
  const publicSchools = useMemo(
    () => pubArea
      ? isRtl
        ? AR_SCHOOL_DATA.filter((s) => s["القضاء"] === pubCaza && s["المنطقة"] === pubArea).map((s) => s["اسم المدرسة"]).sort()
        : SCHOOL_DATA.filter((s) => s.Caza === pubCaza && s.Area === pubArea).map((s) => s["School Name"]).sort()
      : [],
    [pubCaza, pubArea, isRtl],
  );

  const analyticsSchool = pubSchool;
  const canVisit = !!pubSchool;
  const { data: rawCourses } = useCourses();
  const courses = (Array.isArray(rawCourses) ? rawCourses : []).filter(
    (c) => !c.isKidToKid && !c.isHealthContent && !c.isSpecialNeeds,
  );
  const sample = courses.slice(0, 3);

  return (
    <Box
      sx={{ bgcolor: "#edf2f5", minHeight: "100vh" }}
      dir={isRtl ? "rtl" : "ltr"}
    >
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
                {t.hero.pill}
              </Typography>
            </Box>

            <Typography
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2.75rem", md: "4.5rem" },
                letterSpacing: "-0.04em",
                lineHeight: isRtl ? 1.2 : 1.0,
                color: "#e0ffee",
                mb: 3,
              }}
            >
              {t.hero.titleLine1}
              <Box component="span" sx={{ color: "#a6f2d1", display: "block" }}>
                {t.hero.titleLine2}
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
              {t.hero.subtitle}
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
                {t.hero.cta1}
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
                {t.hero.cta2}
              </Button>
            </Box>

            {/* Trust row */}
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              {t.hero.trust.map((item) => (
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
      <Box
        id="national-curriculum"
        sx={{ px: { xs: 4, md: 8 }, pt: 8, pb: 0, bgcolor: "#edf2f5" }}
      >
        <Box sx={{ maxWidth: 1280, mx: "auto" }}>
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
            {t.curriculum.label}
          </Typography>

          {/* Public school cascade */}
          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <TextField
              select
              label={t.curriculum.caza}
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
                <em style={{ color: "#a9b4b9" }}>{t.curriculum.caza}</em>
              </MenuItem>
              {cazas.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label={t.curriculum.area}
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
                <em style={{ color: "#a9b4b9" }}>{t.curriculum.area}</em>
              </MenuItem>
              {areas.map((a) => (
                <MenuItem key={a} value={a}>
                  {a}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label={t.curriculum.school}
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
                <em style={{ color: "#a9b4b9" }}>{t.curriculum.school}</em>
              </MenuItem>
              {publicSchools.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
          </Box>

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
                  {t.curriculum.official}
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
                  {t.curriculum.bannerTitle}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.8125rem",
                    color: "rgba(224,255,238,0.6)",
                    mt: 0.25,
                  }}
                >
                  {canVisit
                    ? `${t.curriculum.visitingAs} ${analyticsSchool}`
                    : t.curriculum.hint}
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
              {t.curriculum.visitBtn}
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
                  fontWeight: 800,
                  fontSize: { xs: "2rem", md: "2.5rem" },
                  letterSpacing: "-0.025em",
                  color: "text.primary",
                  lineHeight: 1,
                }}
              >
                {t.courses.heading}
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
                {t.courses.viewAll}
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
                {t.courses.noCoursesMsg}
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/auth?tab=register")}
                sx={{ mt: 3, borderRadius: "8px", px: 4 }}
              >
                {t.courses.registerBtn}
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 4, md: 8 },
              mb: 10,
              flexDirection: { xs: "column", md: isRtl ? "row-reverse" : "row" },
            }}
          >
            {/* SDG image — wrapper crops the PNG's excess whitespace */}
            <Box
              sx={{
                width: { xs: 300, md: 480 },
                height: { xs: 300, md: 480 },
                flexShrink: 0,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src="/Circle.png"
                alt="UN Sustainable Development Goal 4 - Quality Education"
                sx={{
                  width: "135%",
                  height: "135%",
                  objectFit: "contain",
                  mixBlendMode: "multiply",
                }}
              />
            </Box>

            {/* Text */}
            <Box sx={{ textAlign: { xs: "center", md: isRtl ? "right" : "left" } }}>
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
                {t.mission.label}
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
                {t.mission.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: "1.0625rem",
                  color: "rgba(224,255,238,0.6)",
                  mt: 2.5,
                  maxWidth: 600,
                  lineHeight: 1.65,
                }}
              >
                {t.mission.subtitle}
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {t.features.map(({ title, body }, i) => {
              const Icon = FEATURE_ICONS[i];
              return (
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
              );
            })}
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
              {t.stats.heading}
            </Typography>
          </Box>
          <Grid container spacing={4} justifyContent="center">
            {t.stats.items.map((stat) => (
              <Grid item xs={12} sm={6} md={4} key={stat.label}>
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
              {t.cta.title}
            </Typography>
            <Typography
              sx={{
                fontSize: "1.0625rem",
                color: "rgba(224,255,238,0.7)",
                lineHeight: 1.6,
                maxWidth: 480,
              }}
            >
              {t.cta.subtitle}
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
              {t.cta.btn1}
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
              {t.cta.btn2}
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
                {t.footer.desc}
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
                {t.footer.joinBtn}
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
                {t.footer.platformTitle}
              </Typography>
              {t.footer.platformLinks.map((item) => (
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
                  fontSize: "0.875rem",
                  color: "rgba(224,255,238,0.45)",
                  mb: 2,
                  cursor: "default",
                  "&:hover": { color: "rgba(224,255,238,0.8)" },
                  transition: "color 0.15s",
                }}
              >
                {t.footer.supportLink}
              </Typography>
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
              {t.footer.copyright}
            </Typography>
            <Box sx={{ display: "flex", gap: 4 }}>
              {t.footer.legalLinks.map(({ label, href }) => (
                <Typography
                  key={label}
                  onClick={() => href && navigate(href)}
                  sx={{
                    fontSize: "0.8125rem",
                    color: "rgba(224,255,238,0.35)",
                    cursor: href ? "pointer" : "default",
                    "&:hover": { color: "rgba(224,255,238,0.65)" },
                    transition: "color 0.15s",
                  }}
                >
                  {label}
                </Typography>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
