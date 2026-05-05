import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
  Select,
  MenuItem,
  FormControl,
  FormLabel,
  Checkbox,
  ListItemText,
  FormHelperText,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import PlayCircleOutlineRoundedIcon from "@mui/icons-material/PlayCircleOutlineRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import ChildCareRoundedIcon from "@mui/icons-material/ChildCareRounded";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import {
  useCourses,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
} from "../hooks/useCourses";
import { useAuth } from "../context/AuthContext";
import { Course } from "../api/courses.api";

const SIDEBAR_LINKS = [{ label: "Dashboard", path: "/teacher" }];

const GRADE_OPTIONS = [
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
  "Higher Education",
  "Professional",
  "All Levels",
];

const courseSchema = Yup.object({
  title: Yup.string().min(3).required("Required"),
  subject: Yup.string().min(2).required("Required"),
  grades: Yup.array()
    .of(Yup.string())
    .min(1, "Select at least one grade")
    .required("Required"),
  school: Yup.string().optional(),
  youtubeUrl: Yup.string().required("Required"),
  contentType: Yup.string().optional(),
});

interface CourseFormValues {
  title: string;
  subject: string;
  grades: string[];
  school: string;
  youtubeUrl: string;
  contentType: "" | "health" | "specialNeeds";
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { data: courses, isLoading } = useCourses();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const myCourses = (Array.isArray(courses) ? courses : []).filter((c) => c.teacherId === user?.id);
  const totalViews = myCourses.reduce((sum, c) => sum + c.clicks, 0);
  const avgViews =
    myCourses.length > 0 ? Math.round(totalViews / myCourses.length) : 0;

  const isProfessional = user?.role === 'professional';
  const isKidTutor = user?.role === 'kid_tutor';

  const initialValues: CourseFormValues = editingCourse
    ? {
        title: editingCourse.title,
        subject: editingCourse.subject,
        grades: editingCourse.grades ?? [],
        school: editingCourse.school ?? "",
        youtubeUrl: editingCourse.youtubeVideoId,
        contentType: editingCourse.isHealthContent ? "health" : editingCourse.isSpecialNeeds ? "specialNeeds" : "",
      }
    : {
        title: "", subject: "", grades: [], school: "", youtubeUrl: "",
        contentType: isProfessional ? "health" : "",
      };

  const handleSubmit = async (values: CourseFormValues) => {
    const payload = {
      ...values,
      grades: values.grades,
      isHealthContent: values.contentType === "health",
      isSpecialNeeds: values.contentType === "specialNeeds",
    };
    if (editingCourse) {
      await updateCourse.mutateAsync({ id: editingCourse.id, data: payload });
    } else {
      await createCourse.mutateAsync(payload);
    }
    setDialogOpen(false);
    setEditingCourse(null);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteCourse.mutateAsync(id);
    setDeleteConfirm(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Sidebar
        title="Instructor Portal"
        subtitle="Your Teaching Hub"
        links={SIDEBAR_LINKS}
        {...(!(isKidTutor && !user?.kidTutorApproved) && {
          actionLabel: '+ New Course',
          onAction: () => { setEditingCourse(null); setDialogOpen(true); },
        })}
      />

      <Box
        sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}
      >
        <Navbar />

        {/* ── Header Banner ── */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #f0f4f7 0%, #e8f4f0 100%)",
            px: { xs: 2.5, md: 6 },
            pt: 4,
            pb: 4,
            borderBottom: "1px solid rgba(169,180,185,0.1)",
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "0.6875rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "primary.main",
              mb: 1,
            }}
          >
            {isProfessional ? "Professional Workspace" : isKidTutor ? "Kid Tutor Workspace" : "Instructor Workspace"}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "2rem", md: "2.75rem" },
                  letterSpacing: "-0.025em",
                  color: "text.primary",
                  lineHeight: 1.1,
                }}
              >
                My Dashboard
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.9375rem",
                  color: "text.secondary",
                  mt: 0.75,
                }}
              >
                Welcome back, {user?.name}. Manage your courses below.
              </Typography>
            </Box>
            {!(isKidTutor && !user?.kidTutorApproved) && (
              <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={() => { setEditingCourse(null); setDialogOpen(true); }}
                sx={{
                  px: 3,
                  py: 1.5,
                  fontSize: "0.9375rem",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 12px 0px rgba(27,107,81,0.2)",
                  flexShrink: 0,
                }}
              >
                Add Course
              </Button>
            )}
          </Box>

          {/* Stats row */}
          <Grid container spacing={3} sx={{ mt: 3 }}>
            {[
              {
                icon: MenuBookRoundedIcon,
                value: myCourses.length,
                label: "Total Courses",
                color: "primary.main",
                bg: "rgba(27,107,81,0.1)",
              },
              {
                icon: VisibilityRoundedIcon,
                value: totalViews.toLocaleString(),
                label: "Total Views",
                color: "#475569",
                bg: "rgba(71,85,105,0.08)",
              },
              {
                icon: TrendingUpRoundedIcon,
                value: avgViews.toLocaleString(),
                label: "Avg. Views / Course",
                color: "#1b6b51",
                bg: "rgba(27,107,81,0.08)",
              },
            ].map(({ icon: Icon, value, label, color, bg }) => (
              <Grid item xs={12} sm={4} key={label}>
                <Box
                  sx={{
                    bgcolor: "background.paper",
                    borderRadius: "10px",
                    px: 3,
                    py: 2.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    border: "1px solid rgba(169,180,185,0.1)",
                    boxShadow: "0px 2px 8px 0px rgba(42,52,57,0.04)",
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: bg,
                      borderRadius: "8px",
                      p: 1.25,
                      display: "flex",
                      flexShrink: 0,
                    }}
                  >
                    <Icon sx={{ color, fontSize: "1.25rem" }} />
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: "1.5rem",
                        letterSpacing: "-0.025em",
                        color: "text.primary",
                        lineHeight: 1,
                      }}
                    >
                      {value}
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.6875rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "text.secondary",
                        mt: 0.25,
                      }}
                    >
                      {label}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* ── Kid Tutor approval banner ── */}
        {isKidTutor && (
          <Box
            sx={{
              mx: { xs: 2.5, md: 6 },
              mt: 3,
              px: 3,
              py: 2.5,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              ...(user?.kidTutorApproved
                ? {
                    background: 'linear-gradient(135deg, #1b6b51 0%, #035d45 100%)',
                    border: '1px solid rgba(166,242,209,0.25)',
                  }
                : {
                    background: 'linear-gradient(135deg, #7c5a0a 0%, #a37412 100%)',
                    border: '1px solid rgba(255,220,130,0.25)',
                  }),
            }}
          >
            <Box
              sx={{
                width: 40, height: 40, borderRadius: '10px',
                bgcolor: 'rgba(255,255,255,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}
            >
              <ChildCareRoundedIcon sx={{ color: user?.kidTutorApproved ? '#a6f2d1' : '#ffd97a', fontSize: '1.25rem' }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: '#e0ffee', lineHeight: 1.3 }}>
                {user?.kidTutorApproved
                  ? `You have been approved by ${user.school || 'your school'}`
                  : `Your account is being reviewed by ${user?.school || 'your school'}`}
              </Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: 'rgba(224,255,238,0.65)', mt: 0.25 }}>
                {user?.kidTutorApproved
                  ? 'You can upload courses in the Kid to Kid section below.'
                  : 'This usually takes a short while. You can still prepare your courses while waiting.'}
              </Typography>
            </Box>
          </Box>
        )}

        {/* ── Course List ── */}
        <Box sx={{ px: { xs: 2.5, md: 6 }, py: 4, flex: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 4,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "1.25rem",
                  color: "text.primary",
                }}
              >
                My Courses
              </Typography>
              <Chip
                label={`${myCourses.length} active`}
                size="small"
                sx={{
                  bgcolor: "rgba(27,107,81,0.08)",
                  color: "primary.main",
                  fontWeight: 700,
                  fontSize: "0.6875rem",
                }}
              />
            </Box>
          </Box>

          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
              <CircularProgress sx={{ color: "primary.main" }} />
            </Box>
          ) : myCourses.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 10,
                bgcolor: "#f0f4f7",
                borderRadius: "12px",
                border: "2px dashed rgba(169,180,185,0.3)",
              }}
            >
              <PlayCircleOutlineRoundedIcon
                sx={{ fontSize: "3rem", color: "text.disabled", mb: 2 }}
              />
              <Typography sx={{ color: "text.secondary", fontSize: "1rem", mb: 3 }}>
                {isKidTutor && !user?.kidTutorApproved
                  ? "You'll be able to create courses once your school approves your account."
                  : "You haven't created any courses yet."}
              </Typography>
              {!(isKidTutor && !user?.kidTutorApproved) && (
                <Button
                  variant="contained"
                  startIcon={<AddRoundedIcon />}
                  onClick={() => { setEditingCourse(null); setDialogOpen(true); }}
                  sx={{ borderRadius: "8px", px: 4 }}
                >
                  Create Your First Course
                </Button>
              )}
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {myCourses.map((course) => (
                <Box
                  key={course.id}
                  sx={{
                    bgcolor: "background.paper",
                    borderRadius: "10px",
                    px: { xs: 2, md: 3 },
                    py: 2.5,
                    display: "flex",
                    alignItems: { xs: 'flex-start', sm: "center" },
                    justifyContent: "space-between",
                    flexDirection: { xs: 'column', sm: 'row' },
                    border: "1px solid rgba(169,180,185,0.1)",
                    boxShadow: "0px 2px 8px 0px rgba(42,52,57,0.04)",
                    transition: "box-shadow 0.15s",
                    "&:hover": {
                      boxShadow: "0px 4px 16px 0px rgba(42,52,57,0.08)",
                    },
                    gap: 2,
                  }}
                >
                  {/* Thumbnail + Info row (always horizontal) */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0, width: '100%' }}>
                  {/* Thumbnail */}
                  <Box sx={{ position: "relative", flexShrink: 0 }}>
                    <Box
                      component="img"
                      src={`https://img.youtube.com/vi/${course.youtubeVideoId}/mqdefault.jpg`}
                      alt={course.title}
                      sx={{
                        width: 100,
                        height: 64,
                        objectFit: "cover",
                        borderRadius: "6px",
                        display: "block",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "rgba(0,0,0,0.25)",
                        borderRadius: "6px",
                        opacity: 0,
                        transition: "opacity 0.15s",
                        "&:hover": { opacity: 1 },
                      }}
                    >
                      <PlayCircleOutlineRoundedIcon
                        sx={{ color: "white", fontSize: "1.75rem" }}
                      />
                    </Box>
                  </Box>

                  {/* Info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "1rem",
                        color: "text.primary",
                        mb: 0.5,
                      }}
                      noWrap
                    >
                      {course.title}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1.5,
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      <Chip
                        label={course.subject}
                        size="small"
                        sx={{
                          bgcolor: "rgba(27,107,81,0.08)",
                          color: "primary.main",
                          fontWeight: 700,
                          fontSize: "0.625rem",
                        }}
                      />
                      {course.grades.length > 0 && (
                        <Chip
                          label={
                            course.grades.length === 1
                              ? course.grades[0]
                              : `${course.grades.length} grades`
                          }
                          size="small"
                          sx={{
                            bgcolor: "#f0f4f7",
                            color: "text.secondary",
                            fontWeight: 600,
                            fontSize: "0.625rem",
                          }}
                        />
                      )}
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <VisibilityRoundedIcon
                          sx={{ fontSize: "0.75rem", color: "text.secondary" }}
                        />
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary", fontWeight: 600 }}
                        >
                          {course.clicks.toLocaleString()} views
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  </Box>{/* end Thumbnail + Info row */}

                  {/* Actions */}
                  <Box sx={{ display: isKidTutor && !user?.kidTutorApproved ? 'none' : 'flex', gap: 1, flexShrink: 0, alignSelf: { xs: 'flex-end', sm: 'auto' } }}>
                    <Button
                      startIcon={
                        <EditRoundedIcon
                          sx={{ fontSize: "0.875rem !important" }}
                        />
                      }
                      onClick={() => handleEdit(course)}
                      size="small"
                      sx={{
                        bgcolor: "#f0f4f7",
                        color: "text.primary",
                        px: 2,
                        borderRadius: "8px",
                        fontWeight: 600,
                        fontSize: "0.8125rem",
                        "&:hover": { bgcolor: "#e1e9ee" },
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      startIcon={
                        <DeleteRoundedIcon
                          sx={{ fontSize: "0.875rem !important" }}
                        />
                      }
                      onClick={() => setDeleteConfirm(course.id)}
                      size="small"
                      sx={{
                        bgcolor: "#fdf0ef",
                        color: "#9f403d",
                        px: 2,
                        borderRadius: "8px",
                        fontWeight: 600,
                        fontSize: "0.8125rem",
                        "&:hover": { bgcolor: "#f5d6d5" },
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* ── Create / Edit Dialog ── */}
      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingCourse(null);
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "12px", p: 1 } }}
      >
        <DialogTitle
          sx={{ fontWeight: 700, fontSize: "1.25rem", color: "text.primary" }}
        >
          {editingCourse ? "Edit Course" : "Add New Course"}
        </DialogTitle>
        <Formik
          key={editingCourse?.id ?? "new"}
          initialValues={initialValues}
          validationSchema={courseSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, values, touched, setFieldValue, setFieldTouched }) => (
            <Form>
              <DialogContent
                sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}
              >
                {/* Content type selector for professionals */}
                {isProfessional && (
                  <Box>
                    <FormLabel sx={{ fontWeight: 700, fontSize: "0.625rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "text.secondary", display: "block", mb: 1 }}>
                      Content Category *
                    </FormLabel>
                    <Box sx={{ display: "flex", gap: 1.5 }}>
                      {[
                        { value: "health", label: "Wellbeing" },
                        { value: "specialNeeds", label: "Learning Difficulties" },
                      ].map(({ value, label }) => (
                        <Box
                          key={value}
                          onClick={() => setFieldValue("contentType", value)}
                          sx={{
                            flex: 1, py: 1.25, px: 2, borderRadius: "8px", cursor: "pointer", textAlign: "center",
                            border: "2px solid",
                            borderColor: values.contentType === value ? "primary.main" : "rgba(169,180,185,0.3)",
                            bgcolor: values.contentType === value ? "rgba(27,107,81,0.06)" : "#f7f9fb",
                            fontWeight: values.contentType === value ? 700 : 500,
                            fontSize: "0.875rem",
                            color: values.contentType === value ? "primary.main" : "text.secondary",
                            transition: "all 0.15s",
                          }}
                        >
                          {label}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
                <InputField
                  name="youtubeUrl"
                  label="YouTube Link"
                  placeholder="https://youtube.com/watch?v=..."
                />
                <InputField
                  name="title"
                  label="Course Title"
                  placeholder="e.g. Introduction to Algebra"
                />
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <InputField
                      name="subject"
                      label="Subject"
                      placeholder="e.g. Mathematics"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      error={!!(values.grades.length === 0 && touched.grades)}
                    >
                      <Box sx={{ mb: 0.5 }}>
                        <FormLabel
                          sx={{
                            fontWeight: 700,
                            fontSize: "0.625rem",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "text.secondary",
                          }}
                        >
                          Grades
                        </FormLabel>
                      </Box>
                      <Select
                        multiple
                        value={values.grades}
                        onChange={(e) => {
                          const next = e.target.value as string[];
                          const prev = values.grades;
                          const justAdded = next.find((g) => !prev.includes(g));
                          if (justAdded === "All Levels") {
                            setFieldValue("grades", ["All Levels"]);
                          } else if (justAdded) {
                            setFieldValue(
                              "grades",
                              next.filter((g) => g !== "All Levels")
                            );
                          } else {
                            setFieldValue("grades", next);
                          }
                        }}
                        onBlur={() => setFieldTouched("grades", true)}
                        variant="standard"
                        displayEmpty
                        renderValue={(selected) =>
                          (selected as string[]).length === 0 ? (
                            <span style={{ color: "#9ca3af" }}>
                              Select grades…
                            </span>
                          ) : (selected as string[]).length === 1 ? (
                            (selected as string[])[0]
                          ) : (
                            `${(selected as string[]).length} grades selected`
                          )
                        }
                        sx={{
                          fontFamily: "'Public Sans', sans-serif",
                          fontSize: "1rem",
                          color: "text.primary",
                          "&:before": { borderBottomColor: "#6b7280" },
                          "&:hover:not(.Mui-disabled):before": {
                            borderBottomColor: "primary.main",
                          },
                          "&.Mui-focused:after": {
                            borderBottomColor: "primary.main",
                          },
                          "& .MuiSelect-select": {
                            pb: 1.5,
                            pt: 1.25,
                            px: 1.5,
                          },
                        }}
                      >
                        {GRADE_OPTIONS.map((g) => (
                          <MenuItem key={g} value={g}>
                            <Checkbox
                              checked={values.grades.includes(g)}
                              size="small"
                              sx={{
                                color: "primary.main",
                                "&.Mui-checked": { color: "primary.main" },
                              }}
                            />
                            <ListItemText
                              primary={g}
                              primaryTypographyProps={{ fontSize: "0.875rem" }}
                            />
                          </MenuItem>
                        ))}
                      </Select>
                      {values.grades.length === 0 && touched.grades && (
                        <FormHelperText>
                          Select at least one grade
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
                <InputField
                  name="school"
                  label="School / Institution"
                  placeholder="Optional"
                  optional
                />
                {(createCourse.isError || updateCourse.isError) && (
                  <Alert severity="error">
                    {(
                      (createCourse.error || updateCourse.error) as {
                        response?: { data?: { error?: string } };
                      }
                    )?.response?.data?.error || "Something went wrong"}
                  </Alert>
                )}
              </DialogContent>
              <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                <Button
                  onClick={() => {
                    setDialogOpen(false);
                    setEditingCourse(null);
                  }}
                  sx={{ color: "text.secondary", fontWeight: 600 }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{ px: 4, borderRadius: "8px", fontWeight: 700 }}
                >
                  {isSubmitting
                    ? "Saving…"
                    : editingCourse
                      ? "Save Changes"
                      : "Add Course"}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      {/* ── Delete confirmation ── */}
      <Dialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "12px" } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Course?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "text.secondary" }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => setDeleteConfirm(null)}
            sx={{ color: "text.secondary", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            sx={{
              bgcolor: "#9f403d",
              color: "white",
              "&:hover": { bgcolor: "#7d312f" },
              borderRadius: "8px",
              px: 3,
              fontWeight: 700,
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
