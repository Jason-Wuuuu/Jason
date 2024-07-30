import React, { memo } from "react";
import { Grid, Typography, List } from "@mui/material";
import InfoListItem from "./InfoListItem";

const InfoSection = memo(({ title, items }) => (
  <Grid item>
    <Typography variant="h6" fontWeight="bold">
      {title}
    </Typography>
    <List dense>
      {items.map((item, index) => (
        <InfoListItem key={index} {...item} />
      ))}
    </List>
  </Grid>
));

export default InfoSection;
