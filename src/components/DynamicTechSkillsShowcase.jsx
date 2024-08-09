import React, { useMemo } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip,
  Box,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const categories = {
  Languages: ["Python", "Java", "JavaScript", "TypeScript", "Swift"],
  "Web Development": [
    "React",
    "Next.js",
    "Node.js",
    "Express.js",
    "GraphQL",
    "Spring Boot",
    "FastAPI",
  ],
  Databases: ["MongoDB", "Redis", "SQL"],
  "Machine Learning / AI": ["TensorFlow", "scikit-learn", "NLTK"],
  "Data Analysis": ["Pandas", "NumPy", "Matplotlib", "Seaborn"],
  "DevOps & Cloud": ["Docker", "Git", "AWS"],
  "Mobile Development": ["Swift", "React Native"],
};

const essentialTechs = new Set([
  "Python",
  "Java",
  "JavaScript",
  "TypeScript",
  "Swift",
  "React",
  "Next.js",
  "Node.js",
  "Express.js",
  "Spring Boot",
  "MongoDB",
  "Redis",
  "SQL",
  "TensorFlow",
  "scikit-learn",
  "NLTK",
  "Docker",
  "Git",
  "AWS",
  "FastAPI",
  "GraphQL",
  "Pandas",
  "NumPy",
  "Matplotlib",
  "Seaborn",
]);

const getCategory = (skill) => {
  for (const [category, skills] of Object.entries(categories)) {
    if (skills.includes(skill)) return category;
  }
  return "Other";
};

const SkillChip = React.memo(({ skill }) => (
  <Chip
    label={skill}
    variant="outlined"
    size="small"
    sx={{
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      color: "inherit",
      boxShadow: 10,
    }}
  />
));

const CategorySkills = React.memo(({ category, skills, isSmallScreen }) => (
  <Box key={category} sx={{ mb: 2 }}>
    <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
      {category}
    </Typography>

    {isSmallScreen ? (
      <Typography variant="body2" color="lightgray">
        {skills.join(", ")}
      </Typography>
    ) : (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {skills.map((skill) => (
          <SkillChip key={skill} skill={skill} />
        ))}
      </Box>
    )}
  </Box>
));

const DynamicTechSkillsShowcase = React.memo(({ filteredProjects }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const techStackUnion = useMemo(() => {
    const allTechStacks = filteredProjects.flatMap((project) =>
      project.tech_stack.split(", ")
    );
    return [...new Set(allTechStacks)].filter((tech) =>
      essentialTechs.has(tech)
    );
  }, [filteredProjects]);

  const groupedSkills = useMemo(() => {
    return techStackUnion.reduce((acc, skill) => {
      const category = getCategory(skill);
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill);
      return acc;
    }, {});
  }, [techStackUnion]);

  return (
    <Accordion
      sx={{
        width: { xs: "95vw", sm: "80vw", md: "70vw", lg: "55vw" },
        boxShadow: 10,
        backgroundColor: "#202020",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{ fontWeight: "bold" }}
      >
        Core Technologies / Skills
      </AccordionSummary>

      <Divider sx={{ mx: 1 }} />

      <AccordionDetails>
        {Object.entries(groupedSkills).map(([category, skills]) => (
          <CategorySkills
            key={category}
            category={category}
            skills={skills}
            isSmallScreen={isSmallScreen}
          />
        ))}
      </AccordionDetails>
    </Accordion>
  );
});

export default DynamicTechSkillsShowcase;
