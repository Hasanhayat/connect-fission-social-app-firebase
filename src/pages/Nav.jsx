import React from "react";
import { SegmentedControl } from "@mantine/core";
import { createStyles } from "@mantine/styles"; // Corrected import

const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    boxShadow: theme.shadows.md,
    border: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[1]}`,
  },
  indicator: {
    backgroundImage: `linear-gradient(to right, ${theme.colors.pink[6]}, ${theme.colors.orange[6]})`,
  },
  label: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    '&[data-active]': {
      color: theme.white,
    },
  },
}));

const Nav = () => {
  const { classes } = useStyles();

  return (
    <SegmentedControl
      radius="xl"
      size="md"
      data={["All", "AI/ML", "C++", "Rust", "TypeScript"]}
      classNames={{ root: classes.root, indicator: classes.indicator, label: classes.label }}
    />
  );
};

export default Nav;
