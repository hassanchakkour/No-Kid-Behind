import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Alert,
  Checkbox,
  FormControlLabel,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useRegister, useLogin } from "../hooks/useAuthMutations";
import schoolData from "../data/public_schools_lebanon.json";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ChildCareRoundedIcon from "@mui/icons-material/ChildCareRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";

const GRADE_OPTIONS = [
  { value: "Grade 1", label: "Grade 1" },
  { value: "Grade 2", label: "Grade 2" },
  { value: "Grade 3", label: "Grade 3" },
  { value: "Grade 4", label: "Grade 4" },
  { value: "Grade 5", label: "Grade 5" },
  { value: "Grade 6", label: "Grade 6" },
  { value: "Grade 7", label: "Grade 7" },
  { value: "Grade 8", label: "Grade 8" },
  { value: "Grade 9", label: "Grade 9" },
  { value: "Grade 10", label: "Grade 10" },
  { value: "Grade 11", label: "Grade 11" },
  { value: "Grade 12", label: "Grade 12" },
  { value: "Higher Education", label: "Higher Education" },
  { value: "Professional", label: "Professional" },
];

const PRIVATE_SCHOOLS = ["IC", "ACS", "College"];

const registerSchema = Yup.object({
  username: Yup.string()
    .min(3)
    .max(30)
    .matches(/^[a-zA-Z0-9_]+$/, "Letters, numbers, underscores only")
    .required("Required"),
  name: Yup.string().min(2).required("Required"),
  email: Yup.string().email("Invalid email").optional(),
  password: Yup.string().min(6, "At least 6 characters").required("Required"),
  role: Yup.string().oneOf(["student", "professional", "kid_tutor"]).required(),
  schoolType: Yup.string().when("role", {
    is: (r: string) => r === "student" || r === "kid_tutor",
    then: (s) => s.oneOf(["public", "private"]).required("Required"),
  }),
  grade: Yup.string().when("role", {
    is: (r: string) => r === "student" || r === "kid_tutor",
    then: (s) => s.required("Required"),
  }),
  caza: Yup.string().when(["role", "schoolType"], {
    is: (role: string, schoolType: string) =>
      (role === "student" || role === "kid_tutor") && schoolType === "public",
    then: (s) => s.required("Required"),
  }),
  area: Yup.string().when(["role", "schoolType"], {
    is: (role: string, schoolType: string) =>
      (role === "student" || role === "kid_tutor") && schoolType === "public",
    then: (s) => s.required("Required"),
  }),
  school: Yup.string().when("role", {
    is: (r: string) => r === "student" || r === "kid_tutor",
    then: (s) => s.required("Required"),
  }),
  syndicateNumber: Yup.string().when("role", {
    is: "professional",
    then: (s) => s.required("Required"),
  }),
});

const loginSchema = Yup.object({
  username: Yup.string().required("Required"),
  password: Yup.string().required("Required"),
});

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    bgcolor: "#f7f9fb",
    fontFamily: "'Public Sans', sans-serif",
    fontSize: "0.9375rem",
    "& fieldset": { borderColor: "rgba(169,180,185,0.3)" },
    "&:hover fieldset": { borderColor: "rgba(27,107,81,0.4)" },
    "&.Mui-focused fieldset": { borderColor: "#1b6b51", borderWidth: 2 },
  },
  "& .MuiInputLabel-root": {
    fontFamily: "'Public Sans', sans-serif",
    fontSize: "0.9375rem",
    color: "#a9b4b9",
    "&.Mui-focused": { color: "#1b6b51" },
  },
  "& .MuiInputAdornment-root svg": { color: "#a9b4b9" },
};

const FEATURES = [
  { icon: LockOpenRoundedIcon, text: "Completely free — no paywalls ever" },
  { icon: PublicRoundedIcon, text: "Accessible anywhere in the world" },
  { icon: AutoStoriesRoundedIcon, text: "Curated courses by verified educators" },
];

const ROLE_CONFIG = [
  {
    value: "student",
    label: "Student",
    subtitle: "Browse & learn",
    Icon: SchoolOutlinedIcon,
  },
  {
    value: "kid_tutor",
    label: "Kid Tutor",
    subtitle: "Learn & teach peers",
    Icon: ChildCareRoundedIcon,
  },
  {
    value: "professional",
    label: "Professional",
    subtitle: "Create content",
    Icon: WorkOutlineRoundedIcon,
  },
] as const;

export default function AuthPage() {
  const [params] = useSearchParams();
  const [activeTab, setActiveTab] = useState<"register" | "login">(
    params.get("tab") === "login" ? "login" : "register",
  );
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const registerMutation = useRegister();
  const loginMutation = useLogin();

  useEffect(() => {
    setActiveTab(params.get("tab") === "login" ? "login" : "register");
  }, [params]);

  const registerInitial = {
    username: "",
    name: "",
    email: "",
    password: "",
    role: "student" as "student" | "professional" | "kid_tutor",
    schoolType: "" as "" | "public" | "private",
    grade: "",
    caza: "",
    area: "",
    school: "",
    isDisplaced: false,
    syndicateNumber: "",
  };
  const loginInitial = { username: "", password: "" };

  const handleRegister = async (values: typeof registerInitial) => {
    const data = await registerMutation.mutateAsync({
      username: values.username,
      name: values.name,
      email: values.email || undefined,
      password: values.password,
      role: values.role,
      grade: (values.role === "student" || values.role === "kid_tutor") ? values.grade : undefined,
      school: values.school || undefined,
      isDisplaced: values.isDisplaced,
      syndicateNumber: values.role === "professional" ? values.syndicateNumber : undefined,
    });
    login(data.token, data.user);
    if (data.user.role === "professional" || data.user.role === "kid_tutor") {
      navigate("/teacher");
    } else {
      navigate("/dashboard");
    }
  };

  const handleLogin = async (values: typeof loginInitial) => {
    const data = await loginMutation.mutateAsync(values);
    login(data.token, data.user);
    if (data.user.role === "admin") {
      navigate("/admin");
    } else if (data.user.role === "professional" || data.user.role === "kid_tutor") {
      navigate("/teacher");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* ── LEFT: Brand panel ── */}
      <Box
        sx={{
          flex: "0 0 45%",
          display: { xs: "none", lg: "flex" },
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(160deg, #023d2e 0%, #035d45 40%, #1b6b51 100%)",
          p: 6,
        }}
      >
        <Box sx={{ position: "absolute", top: -80, right: -80, width: 360, height: 360, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.04)" }} />
        <Box sx={{ position: "absolute", bottom: 60, left: -100, width: 320, height: 320, borderRadius: "50%", bgcolor: "rgba(0,0,0,0.12)" }} />
        <Box sx={{ position: "absolute", top: "38%", right: -40, width: 180, height: 180, borderRadius: "50%", bgcolor: "rgba(166,242,209,0.06)" }} />

        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Box onClick={() => navigate("/")} sx={{ display: "inline-flex", alignItems: "center", gap: 1, cursor: "pointer", mb: 12 }}>
            <Box sx={{ width: 32, height: 32, bgcolor: "rgba(166,242,209,0.2)", border: "1px solid rgba(166,242,209,0.3)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AutoStoriesRoundedIcon sx={{ fontSize: "1rem", color: "#a6f2d1" }} />
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.03em", color: "#e0ffee" }}>
              No Kid Behind
            </Typography>
          </Box>

          <Typography sx={{ fontWeight: 800, fontSize: { lg: "2.75rem", xl: "3.25rem" }, letterSpacing: "-0.04em", lineHeight: 1.08, color: "#e0ffee", mb: 3 }}>
            Learning is the
            <Box component="span" sx={{ display: "block", color: "#a6f2d1" }}>great equalizer.</Box>
          </Typography>
          <Typography sx={{ fontSize: "1rem", color: "rgba(224,255,238,0.65)", lineHeight: 1.65, maxWidth: 380, mb: 8 }}>
            Join thousands of students and educators on a platform built to make quality education accessible to everyone — free, forever.
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {FEATURES.map(({ icon: Icon, text }) => (
              <Box key={text} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ width: 32, height: 32, bgcolor: "rgba(166,242,209,0.12)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon sx={{ fontSize: "1rem", color: "#a6f2d1" }} />
                </Box>
                <Typography sx={{ fontSize: "0.9375rem", color: "rgba(224,255,238,0.8)", fontWeight: 400 }}>{text}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ bgcolor: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", border: "1px solid rgba(166,242,209,0.15)", borderRadius: "16px", p: 3, display: "flex", gap: 4 }}>
            {[{ value: "50k+", label: "Learners" }, { value: "1.2k", label: "Courses" }, { value: "100%", label: "Free" }].map(({ value, label }) => (
              <Box key={label} sx={{ textAlign: "center", flex: 1 }}>
                <Typography sx={{ fontWeight: 800, fontSize: "1.625rem", letterSpacing: "-0.04em", color: "#e0ffee", lineHeight: 1 }}>{value}</Typography>
                <Typography sx={{ fontWeight: 600, fontSize: "0.6875rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(166,242,209,0.6)", mt: 0.5 }}>{label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ── RIGHT: Form panel ── */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", bgcolor: "background.paper", overflowY: "auto" }}>
        {/* Top bar */}
        <Box sx={{ px: { xs: 4, md: 8 }, pt: 4, pb: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box onClick={() => navigate("/")} sx={{ display: { xs: "flex", lg: "none" }, alignItems: "center", gap: 1, cursor: "pointer" }}>
            <Box sx={{ width: 28, height: 28, bgcolor: "rgba(27,107,81,0.12)", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AutoStoriesRoundedIcon sx={{ fontSize: "0.875rem", color: "primary.main" }} />
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: "0.9375rem", letterSpacing: "-0.03em", color: "text.primary" }}>No Kid Behind</Typography>
          </Box>
          <Box sx={{ display: { xs: "none", lg: "block" } }} />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
              {activeTab === "register" ? "Already have an account?" : "Don't have an account?"}
            </Typography>
            <Typography
              onClick={() => setActiveTab(activeTab === "register" ? "login" : "register")}
              sx={{ fontSize: "0.875rem", fontWeight: 700, color: "primary.main", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
            >
              {activeTab === "register" ? "Sign In" : "Register"}
            </Typography>
          </Box>
        </Box>

        {/* Form area */}
        <Box sx={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", px: { xs: 4, md: 8 }, pt: { xs: 4, md: 6 }, pb: 6 }}>
          <Box sx={{ width: "100%", maxWidth: 440 }}>
            {/* Tab toggle */}
            <Box sx={{ display: "flex", bgcolor: "#f0f4f7", borderRadius: "12px", p: 0.5, mb: 5 }}>
              {(["register", "login"] as const).map((tab) => (
                <Box
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  sx={{
                    flex: 1, textAlign: "center", py: 1.25, borderRadius: "10px", cursor: "pointer",
                    bgcolor: activeTab === tab ? "background.paper" : "transparent",
                    boxShadow: activeTab === tab ? "0px 1px 4px 0px rgba(0,0,0,0.08)" : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Typography sx={{ fontWeight: activeTab === tab ? 700 : 500, fontSize: "0.9375rem", color: activeTab === tab ? "text.primary" : "text.secondary", transition: "color 0.2s" }}>
                    {tab === "register" ? "Create Account" : "Sign In"}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* ══ REGISTER FORM ══ */}
            {activeTab === "register" && (
              <Formik initialValues={registerInitial} validationSchema={registerSchema} onSubmit={handleRegister}>
                {({ values, setFieldValue, isSubmitting, errors, touched }) => {
                  const isStudentLike = values.role === "student" || values.role === "kid_tutor";

                  const cazas = [
                    ...new Set(
                      (schoolData as { Caza: string; Area: string; "School Name": string }[]).map((s) => s.Caza)
                    ),
                  ].sort();

                  const areas = values.caza
                    ? [
                        ...new Set(
                          (schoolData as { Caza: string; Area: string; "School Name": string }[])
                            .filter((s) => s.Caza === values.caza)
                            .map((s) => s.Area)
                        ),
                      ].sort()
                    : [];

                  const schools = values.area
                    ? (schoolData as { Caza: string; Area: string; "School Name": string }[])
                        .filter((s) => s.Caza === values.caza && s.Area === values.area)
                        .map((s) => s["School Name"])
                        .sort()
                    : [];

                  return (
                    <Form>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                        <Box>
                          <Typography sx={{ fontWeight: 800, fontSize: "1.75rem", letterSpacing: "-0.03em", color: "text.primary", lineHeight: 1.2, mb: 0.5 }}>
                            Welcome aboard
                          </Typography>
                          <Typography sx={{ fontSize: "0.9375rem", color: "text.secondary" }}>
                            Create your free account to start learning.
                          </Typography>
                        </Box>

                        {/* Name + Username */}
                        <Box sx={{ display: "flex", gap: 2 }}>
                          <TextField
                            label="Full Name" placeholder="Jane Smith"
                            value={values.name} onChange={(e) => setFieldValue("name", e.target.value)}
                            error={touched.name && !!errors.name} helperText={touched.name && errors.name}
                            variant="outlined" size="small" fullWidth
                            InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlineRoundedIcon sx={{ fontSize: "1rem" }} /></InputAdornment> }}
                            sx={inputSx}
                          />
                          <TextField
                            label="Username" placeholder="jane_s"
                            value={values.username} onChange={(e) => setFieldValue("username", e.target.value)}
                            error={touched.username && !!errors.username} helperText={touched.username && errors.username}
                            variant="outlined" size="small" fullWidth
                            InputProps={{ startAdornment: <InputAdornment position="start"><BadgeOutlinedIcon sx={{ fontSize: "1rem" }} /></InputAdornment> }}
                            sx={inputSx}
                          />
                        </Box>

                        {/* Email */}
                        <TextField
                          label="Email (optional)" placeholder="you@example.com" type="email"
                          value={values.email} onChange={(e) => setFieldValue("email", e.target.value)}
                          error={touched.email && !!errors.email} helperText={touched.email && errors.email}
                          variant="outlined" size="small" fullWidth
                          InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlinedIcon sx={{ fontSize: "1rem" }} /></InputAdornment> }}
                          sx={inputSx}
                        />

                        {/* Password */}
                        <TextField
                          label="Password" placeholder="Min. 6 characters"
                          type={showPassword ? "text" : "password"}
                          value={values.password} onChange={(e) => setFieldValue("password", e.target.value)}
                          error={touched.password && !!errors.password} helperText={touched.password && errors.password}
                          variant="outlined" size="small" fullWidth
                          InputProps={{
                            startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ fontSize: "1rem" }} /></InputAdornment>,
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton size="small" onClick={() => setShowPassword((p) => !p)} edge="end" sx={{ color: "#a9b4b9" }}>
                                  {showPassword ? <VisibilityOffOutlinedIcon sx={{ fontSize: "1rem" }} /> : <VisibilityOutlinedIcon sx={{ fontSize: "1rem" }} />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={inputSx}
                        />

                        {/* Role selector — 3 cards */}
                        <Box>
                          <Typography sx={{ fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "text.secondary", mb: 1.5 }}>
                            I am a…
                          </Typography>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            {ROLE_CONFIG.map(({ value, label, subtitle, Icon }) => {
                              const active = values.role === value;
                              return (
                                <Box
                                  key={value}
                                  onClick={() => {
                                    setFieldValue("role", value);
                                    setFieldValue("schoolType", "");
                                    setFieldValue("caza", "");
                                    setFieldValue("area", "");
                                    setFieldValue("school", "");
                                  }}
                                  sx={{
                                    flex: 1,
                                    border: "2px solid",
                                    borderColor: active ? "primary.main" : "rgba(169,180,185,0.25)",
                                    borderRadius: "12px",
                                    bgcolor: active ? "rgba(27,107,81,0.06)" : "#f7f9fb",
                                    py: 1.75,
                                    px: 1.5,
                                    cursor: "pointer",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 0.75,
                                    transition: "all 0.15s ease",
                                    position: "relative",
                                    "&:hover": { borderColor: "primary.main", bgcolor: "rgba(27,107,81,0.04)" },
                                  }}
                                >
                                  <Box sx={{ width: 34, height: 34, borderRadius: "8px", bgcolor: active ? "primary.main" : "rgba(169,180,185,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                                    <Icon sx={{ fontSize: "1.1rem", color: active ? "#a6f2d1" : "text.secondary" }} />
                                  </Box>
                                  <Box sx={{ textAlign: "center" }}>
                                    <Typography sx={{ fontWeight: 700, fontSize: "0.8125rem", color: active ? "primary.main" : "text.primary", lineHeight: 1.2 }}>
                                      {label}
                                    </Typography>
                                    <Typography sx={{ fontSize: "0.625rem", color: "text.secondary" }}>
                                      {subtitle}
                                    </Typography>
                                  </Box>
                                  {active && <CheckCircleRoundedIcon sx={{ position: "absolute", top: 6, right: 6, color: "primary.main", fontSize: "0.875rem" }} />}
                                </Box>
                              );
                            })}
                          </Box>
                        </Box>

                        {/* Student / Kid Tutor fields */}
                        {isStudentLike && (
                          <Box sx={{ bgcolor: "#f7f9fb", borderRadius: "12px", p: 2.5, display: "flex", flexDirection: "column", gap: 2, border: "1px solid rgba(169,180,185,0.15)" }}>
                            {/* Grade */}
                            <TextField
                              select label="Your Grade" value={values.grade}
                              onChange={(e) => setFieldValue("grade", e.target.value)}
                              error={touched.grade && !!errors.grade} helperText={touched.grade && errors.grade}
                              variant="outlined" size="small" fullWidth sx={inputSx}
                            >
                              <MenuItem value="" disabled><em style={{ color: "#a9b4b9" }}>Select grade</em></MenuItem>
                              {GRADE_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                            </TextField>

                            {/* Public / Private toggle */}
                            <Box>
                              <Typography sx={{ fontWeight: 700, fontSize: "0.6875rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "text.secondary", mb: 1 }}>
                                School type
                              </Typography>
                              <ToggleButtonGroup
                                value={values.schoolType}
                                exclusive
                                onChange={(_e, val) => {
                                  if (!val) return;
                                  setFieldValue("schoolType", val);
                                  setFieldValue("caza", "");
                                  setFieldValue("area", "");
                                  setFieldValue("school", "");
                                }}
                                fullWidth
                                size="small"
                                sx={{
                                  "& .MuiToggleButton-root": {
                                    borderRadius: "8px !important",
                                    border: "1.5px solid rgba(169,180,185,0.3) !important",
                                    fontFamily: "'Public Sans', sans-serif",
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                    color: "text.secondary",
                                    bgcolor: "background.paper",
                                    py: 1,
                                    "&.Mui-selected": {
                                      bgcolor: "rgba(27,107,81,0.08)",
                                      borderColor: "#1b6b51 !important",
                                      color: "primary.main",
                                      fontWeight: 700,
                                    },
                                  },
                                  gap: 1,
                                }}
                              >
                                <ToggleButton value="public">Public School</ToggleButton>
                                <ToggleButton value="private">Private School</ToggleButton>
                              </ToggleButtonGroup>
                            </Box>

                            {/* Public school: caza → area → school cascade */}
                            {values.schoolType === "public" && (
                              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                <Typography sx={{ fontWeight: 700, fontSize: "0.6875rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "text.secondary" }}>
                                  Your Public School
                                </Typography>
                                <TextField
                                  select label="Caza *" value={values.caza}
                                  onChange={(e) => { setFieldValue("caza", e.target.value); setFieldValue("area", ""); setFieldValue("school", ""); }}
                                  error={touched.caza && !!errors.caza} helperText={touched.caza && errors.caza}
                                  variant="outlined" size="small" fullWidth sx={inputSx}
                                >
                                  <MenuItem value="" disabled><em style={{ color: "#a9b4b9" }}>Select caza</em></MenuItem>
                                  {cazas.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                                </TextField>
                                <TextField
                                  select label="Area *" value={values.area}
                                  onChange={(e) => { setFieldValue("area", e.target.value); setFieldValue("school", ""); }}
                                  error={touched.area && !!errors.area} helperText={touched.area && errors.area}
                                  variant="outlined" size="small" fullWidth disabled={!values.caza} sx={inputSx}
                                >
                                  <MenuItem value="" disabled><em style={{ color: "#a9b4b9" }}>Select area</em></MenuItem>
                                  {areas.map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
                                </TextField>
                                <TextField
                                  select label="School *" value={values.school}
                                  onChange={(e) => setFieldValue("school", e.target.value)}
                                  error={touched.school && !!errors.school} helperText={touched.school && errors.school}
                                  variant="outlined" size="small" fullWidth disabled={!values.area} sx={inputSx}
                                >
                                  <MenuItem value="" disabled><em style={{ color: "#a9b4b9" }}>Select school</em></MenuItem>
                                  {schools.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                                </TextField>
                              </Box>
                            )}

                            {/* Private school: fixed dropdown */}
                            {values.schoolType === "private" && (
                              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                <Typography sx={{ fontWeight: 700, fontSize: "0.6875rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "text.secondary" }}>
                                  Your Private School
                                </Typography>
                                <TextField
                                  select label="School *" value={values.school}
                                  onChange={(e) => setFieldValue("school", e.target.value)}
                                  error={touched.school && !!errors.school} helperText={touched.school && errors.school}
                                  variant="outlined" size="small" fullWidth
                                  InputProps={{ startAdornment: <InputAdornment position="start"><SchoolOutlinedIcon sx={{ fontSize: "1rem" }} /></InputAdornment> }}
                                  sx={inputSx}
                                >
                                  <MenuItem value="" disabled><em style={{ color: "#a9b4b9" }}>Select school</em></MenuItem>
                                  {PRIVATE_SCHOOLS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                                </TextField>
                              </Box>
                            )}

                            {/* Displaced checkbox */}
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={values.isDisplaced}
                                  onChange={(e) => setFieldValue("isDisplaced", e.target.checked)}
                                  size="small"
                                  sx={{ color: "#a9b4b9", "&.Mui-checked": { color: "primary.main" } }}
                                />
                              }
                              label={<Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>I am a displaced student</Typography>}
                            />
                          </Box>
                        )}

                        {/* Professional fields */}
                        {values.role === "professional" && (
                          <Box sx={{ bgcolor: "#f7f9fb", borderRadius: "12px", p: 2.5, border: "1px solid rgba(169,180,185,0.15)" }}>
                            <TextField
                              label="Syndicate Number" placeholder="e.g. SYN-2024-001"
                              value={values.syndicateNumber}
                              onChange={(e) => setFieldValue("syndicateNumber", e.target.value)}
                              error={touched.syndicateNumber && !!errors.syndicateNumber}
                              helperText={touched.syndicateNumber && errors.syndicateNumber}
                              variant="outlined" size="small" fullWidth
                              InputProps={{ startAdornment: <InputAdornment position="start"><BadgeOutlinedIcon sx={{ fontSize: "1rem" }} /></InputAdornment> }}
                              sx={inputSx}
                            />
                          </Box>
                        )}

                        {registerMutation.isError && (
                          <Alert severity="error" sx={{ borderRadius: "10px" }}>
                            {(registerMutation.error as { response?: { data?: { error?: string } } })?.response?.data?.error || "Registration failed"}
                          </Alert>
                        )}

                        <Button
                          type="submit" variant="contained" fullWidth
                          disabled={isSubmitting || registerMutation.isPending}
                          sx={{ py: 1.625, fontSize: "1rem", fontWeight: 700, borderRadius: "12px", mt: 0.5, boxShadow: "0px 6px 20px 0px rgba(27,107,81,0.25)", "&:hover": { boxShadow: "0px 8px 24px 0px rgba(27,107,81,0.35)" } }}
                        >
                          {registerMutation.isPending ? "Creating account…" : "Create Free Account →"}
                        </Button>

                        <Typography sx={{ textAlign: "center", fontSize: "0.75rem", color: "text.secondary" }}>
                          By registering, you agree to our{" "}
                          <Box component="span" sx={{ color: "primary.main", cursor: "pointer", fontWeight: 600 }}>Terms of Service</Box>{" "}
                          and{" "}
                          <Box component="span" sx={{ color: "primary.main", cursor: "pointer", fontWeight: 600 }}>Privacy Policy</Box>.
                        </Typography>
                      </Box>
                    </Form>
                  );
                }}
              </Formik>
            )}

            {/* ══ LOGIN FORM ══ */}
            {activeTab === "login" && (
              <Formik initialValues={loginInitial} validationSchema={loginSchema} onSubmit={handleLogin}>
                {({ values, setFieldValue, isSubmitting, errors, touched }) => (
                  <Form>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                      <Box>
                        <Typography sx={{ fontWeight: 800, fontSize: "1.75rem", letterSpacing: "-0.03em", color: "text.primary", lineHeight: 1.2, mb: 0.5 }}>
                          Welcome back
                        </Typography>
                        <Typography sx={{ fontSize: "0.9375rem", color: "text.secondary" }}>
                          Sign in to continue your learning journey.
                        </Typography>
                      </Box>

                      <TextField
                        label="Username" placeholder="your_handle"
                        value={values.username} onChange={(e) => setFieldValue("username", e.target.value)}
                        error={touched.username && !!errors.username} helperText={touched.username && errors.username}
                        variant="outlined" fullWidth
                        InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlineRoundedIcon sx={{ fontSize: "1rem" }} /></InputAdornment> }}
                        sx={inputSx}
                      />

                      <TextField
                        label="Password" placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        value={values.password} onChange={(e) => setFieldValue("password", e.target.value)}
                        error={touched.password && !!errors.password} helperText={touched.password && errors.password}
                        variant="outlined" fullWidth
                        InputProps={{
                          startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ fontSize: "1rem" }} /></InputAdornment>,
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton size="small" onClick={() => setShowPassword((p) => !p)} edge="end" sx={{ color: "#a9b4b9" }}>
                                {showPassword ? <VisibilityOffOutlinedIcon sx={{ fontSize: "1rem" }} /> : <VisibilityOutlinedIcon sx={{ fontSize: "1rem" }} />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={inputSx}
                      />

                      {loginMutation.isError && (
                        <Alert severity="error" sx={{ borderRadius: "10px" }}>
                          {(loginMutation.error as { response?: { data?: { error?: string } } })?.response?.data?.error || "Invalid credentials"}
                        </Alert>
                      )}

                      <Button
                        type="submit" variant="contained" fullWidth
                        disabled={isSubmitting || loginMutation.isPending}
                        sx={{ py: 1.625, fontSize: "1rem", fontWeight: 700, borderRadius: "12px", mt: 0.5, boxShadow: "0px 6px 20px 0px rgba(27,107,81,0.25)", "&:hover": { boxShadow: "0px 8px 24px 0px rgba(27,107,81,0.35)" } }}
                      >
                        {loginMutation.isPending ? "Signing in…" : "Sign In →"}
                      </Button>

                      <Box sx={{ textAlign: "center" }}>
                        <Typography sx={{ fontSize: "0.875rem", color: "text.secondary", display: "inline" }}>New to No Kid Behind? </Typography>
                        <Typography onClick={() => setActiveTab("register")} sx={{ fontSize: "0.875rem", fontWeight: 700, color: "primary.main", cursor: "pointer", display: "inline", "&:hover": { textDecoration: "underline" } }}>
                          Create a free account
                        </Typography>
                      </Box>
                    </Box>
                  </Form>
                )}
              </Formik>
            )}
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ px: { xs: 4, md: 8 }, pb: 4, display: "flex", justifyContent: "center", gap: 4 }}>
          {["Terms of Service", "Privacy Policy", "Support"].map((item) => (
            <Typography key={item} sx={{ fontSize: "0.75rem", color: "text.secondary", cursor: "default", "&:hover": { color: "text.primary" }, transition: "color 0.15s" }}>
              {item}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
